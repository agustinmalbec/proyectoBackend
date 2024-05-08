import { userService } from "../services/service.js";
import { logger } from '../middleware/logger.middleware.js';

class UserController {
    constructor() {
        this.controller = userService;
    }

    async getUsers() {
        try {
            return await this.controller.getUsers();
        } catch (error) {
            logger.error(`Ha ocurrido un error: ${error}`);
        }
    }

    async getUserByEmail(email) {
        try {
            return await this.controller.getUserByEmail(email);
        } catch (error) {
            logger.error(`Ha ocurrido un error: ${error}`);
        }
    }

    async getUserById(id) {
        try {
            return await this.controller.getUserById(id);
        } catch (error) {
            logger.error(`Ha ocurrido un error: ${error}`);
        }
    }

    async getUserByCart(cart) {
        try {
            return await this.controller.getUserByCart(cart);
        } catch (error) {
            logger.error(`Ha ocurrido un error: ${error}`);
        }
    }

    async createUser(user) {
        try {
            return await this.controller.createUser(user);
        } catch (error) {
            logger.error(`Ha ocurrido un error: ${error}`);
        }
    }

    async updateUser(id, user) {
        try {
            return await this.controller.updateUser(id, user);
        } catch (error) {
            logger.error(`Ha ocurrido un error: ${error}`);
        }
    }

    async deleteUser(id) {
        try {
            return await this.controller.deleteUser(id);
        } catch (error) {
            logger.error(`Ha ocurrido un error: ${error}`);
        }
    }
}

const userController = new UserController();
export default userController;