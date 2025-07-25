
CREATE TABLE `Usuario` (
  `ci` VARCHAR(50) NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `username` VARCHAR(100) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `fechanac` DATE NOT NULL,
  `correo` VARCHAR(100) NOT NULL,
  `imagen` VARCHAR(255) DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  `estado` BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (`ci`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `Administrador` (
  `ci` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`ci`),
  CONSTRAINT `fk_administrador_usuario` FOREIGN KEY (`ci`) REFERENCES `Usuario` (`ci`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE TABLE `Compra` (
  `IDcompra` INT AUTO_INCREMENT,
  `fechaCompra` DATE NOT NULL,
  `costoCarrito` DECIMAL(10, 2) NOT NULL,
  `depto` VARCHAR(100) NOT NULL,
  `direccion` VARCHAR(255) NOT NULL,
  `ci` VARCHAR(50) NOT NULL,
  `telefono` VARCHAR(15) NOT NULL,
  PRIMARY KEY (`IDcompra`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `Carrito` (
  `idCarrito` INT AUTO_INCREMENT,
  `costoCarrito` DECIMAL(10, 2) NOT NULL,
  `cupon` DECIMAL(10, 2) DEFAULT NULL,
  `ci` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`idCarrito`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Marca` (
  `NombreMarca` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`NombreMarca`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `Productos` (
  `id` VARCHAR(50) NOT NULL,
  `precio` DECIMAL(10, 2) NOT NULL,
  `stock` INT NOT NULL,
  `descripcion` VARCHAR(255) NOT NULL,
  `imagen` VARCHAR(255) DEFAULT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `admin_ci` VARCHAR(50) NOT NULL,
  `marca_nombre` VARCHAR(50) DEFAULT NULL,
  `habilitado` BIT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_productos_administrador` FOREIGN KEY (`admin_ci`) REFERENCES `Administrador` (`ci`) ON DELETE CASCADE,
  CONSTRAINT `fk_productos_marca` FOREIGN KEY (`marca_nombre`) REFERENCES `Marca` (`NombreMarca`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



CREATE TABLE `Componentes` (
  `id` VARCHAR(50) NOT NULL,
  `categoria` ENUM(
    'CPU',
    'MOTHERBOARD', 
    'TARJETA_GRAFICA', 
    'ALMACENAMIENTO', 
    'MEMORIAS', 
    'COOLING', 
    'GABINETES', 
    'MONITORES',  
    'TECLADOS', 
    'MOUSE') NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_componentes_productos` FOREIGN KEY (`id`) REFERENCES `Productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Carrito_Productos` (
  `idCarrito` INT NOT NULL,
  `idProducto` VARCHAR(50) NOT NULL,
  `cantidad` INT DEFAULT 0,
  PRIMARY KEY (`idCarrito`, `idProducto`),
  CONSTRAINT `fk_carrito_productos_carrito` FOREIGN KEY (`idCarrito`) REFERENCES `Carrito` (`idCarrito`) ON DELETE CASCADE,
  CONSTRAINT `fk_carrito_productos_productos` FOREIGN KEY (`idProducto`) REFERENCES `Productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Resena` (
  `id` INT AUTO_INCREMENT UNIQUE,
  `mensaje` VARCHAR(250),
  `puntaje` INT NOT NULL CHECK (`puntaje` BETWEEN 1 AND 5),
  `idProducto` VARCHAR(50) NOT NULL,
  `ciUsuario` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`idProducto`, `ciUsuario`),
  CONSTRAINT `fk_resena_producto` FOREIGN KEY (`idProducto`) REFERENCES `Productos` (`id`)  ON DELETE CASCADE,
  CONSTRAINT `fk_resena_usuario` FOREIGN KEY (`ciUsuario`) REFERENCES `Usuario` (`ci`)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Compra_Producto` (
  `idCompra` INT,
  `idProducto` VARCHAR(50),
  `cantidad` INT NOT NULL,
  `precioUnitario` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`IDcompra`, `idProducto`),
  CONSTRAINT `fk_id_compra` FOREIGN KEY (`idCompra`) REFERENCES `Compra` (`IDcompra`) ON DELETE CASCADE,
  CONSTRAINT `fk_id_producto` FOREIGN KEY (`idProducto`) REFERENCES `Productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;