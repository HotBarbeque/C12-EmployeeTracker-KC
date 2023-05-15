DROP DATABASE IF EXISTS employeeTracker;

CREATE DATABASE employeeTracker;

USE employeeTracker;

CREATE TABLE department (
    id INTEGER AUTO_INCREMENT PRIMARY KEY ,
    departmentName VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    departmentId INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee(
    id INTEGER AUTO_INCREMENT PRIMARY KEY ,
    firstName VARCHAR(30) NOT NULL,
    lastName VARCHAR(30) NOT NULL,
    rolesId INTEGER,
    managerId INTEGER
);