import cartModel from "../models/carts.model.js";

class CartDAO {
    constructor() {
        this.model = cartModel;
    }

    async addCart(cart) {
        try {
            return await this.model.create(cart);
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

    async getCartById(cartId) {
        try {
            return await this.model.findOne({ _id: cartId });
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

    async addProductToCart(cartId, products) {
        try {
            return await this.model.updateOne(cartId, products);
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

    async deleteCart(cartId) {
        try {
            return await this.model.deleteOne({ _id: cartId });
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

    async deleteCartProducts(cartId) {
        try {
            return await this.model.updateOne(cartId, []);
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await this.model.findOne({ _id: cartId });
            cart.products = cart.products.filter(
                (product) => product._id.toString() !== productId
            );
            return await cart.save();
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

    async updateCart(id, products) {
        try {
            return await this.model.findByIdAndUpdate(id, { products }, { new: true });
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

    async updateProductCart(cartId, productId, quantity) {
        try {
            const cart = await this.model.findOne({ _id: cartId });
            const productIndex = cart.products.findIndex(
                (product) => product._id.toString() === productId
            );

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = quantity;
                return await cart.save();
            } else {
                console.log("Error al actualizar cantidad de productos");
            }
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }
}

const cartDAO = new CartDAO();
export default cartDAO;