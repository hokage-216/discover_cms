
import { sequelize } from '../config/connect.js';

import { Department } from '../models/Department.js';
import { Employees } from '../models/Employees.js';
import { Role } from '../models/Role.js';



import departmentSeeds from './departmentSeeds.json' assert { type: 'json' };
import roleSeeds from './roleSeeds.json' assert { type: 'json' };
import employeeSeeds from './employeeSeeds.json' assert { type: 'json' };

async function seedDatabase () {
  await sequelize.sync({ force: true });
  try {
    await Department.bulkCreate(departmentSeeds, { validate: true });
    console.log('Departments seeded successfully!');
  
    await Role.bulkCreate(roleSeeds, { validate: true });
    console.log('Roles seeded successfully!');
  
    await Employees.bulkCreate(employeeSeeds, { validate: true });
    console.log('Employees seeded successfully!');
  } catch (error) {
    console.error('Failed to seed:', error);
  }
};

export { seedDatabase };