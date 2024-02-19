const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connect');

class Role extends Model {}

Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
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
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL', 
        },
    },
    {
        sequelize, 
        modelName: 'role',
        freezeTableName: true,
        underscored: true,
        timestamps: true,
    }
);

module.exports = Role;