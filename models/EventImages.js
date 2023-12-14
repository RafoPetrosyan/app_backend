import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";
import Events from "./Events.js";

class EventImages extends Model {}

EventImages.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    event_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    original: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    thumb: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_cover: {
        type: DataTypes.BOOLEAN,
    }
}, {
    timestamps: false,
    sequelize,
    tableName: 'event_mages',
    modelName: 'event_mages',
});

Events.hasMany(EventImages, {
    foreignKey: 'event_id',
    as: 'images',
    onDelete: 'CASCADE',
})

export default EventImages;