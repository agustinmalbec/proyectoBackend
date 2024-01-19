import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}

const PRIVATE_KEY = 'asd';

export const generateJWToken = (user) => {
    return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '24h' });
}

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ error: 'Usuario no autorizado o token no encontrado' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) return res.status(401).send({ error: 'Token invalido' });
        req.user = credentials.user;
        next();
    });
}