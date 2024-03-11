import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import environment from '../config/environment.config.js';
import { faker } from '@faker-js/faker';

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ error: 'Usuario no autorizado o token no encontrado' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, environment.SECRET_KEY, (error, credentials) => {
        if (error) return res.status(401).send({ error: 'Token invalido' });
        req.user = credentials.user;
        next();
    });
}

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        console.log("Entrando a llamar strategy: ");
        console.log(strategy);
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
            }
            console.log("Usuario obtenido del strategy: ");
            console.log(user);
            req.user = user;
            next();
        })(req, res, next);
    }
};

export const authorization = (role) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).send();
        if (req.user.role !== role) return res.status(403).send();
        next();
    }
}

export function generateProduct() {
    const product = {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        category: faker.commerce.department(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: faker.image.url(),
        code: faker.finance.accountNumber(3),
        stock: faker.string.numeric(2),
    }
    return product;
}