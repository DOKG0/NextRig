-- 1. Insertar marcas de componentes electrónicos
INSERT INTO Marca (NombreMarca) VALUES 
('Intel'), ('AMD'), ('NVIDIA'), ('ASUS'), ('MSI'), ('Gigabyte'),
('Corsair'), ('Samsung'), ('Western Digital'), ('Seagate'),
('Crucial'), ('G.Skill'), ('Noctua'), ('Cooler Master'),
('NZXT'), ('Lian Li'), ('LG'), ('Dell'), ('Razer'), ('Logitech'),
('be quiet!'), ('Fractal Design'), ('Zotac'), ('TeamGroup'),
('Patriot'), ('Keychron'), ('SteelSeries'), ('Glorious'), ('Sabrent'),
('Kingston'), ('ASRock'), ('HyperX'), ('EVGA'), ('Thermaltake'),
('Phanteks'), ('BenQ'), ('Acer'), ('ViewSonic'), ('Sapphire'), ('XFX'),
('PowerColor'), ('Gainward'), ('Palit');

-- 2. Insertar usuario administrador --Password Hasheada -> admin
INSERT INTO Usuario (ci, nombre, username, apellido, fechanac, correo, password) VALUES 
('ADM001', 'Admin', 'admin', 'Sistema', '1985-01-15', 'admin@techstore.com', '$2y$10$Dqf.jUXINvpPXGozwyyPkOwduP.uPs8gOTE4QlYsG4r078Y0XGP5S'),
('ADM002', 'Admin2', 'admin2', 'Sistema', '2025-01-15', 'admin', '$2y$10$Dqf.jUXINvpPXGozwyyPkOwduP.uPs8gOTE4QlYsG4r078Y0XGP5S');

INSERT INTO Administrador (ci) VALUES ('ADM001');
-- 3. Insertar 50 productos electrónicos reales con IDs personalizados
INSERT INTO Productos (id, nombre, descripcion, precio, stock, imagen, admin_ci, marca_nombre) VALUES
-- CPUs (6 productos)
('I913900K', 'Intel Core i9-13900K', 'Procesador 24 núcleos (8P+16E) 5.8GHz Turbo, 36MB Cache', 589.99, 12, 'https://i.imgur.com/gAe5b95.jpg', 'ADM001', 'Intel'),
('R97950X3D', 'AMD Ryzen 9 7950X3D', '16 núcleos/32 hilos, 4.2-5.7GHz, 144MB Cache, AM5', 699.00, 8, 'https://i.imgur.com/FcOAiJm.jpg', 'ADM001', 'AMD'),
('I713700KF', 'Intel Core i7-13700KF', '16 núcleos (8P+8E) 5.4GHz Turbo, 30MB Cache, Sin gráficos', 419.99, 15, 'https://i.imgur.com/7Qs5nNV.jpg', 'ADM001', 'Intel'),
('R77800X3D', 'AMD Ryzen 7 7800X3D', '8 núcleos/16 hilos, 4.2-5.0GHz, 104MB Cache, AM5', 449.00, 10, 'https://i.imgur.com/BqZIxkR.jpg', 'ADM001', 'AMD'),
('I513600KF', 'Intel Core i5-13600KF', '14 núcleos (6P+8E) 5.1GHz Turbo, 24MB Cache, Sin gráficos', 319.99, 18, 'https://i.imgur.com/9dcq3un.jpg', 'ADM001', 'Intel'),
('R57600', 'AMD Ryzen 5 7600', '6 núcleos/12 hilos, 3.8-5.1GHz, 38MB Cache, AM5', 229.00, 20, 'https://i.imgur.com/3Q7x0Av.jpg', 'ADM001', 'AMD'),

-- Motherboards (5 productos)
('X670EASUS', 'ASUS ROG Crosshair X670E Hero', 'X670E, AM5, DDR5, PCIe 5.0, Wi-Fi 6E', 699.99, 7, 'https://i.imgur.com/WVX78XA.jpg', 'ADM001', 'ASUS'),
('Z790MSI', 'MSI MPG Z790 Carbon WiFi', 'Z790, LGA1700, DDR5, PCIe 5.0, Wi-Fi 6E', 479.99, 9, 'https://i.imgur.com/J42HogV.jpg', 'ADM001', 'MSI'),
('B650GIGA', 'Gigabyte B650 AORUS Elite AX', 'B650, AM5, DDR5, PCIe 4.0, Wi-Fi 6', 259.99, 12, 'https://i.imgur.com/WFjfMrT.jpg', 'ADM001', 'Gigabyte'),
('Z690ASROCK', 'ASRock Z690 Taichi', 'Z690, LGA1700, DDR5, PCIe 5.0, Thunderbolt 4', 349.99, 6, 'https://i.imgur.com/VpnzMxW.jpg', 'ADM001', 'ASRock'),
('B550ASUS', 'ASUS TUF Gaming B550-PLUS', 'B550, AM4, DDR4, PCIe 4.0, 2.5Gb LAN', 169.99, 15, 'https://i.imgur.com/2WvKdpU.jpg', 'ADM001', 'ASUS'),

-- Tarjetas Gráficas (6 productos)
('RTX4090NV', 'NVIDIA GeForce RTX 4090 Founders Edition', '24GB GDDR6X, 16384 CUDA Cores, PCIe 4.0', 1599.99, 4, 'https://i.imgur.com/7IKNSGo.jpg', 'ADM001', 'NVIDIA'),
('RX7900XTX', 'AMD Radeon RX 7900 XTX', '24GB GDDR6, 6144 Stream Processors, PCIe 4.0', 999.99, 6, 'https://i.imgur.com/4JIde5H.jpg', 'ADM001', 'AMD'),
('RTX4080ASUS', 'ASUS TUF Gaming RTX 4080 OC', '16GB GDDR6X, 9728 CUDA Cores, PCIe 4.0', 1199.99, 5, 'https://i.imgur.com/LG6tIkm.jpg', 'ADM001', 'ASUS'),
('RX7900XTMSI', 'MSI Radeon RX 7900 XT Gaming Trio', '20GB GDDR6, 5376 Stream Processors, PCIe 4.0', 899.99, 7, 'https://i.imgur.com/WVpXqD2.jpg', 'ADM001', 'MSI'),
('RTX4070TIGIGA', 'Gigabyte GeForce RTX 4070 Ti Gaming OC', '12GB GDDR6X, 7680 CUDA Cores, PCIe 4.0', 849.99, 8, 'https://i.imgur.com/vQXsolr.jpg', 'ADM001', 'Gigabyte'),
('RTX3060ZOTAC', 'Zotac Gaming GeForce RTX 3060 Twin Edge', '12GB GDDR6, 3584 CUDA Cores, PCIe 4.0', 329.99, 12, 'https://i.imgur.com/Pwkc6nQ.jpg', 'ADM001', 'Zotac'),
('RTX4090ASUS', 'ASUS ROG Strix RTX 4090 OC', '24GB GDDR6X, 16384 CUDA Cores, PCIe 4.0, RGB', 1799.99, 5, 'https://i.imgur.com/gGvhStA.jpg', 'ADM001', 'ASUS'),
('RTX4080MSI', 'MSI GeForce RTX 4080 Gaming X Trio', '16GB GDDR6X, 9728 CUDA Cores, PCIe 4.0, RGB', 1299.99, 6, 'https://i.imgur.com/KgCNbZ3.jpg', 'ADM001', 'MSI'),
('RX7900XTSAP', 'Sapphire Nitro+ Radeon RX 7900 XT', '20GB GDDR6, 5376 Stream Processors, PCIe 4.0', 949.99, 5, 'https://i.imgur.com/TC6Sxfs.jpg', 'ADM001', 'Sapphire'),
('RTX4070ASUS', 'ASUS Dual RTX 4070 OC', '12GB GDDR6X, 5888 CUDA Cores, PCIe 4.0', 599.99, 10, 'https://i.imgur.com/xH9wLav.jpg', 'ADM001', 'ASUS'),
('RX7800XTPOW', 'PowerColor Red Devil RX 7800 XT', '16GB GDDR6, 3840 Stream Processors, PCIe 4.0', 549.99, 8, 'https://i.imgur.com/Oky3AXZ.jpg', 'ADM001', 'PowerColor'),
('RTX4060TIGIG', 'Gigabyte RTX 4060 Ti Gaming OC', '8GB GDDR6, 4352 CUDA Cores, PCIe 4.0', 399.99, 15, 'https://i.imgur.com/0pr6kK6.jpg', 'ADM001', 'Gigabyte'),
('RX7700XTSAP', 'Sapphire Pulse RX 7700 XT', '12GB GDDR6, 3456 Stream Processors, PCIe 4.0', 449.99, 12, 'https://i.imgur.com/2FOTBtK.jpg', 'ADM001', 'Sapphire'),
('RTX3090TIAS', 'ASUS TUF RTX 3090 Ti OC', '24GB GDDR6X, 10752 CUDA Cores, PCIe 4.0', 1199.99, 3, 'https://i.imgur.com/mhiyRsP.jpg', 'ADM001', 'ASUS'),
('RX6950XTASR', 'ASRock OC Formula RX 6950 XT', '16GB GDDR6, 5120 Stream Processors, PCIe 4.0', 699.99, 4, 'https://i.imgur.com/msz9DUd.jpg', 'ADM001', 'ASRock'),
('RTX3080EVGA', 'EVGA FTW3 RTX 3080 12GB', '12GB GDDR6X, 8960 CUDA Cores, PCIe 4.0', 799.99, 5, 'https://i.imgur.com/vJgofFV.jpg', 'ADM001', 'EVGA'),
('RX6800XTRED', 'XFX Speedster MERC319 RX 6800 XT', '16GB GDDR6, 4608 Stream Processors, PCIe 4.0', 579.99, 7, 'https://i.imgur.com/hq8pmSN.jpg', 'ADM001', 'XFX'),
('RTX4070MSI', 'MSI Ventus 3X RTX 4070', '12GB GDDR6X, 5888 CUDA Cores, PCIe 4.0', 579.99, 9, 'https://i.imgur.com/8AKMVeD.jpg', 'ADM001', 'MSI'),
('RX7600XFX', 'XFX Speedster SWFT210 RX 7600', '8GB GDDR6, 2048 Stream Processors, PCIe 4.0', 269.99, 14, 'https://i.imgur.com/cYoHVuT.jpg', 'ADM001', 'XFX'),
('RTX3060TIGA', 'Gainward Ghost RTX 3060 Ti', '8GB GDDR6, 4864 CUDA Cores, PCIe 4.0', 399.99, 11, 'https://i.imgur.com/lXEEX0M.jpg', 'ADM001', 'Gainward'),
('RX6700XTPOW', 'PowerColor Fighter RX 6700 XT', '12GB GDDR6, 2560 Stream Processors, PCIe 4.0', 349.99, 8, 'https://i.imgur.com/T5CVIcY.jpg', 'ADM001', 'PowerColor'),
('RTX3050PAL', 'Palit Dual RTX 3050', '8GB GDDR6, 2560 CUDA Cores, PCIe 4.0', 249.99, 13, 'https://i.imgur.com/DqcUOxl.jpg', 'ADM001', 'Palit'),
('RX6600XTSAP', 'Sapphire Nitro+ RX 6600 XT', '8GB GDDR6, 2048 Stream Processors, PCIe 4.0', 299.99, 10, 'https://i.imgur.com/yOBhgRN.jpg', 'ADM001', 'Sapphire'),
('RTX2080TIZOT', 'Zotac Gaming RTX 2080 Ti AMP', '11GB GDDR6, 4352 CUDA Cores, PCIe 3.0', 499.99, 3, 'https://i.imgur.com/9KE14Pq.jpg', 'ADM001', 'Zotac'),

-- Almacenamiento (5 productos)
('2TBSAM990', 'Samsung 990 PRO 2TB', 'NVMe PCIe 4.0, 7450MB/s lectura, 6900MB/s escritura', 179.99, 20, 'https://i.imgur.com/KvaMW0R.jpg', 'ADM001', 'Samsung'),
('1TBWD850X', 'WD Black SN850X 1TB', 'NVMe PCIe 4.0, 7300MB/s lectura, 6300MB/s escritura', 99.99, 25, 'https://i.imgur.com/YA4WZ9E.jpg', 'ADM001', 'Western Digital'),
('2TBCRUP5', 'Crucial P5 Plus 2TB', 'NVMe PCIe 4.0, 6600MB/s lectura, 5000MB/s escritura', 149.99, 18, 'https://i.imgur.com/E8LYoUj.jpg', 'ADM001', 'Crucial'),
('1TBSEA530', 'Seagate FireCuda 530 1TB', 'NVMe PCIe 4.0, 7300MB/s lectura, 6000MB/s escritura', 129.99, 15, 'https://i.imgur.com/cANIOYh.jpg', 'ADM001', 'Seagate'),
('1TBKINGKC3', 'Kingston KC3000 1TB', 'NVMe PCIe 4.0, 7000MB/s lectura, 6000MB/s escritura', 109.99, 22, 'https://i.imgur.com/aJ1mv1N.jpg', 'ADM001', 'Kingston'),

-- Memorias RAM (5 productos)
('32GD5COR', 'Corsair Dominator Platinum RGB 32GB', 'DDR5 5600MHz, CL36, 2x16GB, Intel XMP', 249.99, 15, 'https://i.imgur.com/6kVWYgr.jpg', 'ADM001', 'Corsair'),
('32GD5GSK', 'G.Skill Trident Z5 Neo RGB 32GB', 'DDR5 6000MHz, CL30, 2x16GB, AMD EXPO', 229.99, 18, 'https://i.imgur.com/HYWNLHl.jpg', 'ADM001', 'G.Skill'),
('32GD4KING', 'Kingston Fury Renegade 32GB', 'DDR4 3600MHz, CL16, 2x16GB, Intel XMP 3.0', 129.99, 25, 'https://i.imgur.com/mOapzSB.jpg', 'ADM001', 'Kingston'),
('32GD4TEAM', 'TeamGroup T-Force Delta RGB 32GB', 'DDR4 3600MHz, CL18, 2x16GB, AMD Ryzen Optimized', 119.99, 20, 'https://i.imgur.com/ertZOqD.jpg', 'ADM001', 'TeamGroup'),
('64GD4PAT', 'Patriot Viper Steel 64GB', 'DDR4 4400MHz, CL19, 2x32GB, Performance Memory', 289.99, 8, 'https://i.imgur.com/H0loYr9.jpg', 'ADM001', 'Patriot'),

-- Cooling (5 productos)
('NOCTUAD15', 'Noctua NH-D15 chromax.black', 'Doble ventilador 140mm, 6 heatpipes, compatibilidad AM5/LGA1700', 109.99, 20, 'https://i.imgur.com/bo3NQ5P.jpg', 'ADM001', 'Noctua'),
('CORH150I', 'Corsair iCUE H150i ELITE LCD', 'AIO 360mm, Pantalla LCD, Ventiladores RGB, AM5/LGA1700', 259.99, 10, 'https://i.imgur.com/jcwNtN6.jpg', 'ADM001', 'Corsair'),
('CMH212', 'Cooler Master Hyper 212 Black Edition', 'Ventilador 120mm, 4 heatpipes, compatibilidad AM5/LGA1700', 49.99, 30, 'https://i.imgur.com/6aqLDP2.jpg', 'ADM001', 'Cooler Master'),
('NZXTZ73', 'NZXT Kraken Z73 RGB', 'AIO 360mm, Pantalla LCD, Ventiladores Aer P, AM5/LGA1700', 279.99, 8, 'https://i.imgur.com/RZ4MvXI.jpg', 'ADM001', 'NZXT'),
('BQDRP4', 'be quiet! Dark Rock Pro 4', 'Doble ventilador 135/120mm, 7 heatpipes, silencioso', 89.99, 15, 'https://i.imgur.com/cQMA3L8.jpg', 'ADM001', 'be quiet!'),

-- Gabinetes (5 productos)
('LLO11DYN', 'Lian Li PC-O11 Dynamic EVO', 'Mid Tower, Cristal Templado, E-ATX, 10 ventiladores', 179.99, 12, 'https://i.imgur.com/wJkzgtu.jpg', 'ADM001', 'Lian Li'),
('NZXTH7', 'NZXT H7 Flow', 'Mid Tower, Malla frontal, USB-C, E-ATX', 129.99, 15, 'https://i.imgur.com/AXU6C4Y.jpg', 'ADM001', 'NZXT'),
('COR5000D', 'Corsair 5000D AIRFLOW', 'Mid Tower, Malla frontal, 3 ventiladores, E-ATX', 164.99, 10, 'https://i.imgur.com/unjGXMC.jpg', 'ADM001', 'Corsair'),
('FRACTORR', 'Fractal Design Torrent', 'Full Tower, 180mm ventiladores, RGB, E-ATX', 229.99, 8, 'https://i.imgur.com/2ESCoxQ.jpg', 'ADM001', 'Fractal Design'),
('CMHAF700', 'Cooler Master HAF 700 EVO', 'Super Tower, 200mm ventiladores, E-ATX, RGB', 299.99, 5, 'https://i.imgur.com/DeKIcif.jpg', 'ADM001', 'Cooler Master'),

-- Monitores (5 productos)
('LG27GP950', 'LG UltraGear 27GP950-B', '27" 4K UHD 160Hz, Nano IPS, 1ms, G-Sync Compatible', 799.99, 7, 'https://i.imgur.com/c2vJj2j.jpg', 'ADM001', 'LG'),
('ASUSPG32UQX', 'ASUS ROG Swift PG32UQX', '32" 4K UHD 144Hz, Mini LED, HDR1400, G-Sync Ultimate', 2999.99, 3, 'https://i.imgur.com/UC5P7s9.jpg', 'ADM001', 'ASUS'),
('SAMG7', 'Samsung Odyssey G7', '27" QHD 240Hz, VA, 1ms, FreeSync Premium Pro', 599.99, 9, 'https://i.imgur.com/jFm5EBV.jpg', 'ADM001', 'Samsung'),
('DELLAW34', 'Dell Alienware AW3423DW', '34" QD-OLED 175Hz, UWQHD, 0.1ms, G-Sync Ultimate', 1299.99, 6, 'https://i.imgur.com/5IxYfqf.jpg', 'ADM001', 'Dell'),
('MSIMAG274', 'MSI Optix MAG274QRF-QD', '27" QHD 165Hz, IPS, 1ms, G-Sync Compatible', 399.99, 12, 'https://i.imgur.com/8DDSIQ1.jpg', 'ADM001', 'MSI'),

-- Teclados (4 productos)
('RAZERBW4', 'Razer BlackWidow V4 Pro', 'Mecánico, Switch Verde, RGB, Reposamuñecas magnético', 229.99, 15, 'https://i.imgur.com/PEl6DAp.jpg', 'ADM001', 'Razer'),
('LOGIG915', 'Logitech G915 TKL', 'Inalámbrico, Low Profile GL Switch, RGB, Lightspeed', 229.99, 10, 'https://i.imgur.com/DCqcEcA.jpg', 'ADM001', 'Logitech'),
('CORK100', 'Corsair K100 RGB', 'Mecánico, OPX Switch, 4000Hz Polling, Pantalla iCUE', 199.99, 8, 'https://i.imgur.com/5B8rErP.jpg', 'ADM001', 'Corsair'),
('SSAPEXPRO', 'SteelSeries Apex Pro', 'Mecánico, OmniPoint Adjustable, OLED Smart Display', 199.99, 12, 'https://i.imgur.com/vml82R4.jpg', 'ADM001', 'SteelSeries'),

-- Mouse (4 productos)
('LOGIGPX', 'Logitech G Pro X Superlight', 'Inalámbrico, 25K DPI, 63g, Lightspeed, Hero Sensor', 159.99, 18, 'https://i.imgur.com/8CnHXk9.jpg', 'ADM001', 'Logitech'),
('RAZERV2', 'Razer Viper V2 Pro', 'Inalámbrico, 30K DPI, 58g, Focus Pro 30K, HyperSpeed', 149.99, 15, 'https://i.imgur.com/ipvoqxF.jpg', 'ADM001', 'Razer'),
('SSAEROX9', 'SteelSeries Aerox 9 Wireless', 'Inalámbrico, 18K DPI, 89g, 12 botones, Quantum 2.0', 149.99, 10, 'https://i.imgur.com/b0cSqc8.jpg', 'ADM001', 'SteelSeries'),
('CORDARKC', 'Corsair Dark Core RGB Pro SE', 'Inalámbrico, 18K DPI, Qi Charging, 8 botones', 99.99, 20, 'https://i.imgur.com/y79bePQ.jpg', 'ADM001', 'Corsair');

-- 4. Actualizar las categorías de componentes con los nuevos IDs
INSERT INTO Componentes (id, categoria) VALUES
-- CPUs
('I913900K', 'CPU'), ('R97950X3D', 'CPU'), ('I713700KF', 'CPU'), 
('R77800X3D', 'CPU'), ('I513600KF', 'CPU'), ('R57600', 'CPU'),

-- Motherboards
('X670EASUS', 'MOTHERBOARD'), ('Z790MSI', 'MOTHERBOARD'), ('B650GIGA', 'MOTHERBOARD'), 
('Z690ASROCK', 'MOTHERBOARD'), ('B550ASUS', 'MOTHERBOARD'),

-- GPUs
('RTX4090NV', 'TARJETA_GRAFICA'), ('RX7900XTX', 'TARJETA_GRAFICA'), ('RTX4080ASUS', 'TARJETA_GRAFICA'),
('RX7900XTMSI', 'TARJETA_GRAFICA'), ('RTX4070TIGIGA', 'TARJETA_GRAFICA'), ('RTX3060ZOTAC', 'TARJETA_GRAFICA'),
('RTX4090ASUS', 'TARJETA_GRAFICA'), ('RTX4080MSI', 'TARJETA_GRAFICA'), ('RX7900XTSAP', 'TARJETA_GRAFICA'),
('RTX4070ASUS', 'TARJETA_GRAFICA'), ('RX7800XTPOW', 'TARJETA_GRAFICA'), ('RTX4060TIGIG', 'TARJETA_GRAFICA'),
('RX7700XTSAP', 'TARJETA_GRAFICA'), ('RTX3090TIAS', 'TARJETA_GRAFICA'), ('RX6950XTASR', 'TARJETA_GRAFICA'),
('RTX3080EVGA', 'TARJETA_GRAFICA'), ('RX6800XTRED', 'TARJETA_GRAFICA'), ('RTX4070MSI', 'TARJETA_GRAFICA'),
('RX7600XFX', 'TARJETA_GRAFICA'), ('RTX3060TIGA', 'TARJETA_GRAFICA'), ('RX6700XTPOW', 'TARJETA_GRAFICA'),
('RTX3050PAL', 'TARJETA_GRAFICA'), ('RX6600XTSAP', 'TARJETA_GRAFICA'), ('RTX2080TIZOT', 'TARJETA_GRAFICA'),

-- Almacenamiento
('2TBSAM990', 'ALMACENAMIENTO'), ('1TBWD850X', 'ALMACENAMIENTO'), ('2TBCRUP5', 'ALMACENAMIENTO'),
('1TBSEA530', 'ALMACENAMIENTO'), ('1TBKINGKC3', 'ALMACENAMIENTO'),

-- RAM
('32GD5COR', 'MEMORIAS'), ('32GD5GSK', 'MEMORIAS'), ('32GD4KING', 'MEMORIAS'),
('32GD4TEAM', 'MEMORIAS'), ('64GD4PAT', 'MEMORIAS'),

-- Cooling
('NOCTUAD15', 'COOLING'), ('CORH150I', 'COOLING'), ('CMH212', 'COOLING'),
('NZXTZ73', 'COOLING'), ('BQDRP4', 'COOLING'),

-- Gabinetes
('LLO11DYN', 'GABINETES'), ('NZXTH7', 'GABINETES'), ('COR5000D', 'GABINETES'),
('FRACTORR', 'GABINETES'), ('CMHAF700', 'GABINETES'),

-- Monitores
('LG27GP950', 'MONITORES'), ('ASUSPG32UQX', 'MONITORES'), ('SAMG7', 'MONITORES'),
('DELLAW34', 'MONITORES'), ('MSIMAG274', 'MONITORES'),

-- Teclados
('RAZERBW4', 'TECLADOS'), ('LOGIG915', 'TECLADOS'), ('CORK100', 'TECLADOS'),
('SSAPEXPRO', 'TECLADOS'),

-- Mouse
('LOGIGPX', 'MOUSE'), ('RAZERV2', 'MOUSE'), ('SSAEROX9', 'MOUSE'),
('CORDARKC', 'MOUSE');

-- 5. Insertar usuarios compradores
INSERT INTO Usuario (ci, nombre, username, apellido, fechanac, correo, password) VALUES 
('COMP001', 'Juan Pérez', 'juanperez', 'Pérez', '1990-05-15', 'juan@email.com', '123'),
('COMP002', 'María Gómez', 'mariag', 'Gómez', '1988-08-22', 'maria@email.com', '123'),
('COMP003', 'Carlos Rodríguez', 'carlosr', 'Rodríguez', '1995-03-10', 'carlos@email.com', '123');

INSERT INTO Comprador (ci, cel) VALUES 
('COMP001', '0991234567'),
('COMP002', '0987654321'),
('COMP003', '0978912345');

-- 6. Crear carritos para los compradores
INSERT INTO Carrito (costoCarrito, ci) VALUES 
(0, 'COMP001'),
(0, 'COMP002'),
(0, 'COMP003');

-- 7. Añadir productos a carritos con los nuevos IDs personalizados
INSERT INTO Carrito_Productos (idCarrito, idProducto) VALUES
(1, 'I913900K'),  -- Intel Core i9-13900K
(1, 'RX7900XTX'), -- AMD Radeon RX 7900 XTX
(1, 'B650GIGA'),  -- Gigabyte B650 AORUS Elite AX

(2, 'R77800X3D'), -- AMD Ryzen 7 7800X3D
(2, 'RTX4070TIGIGA'), -- Gigabyte RTX 4070 Ti Gaming OC
(2, '32GD5GSK'),  -- G.Skill Trident Z5 Neo RGB 32GB

(3, 'R57600'),    -- AMD Ryzen 5 7600
(3, 'RTX4080ASUS'), -- ASUS TUF Gaming RTX 4080 OC
(3, '2TBSAM990');  -- Samsung 990 PRO 2TB

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
('Excelente rendimiento para gaming', 5, 'I913900K', 'COMP001'),       
('La mejor relación calidad-precio', 4, 'RX7900XTX', 'COMP001'),      
('Matias lo rompió 🤬', 1, 'RX7900XTX', 'COMP003'),                       
('Muy rápida y silenciosa', 5, '2TBSAM990', 'COMP003'),                  
('Pantalla increíble con colores vibrantes', 5, 'DELLAW34', 'COMP002'),  
('Teclado cómodo para largas sesiones', 4, 'LOGIG915', 'COMP003'),     
('El gabinete perfecto para mi build', 5, 'LLO11DYN', 'COMP001'),      
('Memoria RAM de alto rendimiento', 5, '32GD5GSK', 'COMP002');           