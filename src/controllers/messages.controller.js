import { messageService } from "../services/service.js";

class MessagesController {
    constructor() {
        this.controller = messageService;
    }

    async getAllMessages() {
        try {
            return await this.controller.getAllMessages();
        } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`);
        }
    }

    async getUser(user) {
        try {
            const find = await this.controller.getUser(user);
            if (!find) {
                throw new Error('El usuario no existe');
            }
            return find;
        } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`);
        }
    }

    async addUser(user) {
        try {
            const find = await this.controller.getUser(user);
            return await this.controller.addUser(find);
        } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`);
        }
    }

    async addMessage(user, msj) {
        try {
            const find = await this.controller.getUser(user);
            find.message.push(msj);
            return await find.save();
        } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`);
        }
    }
}

const messagesController = new MessagesController();
export default messagesController; 