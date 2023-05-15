// required dependencies
const mysql = require('mysql2');
require('dotenv').config();

// Creates the connection to DB.
const server = mysql.createConnection({
    user: process.env.user,
    password: process.env.pass,
    database: process.env.db,
    host: 'localhost',
    port: 3306,
});

//Exports server
module.exports = server;