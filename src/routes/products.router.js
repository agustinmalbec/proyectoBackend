import { Router } from "express";
import productController from "../controllers/products.controller.js";
import { middlewarePassportJWT } from "../middleware/jwt.middleware.js";
import { generateProduct } from "../utils/utils.js";
import errorHandler from '../errors/errorMiddleware.js';
import { authorization } from '../utils/utils.js';
import { deleteProductEmail } from "../controllers/email.controller.js";

const productsRouter = Router();
productsRouter.use(errorHandler)

productsRouter.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, query = null, sort = 1 } = req.query;
        const products = await productController.getProducts(limit, page, query, sort);
        const prevPage = products.prevPage;
        const nextPage = products.nextPage;
        const prevLink =
            prevPage &&
            `${req.baseUrl}/?page=${prevPage}&limit=${limit}&sort=${sort || ""
            }&query=${encodeURIComponent(query || "")}${query ? `&query=${query}` : ""
            }`;

        const nextLink =
            nextPage &&
            `${req.baseUrl}/?page=${nextPage}&limit=${limit}&sort=${sort || ""
            }&query=${encodeURIComponent(query || "")}${query ? `&query=${query}` : ""
            }`;
        res.send({ status: "success", payload: products.docs, page: page, prevLink: prevLink, nextLink: nextLink });
    } catch (error) {
        req.logger.error(`No se obtuvieron los productos`);
        res.status(500).send(error);
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await productController.getProductById(pid);
        if (!product) {
            return res.status(404).send(`No se encotro el producto con id ${pid}`);
        }
        res.send(product);
    } catch (error) {
        req.logger.error(`No se obtuvo el producto por id`);
        res.status(500).send(error);
    }
});

productsRouter.post('/', middlewarePassportJWT, authorization('admin', 'premium'), async (req, res) => {
    try {
        const product = req.body;
        const user = req.user;
        product.owner = user.email;
        const response = await productController.addProduct(product);
        if (typeof (response) == 'string') {
            return res.status(404).send(`No se pudo agregar el producto, falta el campo ${response}`);
        }
        res.send(product);
    } catch (error) {
        req.logger.error(`No se agrego el producto`);
        res.status(500).send({ error: error.code, message: error.message });
    }
});

productsRouter.put('/:pid', middlewarePassportJWT, authorization('admin'), async (req, res) => {
    try {
        const pid = req.params.pid;
        const update = req.body;
        const updatedProduct = await productController.updateProduct(pid, update);
        if (!updatedProduct) {
            return res.status(404).send(`No se pudo actualizar el producto con id ${pid}`);
        }
        res.send(`El producto con id ${pid} se actualizo correctamente`);
    } catch (error) {
        req.logger.error(`No se actualizo el producto`);
        res.status(500).send(error);
    }
});

productsRouter.delete('/:pid', middlewarePassportJWT, authorization('admin', 'premium'), async (req, res) => {
    try {
        const user = req.user;
        const pid = req.params.pid;
        const product = await productController.getProductById(pid);
        if (user.role !== 'admin' && product.owner !== user.email) {
            return req.logger.debug('Este usuario no creo este producto');
        }
        if (user.role !== 'admin') {
            deleteProductEmail(user.email, product.title, pid);
        }
        const deleted = await productController.deleteProduct(pid);
        if (!deleted) {
            return res.status(404).send(`No se pudo eliminar el producto con id ${pid}`);
        }
        res.send(`El producto con id ${pid} se elimino correctamente`);
    } catch (error) {
        req.logger.error(`No se elimino el producto`);
        res.status(500).send(error);
    }
});

productsRouter.post('/mockingproducts', async (req, res) => {
    try {
        let products = [];
        for (let i = 0; i < 20; i++) {
            let product = generateProduct()
            products.push(product);
            await productController.addProduct(product);
        }
        res.json(products);
    } catch (error) {
        req.logger.error(`No se agregaron los productos`);
        res.status(500).send(error);
    }
});

export default productsRouter;