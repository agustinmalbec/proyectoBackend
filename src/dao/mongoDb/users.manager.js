import userModel from "../../models/user.model.js";

class UserDAO {
    constructor() {
        this.model = userModel;
    }

    async getUsers() {
        return await this.model.find();
    }

    async getUserByEmail(email) {
        return await this.model.findOne({ email: email });
    }

    async getUserById(id) {
        return await this.model.findById(id);
    }

    async createUser(user) {
        return await this.model.create(user);
    }

    async updateUser(id, user) {
        return await this.model.updateOne({ _id: id }, user);
    }

}

const userDAO = new UserDAO();
export default userDAO;