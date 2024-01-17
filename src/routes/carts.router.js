import { Router } from "express";
import cartDAO from "../dao/mongoDb/carts.manager.js";
import productDAO from "../dao/mongoDb/products.manager.js";

const cartsRouter = Router();

cartsRouter.post('/', async (req, res) => {
    try {
        const cart = req.body
        await cartDAO.addCart(cart);
        res.send('Carrito agregado correctamente');
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartDAO.getCartById(cid);
        if (!cart) {
            res.status(404).send(`No se encontró el carrito con id ${cid}`);
        }
        res.send(cart.products);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const cart = await cartDAO.getCartById(cid);
        const prod = await productDAO.getProductById(pid);
        const find = cart.products.findIndex(e => e.product._id == pid);
        if (find != -1) {
            cart.products[find].quantity++;
        } else {
            cart.products.push({ product: prod._id, quantity: 1 });
        }
        const cartUpdated = await cartDAO.addProductToCart({ _id: cart._id }, { products: cart.products });
        if (!cartUpdated) {
            return res.status(404).send('No se pudo agregar el producto al carrito');
        }
        res.send('El producto se agrego correctamente');
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

cartsRouter.delete('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartDAO.deleteCartProducts(cid);
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
        const deleted = await cartDAO.deleteProductFromCart(req.params.cid, req.params.pid);
        res.send(deleted);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

cartsRouter.put('/:cid', async (req, res) => {
    try {
        const cartUpdated = await cartDAO.updateCart(req.params.cid, req.body);
        res.send(cartUpdated);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

cartsRouter.put('/:cid/product/:pid', async (req, res) => {
    try {
        const quantity = req.body.quantity;
        const productUpdated = await cartDAO.updateProductCart(req.params.cid, req.params.pid, quantity);
        res.send(productUpdated);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

export default cartsRouter;