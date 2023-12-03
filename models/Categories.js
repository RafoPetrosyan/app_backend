import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";

const {BASE_URL} = process.env;

class Categories extends Model {}

Categories.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
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
    tableName: 'categories',
    modelName: 'categories',
});

export default Categories;