import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/connect.js';

class Employees extends Model {}

Employees.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [0, 30],
                notEmpty: true 
            }
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [0, 30],
                notEmpty: true 
            }
        },
        department_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'department',
                key: 'id',
            },
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'role',
                key: 'id',
            },
        },
        manager_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'employees',
                key: 'id',
            },
        },
    },
    {
        sequelize, 
        modelName: 'employees',
        freezeTableName: true,
        underscored: true,
        timestamps: true,
    }
);

export { Employees };