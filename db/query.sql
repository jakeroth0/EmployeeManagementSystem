-- SELECT role.id AS id, role.title AS title, role.salary AS salary, department.name AS department
-- FROM role
-- JOIN department ON role.department_id = department.id;

-- SELECT first_name FROM employee;

-- SELECT employee.id AS id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name,' ', manager.last_name) AS manager
-- FROM department
-- INNER JOIN role ON role.id = department.id
-- LEFT JOIN employee ON employee.id = role.id
-- LEFT JOIN employee manager ON employee.manager_id = manager.id;