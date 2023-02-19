// import inquirer from 'inquirer';
const { prompt } = require("inquirer");
// imports the color gradient effect for word art
const gradient = require("gradient-string");
// Figlet is how word art is done
const figlet = require("figlet");
// mysql2 is our db
const mysql = require("mysql2");
// console.table is used to log a cleaner looking table
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
// This is the main question array that will be used like a main menu
function mainMenu() {
  // we don't need to write inquirer.prompt because of how we required inquirer above
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
    },
    // This switch statement checks the res and then runs the appropriate function
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
    }
  });
}
// The view employee function shows us a table with many of the important columns
function viewEmployees() {
  db.query(
    // concat is used to combine first and last names into one
    // join left is ued because we want all employees to be shown - read from left to right - the first table - the left table the employee table
    // left join means we use the all the rows on the left table, the first table, and try to match up the rest of the tables with those rows
    // we're also calling employee.first_name manager.first_name so that we can join a column of table data to itself
    // this is better explained with a venn diagram...
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
// This function shows all departments in db
function viewDepartments() {
  db.query(
    `SELECT department.id AS id, department.name AS name FROM department;`,
    function (err, results) {
      console.table(results);
    }
  );
  return welcome();
  //   This function allows the user to add a new employee
}
function addEmployee() {
  // To avoid scoping issues, the query to get data is included within the function
  // We get the id value and the title so that we can pass both pieces of data along to the query that will add the employee to the db
  db.query(`SELECT id AS value, title FROM role;`, function (err, results) {
    // .map is used to create a new array where the id and value are merged from two values into one value.
    // this allows us to pass both pieces of data we need in one choice
    let roleChoices = results.map(getCombinedRole);
    function getCombinedRole(item) {
      return [item.value, item.title].join(" ");
    }
    // the db.query function below gets employee's first and last names and combines them for the manager question
    db.query(
      `SELECT id AS value, CONCAT(employee.first_name,' ', employee.last_name) AS manager FROM employee;`,
      function (err, managerResults) {
        let managerChoice = managerResults.map(getCombinedManager);
        function getCombinedManager(item) {
          return [item.value, item.manager].join(" ");
        }
        // The series of questions that inquirer uses to prompt the user
        prompt([
          {
            type: "input",
            message: `What is employee’s first name?`,
            name: "firstNameChoice",
            default: "Tim",
          },
          {
            type: "input",
            message: `What is employee’s lasst name?`,
            name: "lastNameChoice",
            default: "Smith",
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
          //   .then waits for the user to select answers. once those answers are saved to an object, res, we use res to
          // to select what data we want and then pass that into the db query that updates/pushes the new employee to the db
        ]).then((res) => {
          // r is set to a regular expression that looks for all the numbers in a string and pulls those out
          var r = /\d+/;
          var s = res.newEmployeeRole;
          var m = res.newEmployeeManager;
          //   .match looks in the string for anything that matches the parameter it's given and returns that
          // in our case we've passed a regex that's only numbers, so we get back the value id
          var roleId = s.match(r)[0];
          var managerId = m.match(r)[0];
          //   This is the sql query statement that adds the data collected from user input - into the db
          db.query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ("${res.firstNameChoice}","${res.lastNameChoice}", ${roleId}, ${managerId});`,
            function (err, res) {}
          );
          return welcome();
        });
      }
    );
  });
}
// This function allows the user to see all roles currently in the db
function viewRoles() {
  db.query(
    // ORDER BY ASC is used here to get the roles in oder starting with 1
    `SELECT role.id AS id, role.title AS title, role.salary AS salary,
                 department.name AS department FROM role JOIN department
                 ON role.department_id = department.id ORDER BY role.id ASC;`,
    function (err, results) {
      console.table(results);
    }
  );
  return welcome();
}
// This funciton allows users to add a department
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
    // instead of going back to the main menu, we call viewDepartments so that the user can confirm that
    // the database they submitted has been added to the db
    return viewDepartments();
  });
}
//  This function is used to update an employee's role
function updateEmployeeRole() {
  // similar to add employee, we use two db.queries to get current data from the db
  // that data is then passed through .map functions that merge value ids with title or employee names
  // passing those values through .map creates a new array that is used for two questions below
  db.query(`SELECT id AS value, title FROM role;`, function (err, results) {
    let roleChoices = results.map(getCombinedRole);
    function getCombinedRole(item) {
      return [item.value, item.title].join(" ");
    }
    db.query(
      `SELECT id AS value, CONCAT(employee.first_name,' ', employee.last_name) AS employee FROM employee;`,
      function (err, employeeResults) {
        let employeeChoice = employeeResults.map(getCombinedEmployee);
        function getCombinedEmployee(item) {
          return [item.value, item.employee].join(" ");
        }
        // This is where the prompts that the user interacts with are
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
          // this is set up the same way it was set up in the addEmployee function. See the comments above
          var r = /\d+/;
          var e = res.updateEmployee;
          var l = res.updateRole;
          var roleId = l.match(r)[0];
          var employeeId = e.match(r)[0];
          //   This sql statement is used to UPDATE a current employee in the db
          db.query(
            `UPDATE employee SET role_id = ${roleId} WHERE employee.id = ${employeeId};`,
            function (err, res) {}
          );
          return welcome();
        });
      }
    );
  });
  // This function allows the user to add a role to the db
}
function addRole() {
  db.query(
    `SELECT id AS value, name FROM department;`,
    function (err, results) {
      // .map is used to create a new array where the id and name's from departments are merged into a single value
      // the new array - departmentChoices is then passed into the third prompt
      let departmentChoices = results.map(getCombinedDepartment);
      function getCombinedDepartment(item) {
        return [item.value, item.name].join(" ");
      }
      prompt([
        {
          type: "input",
          message: `What is the name of the role`,
          name: "newRoleName",
          default: "Human Resources Lead",
        },
        {
          type: "input",
          message: `What is the salary of the role?`,
          name: "newRoleSalary",
          default: "150000",
        },
        {
          type: "list",
          message: `Which department does the role belong to?`,
          name: "newRoleDepartment",
          choices: departmentChoices,
        },
      ]).then((res) => {
        // See comments on addEmployee for more info on /\d+/ and .match
        var r = /\d+/;
        var s = res.newRoleDepartment;
        var departmentId = s.match(r)[0];
        //   this statement inserts a new role into the db
        db.query(
          `INSERT INTO role (title, salary, department_id) VALUES ("${res.newRoleName}", ${res.newRoleSalary}, ${departmentId});`,
          function (err, res) {}
        );
        return welcome();
      });
    }
  );
}
// this function allow the user to exit the employee management interface
function quit() {
  console.log("goodbye");
  return process.exit();
}
// The welcome funciton runs when the user starts the server
// it writes out a fun title and runs the mainMenu prompt fuction
// welcome is called at the end of almost all the funcitons above
// it returnes the user to the main menu/set of options and also clears the terminal
async function welcome() {
  // console.clear() clears the terminal and makes for a cleaner experience
  console.clear();
  const msg = "Employee Manager";
  //   this is what is used to create the niffty text artwork
  await figlet(msg, (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });
  //   it takes time to create for it to render correctly, so a timer has been added
  const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
  await sleep(500);
  await mainMenu();
}
// welcome() is run when the server is started
welcome();