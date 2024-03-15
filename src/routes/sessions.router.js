import { Router } from "express";
import passport from "passport";
import { generateToken, middlewarePassportJWT } from "../middleware/jwt.middleware.js";
import UserDTO from "../services/dto/users.dto.js";

const sessionsRouter = Router();

sessionsRouter.get('/logout', (req, res) => {
    try {
        req.session.destroy(error => {
            if (error) {
                res.json({ error: 'Logout error', msg: 'Error al cerrar sesión' });
            }
            res.send('Sesión cerrada correctamente');
        });
    } catch (error) {
        req.logger.error(`No se finalizo la sesión`);
        res.status(500).send(error);
    }
});

sessionsRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { });

sessionsRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '' }), async (req, res) => {
    const user = req.user;
    try {
        const token = generateToken(user);
        res.cookie('jwtCookieToken', token, {
            httpOnly: true,
            maxAge: 60000,
        }).redirect('/');
    } catch (error) {
        req.logger.error(`No se inicio la sesión con github`);
        res.status(500).send(error);
    }
});

sessionsRouter.get('/current', middlewarePassportJWT, async (req, res) => {
    const { user } = req.user;
    delete user.password;
    delete user.age;
    delete user.cart;
    res.status(200).send({ message: 'Sesión actual: ', user: new UserDTO(user) });
});

export default sessionsRouter;