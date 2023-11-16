import { Router } from "express";
import cartManager from "../managers/cartManager.js";

const cartsRouter = Router();

cartsRouter.post('/', async (req, res) => {
    try {
        const cart = req.body;
        await cartManager.addCart(cart);
        res.send(cart);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
    }
});

cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartManager.getCartById(cid);
        res.send(cart.products);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
    }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const cart = await cartManager.addProductToCart(cid, pid);
        res.send(cart);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
    }
});

export default cartsRouter;