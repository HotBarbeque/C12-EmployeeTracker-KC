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

// Prompts the choices
const promptUser = () => {
    inquirer
    .prompt([
        {
        name: "choices",
        type: "list",
        message: "Please select an option:",
        choices: [
            "View All Employees",
            "View All Employees by Manager",
            "View All Employees by Department",
            "View All Roles",
            "View All Departments",
            "View a Department's Budget",
            "Add Employee",
            "Add Role",
            "Add Department",
            "Update Employee Role",
            "Update Employee Manager",
            "Exit",
        ],
        },
    ])

    //Once a choice is selected, this initiates the associated function
    .then((answers) => {
        const { choices } = answers;

        if (choices === "View All Departments") {
        viewAllDepartments();
        }

        if (choices === "View All Employees") {
        viewAllEmployees();
        }

        if (choices === "View All Employees by Manager") {
            viewEmployeesByManager();
        }

        if (choices === "View All Employees by Department") {
            viewEmployeesByDepartment();
        }

        if (choices === "View All Roles") {
        viewAllRoles();
        }

        if (choices === "Add Department") {
        addDepartment();
        }

        if (choices === "View a Department's Budget") {
            departmentBudget();
        }
        

        if (choices === "Add Role") {
        addRole();
        }

        if (choices === "Add Employee") {
        addEmployee();
        }

        if (choices === "Update Employee Role") {
        updateEmployeeRole();
        }

        if (choices === "Update Employee Manager") {
            updateEmployeeManager();
            }

        if (choices === "Exit") {
        server.end();
        }
    });
};

// View all employees function
const viewAllEmployees = () => {
    const sql = `
        SELECT employee.id,
        employee.firstName,
        employee.lastName,
        roles.title,
        department.departmentName,
        roles.salary,
        CONCAT(manager.firstName, ' ', manager.lastName) AS managerName
        FROM employee
        INNER JOIN roles ON roles.id = employee.rolesId
        INNER JOIN department ON department.id = roles.departmentId
        LEFT JOIN employee AS manager ON employee.managerId = manager.id
        ORDER BY employee.id ASC`;

    server.query(sql, (error, res) => {
        console.log("error", error);
        if (error) throw error;
        console.log("=======================================================");
        console.log(`                    All Employees`);
        console.log("=======================================================");
        console.table(res);
        console.log("=======================================================");
        promptUser();
    });
};

// View employees by manager function
const viewEmployeesByManager = () => {
    const sql = `
        SELECT
        CONCAT(manager.firstName, ' ', manager.lastName) AS managerName,
        employee.id,
        employee.firstName,
        employee.lastName,
        roles.title,
        department.departmentName,
        roles.salary
        FROM
        employee
        INNER JOIN roles ON roles.id = employee.rolesId
        INNER JOIN department ON department.id = roles.departmentId
        LEFT JOIN employee AS manager ON employee.managerId = manager.id
        ORDER BY
        managerName ASC, employee.id ASC`;

    server.query(sql, (error, res) => {
        if (error) throw error;
        console.log("=======================================================");
        console.log(`             Employees Grouped by Manager`);
        console.log("=======================================================");
        console.table(res);
        console.log("=======================================================");
        promptUser();
    });
};

//View employees by department function
const viewEmployeesByDepartment = () => {
    const sql = `
        SELECT department.departmentName AS Department,
        employee.id,
        employee.firstName,
        employee.lastName,
        roles.title,
        roles.salary,
        CONCAT(manager.firstName, ' ', manager.lastName) AS managerName
        FROM employee
        INNER JOIN roles ON roles.id = employee.rolesId
        INNER JOIN department ON department.id = roles.departmentId
        LEFT JOIN employee AS manager ON employee.managerId = manager.id
        ORDER BY department.departmentName ASC, employee.id ASC`;

    server.query(sql, (error, res) => {
        if (error) throw error;
        console.log("=======================================================");
        console.log(`          Employees Grouped by Department`);
        console.log("=======================================================");
        console.table(res);
        console.log("=======================================================");
        promptUser();
    });
};

//View all roles function
const viewAllRoles = () => {
    const sql = `
    SELECT roles.id,
    roles.title,
    roles.salary,
    department.departmentName AS department
    FROM roles
    LEFT JOIN department ON roles.departmentId = department.id
    `;

    server.query(sql, (error, res) => {
        if (error) throw error;
        console.log("=======================================================");
        console.log(`                    Employee Roles`);
        console.log("=======================================================");
        console.table(res);
    console.log("=======================================================");
    });
    promptUser();
};

//View all departments function
const viewAllDepartments = () => {
    const sql = `
    SELECT department.id, 
    department.departmentName AS Department
    FROM department
    `;

    server.query(sql, (error, res) => {
        if (error) throw error;
        console.log("=======================================================");
        console.log(`                    Departments`);
        console.log("=======================================================");
        console.table(res);
        console.log("=======================================================");
    });
    promptUser();
};

//View a department's budget function
const departmentBudget = () => {
    const sql = `
        SELECT department.departmentName AS Department, SUM(roles.salary) AS CombinedSalaries
        FROM employee
        INNER JOIN roles ON roles.id = employee.rolesId
        INNER JOIN department ON department.id = roles.departmentId
        GROUP BY department.departmentName`;

    server.query(sql, (error, res) => {
        if (error) throw error;
        console.log("=======================================================");
        console.log(`          Salary Budget by Department`);
        console.log("=======================================================");
        console.table(res);
        console.log("=======================================================");
        promptUser();
    });
};

//Add an employee function
const addEmployee = () => {
  const rolesSql = `SELECT * FROM roles`;
  const managerSql = `SELECT * FROM employee`;

    inquirer
    .prompt([
        {
        type: "input",
        name: "firstName",
        message: "Please enter the employees first name.",
        validate: (firstName) => {
            if (firstName) {
                return true;
            } else {
                console.log("Please enter the employees first name.");
                return false;
            }
        },
        },
        {
        type: "input",
        name: "lastName",
        message: "Please enter the employees last name.",
        validate: (lastName) => {
            if (lastName) {
            return true;
            } else {
                console.log("Please enter the employees last name.");
                return false;
            }
        },
        },
    ])
    .then((answer) => {
        const input = [answer.firstName, answer.lastName];
        server.query(rolesSql, (err, res) => {
        if (err) throw err;
        const roleList = res.map(({ title, id }) => ({
            name: title,
            value: id,
        }));
        inquirer
            .prompt([
            {
                type: "list",
                name: "role",
                message: "What is the employee's role?",
                choices: roleList,
            },
            ])
            .then((roleAnswer) => {
                input.push(roleAnswer.role);
                server.query(managerSql, (err, res) => {
                if (err) throw err;
                const managerList = res.map(({ id, firstName, lastName }) => ({
                    name: firstName + " " + lastName,
                    value: id,
                }));
                inquirer
                .prompt([
                    {
                    type: "list",
                    name: "manager",
                    message: "Who is the employee's manager?",
                    choices: managerList,
                    },
                ])
                .then((managerAnswer) => {
                    input.push(managerAnswer.manager);
                    const employeeSql = `INSERT INTO employee (firstName, lastName, rolesId, managerId)
                VALUES ('${input[0]}', '${input[1]}', '${input[2]}','${input[3]}')`;

                    server.query(employeeSql, input, (err) => {
                    if (err) throw err;
                    viewAllEmployees();
                    });
                });
            });
            });
        });
    });
};

addRole = () => {
    const isNum = /^\d+$/;
    const hasNumber = /\d/;
    inquirer
    .prompt([
        {
        type: "input",
        name: "role",
        message: "What Role would you like to add?",
        validate: (role) => {
            if (!hasNumber.test(role)) {
            return true;
            } else {
            console.log("Please enter the new Role.");
            return false;
            }
        },
        },
        {
        type: "input",
        name: "salary",
        message: "What is the salary?",
        validate: (salary) => {
            if (isNum.test(salary)) {
            return true;
            } else {
            console.log("input $");
            return false;
            }
        },
        },
    ])
    .then((answers) => {
        server.query(
        `INSERT INTO roles (title, salary, departmentId)
                VALUES ('${answers.role}', '${answers.salary}', '1')`,
        (err) => {
            if (err) throw err;
            promptUser();
        }
        );
    });
};

const addDepartment = () => {
    const hasNumber = /\d/;
    inquirer
        .prompt([
        {
        name: "newDepartment",
        type: "input",
        message: "What is the name of the new Department?",
        validate: (department) => {
            if (!hasNumber.test(department)) {
                return true;
            } else {
                console.log("Please enter the new Department.");
                return false;
            }
        },
        },
    ])
    .then((answer) => {
        server.query(
        `INSERT INTO department (departmentName)
                VALUES ('${answer.newDepartment}')`,
        (err) => {
            if (err) throw err;
            viewAllDepartments();
        }
        );
    });
};

const updateEmployeeRole = () => {
    const employeesSql = "SELECT * FROM employee";
    const rolesSql = "SELECT * FROM roles";

    server.query(employeesSql, (err, employees) => {
        if (err) throw err;

        const employeeList = employees.map(({ id, firstName, lastName }) => ({
            name: `${firstName} ${lastName}`,
            value: id,
        }));

        server.query(rolesSql, (err, roles) => {
            if (err) throw err;

            const roleList = roles.map(({ id, title }) => ({
                name: title,
                value: id,
            }));

            inquirer
            .prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Select the employee to update their role:",
                    choices: employeeList,
                },
                {
                    type: "list",
                    name: "roleId",
                    message: "Select the new role for the employee:",
                    choices: roleList,
                },
            ])
            .then((answers) => {
                const { employeeId, roleId } = answers;
                const updateSql = `UPDATE employee SET rolesId = ${roleId} WHERE id = ${employeeId}`;
                server.query(updateSql, (err) => {
                    if (err) throw err;
                    console.log("Employee role updated successfully!");
                    promptUser();
                });
            });
        });
    });
};

const updateEmployeeManager = () => {
    const employeesSql = "SELECT * FROM employee";

    server.query(employeesSql, (err, employees) => {
        if (err) throw err;

        const employeeList = employees.map(({ id, firstName, lastName }) => ({
            name: `${firstName} ${lastName}`,
            value: id,
        }));

        inquirer
            .prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Select the employee to update their manager:",
                    choices: employeeList,
                },
                {
                    type: "list",
                    name: "managerId",
                    message: "Select the new manager for the employee:",
                    choices: employeeList,
                },
            ])
            .then((answers) => {
                const { employeeId, managerId } = answers;
                const updateSql = `UPDATE employee SET managerId = ${managerId} WHERE id = ${employeeId}`;
                server.query(updateSql, (err) => {
                    if (err) throw err;
                    console.log("Employee manager updated successfully!");
                    promptUser();
                });
            });
    });
};
