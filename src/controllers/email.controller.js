import nodemailer from 'nodemailer';
import environment from '../config/environment.config.js';
import { logger } from '../middleware/logger.middleware.js';
import { v4 } from 'uuid';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: environment.GMAIL_ACCOUNT,
        pass: environment.GMAIL_PASSWORD
    }
})

transporter.verify(function (error, success) {
    if (error) {
        logger.error(error);
    } else {
        logger.debug('Server is ready to take our messages');
    }
})

const mailOptions = {
    from: "Correo de prueba - " + environment.GMAIL_ACCOUNT,
    to: environment.GMAIL_ACCOUNT,
    subject: "Correo de prueba",
    html: `<div><h1> Correo de prueba </h1></div>`,
    attachments: []
}

const mailOptionsWithAttachments = {
    from: "Correo de prueba - " + environment.GMAIL_ACCOUNT,
    to: environment.GMAIL_ACCOUNT,
    subject: "Correo de prueba",
    html: `<div>
                <h1>Correo de prueba con archivos</h1>
                <img src="cid:meme"/>
            </div>`,
    attachments: [
        {
            filename: 'Meme de programacion',
            path: '/public/images/meme.png',
            cid: 'meme'
        }
    ]
}

export const sendEmail = (req, res) => {
    try {
        let result = transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                logger.error(error);
                res.status(400).send({ message: "Error", payload: error });
            }
            logger.debug('Message sent: %s', info.messageId);
            res.send({ message: "Success", payload: info })
        })
    } catch (error) {
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + environment.GMAIL_ACCOUNT });
    }
}

export const sendEmailWithAttachments = (req, res) => {
    try {
        let result = transporter.sendMail(mailOptionsWithAttachments, (error, info) => {
            if (error) {
                res.status(400).send({ message: "Error", payload: error });
            }
            logger.debug('Message sent: %s', info.messageId);
            res.send({ message: "Success", payload: info })
        })
    } catch (error) {
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + environment.GMAIL_ACCOUNT });
    }
}

const mailOptionsToReset = {
    from: environment.GMAIL_ACCOUNT,
    subject: "Reset password",
}

const tempDbMails = {}

export const sendEmailToResetPassword = (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).send('Email not provided');
        }
        const token = v4();
        const link = `http://localhost:8080/api/users/passwordReset/${token}`

        tempDbMails[token] = {
            email,
            expirationTime: new Date(Date.now() + 60 * 60 * 1000)
        }

        mailOptionsToReset.to = email
        mailOptionsToReset.html = `To reset your password, click on the following link: <a href="${link}"> Reset Password</a>`

        transporter.sendMail(mailOptionsToReset, (error, info) => {
            if (error) {
                res.status(500).send({ message: "Error", payload: error });
            }
            logger.debug('Message sent: %s', info.messageId);
            res.send({ message: "Success", payload: info })
        })
    } catch (error) {
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
    }
}

export const resetPassword = (req, res) => {
    const token = req.params.token;
    const email = tempDbMails[token];

    const now = new Date();
    const expirationTime = email?.expirationTime;

    if (now > expirationTime || !expirationTime) {
        delete tempDbMails[token];
        return res.redirect('/forgotPassword')
    }

    res.render('resetPassword', {
        title: 'Restablezca su contraseña',
        email: email.email
    });
}

export const emailToInactiveUser = (email) => {
    let mailOptions = {
        from: environment.GMAIL_ACCOUNT,
        to: email,
        subject: 'Baja por inactividad',
        text: 'Su usuario ha sido dado de baja por inactividad'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            logger.error(error);
        }
        logger.debug('Message sent: %s', info.messageId);
    })
};

export const deleteProductEmail = (email, product, id) => {
    let mailOptions = {
        from: environment.GMAIL_ACCOUNT,
        to: email,
        subject: 'Un producto suyo ha sido eliminado',
        text: `El producto ${product} con id ${id} ha sido eliminado`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            logger.error(error);
        }
        logger.debug('Message sent: %s', info.messageId);
    })
};