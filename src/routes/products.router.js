import { Router } from "express";
import productDAO from "../dao/mongoDb/products.manager.js";

const productsRouter = Router();

productsRouter.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, price } = req.query;
        const products = await productDAO.getProducts(limit, page);
        const prevPage = products.prevPage;
        const nextPage = products.nextPage;
        const prevLink =
            prevPage &&
            `${req.baseUrl}/?page=${prevPage}&limit=${limit}&sort=${sort || ""
            }&price=${encodeURIComponent(price || "")}${price ? `&price=${price}` : ""
            }`;

        const nextLink =
            nextPage &&
            `${req.baseUrl}/?page=${nextPage}&limit=${limit}&sort=${sort || ""
            }&price=${encodeURIComponent(price || "")}${price ? `&price=${price}` : ""
            }`;
        res.send({ status: "success", payload: products, page: page, prevLink: prevLink, nextLink: nextLink });
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await productDAO.getProductById(pid);
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
        const response = await productDAO.addProduct(product);
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
        const updatedProduct = await productDAO.updateProduct(pid, update);
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
        const deleted = await productDAO.deleteProduct(pid);
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