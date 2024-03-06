import { Router } from "express";
import userController from "../controllers/users.controller.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";
import { generateToken } from "../middleware/jwt.middleware.js";
import environment from "../config/environment.config.js";

const userRouter = Router();

userRouter.post('/register', passport.authenticate('register', { failureRedirect: '/register' }), async (req, res) => {
    try {
        res.redirect('/login');
    } catch (error) {
        res.status(500).send(error);
    }
});

/* userRouter.post('/login', passport.authenticate('login', { failureRedirect: '' }), async (req, res) => {
    try {
        const user = req.user;
        if (user.email == 'adminCoder@coder.com') user.role = 'admin';

        req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age
        }

        res.redirect('/');
    } catch (error) {
        res.status(500).send(error);
    }
}); */

userRouter.post('/authentication', async (req, res) => {
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
        if (!user) throw new Error('Ese usuario no existe');
        if (!isValidPassword(user, password) && email !== environment.ADMIN_USERNAME) throw new Error('Contraseña incorrecta');
        const token = generateToken(user);
        res.cookie('jwtCookieToken', token,
            {
                maxAge: 6000000,
                httpOnly: true
            }
        ).redirect('/');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

userRouter.get('/logout', async (req, res) => {
    try {
        res.clearCookie('jwtCookieToken').redirect('/login');
    } catch (error) {
        res.status(500).send(error);
    }
});

export default userRouter;