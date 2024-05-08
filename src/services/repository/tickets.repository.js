import TicketDTO from '../dto/tickets.dto.js'

export default class TicketRepository {
    constructor(dao) {
        this.service = dao;
    }

    async addTicket(amount, purchase) {
        const newTicket = new TicketDTO(amount, purchase);
        return await this.service.addTicket(newTicket);
    }

    async getTickets() {
        return await this.service.getTickets();
    }

    async getSingleTicket(id) {
        return await this.service.getSingleTicket(id);
    }

    async deleteTicket(id) {
        return await this.service.deleteTicket(id);
    }
}