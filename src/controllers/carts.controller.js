import { cartService } from "../services/service.js";
import productController from "./products.controller.js";

class CartController {
    constructor() {
        this.controller = cartService;
    }

    async addCart(cart) {
        try {
            return await this.controller.addCart(cart);
        } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`);
        }
    }

    async getCartById(cartId) {
        try {
            const find = await this.controller.getCartById(cartId);
            if (!find) {
                throw new Error(`El carrito con id: ${error}, no existe`);
            }
            return await find;
        } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`);
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const cart = await this.controller.getCartById(cartId);
            const prod = await productController.getProductById(productId);
            const find = cart.products.findIndex(e => e.product._id == productId);
            if (find != -1) {
                cart.products[find].quantity++;
            } else {
                cart.products.push({ product: prod._id, quantity: 1 });
            }
            return await this.controller.addProductToCart({ _id: cart._id }, { products: cart.products });
        } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`);
        }
    }

    async updateCart(cartId, products) {
        try {
            await this.controller.getCartById(cartId);
            return await this.controller.updateCart(cartId, products);
        } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`);
        }
    }

    async deleteCart(cartId) {
        try {
            return await this.controller.deleteCart(cartId);
        } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`);
        }
    }

    async deleteCartProducts(cartId) {
        try {
            return await this.controller.updateCart(cartId, []);
        } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`);
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await this.controller.getCartById(cartId);
            cart.products = cart.products.filter(
                (product) => product._id.toString() !== productId
            );
            return await cart.save();
        } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`);
        }
    }

    async updateProductCart(cartId, productId, quantity) {
        try {
            const cart = await this.controller.getCartById(cartId);
            const productIndex = cart.products.findIndex(
                (product) => product._id.toString() === productId
            );
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = quantity;
                return await cart.save();
            } else {
                throw new Error("Error al actualizar cantidad de productos");
            }
        } catch (error) {
            throw new Error(`Ha ocurrido un error: ${error}`);
        }
    }
}

const cartController = new CartController();
export default cartController;