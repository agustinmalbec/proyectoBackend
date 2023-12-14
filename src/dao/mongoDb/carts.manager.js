import cartModel from "../models/carts.model.js";

class CartDAO {
    constructor() {
        this.model = cartModel;
    }

    async addCart(cart) {
        return await this.model.create(cart)
    }

    async getCartById(cartId) {
        return await this.model.findOne({ _id: cartId });
    }

    async addProductToCart(cartId, products) {
        return await this.model.updateOne(cartId, products);
    }
}

const cartDAO = new CartDAO();
export default cartDAO;