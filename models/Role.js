import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/connect.js';

class Role extends Model {}

Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [0, 30],
                notEmpty: true
            }
        },
        salary: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        department_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'department',
                key: 'id',
            },
        },
    },
    {
        sequelize, 
        modelName: 'role',
        freezeTableName: true,
        underscored: true,
        timestamps: false,
    }
);

export {Role};