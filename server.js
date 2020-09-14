var mysql = require("mysql");
var inquirer = require("inquirer");
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
  console.log("connected as id " + connection.threadId);
  // run the start function after the connection is made to prompt the user
  runSearchPrompt();
});

// connection.query = util.promisify(connection.query);

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
          case "Update employee role":
            updateRole();
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
};

const viewByDepartment = () => {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    console.log("");
    runSearchPrompt();
  });
};

const viewByRole = () => {
  connection.query("SELECT * FROM roles", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    console.log("");
    runSearchPrompt();
  });
};

const addEmployee = () => {
  connection.query("SELECT * FROM roles", (err, res) => {
    if (err) throw err;
    return inquirer
      .prompt([
        {
          type: "input",
          name: "firstName",
          message: "Please enter employee's first name",
          validate: (answer) => {
            if (answer !== "") {
              return true;
            }
            return "No blank fields";
          },
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
          },
        },
        {
          type: "role",
          message: "What is the employee's role id number?",
          name: "roleID",
        },
        {
          type: "manager",
          message: "What is the manager id number?",
          name: "managerID",
        },
      ])
      .then(function (answer) {
        connection.query(
          "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
          [answer.firstName, answer.lastName, answer.roleID, answer.managerID],
          function (err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            console.log(
              `${answer.firstName} ${answer.lastName}  has been added to the team!`
            );
            console.log("");
            runSearchPrompt();
          }
        );
      });
  });
};

const addDepartment = () => {
  inquirer
    .prompt({
      type: "input",
      name: "departmentName",
      message: "What is the new department name?",
    })
    .then((answer) => {
      let department_name = answer.departmentName;
      connection.query(
        `INSERT into department (department_name) VALUES ("${department_name}") `,
        (err, res) => {
          if (err) throw err;
          // Log all results of the SELECT statement
          console.log(`${department_name} has been added to departments!`);
        }
      );
      console.log("");
      runSearchPrompt();
    });
};

const addRole = () => {
    // this pulls from the department 
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
 
    return inquirer
      .prompt([
        {
          type: "input",
          name: "role",
          message: "Please name this new role:",
        },
        {
          type: "input",
          name: "salary",
          message: "Please enter the salary for this role:",
        },
        {
          type: "list",
          name: "departmentId",
          message: "What department will this role be in?",
        },
      ])
      .then(function (answer) {
        connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",[answer.role, answer.salary, answer.departmentId], function (err, res) {
            if (err) throw err;
            console.log(`You have add "${answer.role}" successfully`);
            console.log("");
            runSearchPrompt();
          }
        );
      });
  });
};

const updateRole = () => {
  //pull all the employees first
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;

    //display prompt
    inquirer
      .prompt([
        {
          type: "list",
          name: "name",
          message: "Whose role are you updating?",
          choices: () => {
            let employeeArray = [];
            //push employees into an array 
            for (let i = 0; i < res.length; i++) {
              employeeArray.push(res[i].first_name + " " + res[i].last_name);
            }
            return employeeArray;
          },
        },
      ])
      // handle answer
      .then((answer) => {
        //split the name up for first and last 
        let fullName = answer.name;
        console.log(fullName);
        let splitName = fullName.split(" ");

        connection.query("SELECT * FROM roles", (err, res) => {
          inquirer
            .prompt([
              {
                type: "list",
                name: "role",
                message: "What role would you like to assign?",
                choices: () => {
                  let roleArray = [];
                  for (let i = 0; i < res.length; i++) {
                    roleArray.push(res[i].title + " | " + res[i].id);
                  }
                  console.log();
                  return roleArray;
                },
              },
            ])
            .then((choice) => {
                // this splits the employee and updated assigned role 
              let roleID = choice.role.split("|")[1];
              connection.query(
                `UPDATE employee SET role_id = "${roleID}" WHERE first_name = "${splitName[0]}" and last_name = "${splitName[1]}"`,

                (err) => {
                  if (err) throw err;
                  console.log("added successfully");
                  // RETURN TO START
                  console.log("");
                  runSearchPrompt();
                }
              );
            });
        });
      });
  });
};
