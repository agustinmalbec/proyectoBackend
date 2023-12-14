import { Router } from "express";
import productDAO from "../dao/mongoDb/products.manager.js";

const viewsRouter = Router();

viewsRouter.get('/', async (req, res) => {
    try {
        const data = await productDAO.getProducts();
        res.render('index', { title: 'Productos', data });
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

viewsRouter.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { title: 'Productos en tiempo real' });
});

export default viewsRouter;