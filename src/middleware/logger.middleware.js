import winston from "winston";
import environment from "../config/environment.config.js"

const myCustomLevels = {
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5,
    },
    colors: {
        debug: 'white',
        http: 'blue',
        info: 'green',
        warning: 'yellow',
        error: 'red',
        fatal: 'red',
    }
};
winston.addColors(myCustomLevels.colors);

const developmentLogger = winston.createLogger({
    levels: myCustomLevels.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.simple(),
                winston.format.printf((info) => {
                    return `${info.level}: ${info.message}`;
                })
            )
        }),
        new winston.transports.File({ filename: 'errors.log', level: 'error', format: winston.format.simple() }),
    ],
});

const productionLogger = winston.createLogger({
    levels: myCustomLevels.levels,
    transports: [
        new winston.transports.File({ filename: 'errors.log', level: 'error', format: winston.format.simple() }),
    ],
});

export const loggerMiddleware = (req, res, next) => {
    req.logger = developmentLogger;

    if (environment.environment === 'prod') {
        req.logger = productionLogger;
    }

    developmentLogger.info(`${req.method} - ${req.url} - [${req.ip}] - ${req.get('user-agent')} - ${new Date().toISOString()}`);
    next();
};