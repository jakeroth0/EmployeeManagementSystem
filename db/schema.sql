-- This removes any db's that have the same name and creates a new db
DROP DATABASE IF EXISTS employeeManagement_db;
CREATE DATABASE employeeManagement_db;
-- this tells sql which db we want to USE
USE employeeManagement_db;
-- there are three tables being used for this db
-- id's for all of them use auto increment, so that we don't have to manually add that
-- primary keys are used to ensure that each of those id's are unique
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);
-- the foreign keys are used as a relational reference
-- ie - the role table's column department_id has a 
-- relationship with the department table's id column
-- the role.department_id's value is linked to department.id's value
-- aww, cute
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id)
  REFERENCES department(id)
  ON DELETE SET NULL
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  FOREIGN KEY (manager_id) REFERENCES employee(id),
  FOREIGN KEY (role_id) REFERENCES role(id)
  ON DELETE SET NULL
);