export default class CartRepository {
    constructor(dao) {
        this.service = dao;
    }

    async addCart(cart) {
        return await this.service.addCart(cart);
    }

    async updateCart(cartId, products) {
        return await this.service.updateCart(cartId, products);
    }

    async getCarts() {
        return await this.service.getCarts();
    }

    async getCartById(cartId) {
        return await this.service.getCartById(cartId);
    }

    async deleteCart(cartId) {
        return await this.service.deleteCart(cartId);
    }
}