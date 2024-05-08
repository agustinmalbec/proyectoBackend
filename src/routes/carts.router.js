import { Router } from "express";
import cartController from "../controllers/carts.controller.js";
import productController from "../controllers/products.controller.js";
import ticketController from "../controllers/tickets.controller.js";
import { middlewarePassportJWT } from "../middleware/jwt.middleware.js";
import userController from "../controllers/users.controller.js";
import { authorization } from '../utils/utils.js';

const cartsRouter = Router();

cartsRouter.post('/', async (req, res) => {
    try {
        const cart = req.body
        await cartController.addCart(cart);
        req.logger.info(`Carrito agregado correctamente`)
        res.send('Carrito agregado correctamente');
    } catch (error) {
        req.logger.error(`No se creo el carrito`);
        res.status(500).send(error);
    }
});

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartController.getCartById(cid);
        if (!cart) {
            req.logger.error(`El carrito no se encontró`);
        }
        res.send(cart.products);
    } catch (error) {
        req.logger.error(`El carrito no se encontró`);
        res.status(500).send(error);
    }
});

cartsRouter.post('/:cid/product/:pid', middlewarePassportJWT, authorization('user', 'premium'), async (req, res) => {
    try {
        const user = req.user;
        const product = await productController.getProductById(req.params.pid);
        if (user.role === 'premium' && user.email === product.owner) {
            return req.logger.warning(`No se puede agregar un producto que hayas creado`);
        }
        const addProdCart = await cartController.addProductToCart(req.params.cid, req.params.pid);
        if (!addProdCart) {
            req.logger.warning(`No hay stock del producto`);
        } else {
            req.logger.info(`Se agrego el producto`);
        }
        res.status(201).send(addProdCart);
    } catch (error) {
        req.logger.error(`No se pudo agregar el producto al carrito`);
        res.status(500).send(error);
    }
});

cartsRouter.delete('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartController.deleteCartProducts(cid);
        if (!cart) {
            req.logger.error(`El carrito no se encontró`);
        }
        res.send(cart);
    } catch (error) {
        req.logger.error(`No se elimino el carrito`);
        res.status(500).send(error);
    }
});

cartsRouter.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const deleted = await cartController.deleteProductFromCart(req.params.cid, req.params.pid);
        res.send(deleted);
    } catch (error) {
        req.logger.error(`No se elimino el producto del carrito`);
        res.status(500).send(error);
    }
});

cartsRouter.put('/:cid', async (req, res) => {
    try {
        const cartUpdated = await cartController.updateCart(req.params.cid, req.body);
        res.send(cartUpdated);
    } catch (error) {
        req.logger.error(`No se actualizo el carrito`);
        res.status(500).send(error);
    }
});

cartsRouter.put('/:cid/product/:pid', async (req, res) => {
    try {
        const quantity = req.body.quantity;
        const productUpdated = await cartController.updateProductCart(req.params.cid, req.params.pid, quantity);
        res.send(productUpdated);
    } catch (error) {
        req.logger.error(`No se actualizo el producto del carrito`);
        res.status(500).send(error);
    }
});

cartsRouter.post('/:cid/purchase', async (req, res) => {
    try {
        const cartId = req.params.cid
        const cart = await cartController.getCartById(cartId);
        const finalCart = [];
        const outOfStock = [];
        let amount = 0;
        const user = await userController.getUserByCart(cart);
        for (const element of cart.products) {
            const productId = element.product._id
            const product = await productController.getProductById(productId)
            if (element.quantity > product.stock) {
                outOfStock.push(product._id)
            } else
                product.stock -= element.quantity;
            amount += product.price * element.quantity
            await productController.updateProduct(productId, product);
            finalCart.push(product);
        }
        if (amount > 0) {
            const ticket = await ticketController.addTicket({ amount: amount, purchase: user.email });
            await cartController.deleteCartProducts(cartId);
            res.send(ticket);
        }
    } catch (error) {
        req.logger.error(`No se concreto la compra`);
        res.status(500).send(error);
    }
});

export default cartsRouter;