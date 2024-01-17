import { Router } from "express";
import userDAO from "../dao/mongoDb/users.manager.js";
import { createHash, isValidPassword } from "../utils.js";

const userRouter = Router();

userRouter.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const exist = await userDAO.getUserByEmail(email);
        if (exist) {
            return res.status(400).send({ status: 'error', message: 'El usuario ya existe' });
        }
        const user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password)
        }
        if (email == 'adminCoder@coder.com') user.role = 'admin';
        await userDAO.createUser(user);
        res.redirect('/login');
    } catch (error) {
        res.status(500).send(error);
    }
});

userRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userDAO.getUserByEmail(email);

        if (!user) return res.status(401).send({ status: 'error', message: "Incorrect credentials" });

        if (!isValidPassword(user, password)) return res.status(401).send({ status: 'error', error: "Incorrect pass" });

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