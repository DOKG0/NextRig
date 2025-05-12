-- 1. Insertar marcas de componentes electrónicos
INSERT INTO Marca (NombreMarca) VALUES 
('Intel'), ('AMD'), ('NVIDIA'), ('ASUS'), ('MSI'), ('Gigabyte'),
('Corsair'), ('Samsung'), ('Western Digital'), ('Seagate'),
('Crucial'), ('G.Skill'), ('Noctua'), ('Cooler Master'),
('NZXT'), ('Lian Li'), ('LG'), ('Dell'), ('Razer'), ('Logitech'),
('be quiet!'), ('Fractal Design'), ('Zotac'), ('TeamGroup'),
('Patriot'), ('Keychron'), ('SteelSeries'), ('Glorious'), ('Sabrent'),
('Kingston'), ('ASRock'), ('HyperX'), ('EVGA'), ('Thermaltake'),
('Phanteks'), ('BenQ'), ('Acer'), ('ViewSonic'), ('Sapphire'), ('XFX');

-- 2. Insertar usuario administrador
INSERT INTO Usuario (ci, nombre, username, apellido, fechanac, correo, password) VALUES 
('ADM001', 'Admin', 'admin', 'Sistema', '1985-01-15', 'admin@techstore.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

INSERT INTO Administrador (ci) VALUES ('ADM001');

-- 3. Insertar 50 productos electrónicos reales
INSERT INTO Productos (id, nombre, descripcion, precio, stock, imagen, admin_ci, marca_nombre) VALUES
-- CPUs (6 productos)
('CPU001', 'Intel Core i9-13900K', 'Procesador 24 núcleos (8P+16E) 5.8GHz Turbo, 36MB Cache', 589.99, 12, 'https://m.media-amazon.com/images/I/61lYIKJMKmL._AC_SL1500_.jpg', 'ADM001', 'Intel'),
('CPU002', 'AMD Ryzen 9 7950X3D', '16 núcleos/32 hilos, 4.2-5.7GHz, 144MB Cache, AM5', 699.00, 8, 'https://m.media-amazon.com/images/I/61D9W+JNtBL._AC_SL1500_.jpg', 'ADM001', 'AMD'),
('CPU003', 'Intel Core i7-13700KF', '16 núcleos (8P+8E) 5.4GHz Turbo, 30MB Cache, Sin gráficos', 419.99, 15, 'https://m.media-amazon.com/images/I/61UxfXTUyvL._AC_SL1500_.jpg', 'ADM001', 'Intel'),
('CPU004', 'AMD Ryzen 7 7800X3D', '8 núcleos/16 hilos, 4.2-5.0GHz, 104MB Cache, AM5', 449.00, 10, 'https://m.media-amazon.com/images/I/61kY9rYdTQL._AC_SL1500_.jpg', 'ADM001', 'AMD'),
('CPU005', 'Intel Core i5-13600KF', '14 núcleos (6P+8E) 5.1GHz Turbo, 24MB Cache, Sin gráficos', 319.99, 18, 'https://m.media-amazon.com/images/I/61UxfXTUyvL._AC_SL1500_.jpg', 'ADM001', 'Intel'),
('CPU006', 'AMD Ryzen 5 7600', '6 núcleos/12 hilos, 3.8-5.1GHz, 38MB Cache, AM5', 229.00, 20, 'https://m.media-amazon.com/images/I/61aJ8jQYrBL._AC_SL1500_.jpg', 'ADM001', 'AMD'),

-- Motherboards (5 productos)
('MB001', 'ASUS ROG Crosshair X670E Hero', 'X670E, AM5, DDR5, PCIe 5.0, Wi-Fi 6E', 699.99, 7, 'https://m.media-amazon.com/images/I/91s0S5vWEJL._AC_SL1500_.jpg', 'ADM001', 'ASUS'),
('MB002', 'MSI MPG Z790 Carbon WiFi', 'Z790, LGA1700, DDR5, PCIe 5.0, Wi-Fi 6E', 479.99, 9, 'https://m.media-amazon.com/images/I/91V1+XJrpQL._AC_SL1500_.jpg', 'ADM001', 'MSI'),
('MB003', 'Gigabyte B650 AORUS Elite AX', 'B650, AM5, DDR5, PCIe 4.0, Wi-Fi 6', 259.99, 12, 'https://m.media-amazon.com/images/I/91YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'Gigabyte'),
('MB004', 'ASRock Z690 Taichi', 'Z690, LGA1700, DDR5, PCIe 5.0, Thunderbolt 4', 349.99, 6, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'ASRock'),
('MB005', 'ASUS TUF Gaming B550-PLUS', 'B550, AM4, DDR4, PCIe 4.0, 2.5Gb LAN', 169.99, 15, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'ASUS'),

-- Tarjetas Gráficas (6 productos)
('GPU001', 'NVIDIA GeForce RTX 4090 Founders Edition', '24GB GDDR6X, 16384 CUDA Cores, PCIe 4.0', 1599.99, 4, 'https://m.media-amazon.com/images/I/71Q4+2zT0VL._AC_SL1500_.jpg', 'ADM001', 'NVIDIA'),
('GPU002', 'AMD Radeon RX 7900 XTX', '24GB GDDR6, 6144 Stream Processors, PCIe 4.0', 999.99, 6, 'https://m.media-amazon.com/images/I/71qU2g+Jw5L._AC_SL1500_.jpg', 'ADM001', 'AMD'),
('GPU003', 'ASUS TUF Gaming RTX 4080 OC', '16GB GDDR6X, 9728 CUDA Cores, PCIe 4.0', 1199.99, 5, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'ASUS'),
('GPU004', 'MSI Radeon RX 7900 XT Gaming Trio', '20GB GDDR6, 5376 Stream Processors, PCIe 4.0', 899.99, 7, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'MSI'),
('GPU005', 'Gigabyte GeForce RTX 4070 Ti Gaming OC', '12GB GDDR6X, 7680 CUDA Cores, PCIe 4.0', 849.99, 8, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'Gigabyte'),
('GPU006', 'Zotac Gaming GeForce RTX 3060 Twin Edge', '12GB GDDR6, 3584 CUDA Cores, PCIe 4.0', 329.99, 12, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'Zotac'),

-- Almacenamiento (5 productos)
('SSD001', 'Samsung 990 PRO 2TB', 'NVMe PCIe 4.0, 7450MB/s lectura, 6900MB/s escritura', 179.99, 20, 'https://m.media-amazon.com/images/I/71gD8WdSlaL._AC_SL1500_.jpg', 'ADM001', 'Samsung'),
('SSD002', 'WD Black SN850X 1TB', 'NVMe PCIe 4.0, 7300MB/s lectura, 6300MB/s escritura', 99.99, 25, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'Western Digital'),
('SSD003', 'Crucial P5 Plus 2TB', 'NVMe PCIe 4.0, 6600MB/s lectura, 5000MB/s escritura', 149.99, 18, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'Crucial'),
('SSD004', 'Seagate FireCuda 530 1TB', 'NVMe PCIe 4.0, 7300MB/s lectura, 6000MB/s escritura', 129.99, 15, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'Seagate'),
('SSD005', 'Kingston KC3000 1TB', 'NVMe PCIe 4.0, 7000MB/s lectura, 6000MB/s escritura', 109.99, 22, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'Kingston'),

-- Memorias RAM (5 productos)
('RAM001', 'Corsair Dominator Platinum RGB 32GB', 'DDR5 5600MHz, CL36, 2x16GB, Intel XMP', 249.99, 15, 'https://m.media-amazon.com/images/I/61kqcB2fQVL._AC_SL1500_.jpg', 'ADM001', 'Corsair'),
('RAM002', 'G.Skill Trident Z5 Neo RGB 32GB', 'DDR5 6000MHz, CL30, 2x16GB, AMD EXPO', 229.99, 18, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'G.Skill'),
('RAM003', 'Kingston Fury Renegade 32GB', 'DDR4 3600MHz, CL16, 2x16GB, Intel XMP 3.0', 129.99, 25, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'Kingston'),
('RAM004', 'TeamGroup T-Force Delta RGB 32GB', 'DDR4 3600MHz, CL18, 2x16GB, AMD Ryzen Optimized', 119.99, 20, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'TeamGroup'),
('RAM005', 'Patriot Viper Steel 64GB', 'DDR4 4400MHz, CL19, 2x32GB, Performance Memory', 289.99, 8, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'Patriot'),

-- Cooling (5 productos)
('COOL001', 'Noctua NH-D15 chromax.black', 'Doble ventilador 140mm, 6 heatpipes, compatibilidad AM5/LGA1700', 109.99, 20, 'https://m.media-amazon.com/images/I/71UxN+Z1FLL._AC_SL1500_.jpg', 'ADM001', 'Noctua'),
('COOL002', 'Corsair iCUE H150i ELITE LCD', 'AIO 360mm, Pantalla LCD, Ventiladores RGB, AM5/LGA1700', 259.99, 10, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'Corsair'),
('COOL003', 'Cooler Master Hyper 212 Black Edition', 'Ventilador 120mm, 4 heatpipes, compatibilidad AM5/LGA1700', 49.99, 30, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'Cooler Master'),
('COOL004', 'NZXT Kraken Z73 RGB', 'AIO 360mm, Pantalla LCD, Ventiladores Aer P, AM5/LGA1700', 279.99, 8, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'NZXT'),
('COOL005', 'be quiet! Dark Rock Pro 4', 'Doble ventilador 135/120mm, 7 heatpipes, silencioso', 89.99, 15, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'be quiet!'),

-- Gabinetes (5 productos)
('CASE001', 'Lian Li PC-O11 Dynamic EVO', 'Mid Tower, Cristal Templado, E-ATX, 10 ventiladores', 179.99, 12, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'Lian Li'),
('CASE002', 'NZXT H7 Flow', 'Mid Tower, Malla frontal, USB-C, E-ATX', 129.99, 15, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'NZXT'),
('CASE003', 'Corsair 5000D AIRFLOW', 'Mid Tower, Malla frontal, 3 ventiladores, E-ATX', 164.99, 10, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'Corsair'),
('CASE004', 'Fractal Design Torrent', 'Full Tower, 180mm ventiladores, RGB, E-ATX', 229.99, 8, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'Fractal Design'),
('CASE005', 'Cooler Master HAF 700 EVO', 'Super Tower, 200mm ventiladores, E-ATX, RGB', 299.99, 5, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'Cooler Master'),

-- Monitores (5 productos)
('MON001', 'LG UltraGear 27GP950-B', '27" 4K UHD 160Hz, Nano IPS, 1ms, G-Sync Compatible', 799.99, 7, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'LG'),
('MON002', 'ASUS ROG Swift PG32UQX', '32" 4K UHD 144Hz, Mini LED, HDR1400, G-Sync Ultimate', 2999.99, 3, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'ASUS'),
('MON003', 'Samsung Odyssey G7', '27" QHD 240Hz, VA, 1ms, FreeSync Premium Pro', 599.99, 9, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'Samsung'),
('MON004', 'Dell Alienware AW3423DW', '34" QD-OLED 175Hz, UWQHD, 0.1ms, G-Sync Ultimate', 1299.99, 6, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'Dell'),
('MON005', 'MSI Optix MAG274QRF-QD', '27" QHD 165Hz, IPS, 1ms, G-Sync Compatible', 399.99, 12, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'MSI'),

-- Teclados (4 productos)
('KB001', 'Razer BlackWidow V4 Pro', 'Mecánico, Switch Verde, RGB, Reposamuñecas magnético', 229.99, 15, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'Razer'),
('KB002', 'Logitech G915 TKL', 'Inalámbrico, Low Profile GL Switch, RGB, Lightspeed', 229.99, 10, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'Logitech'),
('KB003', 'Corsair K100 RGB', 'Mecánico, OPX Switch, 4000Hz Polling, Pantalla iCUE', 199.99, 8, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'Corsair'),
('KB004', 'SteelSeries Apex Pro', 'Mecánico, OmniPoint Adjustable, OLED Smart Display', 199.99, 12, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'SteelSeries'),

-- Mouse (4 productos)
('MOU001', 'Logitech G Pro X Superlight', 'Inalámbrico, 25K DPI, 63g, Lightspeed, Hero Sensor', 159.99, 18, 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL1500_.jpg', 'ADM001', 'Logitech'),
('MOU002', 'Razer Viper V2 Pro', 'Inalámbrico, 30K DPI, 58g, Focus Pro 30K, HyperSpeed', 149.99, 15, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'Razer'),
('MOU003', 'SteelSeries Aerox 9 Wireless', 'Inalámbrico, 18K DPI, 89g, 12 botones, Quantum 2.0', 149.99, 10, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'SteelSeries'),
('MOU004', 'Corsair Dark Core RGB Pro SE', 'Inalámbrico, 18K DPI, Qi Charging, 8 botones', 99.99, 20, 'https://m.media-amazon.com/images/I/71YHjVXy-TL._AC_SL1500_.jpg', 'ADM001', 'Corsair');

-- 4. Insertar categorías de componentes
INSERT INTO Componentes (id, categoria) VALUES
-- CPUs
('CPU001', 'CPU'), ('CPU002', 'CPU'), ('CPU003', 'CPU'), ('CPU004', 'CPU'), ('CPU005', 'CPU'), ('CPU006', 'CPU'),

-- Motherboards
('MB001', 'MOTHERBOARD'), ('MB002', 'MOTHERBOARD'), ('MB003', 'MOTHERBOARD'), 
('MB004', 'MOTHERBOARD'), ('MB005', 'MOTHERBOARD'),

-- GPUs
('GPU001', 'TARJETA_GRAFICA'), ('GPU002', 'TARJETA_GRAFICA'), ('GPU003', 'TARJETA_GRAFICA'),
('GPU004', 'TARJETA_GRAFICA'), ('GPU005', 'TARJETA_GRAFICA'), ('GPU006', 'TARJETA_GRAFICA'),

-- Almacenamiento
('SSD001', 'ALMACENAMIENTO'), ('SSD002', 'ALMACENAMIENTO'), ('SSD003', 'ALMACENAMIENTO'),
('SSD004', 'ALMACENAMIENTO'), ('SSD005', 'ALMACENAMIENTO'),

-- RAM
('RAM001', 'MEMORIAS'), ('RAM002', 'MEMORIAS'), ('RAM003', 'MEMORIAS'),
('RAM004', 'MEMORIAS'), ('RAM005', 'MEMORIAS'),

-- Cooling
('COOL001', 'COOLING'), ('COOL002', 'COOLING'), ('COOL003', 'COOLING'),
('COOL004', 'COOLING'), ('COOL005', 'COOLING'),

-- Gabinetes
('CASE001', 'GABINETES'), ('CASE002', 'GABINETES'), ('CASE003', 'GABINETES'),
('CASE004', 'GABINETES'), ('CASE005', 'GABINETES'),

-- Monitores
('MON001', 'MONITORES'), ('MON002', 'MONITORES'), ('MON003', 'MONITORES'),
('MON004', 'MONITORES'), ('MON005', 'MONITORES'),

-- Teclados
('KB001', 'TECLADOS'), ('KB002', 'TECLADOS'), ('KB003', 'TECLADOS'),
('KB004', 'TECLADOS'),

-- Mouse
('MOU001', 'MOUSE'), ('MOU002', 'MOUSE'), ('MOU003', 'MOUSE'),
('MOU004', 'MOUSE');

-- 5. Insertar usuarios compradores
INSERT INTO Usuario (ci, nombre, username, apellido, fechanac, correo, password) VALUES 
('COMP001', 'Juan Pérez', 'juanperez', 'Pérez', '1990-05-15', 'juan@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('COMP002', 'María Gómez', 'mariag', 'Gómez', '1988-08-22', 'maria@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('COMP003', 'Carlos Rodríguez', 'carlosr', 'Rodríguez', '1995-03-10', 'carlos@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

INSERT INTO Comprador (ci, cel) VALUES 
('COMP001', '0991234567'),
('COMP002', '0987654321'),
('COMP003', '0978912345');

-- 6. Crear carritos para los compradores
INSERT INTO Carrito (costoCarrito, ci) VALUES 
(0, 'COMP001'),
(0, 'COMP002'),
(0, 'COMP003');

-- 7. Añadir productos a carritos
INSERT INTO Carrito_Productos (idCarrito, idProducto) VALUES
(1, 'CPU001'), (1, 'GPU002'), (1, 'MB003'),
(2, 'CPU004'), (2, 'GPU005'), (2, 'RAM002'),
(3, 'CPU006'), (3, 'GPU003'), (3, 'SSD001');

-- Actualizar costos de carritos
UPDATE Carrito SET costoCarrito = (
  SELECT SUM(precio) FROM Productos 
  JOIN Carrito_Productos ON Productos.id = Carrito_Productos.idProducto
  WHERE Carrito_Productos.idCarrito = Carrito.idCarrito
);

-- 8. Crear compras de ejemplo
INSERT INTO Compra (fechaCompra, costoCarrito, depto, direccion, ci) VALUES
('2023-06-15', 1899.98, 'Montevideo', 'Av. 18 de Julio 1234', 'COMP001'),
('2023-06-20', 1349.98, 'Canelones', 'Ruta 101 km 25', 'COMP002'),
('2023-06-25', 1279.97, 'Maldonado', 'Piriapolis 567', 'COMP003');

-- 9. Añadir reseñas de productos
INSERT INTO Resena (mensaje, puntaje, idProducto, ciComprador) VALUES
('Excelente rendimiento para gaming', 5, 'CPU001', 'COMP001'),
('La mejor relación calidad-precio', 4, 'GPU002', 'COMP001'),
('Muy rápida y silenciosa', 5, 'SSD001', 'COMP003'),
('Pantalla increíble con colores vibrantes', 5, 'MON004', 'COMP002'),
('Teclado cómodo para largas sesiones', 4, 'KB002', 'COMP003'),
('El gabinete perfecto para mi build', 5, 'CASE001', 'COMP001'),
('Memoria RAM de alto rendimiento', 5, 'RAM002', 'COMP002');