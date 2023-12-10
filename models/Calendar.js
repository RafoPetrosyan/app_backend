import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";
import Users from "./Users.js";

class Calendar extends Model {}

Calendar.init({
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
    day: {
        type: DataTypes.DATEONLY,
    },
    start_time: {
        type: DataTypes.TIME,
    },
    end_time: {
        type: DataTypes.TIME,
    }
}, {
    timestamps: false,
    sequelize,
    tableName: 'calendar',
    modelName: 'calendar',
});

Users.hasMany(Calendar, {
    foreignKey: 'user_id',
    as: 'calendar',
})

export default Calendar;