import { Router } from "express";
import userDAO from "../dao/mongoDb/users.manager.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";
import { generateJWToken } from "../utils.js";

const userRouter = Router();

userRouter.post('/register', passport.authenticate('register', { failureRedirect: '' }), async (req, res) => {
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

userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = {};
        if (email === 'adminCoder@coder.com') {
            user.role = 'admin';
            user.email = 'adminCoder@coder.com';
            user.password = 'asd';
            if (user.password !== password) throw new Error('Contraseña incorrecta');
        } else {
            user = await userDAO.getUserByEmail(email);
        }
        if (!user) throw new Error('Ese usuario no existe');
        if (!isValidPassword(user, password) && email !== 'adminCoder@coder.com') throw new Error('Contraseña incorrecta');
        const token = generateJWToken(user);
        res.cookie('jwtCookieToken', token,
            {
                maxAge: 60000,
                httpOnly: true
            }
        );
        res.send({ message: "Login success!!" })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

userRouter.get('/logout', async (req, res) => {
    try {
        req.session.destroy(error => {
            if (error) {
                res.json({ error: 'Logout error', message: 'Error al cerrar sesión' });
            }
            res.redirect('/');
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

export default userRouter;