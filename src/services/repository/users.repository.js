import UserDTO from "../dto/users.dto.js";

export default class UserRepository {
    constructor(dao) {
        this.service = dao;
    }

    async getUsers() {
        return await this.service.getUsers();
    }

    async getUserByEmail(email) {
        return await this.service.getUserByEmail(email);
    }

    async getUserByCart(cart) {
        return await this.service.getUserByCart(cart);
    }

    async getUserById(id) {
        return await this.service.getUserById(id);
    }

    async createUser(user) {
        const newUser = new UserDTO(user);
        return await this.service.createUser(newUser);
    }

    async updateUser(id, user) {
        return await this.service.updateUser(id, user);
    }

    async deleteUser(id) {
        return await this.service.deleteUser(id);
    }
}