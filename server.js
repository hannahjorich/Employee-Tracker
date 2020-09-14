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
          "View all departments",
          "View all roles",
          "Add employee",
          "Add department",
          "Add role",
          "Update employee role",
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
        case "View all departments":
          viewByDepartment();
          break;
        case "View all roles":
          viewByRole();
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
        case "exit":
          connection.end();
          break;
      }
    });
}

const allEmployees = () => {
    connection.query("SELECT * FROM employee", function (err, res) {
      if (err) throw err;
      console.table(res);
      console.log("");
      runSearchPrompt();
    });
  }

  const viewByDepartment = () => {
    connection.query("SELECT * FROM department", function (err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
      console.log("");
      runSearchPrompt();
    });
  }

  const viewByRole = () => {
    connection.query("SELECT * FROM roles", function (err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
      console.log("");
      runSearchPrompt();
    });
  }

  const addEmployee = () => {
      connection.query("SELECT * FROM roles", (err, res) => {
          if (err) throw err;
          return inquirer.prompt([
              {
                  type: "input",
                  name: "firstName",
                  message: "Please enter employee's first name",
                  validate: (answer) => {
                    if (answer !== "") {
                        return true;
                      }
                      return "No blank fields";
                    }
              },
              {
                type: "input",
                name: "lastName",
                message: "Please enter employee's last name",
                validate: (answer) => {
                  if (answer !== "") {
                      return true;
                    }
                    return "No blank fields";
                  }
              },  
            {
                type: "input",
                name: "role",
                message: "Please enter employee's department",
            },
          ]).then(function (answer)  {
              connection.query(`INSERT into employee (first_name, last_name, role_id) VALE ("${answer.firstName}", "${answer.lastName}", ${role_id}`) (err, res) 
                if (err) throw err;
                // Log all results of the SELECT statement
                console.log(`${answer.firstName} ${answer.lastName}  has been added to the team!`);
            console.log("");
          })
        });
    }