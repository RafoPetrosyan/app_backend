import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";

class SubCategoryLanguages extends Model {}

SubCategoryLanguages.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    en: {
        type: DataTypes.STRING,
    },
    hy: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: false,
    sequelize,
    tableName: 'sub_category_languages',
    modelName: 'sub_category_languages',
});

export default SubCategoryLanguages;