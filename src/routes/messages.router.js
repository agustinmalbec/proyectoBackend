import { Router } from 'express';
import { isUser } from '../middleware/auth.middleware.js';
import { middlewarePassportJWT } from '../middleware/jwt.middleware.js';
import messagesController from '../controllers/messages.controller.js';

const messagesRouter = Router();

messagesRouter.get('/', async (req, res) => {
    try {
        const messagesHistory = await messagesController.getAllMessages();
        res.send(messagesHistory);
    } catch (err) {
        req.logger.error(`No se obtuvieron los mensajes`);
        res.status(500).send({ err });
    }
});

messagesRouter.post('/', middlewarePassportJWT, isUser, async (req, res) => {
    const message = req.body;
    try {
        const newMessage = await messagesController.addMessage(message);
        res.send(newMessage);
    } catch (err) {
        req.logger.error(`No se envió el mensaje`);
        res.status(500).send({ err });
    }
});

export default messagesRouter;