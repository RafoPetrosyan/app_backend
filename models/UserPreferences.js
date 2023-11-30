import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";
import Users from "./Users.js";
import SubCategories from "./SubCategories.js";

class UserPreferences extends Model {}

UserPreferences.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    sub_category_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    }
}, {
    timestamps: false,
    sequelize,
    tableName: 'user_preferences',
    modelName: 'user_preferences',
});

Users.hasMany(UserPreferences, {
    foreignKey: 'user_id',
    as: 'preferences',
})

SubCategories.hasMany(UserPreferences, {
    foreignKey: 'sub_category_id',
    as: 'preferences',
})

export default UserPreferences;