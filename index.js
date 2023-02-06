#!/usr/bin/env node

// import inquirer from 'inquirer';
const inquirer = require('inquirer');
const gradient = require('gradient-string');
const figlet = require('figlet');
const mysql = require('mysql2');
const cTable = require('console.table');
// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password
      password: 'Shark231!',
      database: 'employeeManagement_db'
    },
    console.log(`Connected to the database.`)
  );

const mainQuestions = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'dataBaseAction',
        choices: ['View all employees', 'Add employee', 'Update employee role', 'View all roles', 'Add role', 'View all departments', 'Add department', 'Quit'],
        default: [0],
        prefix: 'Use arrow keys',
        suffix: 'Move up and down to reveal more choices',
    },
  ];
const addEmployeeQuestions = [
    {
        type: 'input',
        message: `What is the employee's first name?`,
        name: 'employeeFirstName',
        default: 'John',
    },
    {
        type: 'input',
        message: `What is the employee's last name?`,
        name: 'employeeLastName',
        default: 'Doe',
    },
    {
        type: 'input',
        message: `What is the employee's role?`,
        name: 'employeeRole',
        default: 'Customer Service',
    },
    {
        type: 'input',
        message: `Who is the employee's manager?`,
        name: 'employeeManager',
        default: 'Doe',
    },
];
const updateEmployeeRoleQuestions = [
    {
        type: 'list',
        message: `Which employee's role do you want to update?`,
        name: 'NameOfEmployeeToUpdate',
        choices: ['Malia Brown', 'Sarah Lourd', 'Tom Allen'],
        default: [0],
        prefix: 'Use arrow keys',
        suffix: 'Move up and down to reveal more choices',
    },
    {
        type: 'list',
        message: `Which role do you want to assign the selected employee`,
        name: 'updateEmployeeRole',
        choices: ['Sales Lead', 'Salesperson', 'Lead Engineer'],
        default: [0],
        prefix: 'Use arrow keys',
        suffix: 'Move up and down to reveal more choices',
    },
];
const addRoleQuestions = [
    {
        type: 'input',
        message: 'What is the name of the role?',
        name: 'addRoleName',
        default: 'Customer Service',
    },
    {
        type: 'input',
        message: 'What is the salary of the role?',
        name: 'addSalaryToRole',
        default: 'Description',
    },
    {
        type: 'input',
        message: 'Which department does the role belong to?',
        name: 'addDepartmentToRole',
        default: 'Service',
    },
];
const addDepartmentQuestions = [
    {
        type: 'input',
        message: 'What is the name of the department?',
        name: 'addDepartmentName',
        default: 'Service',
    },
];
async function welcome() {
    const msg = `Employee Manager`;

   await figlet(msg, (err, data) => {
        console.log(gradient.pastel.multiline(data));
    });
    const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
    await sleep(500);
    mainMenu()
}
welcome()

function mainMenu() {
inquirer
.prompt(mainQuestions)
.then((answers) => {
    console.log(answers);
    
    if (answers.dataBaseAction === 'Quit') {
        console.log('goodbye')
        process.exit();
    } else if (answers.dataBaseAction === 'Add role') {
        console.log('add role selected')
        inquirer.prompt(addRoleQuestions).then((addRoleAnswers) => {
            console.log(addRoleAnswers);
            welcome();
        })
    } else if (answers.dataBaseAction  === 'View all roles') {
        db.query(`SELECT role.id AS id, role.title AS title, role.salary AS salary,
         department.name AS department FROM role JOIN department 
         ON role.department_id = department.id;`, function (err, results) {
    console.table(results);
  });
        console.log('View all roles selected')
        welcome();
    } else if (answers.dataBaseAction === 'Add employee') {
        inquirer.prompt(addEmployeeQuestions).then((addEmployeeAnswers) => {
            console.log(addEmployeeAnswers);
            welcome();
        })
    } else if (answers.dataBaseAction === 'Update employee role') {
        inquirer.prompt(updateEmployeeRoleQuestions).then((updateEmployeeRoleAnswers) => {
            console.log(updateEmployeeRoleAnswers);
            welcome();
        })
    } else if (answers.dataBaseAction === 'View all employees') {
        console.log('View all employees selected');
        welcome();
    } else if (answers.dataBaseAction === 'View all departments') {
        console.log('View all departments selected');
        welcome();
    } else if (answers.dataBaseAction === 'Add department') {
        inquirer.prompt(addDepartmentQuestions).then((addDepartmentAnswers) => {
            console.log(addDepartmentAnswers);
            welcome();
        })
    };
    // Use user feedback for... whatever!!
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
}
// mainMenu();