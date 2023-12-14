import express from 'express';
import handlebars from 'express-handlebars';
import { app, server } from './server.js';
import viewsRouter from './routes/views.router.js';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import mongoose from 'mongoose';

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
server.listen(PORT, () => console.log(`Escuchando el puerto ${PORT}`));
mongoose.connect('mongodb+srv://agustinmalbec123:123@ecommerce.hpnzfcb.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        console.log('DB connected');
    }).catch((error) => {
        console.log('Ocurrio un error', error);
    });

