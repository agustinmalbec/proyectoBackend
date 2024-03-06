import { Router } from "express";
import cartController from "../controllers/carts.controller.js";
import productController from "../controllers/products.controller.js";
import { middlewarePassportJWT } from "../middleware/jwt.middleware.js";
import { isAuth } from "../middleware/auth.middleware.js";

const viewsRouter = Router();

viewsRouter.get('/', middlewarePassportJWT, isAuth, async (req, res) => {
    try {
        const user = req.user;
        delete user.password;
        const { limit = 10, page = 1, query, sort = 1 } = req.query;
        const data = await productController.getProducts(limit, page, query, Number(sort));
        data.docs.cart = user.cart._id;
        data.docs = data.docs.filter((e) => e.stock > 0);
        res.render('index', {
            title: 'Productos',
            data: data,
            user
        });
    } catch (error) {
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

viewsRouter.get('/carts/:cid', middlewarePassportJWT, async (req, res) => {
    try {
        const { user } = req.user;
        const cartId = req.params.cid;
        const data = await cartController.getCartById(cartId);
        res.render('carts', { data: data.products, user, cartId });
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