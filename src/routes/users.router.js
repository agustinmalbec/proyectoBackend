import { Router } from "express";
import userDAO from "../dao/mongoDb/users.manager.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const userRouter = Router();

userRouter.post('/register', passport.authenticate('register', { failureRedirect: '' }), async (req, res) => {
    try {
        res.redirect('/login');
    } catch (error) {
        res.status(500).send(error);
    }
});

userRouter.post('/login', passport.authenticate('login', { failureRedirect: '' }), async (req, res) => {
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