import { Router } from "express";
import userController from "../controllers/users.controller.js";
import { createHash } from "../utils/utils.js";
import passport from "passport";
import { generateToken } from "../middleware/jwt.middleware.js";
//import environment from "../config/environment.config.js";
import { resetPassword, sendEmailToResetPassword } from "../controllers/email.controller.js";


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
/* userRouter.post('/authentication', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = {};
        if (email === environment.ADMIN_USERNAME) {
            user.role = 'admin';
            user.email = environment.ADMIN_USERNAME;
            user.password = environment.ADMIN_PASSWORD;
            if (user.password !== password) throw new Error('Contraseña incorrecta');
        } else {
            user = await userController.getUserByEmail(email);
        }
        if (!user) throw new Error('El usuario no existe');

        if (!isValidPassword(user, password) && email !== environment.ADMIN_USERNAME) throw new Error('Contraseña incorrecta');
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
}); */

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

userRouter.post('/premium/:uid', async (req, res) => {
    try {
        const userId = req.params.uid
        const user = await userController.getUserById(userId);
        if (user.role === 'premium') {
            user.role = 'user'
            await userController.updateUser(userId, user);
            return res.redirect('/api/users/logout');
        }
        user.role = 'premium';
        await userController.updateUser(userId, user);
        return res.redirect('/api/users/logout');
    } catch (error) {
        req.logger.error('No se pudo cambiar el rol');
        res.status(500).send(error);
    }
});

export default userRouter;