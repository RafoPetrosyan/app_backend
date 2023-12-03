import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";
import {languages} from "../constants/index.js";
import SubCategories from "./SubCategories.js";

class SubCategoryLanguages extends Model {
}

SubCategoryLanguages.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    sub_category_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
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
    tableName: 'sub_category_languages',
    modelName: 'sub_category_languages',
});

SubCategories.hasMany(SubCategoryLanguages, {
    foreignKey: 'sub_category_id',
    as: 'lang',
})

export default SubCategoryLanguages;