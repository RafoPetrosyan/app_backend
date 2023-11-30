import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";
import {languages} from "../constants/index.js";
import Categories from "./Categories.js";

class CategoryLanguages extends Model {}

CategoryLanguages.init({
    category_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.BIGINT,
    },
    name: {
        type: DataTypes.STRING,
    },
    language: {
        type: DataTypes.ENUM(...languages),
    }
}, {
    timestamps: false,
    sequelize,
    tableName: 'category_languages',
    modelName: 'category_languages',
});

Categories.hasOne(CategoryLanguages, {
    foreignKey: 'category_id',
    as: 'lang',
})

export default CategoryLanguages;