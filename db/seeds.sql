INSERT INTO department (department_name) VALUES ("accounting"), ("sales"), ("marketing");

INSERT INTO roles (id, title, salary, department_id) VALUES (1, "Account", 50000.00, 1), (2, "Saleman", 38000.00, 2), (3, "Marketing Manager", 60000.00, 3); 

INSERT INTO employee (id, first_name, last_name, role_id) VALUES (1, "Paul", "Smith", 1), (2, "Mary", "Lee", 2), (3, "Jamie", "Kingston", 3);