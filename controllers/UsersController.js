import jwt from 'jsonwebtoken';
import {Op} from "sequelize";
import HttpError from "http-errors";
import Joi from 'joi';
import path from 'path';
import ejs from 'ejs';
import Users from "../models/Users.js";
import validate from "../validations/validate.js";
import {translate} from "../helpers/index.js";
import {sendMail} from "../services/nodemailer.js";

const {JWT_SECRET} = process.env;

class UsersController {
    static signIn = async (req, res, next) => {
        try {
            const {email, password} = req.body;

            const content = 'You recently requested to reset your password for your Timeless account.';
            const confirmMessage = 'Your new password is - ';
            const htmlDirection = path.resolve(path.join('./templates', 'forgot-template.ejs'));
            const html = await ejs.renderFile(htmlDirection, {name: 'Poxos', password, content, confirmMessage});
            const subject = 'Resetting your password for Timeless'

            const {messageId} = await sendMail({email, subject, html});

            const schema = Joi.object({
                email : Joi.string().required().email().label(translate('email', req.lang)),
                password : Joi.string().required().label(translate('password', req.lang)),
            });

            await validate({schema, values: {email, password}, lang: req.lang});

            const user = await Users.findOne({
                where: {
                    email,
                    password: Users.hashPassword(password),
                },
            });


            if (!user) {
                throw HttpError(401, translate('invalidEmailOrPassword', req.lang));
            }

            const token = jwt.sign({userId: user.id}, JWT_SECRET, {
                expiresIn: '1h'
            });

            res.json({
                status: 'ok',
                token,
                user,
            })

        } catch (e) {
            next(e)
        }
    }

    static signUp = async (req, res, next) => {
        try {
            const {email, password} = req.body;

            const schema = Joi.object({
                email : Joi.string().required().email().label(translate('email', req.lang)),
                password : Joi.string().min(6).max(10).required().label(translate('password', req.lang)),
            });

            await validate({schema, values: {email, password}, lang: req.lang});

            if (await Users.findOne({where: {email}})) {
                throw HttpError(422, {
                    errors: {
                        email: translate('emailAlreadyExits', req.lang),
                    }
                });
            }

            const user = await Users.create({email, password});
            const token = jwt.sign({userId: user.id}, JWT_SECRET);

            res.json({
                status: 'ok',
                user,
                token,
            })

        } catch (e) {
            next(e)
        }
    }

    static usersList = async (req, res, next) => {
        try {
            let {page = 1, search, limit} = req.query;
            limit = +limit || 20;
            page = +page || 1;

            const where = {};
            if (search) {
                where[Op.or] = [
                    {first_name: {[Op.like]: `%${search}%`}},
                    {last_name: {[Op.like]: `%${search}%`}},
                    {email: {[Op.like]: `%${search}%`}},
                ]
            }

            const users = await Users.findAll({
                where,
                limit: limit,
                offset: (page - 1) * limit,
                logging: true,
            });

            res.json({
                status: 'ok',
                users,
            })
        } catch (e) {
            next(e)
        }
    };

    static updateProfile = async (req, res, next) => {
        try {
            const {userId} = req;
            const user = Users.findByPk(userId);

            if (!user) {
                throw HttpError(404, 'User not found');
            }

            const {firstName, lastName, cityId} = req.body;

            await Users.update({
                firstName, lastName, cityId,
            }, {
                where: {
                    id: userId,
                }
            });
            const data = await Users.findByPk(userId);

            res.json({
                status: 'ok',
                data,
            });
        } catch (e) {
            next(e);
        }
    };
}

export default UsersController;
