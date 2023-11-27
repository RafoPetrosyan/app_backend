import jwt from 'jsonwebtoken'
import HttpError from "http-errors";

const {JWT_SECRET} = process.env;

const EXCLUDE = [
    'POST:/api/users/sign-in',
    'POST:/api/users/sign-up',
]

export default function authorization(req, res, next) {
    try {
        if (req.method === 'OPTIONS') {
            next();
            return;
        }

        if (EXCLUDE.includes(req.method + ':' + req.path)) {
            next();
            return;
        }
        const authorization = req.headers.authorization || '';
        const data = jwt.verify(authorization.replace('Bearer ', ''), JWT_SECRET);

        if (!data.userId) {
            throw HttpError(401, 'Unauthorized request');
        }
        req.userId = data.userId;
        next();
    } catch (e) {
        e.status = 401;
        e.message = 'Unauthorized request'
        next(e)
    }
}
