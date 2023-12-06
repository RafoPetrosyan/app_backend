import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";

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
    start_date: {
        type: DataTypes.DATE,
    },
    end_date: {
        type: DataTypes.DATE,
    }
}, {
    timestamps: false,
    sequelize,
    tableName: 'calendar',
    modelName: 'calendar',
});

export default Calendar;