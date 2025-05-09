-- registrar usuario con la cedula 99999999 previo a ejecutar este insert
INSERT INTO Administrador VALUES ("99999999");

INSERT INTO Marca VALUES ("AMD"),("Intel"),("Cougar"),("Logitech");

INSERT INTO Productos VALUES ("R57600", 275.00, 10, "asdfnjkasndfkjnasjdk", "https://thotcomputacion.com.uy/wp-content/uploads/2023/05/r5-7.jpg","CPU AMD Ryzen 5 7600 AM5", "99999999", "AMD");
INSERT INTO Componentes VALUES ("R57600", "CPU");

INSERT INTO Productos VALUES ("R99950X", 1095.00, 4, "ASDASDF", "https://thotcomputacion.com.uy/wp-content/uploads/2025/03/6944_1_cb4a839926da46dda10fde5b92dd12b1.jpg","CPU AMD Ryzen 9 9950X3D AM5", "99999999", "AMD");
INSERT INTO Componentes VALUES ("R99950X", "CPU");


INSERT INTO Productos VALUES ("I714700K", 550.00, 5, "asdfasdf", "https://thotcomputacion.com.uy/wp-content/uploads/2023/10/22620a8e-7cf9-4721-a41d-77a8db3ea5a474112_5d1fe3f9d55a4b4d931d60506b32b733.webp","CPU Intel Core i7 14700K Raptor Lake 1700", "99999999", "Intel");
INSERT INTO Componentes VALUES ("I714700K", "CPU");

INSERT INTO Productos VALUES ("LOGG515", 177.00, 10, "asdfnjkasndfkjnasjdk", "https://thotcomputacion.com.uy/wp-content/uploads/2023/05/r5-7.jpg","Teclado Logitech G515 Lightspeed TKL Inalámbrico", "99999999", "Logitech");
INSERT INTO Componentes VALUES ("LOGG515", "TECLADOS");

INSERT INTO Productos VALUES ("COUGPOSEL240", 80.00, 3, "asdfnjkasndfkjnasjdk", "https://thotcomputacion.com.uy/wp-content/uploads/2024/08/6546_1c115d1d574fc437b89e4b9fb67fb7dc8.webp", "Watercooling Cougar Poseidon Elite 240 ARGB BK","99999999", "Cougar");
INSERT INTO Componentes VALUES ("COUGPOSEL240", "COOLING");
