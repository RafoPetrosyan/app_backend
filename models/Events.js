import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";
import Categories from "./Categories.js";
import Users from "./Users.js";

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
    speaker_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    category_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
    },
    details: {
        type: DataTypes.STRING,
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

Events.belongsTo(Users, {
    foreignKey: 'user_id',
    as: 'user',
})

Events.belongsTo(Users, {
    foreignKey: 'speaker_id',
    as: 'speaker',
})

Events.hasOne(Categories, {
    foreignKey: 'category_id',
    as: 'category',
})

export default Events;