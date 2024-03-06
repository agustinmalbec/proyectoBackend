export default class MessageRepository {
    constructor(dao) {
        this.service = dao;
    }

    async getAllMessages() {
        return await this.service.getAllMessages();
    }

    async getUser(user) {
        return await this.service.getUser(user)
    }

    async addUser(user) {
        return await this.service.addUser(user)
    }

    async addMessage(user, message) {
        return await this.service.addMessage(user, message);
    }
}