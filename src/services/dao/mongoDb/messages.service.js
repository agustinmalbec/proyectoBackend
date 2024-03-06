import messageModel from '../../models/messages.model.js'

export default class MessagesService {
    constructor() {
        this.model = messageModel;
    }

    async getAllMessages() {
        return await this.model.find();
    }

    /* async addUser(user) {
        let finded = await this.model.findOne({ user });
        if (finded) {
            return finded.user;
        }
        await this.model.create({ user });
        finded = await this.model.findOne({ user });
        return finded.user;
    } */

    async addUser(user) {
        return await this.model.create(user)
    }

    async getUser(user) {
        return await this.model.findOne({ user });
    }

    /* async addMessage(user, msj) {
        const finded = await this.model.findOne({ user });
        finded.message.push(msj);
        return await finded.save();
    } */
    async addMessage(user, message) {

    }
}