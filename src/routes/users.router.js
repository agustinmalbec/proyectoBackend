import { Router } from "express";
//import userController from "../controllers/users.controller.js";
//import { createHash, isValidPassword } from "../utils/utils.js";
import passport from "passport";
import { generateToken } from "../middleware/jwt.middleware.js";
//import environment from "../config/environment.config.js";

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

export default userRouter;