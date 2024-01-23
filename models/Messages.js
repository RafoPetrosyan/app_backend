import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";
import Conversations from "../models/Conversations.js";

class Messages extends Model {}

Messages.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    conversation_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    sender_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
    sequelize,
    tableName: 'messages',
    modelName: 'messages',
});

Messages.belongsTo(Conversations, {
    foreignKey: 'conversation_id',
    as: 'conversation',
    onDelete: 'CASCADE',
})

Conversations.hasMany(Messages, {
    foreignKey: 'conversation_id',
    as: 'messages',
    onDelete: 'CASCADE',
})

export default Messages;