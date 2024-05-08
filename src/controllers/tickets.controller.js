import { ticketService } from "../services/service.js";
import { logger } from '../middleware/logger.middleware.js';

class TicketController {
    constructor() {
        this.controller = ticketService;
    }

    async addTicket(amount, purchase) {
        try {
            return await this.controller.addTicket(amount, purchase);
        } catch (error) {
            logger.error(`Ha ocurrido un error: ${error}`);
        }
    }

    async getTickets() {
        try {
            return await this.controller.getTickets();
        } catch (error) {
            logger.error(`Ha ocurrido un error: ${error}`);
        }
    }

    async getSingleTicket(id) {
        try {
            return await this.controller.getSingleTicket(id);
        } catch (error) {
            logger.error(`Ha ocurrido un error: ${error}`);
        }
    }

    async deleteTicket(id) {
        try {
            return await this.controller.deleteTicket(id);
        } catch (error) {
            logger.error(`Ha ocurrido un error: ${error}`);
        }
    }
}

const ticketController = new TicketController();
export default ticketController;