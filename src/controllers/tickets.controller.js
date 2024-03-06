import { ticketService } from "../services/service.js";

class TicketController {
    constructor() {
        this.controller = ticketService;
    }

    async addTicket(ticket) {
        try {
            return await this.controller.addTicket(ticket);
        } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`);
        }
    }

    async getTickets() {
        try {
            return await this.controller.getTickets();
        } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`);
        }
    }

    async getSingleTicket(id) {
        try {
            return await this.controller.getSingleTicket(id);
        } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`);
        }
    }

    async deleteTicket(id) {
        try {
            return await this.controller.deleteTicket(id);
        } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`);
        }
    }
}

const ticketController = new TicketController();
export default ticketController;