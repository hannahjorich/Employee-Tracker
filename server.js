//Dependen
const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection ({
    host: "localhost",
    port: 3306, 
    user: "root",
    password: "PSHsoccer1212!",
    database:"employee_trackerDB"
});

// connect to mysql server and database 

connection.connect((err) => {
    if (err) throw err;
    runSearchPrompt();
});

function runSearchPrompt() {
    inquirer.prompt([
        {
            type:"list",
            name: "action",
            message: "what would you like to do?",
            choices: [
                "View all employees",
                "View all employees by department",
                "View all employees by manager",
                "Add employee",
                "Add Department",
                "Add Role"
                // this is bonus 
                // "Remove employee", 
                // // "Update employee role", 
                // "Update employee manager", 
            ]
        }
    ])
}