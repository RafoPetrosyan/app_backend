import {DataTypes, Model} from "sequelize";
import md5 from "md5";
import sequelize from "../services/sequelize.js";
import {signInProviders} from "../constants/index.js";

const {PASSWORD_SECRET, BASE_URL} = process.env;

class Users extends Model {
    static hashPassword = (password) => md5(md5(password) + PASSWORD_SECRET);
}

Users.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    first_name: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    last_name: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.CHAR(32),
        allowNull: false,
        set(password) {
            if (password) {
                this.setDataValue('password', Users.hashPassword(password));
            }
        },
        get() {
            return undefined;
        }
    },
    phone_number: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    avatar: {
        type: DataTypes.STRING,
        defaultValue: "",
        get() {
            const value = this.getDataValue('avatar');
            return value ? `${BASE_URL}${value}` : '';
        }
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    provider: {
        type: DataTypes.ENUM(...signInProviders),
        get() {
            return undefined;
        }
    },
    verification_code: {
        type: DataTypes.CHAR(6),
        get() {
            return undefined;
        }
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
    }
}, {
    timestamps: true,
    sequelize,
    tableName: 'users',
    modelName: 'users',
});

export default Users;