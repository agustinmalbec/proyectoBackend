import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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

export const authorization = (...roles) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).send();
        for (const role of roles) {
            if (req.user.role === role) return next();
        }
        return res.status(403).send();
    }
}

export function generateProduct() {
    const product = {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        category: faker.commerce.department(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnails: [faker.image.url()],
        code: faker.finance.accountNumber(3),
        stock: faker.string.numeric(2),
    }
    return product;
}