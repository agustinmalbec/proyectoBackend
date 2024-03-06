import cartModel from '../../models/carts.model.js'

export default class CartService {
    constructor() {
        this.model = cartModel;
    }

    async addCart(cart) {
        return await this.model.create(cart);
    }

    async addProductToCart(cartId, products) {
        return await this.model.updateOne(cartId, products);
    }

    async getCarts() {
        return await this.model.find();
    }

    async getCartById(cartId) {
        return await this.model.findOne({ _id: cartId }).lean();
    }

    async deleteCart(cartId) {
        return await this.model.findByIdAndDelete({ _id: cartId });
    }

    async updateCart(cartId, products) {
        return await this.model.findByIdAndUpdate(cartId, { products }, { new: true });
    }
}