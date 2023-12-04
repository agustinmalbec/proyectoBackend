import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';

import viewsRouter from './routes/views.router.js';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import productManager from './managers/products.manager.js';



const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine());
app.set('views', 'views/');
app.set('view engine', 'handlebars');

// Routes
app.use('/', viewsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);

const PORT = 8080;
const httpServer = app.listen(PORT, () => console.log(`Escuchando el puerto ${PORT}`));

const io = new Server(httpServer);
io.on('connection', async (socket) => {
    console.log('Nuevo usuario conectado');

    socket.emit('products', await productManager.getProducts());
    socket.on('addProduct', async (data) => {
        const product = data;
        product.status = true;
        product.thumbnails = [];
        await productManager.addProduct(product);
        socket.emit('products', await productManager.getProducts());
    });
    socket.on('deleteProduct', async (data) => {
        await productManager.deleteProduct(Number(data.id));
        socket.emit('products', await productManager.getProducts());
    })
});