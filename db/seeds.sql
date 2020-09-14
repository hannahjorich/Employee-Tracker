INSERT INTO department (department_name) VALUES ("accounting"), ("sales"), ("marketing");

INSERT INTO roles (title, salary, department_id) VALUES ("Account", 50000, 1), ("Saleman", 38000, 2), ("Marketing Manager", 60000, 3); 

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Paul", "Smith", 1, NULL), ("Mary", "Lee", 2, 1), ("Jamie", "Kingston", 3, 1);