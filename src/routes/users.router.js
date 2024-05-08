import { Router } from "express";
import userController from "../controllers/users.controller.js";
import { createHash } from "../utils/utils.js";
import passport from "passport";
import { generateToken } from "../middleware/jwt.middleware.js";
import { resetPassword, sendEmailToResetPassword, emailToInactiveUser } from "../controllers/email.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const userRouter = Router();

userRouter.post('/register', passport.authenticate('register', { failureRedirect: '/register' }), async (req, res) => {
    try {
        res.redirect('/login');
    } catch (error) {
        req.logger.error('No se pudo registrar');
        res.status(500).send(error);
    }
});

userRouter.post('/authentication', passport.authenticate('login', { failureRedirect: '' }), async (req, res) => {
    const user = req.user;
    try {
        const token = generateToken(user);
        res.cookie('jwtCookieToken', token,
            {
                maxAge: 6000000,
                httpOnly: true
            }
        ).redirect('/');
    } catch (error) {
        req.logger.error('No se pudo iniciar sesión');
        res.status(400).json({ error: error.message });
    }
});

userRouter.get('/logout', async (req, res) => {
    try {
        res.clearCookie('jwtCookieToken').redirect('/login');
    } catch (error) {
        req.logger.error('No se pudo finalizar la sesión');
        res.status(500).send(error);
    }
});

userRouter.post('/forgotPassword', sendEmailToResetPassword);

userRouter.get('/passwordReset/:token', resetPassword);

userRouter.post('/newPassword/:email', async (req, res) => {
    let email = req.params.email
    const { password, confirmPassword } = req.body;
    try {
        const user = await userController.getUserByEmail(email);
        if (password !== confirmPassword) {
            return res.render('error', { message: 'Las contra no coinciden', redirect: '/login' });
        }
        user.password = createHash(password);
        if (password === user.password) {
            return res.render('error', { message: 'No se puede ingresar la misma contraseña', redirect: '/login' });
        }
        await userController.updateUser(user._id, user);
        res.redirect('/login');
    } catch (error) {
        req.logger.error('No se pudo finalizar la sesión');
        res.status(500).send(error);
    }
});

let alertData = {
    showAlert: false,
    title: '',
    icon: ''
};
userRouter.post('/premium/:uid', async (req, res) => {
    try {

        const userId = req.params.uid
        const user = await userController.getUserById(userId);
        if (user.role === 'premium') {
            user.role = 'user'
            await userController.updateUser(userId, user);
            alertData = {
                showAlert: true,
                title: 'Se cambio el rol a user',
                icon: 'success'
            };
            return res.redirect('back');
        }
        let identificación = user.documents.find(obj => obj.name == 'identificacion');
        let comprobanteDeDomicilio = user.documents.find(obj => obj.name == 'comprobanteDeDomicilio');
        let comprobanteDeEstadoDeCuenta = user.documents.find(obj => obj.name == 'comprobanteDeEstadoDeCuenta');
        if (!identificación || !comprobanteDeDomicilio || !comprobanteDeEstadoDeCuenta) {
            req.logger.error('No posee la documentación');
            alertData = {
                showAlert: true,
                title: 'No posee la documentación necesaria',
                icon: 'error'
            };
            return res.redirect('back');
        }
        user.role = 'premium';
        alertData = {
            showAlert: true,
            title: 'Se cambio el rol a premium',
            icon: 'success'
        };

        await userController.updateUser(userId, user);
        return res.redirect('back');
    } catch (error) {
        req.logger.error('No se pudo cambiar el rol');
        res.status(500).send(error);
    }
});
export { alertData }

userRouter.post('/:uid/documents', upload, async (req, res) => {
    try {
        const files = req.files;
        const userId = req.params.uid;
        const user = await userController.getUserById(userId);
        files.forEach(doc => {
            user.documents.push({ name: doc.filename, reference: doc.path });
        });
        await userController.updateUser(userId, user);
    } catch (error) {
        req.logger.error('No se pudieron cargar los documentos');
        res.status(500).send(error);
    }
});

userRouter.get('/', async (req, res) => {
    try {
        const modUsers = [];
        const users = await userController.getUsers();
        users.forEach((element) => {
            let user = {
                fullName: element.first_name + ' ' + element.last_name,
                email: element.email,
                role: element.role
            }
            modUsers.push(user)
        });
        res.send(modUsers);
    } catch (error) {
        req.logger.error('No se pudo registrar');
        res.status(500).send(error);
    }
});

userRouter.delete('/', async (req, res) => {
    try {
        const users = await userController.getUsers();
        const today = new Date;
        let days;
        users.forEach(async element => {
            if (element.last_connection !== undefined) {
                let userDate = new Date(element.last_connection);
                days = (today - userDate) / (1000 * 60 * 60 * 24);
            }
            if (days > 2 || days === undefined) {
                emailToInactiveUser(element.email);
                await userController.deleteUser(element._id);
            }
        });
        res.send('Susses');
    } catch (error) {
        req.logger.error('No se pudo registrar');
        res.status(500).send(error);
    }
});

userRouter.post('/:uid', async (req, res) => {
    try {
        const uid = req.params.uid;
        await userController.deleteUser(uid);
        res.redirect('back');
    } catch (error) {
        req.logger.error('No se pudo registrar');
        res.status(500).send(error);
    }
});

export default userRouter;