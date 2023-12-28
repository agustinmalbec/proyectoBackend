import { Router } from "express";
import productDAO from "../dao/mongoDb/products.manager.js";
import cartDAO from "../dao/mongoDb/carts.manager.js";

const viewsRouter = Router();

viewsRouter.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, query = "Sin categoria", sort } = req.query;
        const data = await productDAO.getProducts(limit, page, query, sort);
        //data.category = query;
        res.render('index', { title: 'Productos', data: data });
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

viewsRouter.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { title: 'Productos en tiempo real' });
});

viewsRouter.get('/chat', async (req, res) => {
    try {
        res.render('chat', {});
    } catch (error) {
        res.status(500).send(error);
    }
});

viewsRouter.get('/products', async (req, res) => {
    try {
        res.render('products', {});
    } catch (error) {
        res.status(500).send(error);
    }
});

viewsRouter.get('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const data = await cartDAO.getCartById(cartId);
        res.render('carts', { data: data.products });
    } catch (error) {
        res.status(500).send(error);
    }
});

export default viewsRouter;