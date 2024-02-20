import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/connect.js';

class Department extends Sequelize.Model {}

Department.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [0, 30],
                notEmpty: true,
            },
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'department',
    }
);

export { Department };