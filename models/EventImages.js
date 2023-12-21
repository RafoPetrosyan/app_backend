import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";
import Events from "./Events.js";

const {BASE_URL} = process.env;

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
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            const value = this.getDataValue('original');
            return value ? `${BASE_URL}${value}` : '';
        }
    },
    thumb: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            const value = this.getDataValue('thumb');
            return value ? `${BASE_URL}${value}` : '';
        }
    },
    is_cover: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    timestamps: false,
    sequelize,
    tableName: 'event_images',
    modelName: 'event_images',
});

Events.hasMany(EventImages, {
    foreignKey: 'event_id',
    as: 'images',
    onDelete: 'CASCADE',
})

export default EventImages;