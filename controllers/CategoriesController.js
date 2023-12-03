import {Sequelize} from "sequelize";
import Categories from "../models/Categories.js";
import CategoryLanguages from "../models/CategoryLanguages.js";
import SubCategories from "../models/SubCategories.js";
import SubCategoryLanguages from "../models/SubCategoryLanguages.js";

class CategoriesController {
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
}

export default CategoriesController;
