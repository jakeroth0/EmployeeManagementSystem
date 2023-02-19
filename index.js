#!/usr/bin/env node
// import inquirer from 'inquirer';
const { prompt } = require("inquirer");
const gradient = require("gradient-string");
const figlet = require("figlet");
const mysql = require("mysql2");
const cTable = require("console.table");
// Connects us to the database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // TODO: Add MySQL password
    password: "Shark231!",
    database: "employeeManagement_db",
  },
  console.log("Connected to the database")
);
// These are all the array's of questions that the prompt will use
function mainMenu() {
  prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "choice",
      choices: [
        {
          name: "View all employees",
          value: "View all employees",
        },
        {
          name: "View all departments",
          value: "View all departments",
        },
        {
          name: "Add Employee",
          value: "Add Employee",
        },
        {
          name: "Update employee role",
          value: "Update employee role",
        },
        {
          name: "View all roles",
          value: "View all roles",
        },
        {
          name: "Add department",
          value: "Add department",
        },
        {
          name: "Add role",
          value: "Add role",
        },
        {
          name: "Quit",
          value: "QUIT",
        },
      ],
      // default: [0],
      // prefix: "Use arrow keys",
      // suffix: "Move up and down to reveal more choices",
    },
  ]).then((res) => {
    let choice = res.choice;
    switch (choice) {
      case "View all employees":
        viewEmployees();
        break;
      case "View all departments":
        viewDepartments();
        break;
      case "Add Employee":
        addEmployee();
        break;
      case "Update employee role":
        updateEmployeeRole();
        break;
      case "View all roles":
        viewRoles();
        break;
      case "Add role":
        addRole();
        break;
      case "Add department":
        addDepartment();
        break;
      case "QUIT":
        quit();
        break;
      // default:
      //   quit();
    }
  });
}

function viewEmployees() {
  db.query(
    `SELECT employee.id AS id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name,' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id;`,
    function (err, results) {
      console.table(results);
    }
  );
  return welcome();
}
function viewDepartments() {
  db.query(
    `SELECT department.id AS id, department.name AS name FROM department;`,
    function (err, results) {
      console.table(results);
    }
  );
  return welcome();
}
function addEmployee() {
  db.query(`SELECT id AS value, title FROM role;`, function (err, results) {
    // console.log(results);
    let roleChoices = results.map(getCombinedRole);
    function getCombinedRole(item) {
        return [item.value, item.title].join(" ");
    };
    // let roleValue = results.map(({ value }) => value);
    db.query(
      `SELECT id AS value, CONCAT(employee.first_name,' ', employee.last_name) AS manager FROM employee;`,
      function (err, managerResults) {
        let managerChoice = managerResults.map(getCombinedManager);
        function getCombinedManager(item) {
            return [item.value, item.manager].join(" ");
        };

        prompt([
          {
            type: "input",
            message: `What is employee’s first name?`,
            name: "firstNameChoice",
            default: "John",
          },
          {
            type: "input",
            message: `What is employee’s lasst name?`,
            name: "lastNameChoice",
            default: "Doe",
          },
          {
            type: "list",
            message: `What is employee’s role?`,
            name: "newEmployeeRole",
            choices: roleChoices,
          },
          {
            type: "list",
            message: `who is the employee’s manager?`,
            name: "newEmployeeManager",
            choices: managerChoice,
          },
        ]).then((res) => {
          var r = /\d+/;
          var s = res.newEmployeeRole;
          var m = res.newEmployeeManager;
          var roleId = s.match(r)[0];
          var managerId = m.match(r)[0];
        //   console.log(roleId);
        //   console.log(res.firstNameChoice);
        //   console.log(managerId + 'manager id number');
          db.query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ("${res.firstNameChoice}","${res.lastNameChoice}", ${roleId}, ${managerId});`,
            function (err, res) {
            //   console.log(res);
            }
          );
          return welcome();
        });
        //   return welcome();
      }
    );
  });
}
function viewRoles() {
  db.query(
    `SELECT role.id AS id, role.title AS title, role.salary AS salary,
                 department.name AS department FROM role JOIN department
                 ON role.department_id = department.id ORDER BY role.id ASC;`,
    function (err, results) {
      console.table(results);
    }
  );
  return welcome();
}
function addDepartment() {
  prompt([
    {
      type: "input",
      message: `what is the name of the department?`,
      name: "departmentName",
      default: "Human Resources",
    },
  ]).then((response) => {
    db.query(
      `INSERT INTO department (name)
    VALUES ("${response.departmentName}")`,
      function (err, res) {}
    );
    return viewDepartments();
  });
}
function updateEmployeeRole() {
    db.query(`SELECT id AS value, title FROM role;`, function (err, results) {
        let roleChoices = results.map(getCombinedRole);
        function getCombinedRole(item) {
            return [item.value, item.title].join(" ");
        };
        db.query(
          `SELECT id AS value, CONCAT(employee.first_name,' ', employee.last_name) AS employee FROM employee;`,
          function (err, employeeResults) {
            let employeeChoice = employeeResults.map(getCombinedEmployee);
            function getCombinedEmployee(item) {
                return [item.value, item.employee].join(" ");
            };
    
            prompt([
                {
                    type: "list",
                    message: `which employee’s role do you want to update?`,
                    name: "updateEmployee",
                    choices: employeeChoice,
                  },
              {
                type: "list",
                message: `Which role do you want to assign the selected employee?`,
                name: "updateRole",
                choices: roleChoices,
              },
            ]).then((res) => {
              var r = /\d+/;
              var e = res.updateEmployee;
              var l = res.updateRole;
              var roleId = l.match(r)[0];
              var employeeId = e.match(r)[0];
            //   console.log(roleId);
            //   console.log(employeeId + 'employee id number');
              db.query(
                `UPDATE employee SET role_id = ${roleId} WHERE employee.id = ${employeeId};`,
                function (err, res) {
                //   console.log(res);
                }
              );
              return welcome();
            });
            //   return welcome();
          }
        );
      });
    
}
function addRole() {
    db.query(`SELECT id AS value, name FROM department;`, function (err, results) {
        // console.log(results);
        let departmentChoices = results.map(getCombinedDepartment);
        function getCombinedDepartment(item) {
            return [item.value, item.name].join(" ");
        };
            prompt([
              {
                type: "input",
                message: `What is the name of the role`,
                name: "newRoleName",
                default: "Lawyer",
              },
              {
                type: "input",
                message: `What is the salary of the role?`,
                name: "newRoleSalary",
                default: "190000",
              },
              {
                type: "list",
                message: `Which department does the role belong to?`,
                name: "newRoleDepartment",
                choices: departmentChoices,
              },
            ]).then((res) => {
              var r = /\d+/;
              var s = res.newRoleDepartment;
              var departmentId = s.match(r)[0];
            //   console.log('through add role prompt')
            //   console.log(departmentId);
            //   console.log(res.newRoleName)
            //   console.log(res.newRoleSalary)
              db.query(
                `INSERT INTO role (title, salary, department_id) VALUES ("${res.newRoleName}", ${res.newRoleSalary}, ${departmentId});`,
                function (err, res) {
                //   console.log(res);
                }
              );
              return welcome();
            });
            //   return welcome();
      });  
}
function quit() {
  console.log("goodbye");
  return process.exit();
}
// The welcome funciton runs when the user starts the server
// it writes out a fun title and runs the mainMenu prompt fuction
async function welcome() {
    console.clear();
  const msg = "Employee Manager";
  await figlet(msg, (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });
  const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
  await sleep(500);
  await mainMenu();
}
welcome();