const Department = require('./Department');
const Manager = require('./Manager');
const Employees = require('./Employees');
const Role = require('./Role');

Department.hasMany(Employees, {
    foreignKey: 'department_id',
    onDelete: 'CASCADE'
});

// An Employee belongs to one Department
Employees.belongsTo(Department, {
    foreignKey: 'department_id',
    onDelete: 'CASCADE'
});

// An Employee has one Role
Employees.hasOne(Role, {
    foreignKey: 'role_id',
    onDelete: 'CASCADE'
});

// An Employee has one Manager
Employees.hasOne(Manager, {
    foreignKey: 'manager_id',
    onDelete: 'CASCADE'
});

// A Manager belongs to many Employees
Manager.belongsToMany(Employees, {
    foreignKey: 'manager_id'
})

// A Role belongs to many Employees
Role.belongsToMany(Employees, {
    foreignKey: 'role_id'
});


module.exports = { Department, Employees, Role, Manager };