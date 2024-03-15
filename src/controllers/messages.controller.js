import { messageService } from "../services/service.js";
import { logger } from '../middleware/logger.middleware.js';

class MessagesController {
    constructor() {
        this.controller = messageService;
    }

    async getAllMessages() {
        try {
            return await this.controller.getAllMessages();
        } catch (error) {
            logger.error(`Ha ocurrido un error: ${error}`);
        }
    }

    async getUser(user) {
        try {
            const find = await this.controller.getUser(user);
            if (!find) {
                return logger.error('El usuario no existe');
            }
            return find;
        } catch (error) {
            logger.error(`Ha ocurrido un error: ${error}`);
        }
    }

    async addUser(user) {
        try {
            const find = await this.controller.getUser(user);
            return await this.controller.addUser(find);
        } catch (error) {
            logger.error(`Ha ocurrido un error: ${error}`);
        }
    }

    async addMessage(user, msj) {
        try {
            const find = await this.controller.getUser(user);
            find.message.push(msj);
            return await find.save();
        } catch (error) {
            logger.error(`Ha ocurrido un error: ${error}`);
        }
    }
}

const messagesController = new MessagesController();
export default messagesController; 