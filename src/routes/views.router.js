import { Router } from "express";
import cartController from "../controllers/carts.controller.js";
import productController from "../controllers/products.controller.js";
import { middlewarePassportJWT } from "../middleware/jwt.middleware.js";
import { isAuth } from "../middleware/auth.middleware.js";
import { authorization } from '../utils/utils.js'
import userController from "../controllers/users.controller.js";
import { alertData } from "./users.router.js";

const viewsRouter = Router();

viewsRouter.get('/', middlewarePassportJWT, isAuth, async (req, res) => {
    try {
        let user = req.user;
        const { limit = 10, page = 1, query, sort = 1 } = req.query;
        const data = await productController.getProducts(limit, page, query, Number(sort));
        let isAdmin = true;
        if (user.role !== 'admin' && user.role !== 'premium') {
            isAdmin = null;
            data.docs.cart = user.cart._id;
        }
        data.docs = data.docs.filter((e) => e.stock > 0);
        res.render('index', {
            title: 'Productos',
            data: data,
            user,
            isAdmin
        });
    } catch (error) {
        req.logger.error(`No se cargo la vista index`);
        res.status(500).send(error);
    }
});

viewsRouter.get('/realtimeproducts', (req, res) => {
    try {
        res.render('realTimeProducts', { title: 'Productos en tiempo real' });
    } catch (error) {
        req.logger.error(`No se cargo la vista realtimeproducts`);
        res.status(500).send(error);
    }
});

viewsRouter.get('/chat', async (req, res) => {
    try {
        res.render('chat', {});
    } catch (error) {
        req.logger.error(`No se cargo la vista de chat`);
        res.status(500).send(error);
    }
});

viewsRouter.get('/products', async (req, res) => {
    try {
        res.render('products', {});
    } catch (error) {
        req.logger.error(`No se cargo la vista products`);
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
        req.logger.error(`No se cargo la vista del carrito`);
        res.status(500).send(error);
    }
});

viewsRouter.get('/register', async (req, res) => {
    try {
        res.render('register', { title: 'Inicia sesión' });
    } catch (error) {
        req.logger.error(`No se cargo la vista de registro`);
        res.status(500).send(error);
    }
});

viewsRouter.get('/login', (req, res) => {
    try {
        res.render('login', { title: 'Registra tu usuario' });
    } catch (error) {
        req.logger.error(`No se cargo la vista de login`);
        res.status(500).send(error);
    }
});

viewsRouter.get('/forgotPassword', (req, res) => {
    try {
        res.render('forgotPassword', {
            title: 'Olvido contraseña'
        });
    } catch (error) {
        req.logger.error(`No se cargo la vista de forgotPassword`);
        res.status(500).send(error);
    }
});

viewsRouter.get('/user', middlewarePassportJWT, async (req, res) => {
    try {
        const user = req.user;
        res.render('user', {
            title: `${user.first_name} ${user.last_name}`,
            user,
            alertData
        });
    } catch (error) {
        req.logger.error(`No se cargo la vista de forgotPassword`);
        res.status(500).send(error);
    }
});

viewsRouter.get('/allUsers', middlewarePassportJWT, authorization('admin'), async (req, res) => {
    try {
        const users = await userController.getUsers();
        res.render('allUsers', {
            title: '',
            users: users
        });
    } catch (error) {
        req.logger.error(`No se cargo la vista de forgotPassword`);
        res.status(500).send(error);
    }
});

export default viewsRouter;