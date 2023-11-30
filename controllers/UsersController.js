import jwt from 'jsonwebtoken';
import {Op} from "sequelize";
import HttpError from "http-errors";
import Joi from 'joi';
import Users from "../models/Users.js";
import validate from "../validations/validate.js";
import {emailVerification, generateRandomCode, translate} from "../helpers/index.js";
import SubCategories from "../models/SubCategories.js";
import UserPreferences from "../models/UserPreferences.js";
import {signInProviders} from "constants/index.js";

const {JWT_SECRET} = process.env;

class UsersController {
    static signIn = async (req, res, next) => {
        try {
            const {email, password} = req.body;

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

    static socialLogin = async (req, res, next) => {
        try {
            const {provider, access_token} = req.body;

            if (!provider || !access_token) {
                throw HttpError(422, 'Invalid data');
            }

            if (!signInProviders.includes(provider)) {
                throw HttpError(422, 'Wrong provider');
            }

            // const user = await Users.findOne({
            //     where: {
            //         email,
            //         password: Users.hashPassword(password),
            //     },
            // });


            // if (!user) {
            //     throw HttpError(401, translate('invalidEmailOrPassword', req.lang));
            // }

            // const token = jwt.sign({userId: user.id}, JWT_SECRET, {
            //     expiresIn: '1h'
            // });

            res.json({
                status: 'ok',
                // token,
                // user,
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

            const verificationCode = generateRandomCode();
            await emailVerification(email, verificationCode)

            const token = jwt.sign({userId: user.id}, JWT_SECRET);
            const verify_token = jwt.sign({userId: user.id, verificationCode}, JWT_SECRET, {expiresIn: '1m'});

            res.json({
                status: 'ok',
                user,
                token,
                verify_token,
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

    static signUpUserInfo = async (req, res, next) => {
        try {
            const {userId} = req;
            const user = Users.findByPk(userId);

            if (!user) {
                throw HttpError(404, 'User not found');
            }

            const {first_name, last_name, phone_number} = req.body;

            const schema = Joi.object({
                first_name : Joi.string().required().label(''),
                last_name : Joi.string().required().label(''),
                phone_number : Joi.string().required().label(''),
            });

            await validate({schema, values: {first_name, last_name, phone_number}, lang: req.lang});

            await Users.update({
                first_name, last_name, phone_number
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

    static addPreferences = async (req, res, next) => {
        try {
            const {userId} = req;
            const {preferences} = req.body;
            const user = await Users.findByPk(userId);

            if (!user) {
                throw HttpError(404, 'User not found');
            }

            if (!preferences) {
                throw HttpError(422, 'Invalid data');
            }

            const splitData = preferences.split(',');
            const checkData = splitData.every(value => !isNaN(Number(value.trim())));

            if (!checkData) {
                throw HttpError(422, 'Invalid data');
            }

            const arrayOfIntegers = splitData.map(Number);

            const data = await SubCategories.findAll({
                where: {
                    id: {
                        [Op.or]: arrayOfIntegers,
                    }
                }
            });

            if (data.length !== splitData.length) {
                throw HttpError(422, 'Invalid data');
            }

            const insertData = arrayOfIntegers.reduce((acc, item) => {
                acc.push({user_id: userId, sub_category_id: item})
                return acc;
            }, [])

            await UserPreferences.bulkCreate(insertData);

            res.json({
                status: 'ok',
                data,
            });
        } catch (e) {
            next(e);
        }
    };

    static confirmVerification = async (req, res, next) => {
        try {
            const {userId} = req;
            const {code, verify_token = ''} = req.body;

            if (!code || !verify_token) {
                throw HttpError(422, 'Invalid data');
            }

            let tokenData;
            try {
                tokenData = jwt.verify(verify_token, JWT_SECRET);
            } catch(err) {
                throw HttpError(403, 'Verify token expired');
            }

            if (userId !== tokenData.userId) {
                throw HttpError(401, 'Unauthorized request');
            }
            if (code !== tokenData.verificationCode) {
                throw HttpError(422, translate('wrongCode', req.lang));
            }

            await Users.update({verified: true}, {
                where: {
                    id: userId,
                }
            });
            const user = await Users.findByPk(userId);

            res.json({
                status: 'ok',
                user,
            });
        } catch (e) {
            next(e);
        }
    };

    static resendVerification = async (req, res, next) => {
        try {
            const {userId} = req;
            const user = await Users.findByPk(userId);

            if (user.verified) {
                throw HttpError(422, 'User already verified');
            }

            const verificationCode = generateRandomCode();
            await emailVerification(user.email, verificationCode);

            const verify_token = jwt.sign({userId: user.id, verificationCode}, JWT_SECRET, {expiresIn: '1m'});

            res.json({
                status: 'ok',
                verify_token,
            });
        } catch (e) {
            next(e);
        }
    };
}

export default UsersController;
