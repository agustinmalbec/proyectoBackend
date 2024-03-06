import ticketModel from "../../models/tickets.model.js";

export default class TicketService {
    constructor() {
        this.model = ticketModel;
    }

    async addTicket(ticket) {
        return await this.model.create(ticket);
    }

    async getTickets() {
        return await this.model.find();
    }

    async getSingleTicket(id) {
        return await this.model.findOne({ _id: id }).lean();
    }

    async deleteTicket(id) {
        return await this.model.findByIdAndDelete({ _id: id });
    }
}