import { Router } from "express";
import cartManager from "../managers/carts.manager.js";

const cartsRouter = Router();

cartsRouter.post('/', async (req, res) => {
    try {
        const cart = await cartManager.addCart();
        res.send(cart);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            res.status(404).send(`No se encontro el carrito con id ${cid}`);
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
        const cart = await cartManager.addProductToCart(cid, pid);
        if (!cart) {
            res.status(404).send('No se pudo agregar el producto al carrito');
        }
        res.send(cart);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

export default cartsRouter;