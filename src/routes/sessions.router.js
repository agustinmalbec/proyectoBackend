import { Router } from "express";
import passport from "passport";

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
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

sessionsRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { });

sessionsRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '' }), async (req, res) => {
    const user = req.user;
    const token = generateToken(user);
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 60000,
    }).redirect('/');
});

sessionsRouter.get('/current', passport.authenticate('current', { session: false }), async (req, res) => {
    try {
        const user = req.user;
        res.send('Usuario:' + JSON.stringify(user));
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

export default sessionsRouter;