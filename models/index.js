import { Department } from '../models/Department.js';
import { Employees } from '../models/Employees.js';
import { Role } from '../models/Role.js';

// A Department has many Employees
Department.hasMany(Employees, {
    foreignKey: 'department_id',
});

// An Employee belongs to one Department
Employees.belongsTo(Department, {
    foreignKey: 'department_id',
});

// An Employee has one Manager
Employees.belongsTo(Employees, {
    as: 'Manager',
    foreignKey: 'manager_id',
});

// A Manager has many Directs (Employees)
Employees.hasMany(Employees, {
    as: 'Directs',
    foreignKey: 'manager_id',
});

// A Role has many Employees
Role.hasMany(Employees, {
    foreignKey: 'role_id',
});

// An Employee belongs to one Role
Employees.belongsTo(Role, {
    foreignKey: 'role_id',
});

export { Department, Employees, Role };

