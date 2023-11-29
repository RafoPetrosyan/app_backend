import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";
import {languages} from "../constants/index.js";
import Categories from "./Categories.js";

class CategoryLanguages extends Model {}

CategoryLanguages.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    category_id: {
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