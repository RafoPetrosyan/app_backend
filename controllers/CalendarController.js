import {Sequelize} from "sequelize";
import Joi from "joi";
import moment from "moment";
import path from "path";
import sharp from "sharp";
import HttpError from "http-errors";
import Categories from "../models/Categories.js";
import CategoryLanguages from "../models/CategoryLanguages.js";
import SubCategories from "../models/SubCategories.js";
import SubCategoryLanguages from "../models/SubCategoryLanguages.js";
import validate from "../validations/validate.js";
import {deleteImage} from "../helpers/index.js";

class CategoriesController {
    static getCategory = async (id) => {
        return await Categories.findByPk(id, {
            include: [
                {
                    model: CategoryLanguages,
                    required: true,
                    as: 'lang',
                },
                {
                    model: SubCategories,
                    as: 'sub_categories',
                }
            ],
            logging: true,
        })
    };

    static addFreeDay = async (req, res, next) => {
        try {
            const {userId} = req;
            const {day, times} = req.body;

            const schema = Joi.object({
                day: Joi.date().default(() => moment().format('YYYY-MM-DD')).required(),
                times: Joi.array().items(Joi.date().default(() => moment().format('HH:mm')).required()),
            });
            await validate({schema, values: {day, times}});

            // if (!) {
            //
            // }

            // const category = await Categories.findByPk(category_id);
            //
            // if (!category) {
            //     throw HttpError(404, 'Category not found');
            // }
            //
            // let categoryImage;
            // if (image) {
            //     categoryImage = path.join('/uploads/images', image.filename).replace(/\\/g, '/');
            //     await Promise.all([
            //         sharp(image.path)
            //             .resize(256)
            //             .jpeg({
            //                 quality: 85,
            //                 mozjpeg: true,
            //             })
            //             .toFile(path.resolve(path.join('./public', categoryImage)))
            //     ]);
            // }
            // const subCategory = await Categories.create({image: categoryImage, category_id});
            // await SubCategoryLanguages.bulkCreate([
            //     {name: en_lang, language: 'en', sub_category_id: subCategory.id},
            //     {name: hy_lang, language: 'hy', sub_category_id: subCategory.id},
            //     {name: ru_lang, language: 'ru', sub_category_id: subCategory.id},
            // ]);

            res.json({
                status: 'ok',
            })
        } catch (e) {
            next(e)
        }
    };

    static deleteSubCategory = async (req, res, next) => {
        try {
            const {id} = req.params;
            const subCategory = await SubCategories.findByPk(id);

            if (!subCategory) {
                throw HttpError(404, 'Sub category not found');
            }
            await deleteImage(subCategory.image);
            await SubCategories.destroy({where: {id}});

            res.json({
                status: 'ok'
            })
        } catch (e) {
            next(e)
        }
    };
}

export default CategoriesController;
