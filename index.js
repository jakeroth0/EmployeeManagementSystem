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
          name: "View all roles",
          value: "View all roles",
        },
        // "Add employee",
        // "Update employee role",
        // "View all roles",
        // "Add role",
        {
          name: "Add department",
          value: "Add department",
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
      // case "Update employee role":
      //   addEmployee();
      //   break;
      case "View all roles":
        viewRoles();
        break;
      // case "Add role":
      //   viewRoles();
      //   break;
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

// const arrayOfRoleChoices = () => {
//   db.query(`SELECT id AS value, title FROM role;`, function (err, results) {
//     let roleChoices = results.map(({ title }) => title);
//     prompt([
//         {
//             type: "list",
//             message: `who is the employee’s manager?`,
//             name: "newEmployeeManager",
//             choices: roleChoices,
//           },
//     ]).then((res) => {
//         console.log(res);
//     })
//   });
// };
// arrayOfRoleChoices();

// const roleChoices = async () => {
//     const roleQuery = `SELECT id AS value, title FROM role;`;
//     const roles = await db.query(roleQuery);
//     return roles[0]
//    await db.query(`SELECT id AS value, title FROM role;`,
//     function (err, results) {
//         let arrayOfRoleChoices = results.map(({ title }) => title)
//     //    console.log(arrayOfRoleChoices)
//         return results
//       },
//       console.log(results)
//     );
// };
// function testAddEmployeeRole() {
//   prompt([
//     {
//       type: "list",
//       message: `who is the employee’s manager?`,
//       name: "newEmployeeManager",
//       choices: arrayOfRoleChoices,
//     },
//   ]).then((res) => {
//     console.log(res);
//   });
// }
// testAddEmployeeRole();

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
          console.log(roleId);
          console.log(res.firstNameChoice);
          console.log(managerId + 'manager id number');
          db.query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ("${res.firstNameChoice}","${res.lastNameChoice}", ${roleId}, ${managerId});`,
            function (err, res) {
              console.log(res);
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
                 ON role.department_id = department.id;`,
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
function quit() {
  console.log("goodbye");
  return process.exit();
}
// The welcome funciton runs when the user starts the server
// it writes out a fun title and runs the mainMenu prompt fuction
async function welcome() {
  //   console.clear();
  const msg = "Employee Manager";
  await figlet(msg, (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });
  const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
  await sleep(500);
  await mainMenu();
}
welcome();

// const addEmployeeQuestions = [
//   {
//     type: "input",
//     message: What is the employee's first name?,
//     name: "employeeFirstName",
//     default: "John",
//   },
//   {
//     type: "input",
//     message: What is the employee's last name?,
//     name: "employeeLastName",
//     default: "Doe",
//   },
//   {
//     type: "input",
//     message: What is the employee's role?,
//     name: "employeeRole",
//     default: "Customer Service",
//   },
//   {
//     type: "input",
//     message: Who is the employee's manager?,
//     name: "employeeManager",
//     default: "Doe",
//   },
// ];
// const updateEmployeeRoleQuestions = [
//   {
//     type: "list",
//     message: Which employee's role do you want to update?,
//     name: "NameOfEmployeeToUpdate",
//     choices: ["Malia Brown", "Sarah Lourd", "Tom Allen"],
//     default: [0],
//     prefix: "Use arrow keys",
//     suffix: "Move up and down to reveal more choices",
//   },
//   {
//     type: "list",
//     message: Which role do you want to assign the selected employee,
//     name: "updateEmployeeRole",
//     choices: ["Sales Lead", "Salesperson", "Lead Engineer"],
//     default: [0],
//     prefix: "Use arrow keys",
//     suffix: "Move up and down to reveal more choices",
//   },
// ];
// const addRoleQuestions = [
//   {
//     type: "input",
//     message: "What is the name of the role?",
//     name: "addRoleName",
//     default: "Customer Service",
//   },
//   {
//     type: "input",

//     message: "What is the salary of the role?",
//     name: "addSalaryToRole",
//     default: "Description",
//   },
//   {
//     type: "input",
//     message: "Which department does the role belong to?",
//     name: "addDepartmentToRole",
//     default: "Service",
//   },
// ];
// const addDepartmentQuestions = [
//   {
//     type: "input",
//     message: "What is the name of the department?",
//     name: "addDepartmentName",
//     default: "Service",
//   },
// ];
// function getEmployeeFirstName() {
//   db.query(
//     SELECT first_name, last_name FROM employee;,
//     function (err, results) {
//       for (let i = 0; i < results.length; i++) {
//         const element = results[i];
//         const employeeNames =
//           results[i].first_name + " " + results[i].last_name;
//         console.log(employeeNames);
//         // return employeeNames;
//       }
//     }
//   );
// }
// // async function mainMenu() {
// //   inquirer
// //     .prompt(mainQuestions)
// //     .then((answers) => {
// //       console.clear();
// //       console.log(answers);
// //       if (answers.dataBaseAction === "Quit") {
// //         console.log("goodbye");
// //         process.exit();
// //       } else if (answers.dataBaseAction === "Add role") {
// //         console.log("add role selected");
// //         inquirer.prompt(addRoleQuestions).then((addRoleAnswers) => {
// //           console.log(addRoleAnswers);
// //           welcome();
// //         });
// //       } else if (answers.dataBaseAction === "View all roles") {
// //         db.query(
// //           `SELECT role.id AS id, role.title AS title, role.salary AS salary,
// //          department.name AS department FROM role JOIN department
// //          ON role.department_id = department.id;`,
// //           function (err, results) {
// //             console.table(results);
// //           }
// //         );
// //         welcome();
// //       } else if (answers.dataBaseAction === "Add employee") {
// //         inquirer.prompt(addEmployeeQuestions).then((addEmployeeAnswers) => {
// //           console.log(addEmployeeAnswers);
// //           welcome();
// //         });
// //       } else if (answers.dataBaseAction === "Update employee role") {
// //         db.promise().query(SELECT * FROM employee, (err, res) => {
// //           console.log(res);
// //           employees = res.map(({ id, first_name, last_name }) => ({
// //             name: ${first_name} ${last_name},
// //             value: id,
// //           }));
// //         });
// //         const updateEmployeeRoleQuestions = [
// //           {
// //             type: "list",
// //             message: Which employee's role do you want to update?,
// //             name: "NameOfEmployeeToUpdate",
// //             choices: employees,
// //             default: [0],
// //             prefix: "Use arrow keys",
// //             suffix: "Move up and down to reveal more choices",
// //           },
// //           {
// //             type: "list",
// //             message: Which role do you want to assign the selected employee,
// //             name: "updateEmployeeRole",
// //             choices: ["Sales Lead", "Salesperson", "Lead Engineer"],
// //             default: [0],
// //             prefix: "Use arrow keys",
// //             suffix: "Move up and down to reveal more choices",
// //           },
// //         ];
// //         inquirer
// //           .prompt(updateEmployeeRoleQuestions)
// //           .then((updateEmployeeRoleAnswers) => {
// //             const employeesList = console.log(updateEmployeeRoleAnswers);
// //             welcome();
// //           });
// //       } else if (answers.dataBaseAction === "View all employees") {
// //         console.log("View all employees selected");
// //         welcome();
// //       } else if (answers.dataBaseAction === "View all departments") {

// //         console.log("View all departments selected");
// //         welcome();
// //       } else if (answers.dataBaseAction === "Add department") {
// //         inquirer.prompt(addDepartmentQuestions).then((addDepartmentAnswers) => {
// //           console.log(addDepartmentAnswers);
// //           welcome();
// //         });
// //       }
// //       // Use user feedback for... whatever!!
// //     })
// //     .catch((error) => {
// //       if (error.isTtyError) {
// //         // Prompt couldn't be rendered in the current environment
// //       } else {
// //         // Something else went wrong
// //       }
// //     });
// // }
// // Define the functions that will be used in mainMenu
// // This is the mainMenu function that will run a function
// function addDepartment() {
//     // inquirer.prompt(addDepartmentQuestions).then((addDepartmentAnswers) => {
//     //               console.log(addDepartmentAnswers);
//     //               welcome();
//     // });
//     console.log("add department switch");
// };```
