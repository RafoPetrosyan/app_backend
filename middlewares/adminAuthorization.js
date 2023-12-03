import jwt from 'jsonwebtoken'
import HttpError from "http-errors";
import Users from "../models/Users.js";

const {JWT_SECRET} = process.env;

export default async function adminAuthorization(req, res, next) {
    try {
        if (req.method === 'OPTIONS') {
            next();
            return;
        }

        const authorization = req.headers.authorization || '';
        const data = jwt.verify(authorization.replace('Bearer ', ''), JWT_SECRET);

        if (!data.userId) {
            throw HttpError(401, 'Unauthorized request');
        }

        const user = await Users.findByPk(data.userId);

        if (user.role !== 'admin') {
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
