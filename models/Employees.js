const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connect');

class Employees extends Model {}

Employees.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
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
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL', 
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'role',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
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

module.exports = Employees;