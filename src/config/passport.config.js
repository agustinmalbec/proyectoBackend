import passport from "passport";
import passportLocal from "passport-local";
import GitHubStrategy from 'passport-github2';
import jwtStrategy from 'passport-jwt';
import userController from "../controllers/users.controller.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import environment from "./environment.config.js";
import cartController from "../controllers/carts.controller.js";
import { ObjectId } from "mongodb";
import { logger } from '../middleware/logger.middleware.js';

const localStrategy = passportLocal.Strategy;
const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

const initializePassport = () => {
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                const exist = await userController.getUserByEmail(email);
                if (exist) {
                    logger.error('El usuario ya existe');
                    done(null, false);
                }
                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    cart: await cartController.addCart(),
                }
                const result = await userController.createUser(user);
                return done(null, result);
            } catch (error) {
                return done('Error de registro' + error);
            }
        }
    ));

    passport.use('login', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { email } = req.body;
            try {
                let user = {};
                if (email === environment.ADMIN_USERNAME) {
                    user.role = 'admin';
                    user.email = environment.ADMIN_USERNAME;
                    user.password = environment.ADMIN_PASSWORD;
                    user._id = new ObjectId('111111111111111111111111');
                    if (user.password !== password) throw new Error('Contraseña incorrecta');
                } else {
                    user = await userController.getUserByEmail(email);
                    user.last_connection = new Date();
                    await userController.updateUser(user._id, user)
                }
                if (!user) {
                    logger.error('No existe el usuario');
                    return done(null, false);
                }

                if (!isValidPassword(user, password) && email !== environment.ADMIN_USERNAME) {
                    logger.error('Credenciales invalidas');
                    return done(null, false);
                }

                return done(null, user);
            } catch (error) {
                return done('Error de login' + error);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userController.getUserById(id);
            done(null, user);
        } catch (error) {
            logger.error('Error al deserializar usuario' + error);
        }
    });

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.121bc709b88c8123',
        clientSecret: environment.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
    }, async (accesToken, refreshToken, profile, done) => {
        try {
            if (!profile._json.email) {
                profile._json.email = profile.profileUrl;
            }
            let user = await userController.getUserByEmail(profile._json.email);
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    email: profile._json.email,
                    password: '',
                    cart: await cartController.addCart(),
                };
                user = await userController.createUser(newUser);
                done(null, user);
            } else {
                done(null, user);
            };
        } catch (error) {
            done(error, false);
        };
    }));

    passport.use('current', new JwtStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: environment.SECRET_KEY
        }, async (jwt_payload, done) => {
            try {
                delete jwt_payload.user.password;
                return done(null, jwt_payload.user)
            } catch (error) {
                return done(error)
            }
        }
    ));
}

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwtCookieToken'];
    }
    return token;
};

export default initializePassport;