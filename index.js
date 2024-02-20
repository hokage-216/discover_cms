import inquirer from 'inquirer';
import mysql from 'mysql2/promise';
import { seedDatabase} from './seeds/seeds.js';
import 'dotenv/config'

const logo = ">>=====================================================<<\r\n||                                                     ||\r\n||                                                     ||\r\n||                                                     ||\r\n||    _____                 _                          ||\r\n||   | ____|_ __ ___  _ __ | | ___  _   _  ___  ___    ||\r\n||   |  _| | \'_ ` _ \\| \'_ \\| |\/ _ \\| | | |\/ _ \\\/ _ \\   ||\r\n||   | |___| | | | | | |_) | | (_) | |_| |  __\/  __\/   ||\r\n||   |_____|_| |_| |_| .__\/|_|\\___\/ \\__, |\\___|\\___|   ||\r\n||   |  \\\/  | __ _ _ |_|  __ _  __ _|___\/ _ __  | |    ||\r\n||   | |\\\/| |\/ _` | \'_ \\ \/ _` |\/ _` |\/ _ \\ \'__| | |    ||\r\n||   | |  | | (_| | | | | (_| | (_| |  __\/ |    |_|    ||\r\n||   |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|    (_)    ||\r\n||                             |___\/                   ||\r\n||                                                     ||\r\n||                                                     ||\r\n||                                                     ||\r\n>>=====================================================<<"

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'ball4l!f3',
    database: 'employees_db'
  });

async function testConnection() {
    try {
        const results = await connection.query('SHOW DATABASES');
        console.log(results);
        console.log('Successfully established connection to database...');
    } catch (error) {
        console.log(error);
    }
}

async function viewAllEmployees() {
    try {
        const [rows] = await connect.query('SELECT * FROM departments');
        console.log(rows);
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
}

async function viewEmployeesByDepartment () {
    try {
        //code block
    } catch (error) {
        console.error('Error fetching employees by department:', error);
    }
}

async function addEmployee(firstName, lastName, departmentId, roleId, managerId) {
    // Assuming these are the columns in your employees table: first_name, last_name, department_id, role_id, manager_id
    const query = `
        INSERT INTO employees (first_name, last_name, department_id, role_id, manager_id)
        VALUES (?, ?, ?, ?, ?);
    `;
    const values = [firstName, lastName, departmentId, roleId, managerId];

    try {
        const [result] = await connect.query(query, values);
        console.log('Employee added successfully:', result);
        // result object will contain useful information such as insertId
    } catch (error) {
        console.error('Error adding employee:', error);
    }
}

async function mainMenu() {
    const response = await inquirer.prompt({
        type: 'list',
        name: 'menu',
        message: "What would you like to do?",
        choices: [
            { name: 'View All Employees', value: 'view-all-employees' },
            { name: 'Add Employee', value: 'add-employee' },
            { name: 'Remove Employee', value: 'remove-employee' },
            { name: 'Update Employee Role', value: 'update-employee-role' },
            { name: 'View Employees by Managers', value: 'view-em-by-man' },
            { name: 'Add Manager', value: 'add-manager' },
            { name: 'Remove manager', value: 'remove-manager' },
            { name: 'Update manager Role', value: 'update-manager-role' },
            { name: 'View All Roles', value: 'view-all-roles' },
            { name: 'Add Role', value: 'add-role' },
            { name: 'Remove Role', value: 'remove-role' },
            { name: 'View All Departments', value: 'view-all-departments' },
            { name: 'Add Department', value: 'add-employee' },
            { name: 'Update Employee Department', value: 'update-employee-department' },
            { name: 'Quit' , value: 'quit'}
        ]
    });

    switch (response.choices) {

        case 'view-all-employees':
            return viewAllEmployees();
        case 'add-employee':
            //functionality here
            break;
        case 'remove-employee':
            //functionality here
            break;
        case 'update-employee-role':
            //functionality here
            break;
        case 'view-all-managers':
            //functionality here
            break;
        case 'add-manager':
            //functionality here
            break;
        case 'remove-manager':
            //functionality here
            break;
        case 'update-manager-role':
            //functionality here
                break;
        case 'view-all-roles':
            //functionality here
            break;
        case 'add-role':
            //functionality here
            break;
        case 'remove-role':
            //functionality here
            break;
        case 'view-all-departments':
        //functionality here
        break;
        case 'add-employee':
            //functionality here
            break;
        case 'update-employee-department':
            //functionality here
            break;
        case 'quit':
            connection.releaseConnection()
            process.exit();
    }
}

async function init() {
    
    try {
        //test connection
        await seedDatabase();
      } catch (error) {
        console.error('Error seeding the database:', error);
      }

      // disply app logo
    console.log(logo);

    await mainMenu();

}

init();