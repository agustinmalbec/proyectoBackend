import passport from "passport";
import passportLocal from "passport-local";
import GitHubStrategy from 'passport-github2';
import userDAO from "../dao/mongoDb/users.manager.js";
import { createHash, isValidPassword } from "../utils.js";

const localStrategy = passportLocal.Strategy;

const initializePassport = () => {
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                const exist = await userDAO.getUserByEmail(email);
                if (exist) {
                    console.log('El usuario ya existe');
                    done(null, false);
                }
                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }
                const result = await userDAO.createUser(user);
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
                const user = await userDAO.getUserByEmail(email);

                if (!user) {
                    console.log('No existe el usuario');
                    return done(null, false);
                }

                if (!isValidPassword(user, password)) {
                    console.log('Credenciales invalidas');
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
            let user = await userDAO.getUserById(id);
            done(null, user);
        } catch (error) {
            console.log('Error al deserializar usuario' + error);
        }
    });

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.121bc709b88c8123',
        clientSecret: 'af503517eae74f4e9c3bb8f155255194e17aa0fd',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
    }, async (accesToken, refreshToken, profile, done) => {
        try {
            let user = await userDAO.getUserByEmail(profile._json.email);
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    email: profile._json.email,
                    password: '',
                };
                user = await userDAO.createUser(newUser);
                done(null, user);
            } else {
                done(null, user);
            };
        } catch (error) {
            done(error, false);
        };

    }));
}

export default initializePassport;