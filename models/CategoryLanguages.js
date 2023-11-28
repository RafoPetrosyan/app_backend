import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";

class CategoryLanguages extends Model {}

CategoryLanguages.init({
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
    tableName: 'categories',
    modelName: 'categories',
});

export default CategoryLanguages;