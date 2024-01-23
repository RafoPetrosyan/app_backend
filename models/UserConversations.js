import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";
import Conversations from "../models/Conversations.js";

class UserConversations extends Model {}

UserConversations.init({
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
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
}, {
    timestamps: true,
    sequelize,
    tableName: 'user_conversations',
    modelName: 'user_conversations',
});

UserConversations.belongsTo(Conversations, {
    foreignKey: 'conversation_id',
    as: 'conversation',
    onDelete: 'CASCADE',
})

Conversations.hasMany(UserConversations, {
    foreignKey: 'conversation_id',
    as: 'user_conversations',
    onDelete: 'CASCADE',
})

export default UserConversations;