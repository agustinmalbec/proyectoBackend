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
    req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age
    }
    res.redirect('/');
});

export default sessionsRouter;