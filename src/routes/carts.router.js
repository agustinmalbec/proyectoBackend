import { Router } from "express";
import cartController from "../controllers/carts.controller.js";
import productController from "../controllers/products.controller.js";
import { isUser } from "../middleware/auth.middleware.js";
import ticketController from "../controllers/tickets.controller.js";
import { middlewarePassportJWT } from "../middleware/jwt.middleware.js";
import userController from "../controllers/users.controller.js";

const cartsRouter = Router();

cartsRouter.post('/', async (req, res) => {
    try {
        const cart = req.body
        await cartController.addCart(cart);
        res.send('Carrito agregado correctamente');
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartController.getCartById(cid);
        if (!cart) {
            res.status(404).send(`No se encontró el carrito con id ${cid}`);
        }
        res.send(cart.products);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

cartsRouter.post('/:cid/product/:pid', middlewarePassportJWT, isUser, async (req, res) => {
    try {
        const addProdCart = await cartController.addProductToCart(req.params.cid, req.params.pid);
        if (!addProdCart) {
            res.status(404).send('No hay stock del producto');
        } else {
            console.log('Se agrego el producto');
        }
        res.status(201).send(addProdCart);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

cartsRouter.delete('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartController.deleteCartProducts(cid);
        if (!cart) {
            return res.status(404).send(`No se eliminaron los productos del carrito con id ${cid}`);
        }
        res.send(cart);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

cartsRouter.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const deleted = await cartController.deleteProductFromCart(req.params.cid, req.params.pid);
        res.send(deleted);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

cartsRouter.put('/:cid', async (req, res) => {
    try {
        const cartUpdated = await cartController.updateCart(req.params.cid, req.body);
        res.send(cartUpdated);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

cartsRouter.put('/:cid/product/:pid', async (req, res) => {
    try {
        const quantity = req.body.quantity;
        const productUpdated = await cartController.updateProductCart(req.params.cid, req.params.pid, quantity);
        res.send(productUpdated);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

cartsRouter.put('/:cid/purchase', async (req, res) => {
    try {
        const cart = await cartController.getCartById(req.params.cid);
        const finalCart = [];
        const outOfStock = [];
        let amount = 0;
        const user = await userController.getUserByCart(cart);
        cart.products.forEach(async element => {
            const productId = element.product._id;
            const product = await productController.getProductById(productId);
            if (element.quantity > product.stock) {
                outOfStock.push(product._id);
            } else {
                product.stock -= element.quantity;
                amount += product.price * element.quantity;
                await productController.updateProduct(productId, product);
                finalCart.push(product);
                console.log(amount);
            }
        });

        console.log(amount);
        if (amount > 0) {
            await ticketController.addTicket({ amount: amount, email: user.email });
            await cartController.updateCart(cart, []);
        }
        if (outOfStock.length > 0) {
            await cartController.updateCart(cart, []);
            res.send(outOfStock);
        } else {
            res.send('Compra realizada con éxito');
        }

    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

export default cartsRouter;