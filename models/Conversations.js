import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";

class Conversations extends Model {}

Conversations.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    type: {
        type: DataTypes.ENUM('group', 'direct'),
        allowNull: false,
    },
}, {
    timestamps: true,
    sequelize,
    tableName: 'conversations',
    modelName: 'conversations',
});

export default Conversations;