import { Router } from "express";
import productDAO from "../dao/mongoDb/products.manager.js";
import cartDAO from "../dao/mongoDb/carts.manager.js";
import userDAO from "../dao/mongoDb/users.manager.js";
import { passportCall } from "../utils.js";
import passport from "passport";

const viewsRouter = Router();

viewsRouter.get('/', passport.authenticate('current', { session: false }), async (req, res) => {
    try {
        const user = req.user;
        const { limit = 10, page = 1, query, sort = 1 } = req.query;
        const data = await productDAO.getProducts(limit, page, query, Number(sort));
        res.render('index', { title: 'Productos', data: data, user });
    } catch (error) {
        console.log(`Ha ocurrido un error: ${error}`);
        res.status(500).send(error);
    }
});

viewsRouter.get('/realtimeproducts', (req, res) => {
    try {
        res.render('realTimeProducts', { title: 'Productos en tiempo real' });
    } catch (error) {
        res.status(500).send(error);
    }
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

viewsRouter.get('/register', async (req, res) => {
    try {
        res.render('register', { title: 'Inicia sesión' });
    } catch (error) {
        res.status(500).send(error);
    }
});

viewsRouter.get('/login', (req, res) => {
    try {
        res.render('login', { title: 'Registra tu usuario' });
    } catch (error) {
        res.status(500).send(error);
    }
});

export default viewsRouter;