import nodemailer from 'nodemailer';
import environment from '../config/environment.config.js';
import { logger } from '../middleware/logger.middleware.js';

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