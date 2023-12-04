import {Sequelize} from "sequelize";
import Joi from "joi";
import path from "path";
import sharp from "sharp";
import fs from 'fs';
import HttpError from "http-errors";
import Categories from "../models/Categories.js";
import CategoryLanguages from "../models/CategoryLanguages.js";
import SubCategories from "../models/SubCategories.js";
import SubCategoryLanguages from "../models/SubCategoryLanguages.js";
import validate from "../validations/validate.js";

const {BASE_URL} = process.env;

class CategoriesController {
    static getCategory = async (id) => {
        return await Categories.findByPk(id, {
            include: [
                {
                    model: CategoryLanguages,
                    required: true,
                    as: 'lang',
                }
            ],
            logging: true,
        })
    };

    /** for users*/
    static categoriesList = async (req, res, next) => {
        try {
            const {lang} = req;
            let {page = 1, limit} = req.query;
            limit = +limit || 20;
            page = +page || 1;

            const data = await Categories.findAll({
                include: [
                    {
                        model: CategoryLanguages,
                        required: true,
                        as: 'lang',
                        attributes: [],
                        where: {language: lang},
                        raw: true,
                        nest: true,
                        subQuery: false,
                        distinct: true,
                        duplicating: false,
                    },
                    {
                        model: SubCategories,
                        as: 'sub_categories',
                        separate: true,
                        attributes: ['id', 'image', 'category_id', [Sequelize.col('lang.name'), 'name']],
                        include: [
                            {
                                model: SubCategoryLanguages,
                                required: true,
                                as: 'lang',
                                attributes: [],
                                where: {language: lang},
                                raw: true,
                                nest: true,
                                subQuery: false,
                                distinct: true,
                                duplicating: false,
                            },
                        ],
                    },
                ],
                attributes: ['id', 'image', [Sequelize.col('lang.name'), 'name']],
                limit: limit,
                offset: (page - 1) * limit,
                logging: true,
            });

            const total_count = await Categories.count();

            res.json({
                status: 'ok',
                data,
                total_count,
            })
        } catch (e) {
            next(e)
        }
    };

    static subCategoriesList = async (req, res, next) => {
        try {
            const {lang} = req;
            let {page = 1, limit} = req.query;
            limit = +limit || 20;
            page = +page || 1;

            const data = await SubCategories.findAll({
                include: [
                    {
                        model: SubCategoryLanguages,
                        required: true,
                        as: 'lang',
                        attributes: [],
                        where: {language: lang},
                        raw: true,
                        nest: true,
                        subQuery: false,
                        distinct: true,
                        duplicating: false,
                    },
                ],
                attributes: ['id', 'image', [Sequelize.col('lang.name'), 'name']],
                limit: limit,
                offset: (page - 1) * limit,
                logging: true,
            });

            const total_count = await SubCategories.count();

            res.json({
                status: 'ok',
                data,
                total_count,
            })
        } catch (e) {
            next(e)
        }
    };


    /** for admins*/
    static adminCategoriesList = async (req, res, next) => {
        try {
            let {page = 1, limit} = req.query;
            limit = +limit || 20;
            page = +page || 1;

            const data = await Categories.findAll({
                include: [
                    {
                        model: CategoryLanguages,
                        required: true,
                        as: 'lang',
                    }
                ],
                limit: limit,
                offset: (page - 1) * limit,
                logging: true,
            });

            const total_count = await Categories.count();

            res.json({
                status: 'ok',
                data,
                total_count,
            })
        } catch (e) {
            next(e)
        }
    };

    static adminSubCategoriesList = async (req, res, next) => {
        try {
            let {page = 1, limit} = req.query;
            limit = +limit || 20;
            page = +page || 1;

            const data = await SubCategories.findAll({
                include: [
                    {
                        model: SubCategoryLanguages,
                        required: true,
                        as: 'lang',
                    },
                ],
                limit: limit,
                offset: (page - 1) * limit,
                logging: true,
            });

            const total_count = await SubCategories.count();

            res.json({
                status: 'ok',
                data,
                total_count,
            })
        } catch (e) {
            next(e)
        }
    };

    static getCategoryById = async (req, res, next) => {
        try {
            const data = await this.getCategory(req.params.id);

            res.json({
                status: 'ok',
                data,
            })
        } catch (e) {
            next(e)
        }
    };

    static getSubCategoryById = async (req, res, next) => {
        try {
            const data = await SubCategories.findByPk(req.params.id, {
                include: [
                    {
                        model: SubCategoryLanguages,
                        required: true,
                        as: 'lang',
                    },
                ],
                logging: true,
            });

            res.json({
                status: 'ok',
                data,
            })
        } catch (e) {
            next(e)
        }
    };

    static createCategory = async (req, res, next) => {
        try {
            const {file: image} = req;
            const {en_lang, hy_lang, ru_lang} = req.body;

            const schema = Joi.object({
                en_lang: Joi.string().required(),
                hy_lang: Joi.string().required(),
                ru_lang: Joi.string().required(),
                image: Joi.object().required(),
            });
            await validate({schema, values: {en_lang, hy_lang, ru_lang, image}});
            let categoryImage;
            if (image) {
                categoryImage = path.join('/uploads/images', image.filename).replace(/\\/g, '/');
                await Promise.all([
                    sharp(image.path)
                        .resize(256)
                        .jpeg({
                            quality: 85,
                            mozjpeg: true,
                        })
                        .toFile(path.resolve(path.join('./public', categoryImage)))
                ]);
            }
            const category = await Categories.create({image: categoryImage});
            await CategoryLanguages.bulkCreate([
                {name: en_lang, language: 'en', category_id: category.id},
                {name: hy_lang, language: 'hy', category_id: category.id},
                {name: ru_lang, language: 'ru', category_id: category.id},
            ]);

            res.json({
                status: 'ok',
            })
        } catch (e) {
            next(e)
        }
    };

    static updateCategory = async (req, res, next) => {
        try {
            const {file: image} = req;
            const {en_lang, hy_lang, ru_lang} = req.body;
            const category = await this.getCategory(req.params.id);

            if (!category) {
                throw HttpError(404, 'Category not found');
            }

            if (en_lang) {
                const langId = category.lang.find(e => e.language === 'en').id;
                await CategoryLanguages.update({name: en_lang}, {
                    where: {
                        id: langId,
                    }
                });
            }
            if (hy_lang) {
                const langId = category.lang.find(e => e.language === 'hy').id;
                await CategoryLanguages.update({name: hy_lang}, {
                    where: {
                        id: langId,
                    }
                });
            }
            if (ru_lang) {
                const langId = category.lang.find(e => e.language === 'ru').id;
                await CategoryLanguages.update({name: ru_lang}, {
                    where: {
                        id: langId,
                    }
                });
            }

            let categoryImage;
            if (image) {
                categoryImage = path.join('/uploads/images', image.filename).replace(/\\/g, '/');
                await Promise.all([
                    sharp(image.path)
                        .resize(256)
                        .jpeg({
                            quality: 85,
                            mozjpeg: true,
                        })
                        .toFile(path.resolve(path.join('./public', categoryImage)))
                ]);
                if (category.image) {
                    const oldImage = path.resolve(path.join('./public', category.image.replace(BASE_URL, '')));
                    await fs.unlink(oldImage, (err) => {
                        if (err) throw err;
                        console.log('successfully');
                    });
                }
            }

            await Categories.update({image: categoryImage}, {
                where: {
                    id: req.params.id,
                }
            });

            res.json({
                status: 'ok',
            })
        } catch (e) {
            next(e)
        }
    };
}

export default CategoriesController;
