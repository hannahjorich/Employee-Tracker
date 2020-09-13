const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");
const cTable = require("console.table");
require("dotenv").config();

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.mysql_password,
  database: "employee_trackerDB",
});

connection.connect((err) => {
  // connect to the mysql server and sql database
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  runSearchPrompt();
});

connection.query = util.promisify(connection.query);

function runSearchPrompt() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "what would you like to do?",
        choices: [
          "View all employees",
          "View all employees by department",
          "View all employees by manager",
          "Add employee",
          "Add Department",
          "Add Role",
          "Remove employee",
          "Update employee manager",
        ],
      },
    ])
    .then((answer) => {
      // Start switch statement
      switch (answer.action) {
        // Start new case
        case "View all employees":
          allEmployees();
          break;
        case "View all employees by department":
          viewByDepartment();
          break;
        case "View all employees by manager":
          viewByManager();
          break;
        case "Add employee":
          addEmployee();
          break;
        case "Add department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Remove employee":
          deleteEmployee();
          break;
        case "Update employee manager":
          updateManager();
          break;
        case "exit":
          connection.end();
          break;
      }
    });
}
