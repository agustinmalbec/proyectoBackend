import jwt from 'jsonwebtoken';
import passport from 'passport';
import environment from '../config/environment.config.js';

const privatekey = environment.SECRET_KEY;

const generateToken = (user) => {
    return jwt.sign({ user }, privatekey, { expiresIn: '1h' });
};

const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).send({ message: 'Token not found' });
    }

    jwt.verify(authHeader, privatekey, (err, credentials) => {
        if (err) {
            res.status(401).send({ message: 'Token not valid' });
        }
        req.user = credentials;
        next();
    });
};

const middlewarePassportJWT = async (req, res, next) => {
    passport.authenticate('current', { session: false }, (err, usr, info) => {
        if (err) {
            next(err);
        }

        if (!usr) {
            res.redirect('/login');
        } else {
            req.user = usr;
            next();
        }

    })(req, res, next);
};

export { generateToken, authToken, middlewarePassportJWT };