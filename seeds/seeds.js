import { Department, Employees, Role } from '../models/index.js';
import departmentSeeds from './departmentSeeds.json' assert { type: 'json' };
import roleSeeds from './roleSeeds.json' assert { type: 'json' };
import employeeSeeds from './employeeSeeds.json' assert { type: 'json' };

async function seedDatabase () {
  try {
    await Department.bulkCreate(departmentSeeds);
    console.log('Departments seeded successfully!');
  
    await Role.bulkCreate(roleSeeds);
    console.log('Roles seeded successfully!');
  
    await Employees.bulkCreate(employeeSeeds);
    console.log('Employees seeded successfully!');
  } catch (error) {
    console.error('Failed to seed:', error);
  }
};

export default seedDatabase;