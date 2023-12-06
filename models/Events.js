import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";
import Categories from "./Categories.js";

class Events extends Model {}

Events.init({
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
    category_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
    },
    details: {
        type: DataTypes.STRING,
    },
    date: {
        type: DataTypes.DATE,
    },
    start_date: {
        type: DataTypes.DATE,
    },
    end_date: {
        type: DataTypes.DATE,
    }
}, {
    timestamps: false,
    sequelize,
    tableName: 'events',
    modelName: 'events',
});

Events.hasOne(Categories, {
    foreignKey: 'category_id',
    as: 'category',
})

export default Events;