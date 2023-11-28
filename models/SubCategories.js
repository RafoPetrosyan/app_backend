import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";
import Categories from "./Categories.js";

class SubCategories extends Model {}

SubCategories.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    category_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    }
}, {
    timestamps: false,
    sequelize,
    tableName: 'sub_categories',
    modelName: 'sub_categories',
});

SubCategories.belongsTo(Categories, {
    foreignKey: 'category_id',
    as: 'category'
})

Categories.hasMany(SubCategories, {
    foreignKey: 'category_id',
    as: 'sub_categories',
})

export default SubCategories;