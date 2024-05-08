import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUIExpress from 'swagger-ui-express';
import cors from 'cors';
import connectMemoryStore from 'memorystore';

import { app, server } from './utils/server.js';
import initializePassport from './config/passport.config.js';
import environment from './config/environment.config.js';
import { logger, loggerMiddleware } from './middleware/logger.middleware.js';

//Routers
import viewsRouter from './routes/views.router.js';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import sessionsRouter from './routes/sessions.router.js';
import userRouter from './routes/users.router.js';
import messagesRouter from './routes/messages.router.js';
import emailsRouter from './routes/mail.router.js';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(loggerMiddleware);
app.use(cors());

//Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación API Proyecto BackEnd",
            description: "Documentación para uso de swagger"
        }
    },
    apis: [`./src/docs/**/*.yaml`]
}
const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs))

//Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', 'views/');
app.set('view engine', 'handlebars');

//Session


const MemoryStore = connectMemoryStore(session);
app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
        checkPeriod: 86400000
    }),
    secret: 'B2zdY3B$pHmxW%',
    resave: true,
    saveUninitialized: true
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser(environment.KEY))

// Routes
app.use('/', viewsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', userRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/emails', emailsRouter);
app.get("/loggerTest", (req, res) => {
    try {
        req.logger.debug('debug msg')
        req.logger.http('http msg')
        req.logger.info('debug msg')
        req.logger.warning('warning msg')
        req.logger.error('error msg')
        req.logger.fatal('fatal msg')
        res.send('loggerTest')
    } catch (err) {
        req.logger.error('error msg')
        req.logger.fatal('fatal msg')
        res.status(500).send('err')
    }
});
app.get('*', (req, res) => {
    res.status(404).render('error', {
        title: 'Error'
    });
});

const PORT = environment.PORT;
server.listen(PORT, () => logger.debug(`Escuchando el puerto ${PORT}`));
mongoose.connect(environment.DB_LINK)
    .then(() => {
        logger.debug('DB connected');
    }).catch((error) => {
        logger.debug('Ocurrió un error', error);
    });

