export function auth(req, res, next) {
    if (req.session.user.admin) {
        next();
    } else {
        res.status(403).send('Usuario no autorizado');
    }
}
export function isAuth(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.status(403).send('Usuario no autorizado').redirect('/login');
    }
}

export function isGuest(req, res, next) {
    if (!req.user) {
        next();
    } else {
        res.status(403).send('Usuario no autorizado').redirect('/');
    }
}

export function isAdmin(req, res, next) {
    if (req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Usuario no autorizado').redirect('/');
    }
}

export function isUser(req, res, next) {
    console.log(req.user.role);
    if (req.user.role === 'user') {
        next();
    } else {
        res.status(403).send('Usuario no autorizado').redirect('/');
    }
}