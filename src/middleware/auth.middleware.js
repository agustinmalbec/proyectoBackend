export function auth(req, res, next) {
    if (req.session.user.admin) {
        next();
    } else {
        res.status(403).send('Usuario no autorizado');
    }
}