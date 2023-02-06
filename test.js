const inquirer = require('inquirer');

const questions = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'dataBaseAction',
        choices: ['View all employees', 'Add employee', 'Update employee role', 'View all roles', 'Add role', 'View all departments', 'Add department', 'Quit'],
        default: [0],
        prefix: 'Use arrow keys',
        suffix: 'Move up and down to reveal more choices',
    },    
    {
        type: 'input',
        message: 'What is the name of the department?',
        name: 'addDepartmentName',
        default: 'Service',
    },
    {
        type: 'input',
        message: 'What is the name of the role?',
        name: 'addRoleName',
        default: 'Customer Service',
    },
]

inquirer
  .prompt(questions)
  .then((answers) => {
    console.log(answers);
    // Use user feedback for... whatever!!
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });