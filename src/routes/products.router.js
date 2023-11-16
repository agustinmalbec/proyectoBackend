import { Router } from "express";
import productManager from "../managers/productManager.js";

const productsRouter = Router();

productsRouter.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();
        const limitedProducts = products.slice(0, limit);
        res.send(limitedProducts);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.send(`No se encotro el producto con id ${pid}`);
        }
        res.send(product);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
    }
});

productsRouter.post('/', async (req, res) => {
    try {
        const product = req.body;
        await productManager.addProduct(product);
        res.send(product);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
    }
});

productsRouter.put('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const update = req.body;
        await productManager.updateProduct(pid, update);
        res.send(update);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
    }
});

productsRouter.delete('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        await productManager.deleteProduct(pid);
        res.send(pid);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
    }
});

export default productsRouter;