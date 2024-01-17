import { Router } from "express";

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

export default sessionsRouter;