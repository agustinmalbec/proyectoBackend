export default class TicketDTO {
    constructor({ amount, purchase }) {
        this.code = Math.random() * 1000;
        this.purchase_datetime = new Date();
        this.amount = amount
        this.purchase = purchase;
    }
}