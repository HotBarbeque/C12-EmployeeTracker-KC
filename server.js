// Required dependencies
const server = require("./config/connection");
const figlet = require("figlet");
const inquirer = require("inquirer");
const conTable = require("console.table");

// Establishes the connection to the server
server.connect((error) => {
    if (error) throw error;
    console.log(
    `====================================================================================`
    );
    console.log(``);
    console.log(figlet.textSync("Employee Tracker"));
    console.log(``);
    console.log(``);

    console.log(
    `====================================================================================`
    );
    promptUser();
});
