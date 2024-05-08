export function isAuth(req, res, next) {
    if (req.user) {
        next();
    } else {
        req.logger.error(`Usuario lo logeado`);
        res.status(403).send('Usuario no autorizado').redirect('/login');
    }
}

export function isGuest(req, res, next) {
    if (!req.user) {
        next();
    } else {
        req.logger.error(`Invitado no autorizado`);
        res.status(403).send('Usuario no autorizado').redirect('/');
    }
}

export function isAdmin(req, res, next) {
    if (req.user.role === 'admin') {
        next();
    } else {
        req.logger.error(`Admin no autorizado`);
        res.status(403).send('Usuario no autorizado').redirect('/');
    }
}

export function isUser(req, res, next) {
    if (req.user.role === 'user') {
        next();
    } else {
        req.logger.error(`Usuario no autorizado`);
        res.status(403).send('Usuario no autorizado').redirect('/');
    }
}