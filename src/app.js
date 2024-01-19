import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';

import { app, server } from './server.js';
import initializePassport from './config/passport.config.js';

import viewsRouter from './routes/views.router.js';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import sessionsRouter from './routes/sessions.router.js';
import userRouter from './routes/users.router.js';



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine());
app.set('views', 'views/');
app.set('view engine', 'handlebars');

//Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', viewsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', userRouter);

const PORT = 8080;
server.listen(PORT, () => console.log(`Escuchando el puerto ${PORT}`));
mongoose.connect('mongodb+srv://agustinmalbec123:123@ecommerce.hpnzfcb.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        console.log('DB connected');
    }).catch((error) => {
        console.log('Ocurrió un error', error);
    });

