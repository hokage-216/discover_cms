const sequelize = require('../config/connect');
const { Department, Employees, Role , Manager } = require('../models');

const departmentSeeds = require('./departmentSeeds.json');
const roleSeeds = require('./roleSeeds.json');
const managerSeeds = require('./managerSeeds.json');
const employeeSeeds = require('./employeeSeeds.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await Department.bulkCreate(departmentSeeds);
  await Role.bulkCreate(roleSeeds);
  await Manager.bulkCreate(managerSeeds);
  await Employees.bulkCreate(employeeSeeds);

  process.exit(0);
};

seedDatabase();