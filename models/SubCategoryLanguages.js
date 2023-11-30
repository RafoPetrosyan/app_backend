import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";
import {languages} from "../constants/index.js";
import SubCategories from "./SubCategories.js";

class SubCategoryLanguages extends Model {
}

SubCategoryLanguages.init({
    sub_category_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
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

SubCategories.hasOne(SubCategoryLanguages, {
    foreignKey: 'sub_category_id',
    as: 'lang',
})

export default SubCategoryLanguages;