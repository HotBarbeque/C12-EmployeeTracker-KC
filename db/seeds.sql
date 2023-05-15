INSERT INTO department(departmentName)
VALUES("Engineering"), ("Sales"), ("Finance"), ("Legal"), ("Marketing");

INSERT INTO roles(title, salary, departmentId)
VALUES("Engineer", 90000, 1), ("Senior Engineer", 120000, 1), ("CFO", 45000, 3), ("Manager", 150000, 4), ("Sales Manager", 90000, 2);

INSERT INTO employee(firstName, lastName, rolesId, managerId)
VALUES ('Mike', 'Chan', 1, 2), ('Sarah', 'Lourd', 1, null), ('Malia', 'Brown', 1, 2), ('Ashley', 'Rodriguez', 4, 4);

show tables;
select * from department, roles, employee;