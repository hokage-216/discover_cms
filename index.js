import inquirer from 'inquirer';
import mysql from 'mysql2/promise';
import 'dotenv/config'

const logo = ">>=====================================================<<\r\n||                                                     ||\r\n||                                                     ||\r\n||                                                     ||\r\n||    _____                 _                          ||\r\n||   | ____|_ __ ___  _ __ | | ___  _   _  ___  ___    ||\r\n||   |  _| | \'_ ` _ \\| \'_ \\| |\/ _ \\| | | |\/ _ \\\/ _ \\   ||\r\n||   | |___| | | | | | |_) | | (_) | |_| |  __\/  __\/   ||\r\n||   |_____|_| |_| |_| .__\/|_|\\___\/ \\__, |\\___|\\___|   ||\r\n||   |  \\\/  | __ _ _ |_|  __ _  __ _|___\/ _ __  | |    ||\r\n||   | |\\\/| |\/ _` | \'_ \\ \/ _` |\/ _` |\/ _ \\ \'__| | |    ||\r\n||   | |  | | (_| | | | | (_| | (_| |  __\/ |    |_|    ||\r\n||   |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|    (_)    ||\r\n||                             |___\/                   ||\r\n||                                                     ||\r\n||                                                     ||\r\n||                                                     ||\r\n>>=====================================================<<"

const connection = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASS,
    database: process.env.MYSQLDB,
  });

  async function viewAllDepartments() {
    const [rows] = await db.query('SELECT * FROM departments');
    console.table(rows);
  }

async function viewAllRoles() {
    const [rows] = await db.query('SELECT * FROM roles');
    console.table(rows);
  }

async function viewAllEmployees() {
    const [rows] = await db.query('SELECT * FROM employees');
    console.table(rows);
  }

  async function viewEmployeesByManagers() {
    const [rows] = await db.query(`
      SELECT e.id, e.first_name, e.last_name, m.first_name AS manager_first_name, m.last_name AS manager_last_name 
      FROM employees e
      LEFT JOIN employees m ON e.manager_id = m.id
    `);
    console.table(rows);
  }
  async function removeEmployee() {
    const { employeeId } = await inquirer.prompt([
      { name: 'employeeId', message: "Enter the employee's ID to remove:" }
    ]);
    await db.query('DELETE FROM employees WHERE id = ?', [employeeId]);
    console.log('Employee removed successfully.');
  }

  async function addRoleType() {
    const role = await inquirer.prompt([
      { name: 'title', message: "Role title:" },
      { name: 'salary', message: "Role salary:" },
      // Add prompt for department_id
    ]);
    await db.query('INSERT INTO roles (title, salary) VALUES (?, ?)', [role.title, role.salary]);
    console.log('Role added successfully.');
  }

  async function addDepartmentType() {
    const { departmentName } = await inquirer.prompt([
      { name: 'departmentName', message: "Department name:" }
    ]);
    await db.query('INSERT INTO departments (name) VALUES (?)', [departmentName]);
    console.log('Department added successfully.');
  }

  async function updateEmployeeDepartment() {
    const { employeeId, departmentId } = await inquirer.prompt([
      { name: 'employeeId', message: "Enter the employee's ID:" },
      { name: 'departmentId', message: "Enter the new department ID:" }
    ]);
    await db.query('UPDATE employees SET department_id = ? WHERE id = ?', [departmentId, employeeId]);
    console.log('Employee department updated successfully.');
  }

async function addEmployee() {
    try {
        let managerID = 0;
        let roleID = 0;
        let departNum = 0;
        const firstName = await inquirer.prompt([{ name: 'fn', message: "Employee's first name:" }]);
        const lastName = await inquirer.prompt([{ name: 'ln', message: "Employee's last name:" }]);
        const departID = await inquirer.prompt([{ type: 'list', name: 'departmentId', message: "Which department will they work in?", choices: [{name: 'IT', value: 'it'}, {name: 'Sales', value: 'sales'}, {name: 'Marketing', value: 'marketing'}]}]);
        
        switch (departID.departmentId) {
            case 'it':
                let itRole = await inquirer.prompt([{ type: 'list', name: 'roleId', message: "Which role will they work in?", choices: [{name: 'Software Developer Manager', value: 'software-manager'}, {name: 'Software Developer', value: 'software-development'}]}]);
                if (itRole.roleId === 'software-manager') {
                    departNum = 1;
                    roleID = 1;
                    managerID = null;
                } else {
                    
                    roleID = 3;
                    managerID = 1;
                }
                break;
            case 'sales':
                let salesRole = await inquirer.prompt([{ type: 'list', name: 'roleId', message: "Which role will they work in?", choices: [{name: 'Sales Manager', value: 'sales-manager'}, {name: 'Sales Representative', value: 'sales-representative'}]}]);
                if (salesRole.roleId === 'sales-manager') {
                    roleID = 2;
                    managerID = null;
                } else {
                    roleID = 5;
                    managerID = 2;
                }
                break;
            case 'marketing':
                let marketingRole = await inquirer.prompt([{ type: 'list', name: 'roleId', message: "Which role will they work in?", choices: [{name: 'Digital Marketing Manager', value: 'digital-manager'}, {name: 'Marketing Specialist', value: 'marketing-manager'}]}]);
                if (marketingRole.roleId === 'sales-manager') {
                    roleID = 3;
                    managerID = null;
                } else {
                    roleID = 6;
                    managerID = 3;
                }
                break;
          }
          const [res] = await connection.query('INSERT INTO employees (first_name, last_name, department_id, role_id, manager_id) VALUES (?, ?, ?, ?, ?)', [firstName.fn, lastName.ln, departNum, roleID, managerID]);
          console.log('Employee added successfully.', res);
    } catch (error) {
        console.log(error);
    }
  }

  async function quit() {
    console.log('Exiting...');
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
                { name: 'Remove Manager', value: 'remove-manager' },
                { name: 'Add Role Type', value: 'add-role' },
                { name: 'Add Department Type', value: 'add-department-type' },
                { name: 'Update Employee Department', value: 'update-employee-department' },
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
    // disply app logo
    console.log(logo);
    // show main menue
    const choice = await mainMenu();

    switch (choice) {
    
        case 'view-all-employees':
            await viewAllEmployees();
            break;
        case 'view-all-roles':
            await viewAllRoles();
        case 'view-all-departments':
            await viewAllRoles();
            break;
        case 'view-em-by-man':
            //functionality here
            break;
        case 'add-employee':
            await addEmployee();
            break;
        case 'remove-employee':
            //functionality here
            break;
        case 'remove-manager':
            //functionality here
            break;
        case 'add-role':
            //functionality here
                break;
        case 'add-department-type':
            //functionality here
            break;
        case 'update-employee-department':
            //functionality here
            break;
        case 'update-employee-role':
            //functionality here
            break;
        case 'quit':
            quit();
    }   
}

init();