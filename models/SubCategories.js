import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";
import Categories from "./Categories.js";

const {BASE_URL} = process.env;

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
    },
    image: {
        type: DataTypes.STRING,
        defaultValue: "",
        get() {
            const value = this.getDataValue('image');
            return value ? `${BASE_URL}${value}` : '';
        }
    },
}, {
    timestamps: false,
    sequelize,
    tableName: 'sub_categories',
    modelName: 'sub_categories',
});

SubCategories.belongsTo(Categories, {
    foreignKey: 'category_id',
    as: 'category',
    onDelete: 'CASCADE',
})

Categories.hasMany(SubCategories, {
    foreignKey: 'category_id',
    as: 'sub_categories',
    onDelete: 'CASCADE',
})

export default SubCategories;