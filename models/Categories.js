import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";

class Categories extends Model {}

Categories.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    }
}, {
    timestamps: false,
    sequelize,
    tableName: 'categories',
    modelName: 'categories',
});

export default Categories;