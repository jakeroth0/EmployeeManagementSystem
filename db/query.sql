-- SELECT role.id AS id, role.title AS title, role.salary AS salary, department.name AS department
-- FROM role
-- JOIN department ON role.department_id = department.id;

-- SELECT first_name FROM employee;

-- SELECT employee.id AS id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name,' ', manager.last_name) AS manager
-- FROM employee
-- LEFT JOIN role ON employee.role_id = role.id
-- LEFT JOIN department ON role.department_id = department.id
-- LEFT JOIN employee manager ON employee.manager_id = manager.id;

-- UPDATE employee SET role_id = 3 WHERE employee.id = 6;

-- INSERT INTO role (title, salary, department_id) VALUES ("Gamer", 20000, 1);

-- SELECT role.id AS id, role.title AS title, role.salary AS salary, department.name AS department FROM role JOIN department ON role.department_id = department.id ORDER BY role.id ASC;