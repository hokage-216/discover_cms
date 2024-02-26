import inquirer from 'inquirer';
import mysql from 'mysql2/promise';
import 'dotenv/config';
import seedDatabase from './seeds/seeds.js';
import syncTables from './config/sync.js';

const logo = "\n\n\n>>=====================================================<<\r\n||                                                     ||\r\n||                                                     ||\r\n||                                                     ||\r\n||    _____                 _                          ||\r\n||   | ____|_ __ ___  _ __ | | ___  _   _  ___  ___    ||\r\n||   |  _| | \'_ ` _ \\| \'_ \\| |\/ _ \\| | | |\/ _ \\\/ _ \\   ||\r\n||   | |___| | | | | | |_) | | (_) | |_| |  __\/  __\/   ||\r\n||   |_____|_| |_| |_| .__\/|_|\\___\/ \\__, |\\___|\\___|   ||\r\n||   |  \\\/  | __ _ _ |_|  __ _  __ _|___\/ _ __  | |    ||\r\n||   | |\\\/| |\/ _` | \'_ \\ \/ _` |\/ _` |\/ _ \\ \'__| | |    ||\r\n||   | |  | | (_| | | | | (_| | (_| |  __\/ |    |_|    ||\r\n||   |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|    (_)    ||\r\n||                             |___\/                   ||\r\n||                                                     ||\r\n||                                                     ||\r\n||                                                     ||\r\n>>=====================================================<<\n\n"

const connection = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASS,
    database: process.env.MYSQLDB,
  });

  async function viewAllDepartments() {
    const [rows] = await connection.query('SELECT * FROM department');
    console.log("\n\nList of all departments:\n");
    console.table(rows);
    console.log('\n\n')
  }

async function viewAllRoles() {
    const [rows] = await connection.query('SELECT * FROM role');
    console.log("\n\nList of all roles:\n");
    console.table(rows);
    console.log('\n\n')
  }

async function viewAllEmployees() {
    const [rows] = await connection.query('SELECT * FROM employees');
    console.log("\n\nList of all emploees:\n");
    console.table(rows);
    console.log('\n\n')
  }

  async function viewEmployeesByManagers() {
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'managerId',
      message: "Please enter the manager's ID:",
      validate: input => {
        if (!input || isNaN(input)) {
          return 'Please enter a valid numeric ID.';
        }
        return true;
      }
    }
  ]);

  const managerId = answers.managerId;

  const [rows] = await connection.query(`
    SELECT e.id, e.first_name, e.last_name, m.first_name AS manager_first_name, m.last_name AS manager_last_name 
    FROM employees e
    LEFT JOIN employees m ON e.manager_id = m.id
    WHERE e.manager_id = ?
  `, [managerId]);

  if (rows.length > 0) {
    console.log(`\n\nList of employees managed by ID ${managerId}: \n\n`);
    console.table(rows);
  } else {
    console.log(`\n\nNo employees found for manager ID ${managerId}.\n\n`);
  }
}

  async function removeEmployee() {
    const { employeeId } = await inquirer.prompt([
      { name: 'employeeId', message: "Enter the employee's ID to remove:" }
    ]);
    await connection.query('DELETE FROM employees WHERE id = ?', [employeeId]);
    console.log('\n\nEmployee removed successfully.\n\n');
  }

  async function addRoleType() {
    try {
      const [departments] = await connection.query('SELECT id, name FROM department');
      const departmentChoices = departments.map(dept => ({
        name: dept.name,
        value: dept.id
      }));
  
      const role = await inquirer.prompt([
        { name: 'title', message: "Role title:" },
        { name: 'salary', message: "Role salary:", validate: input => !isNaN(parseFloat(input)) && isFinite(input) ? true : "Please enter a valid salary." },
        { type: 'list', name: 'departmentId', message: "Which department does the role belong to?", choices: departmentChoices }
      ]);
  
      await connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [role.title, role.salary, role.departmentId]);
      console.log('Role added successfully.');
    } catch (error) {
      console.error('Failed to add role:', error.message);
    }
  }

  async function addDepartmentType() {
    try {
      const { departmentName } = await inquirer.prompt([
        {
          name: 'departmentName',
          message: "Department name:",
          validate: async (input) => {
            if (!input.trim()) {
              return 'Department name cannot be empty.';
            }
            const [rows] = await connection.query('SELECT name FROM department WHERE name = ?', [input.trim()]);
            if (rows.length > 0) {
              return 'This department already exists.';
            }
            return true;
          },
          filter: input => input.trim()
        }
      ]);

      await connection.query('INSERT INTO department (name) VALUES (?)', [departmentName]);
      console.log('Department added successfully.');
    } catch (error) {
      console.error('Failed to add department:', error.message);
    }
  }

  async function updateEmployeeRole() {
  try {
    const [departments] = await connection.query('SELECT id, name FROM department');
    const departmentChoices = departments.map(dept => ({ name: dept.name, value: dept.id }));

    const { departmentId } = await inquirer.prompt([
      { type: 'list', name: 'departmentId', message: "Select the department:", choices: departmentChoices },
    ]);

    const [roles] = await connection.query('SELECT id, title FROM role WHERE department_id = ?', [departmentId]);
    const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

    const { roleId } = await inquirer.prompt([
      { type: 'list', name: 'roleId', message: 'Select the role:', choices: roleChoices },
    ]);

    const { employeeId } = await inquirer.prompt([
      { name: 'employeeId', message: "Enter the employee's ID:" },
    ]);

    await connection.query('UPDATE employees SET role_id = ?, department_id = ?, manager_id = ? WHERE id = ?', [roleId, departmentId, departmentId, employeeId]);
    console.log('Employee role updated successfully.');
  } catch (error) {
    console.error('Failed to update employee role:', error.message);
  }
}

async function addEmployee() {
  try {

    const [departments] = await connection.query('SELECT id, name FROM department');
    const departmentChoices = departments.map(dept => ({ name: dept.name, value: dept.id }));

    const { fn, ln, departmentId } = await inquirer.prompt([
      { name: 'fn', message: "Employee's first name:" },
      { name: 'ln', message: "Employee's last name:" },
      { type: 'list', name: 'departmentId', message: "Which department will they work in?", choices: departmentChoices }
    ]);


    const [roles] = await connection.query('SELECT id, title FROM role WHERE department_id = ?', [departmentId]);
    if (roles.length === 0) {
      console.error('This department has no roles. Please add roles to the department first.');
      return; 
    }
    const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

    const { roleId } = await inquirer.prompt([
      { type: 'list', name: 'roleId', message: "Which role will they work in?", choices: roleChoices }
    ]);

    const selectedRole = roles.find(role => role.id === roleId);

    if (!selectedRole) {
      console.error('Selected role not found.');
      return;
    }

    const isManager = selectedRole.title.toLowerCase().includes("manager");

    let managerId = null;
    if (!isManager) {
      const [managers] = await connection.query('SELECT id, first_name, last_name FROM employees WHERE department_id = ? AND role_id IN (SELECT id FROM role WHERE title LIKE "%Manager%")', [departmentId]);
      if (managers.length > 0) {
        const managerChoices = managers.map(manager => ({ name: `${manager.first_name} ${manager.last_name}`, value: manager.id }));
        const managerResponse = await inquirer.prompt([
          { type: 'list', name: 'managerId', message: "Select the employee's manager:", choices: managerChoices }
        ]);
        managerId = managerResponse.managerId;
      }
    }

    await connection.query('INSERT INTO employees (first_name, last_name, department_id, role_id, manager_id) VALUES (?, ?, ?, ?, ?)', [fn, ln, departmentId, roleId, managerId]);
    console.log('\n\nEmployee added successfully.\n\n');
  } catch (error) {
    console.error('Failed to add employee:', error);
  }
}

  async function quit() {
    console.log('Exiting... Good Bye!');
    process.exit(0);
  }

async function mainMenu() {
    try {
        const response = await inquirer.prompt({
            type: 'list',
            name: 'choice',
            message: "What would you like to do?",
            choices: [
                { name: 'View All Employees', value: 'view-all-employees' },
                { name: 'View All Roles', value: 'view-all-roles' },
                { name: 'View All Departments', value: 'view-all-departments' },
                { name: 'View Employees by Managers', value: 'view-em-by-man' },
                { name: 'Add Employee', value: 'add-employee' },
                { name: 'Remove Employee', value: 'remove-employee' },
                { name: 'Add Role Type', value: 'add-role' },
                { name: 'Add Department Type', value: 'add-department-type' },
                { name: 'Update Employee Role', value: 'update-employee-role' },
                { name: 'Quit' , value: 'quit'}
            ]
        });

        return response.choice;
    } catch (error) {
        console.log(error);
    }
  }

async function init() {
    await syncTables();
    await seedDatabase();

    console.log(logo);

    let exitLoop = false;
    while (!exitLoop) {
      const choice = await mainMenu();
      switch (choice) {
      
          case 'view-all-employees':
              await viewAllEmployees();
              break;
          case 'view-all-roles':
              await viewAllRoles();
              break;
          case 'view-all-departments':
              await viewAllDepartments();
              break;
          case 'view-em-by-man':
              await viewEmployeesByManagers();
              break;
          case 'add-employee':
              await addEmployee();
              break;
          case 'remove-employee':
              await removeEmployee();
              break;
          case 'add-role':
              await addRoleType();
              break;
          case 'add-department-type':
              await addDepartmentType();
              break;
          case 'update-employee-role':
              await updateEmployeeRole();
              break;
          case 'quit':
              exitLoop = true;
              quit();
              break;
      };
    };
}

init();