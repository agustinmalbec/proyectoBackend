import { Router } from "express";
import productManager from "../managers/products.manager.js";

const productsRouter = Router();

productsRouter.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();
        if (!products) {
            return res.status(404).send('No se pudieron obtener los productos');
        }
        const limitedProducts = products.slice(0, limit);
        res.send(limitedProducts);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).send(`No se encotro el producto con id ${pid}`);
        }
        res.send(product);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

productsRouter.post('/', async (req, res) => {
    try {
        const product = req.body;
        const response = await productManager.addProduct(product);
        if (typeof (response) == 'string') {
            res.status(404).send(`No se pudo agregar el producto, falta el campo ${response}`);
        }
        res.send(product);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

productsRouter.put('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const update = req.body;
        const updatedProduct = await productManager.updateProduct(pid, update);
        if (!updatedProduct) {
            return res.status(404).send(`No se pudo actualizar el producto con id ${pid}`);
        }
        res.send(updatedProduct);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

productsRouter.delete('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const deleted = await productManager.deleteProduct(pid);
        if (!deleted) {
            return res.status(404).send(`No se pudo eliminar el producto con id ${pid}`);
        }
        res.send(pid);
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

export default productsRouter;