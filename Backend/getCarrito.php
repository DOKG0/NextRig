<?php 
require_once('config.php');
class CarritoService{
        private $db_conn;
        public function __construct(){
            $database = new Database();
            $this->db_conn = $database->getConnection();
        }

        public function getProductosCarrito($username){
            $query = "select id,precio,stock,descripcion,imagen,nombre,marca_nombre,cantidad from (select idProducto,cantidad from (select idCarrito from (select ci from Usuario where username = '$username') as consulta1,Carrito where Carrito.ci = consulta1.ci) as consulta2,Carrito_Productos where Carrito_Productos.idCarrito = consulta2.idCarrito) as consulta3,Productos where Productos.id = consulta3.idProducto";
            
            $resultado = mysqli_query($this->db_conn, $query);
            if (!$resultado) {
                http_response_code(500);
                echo json_encode(["error" => "Error en la consulta a la base de datos."]);
                exit;
            }
            $productos = [];
            while ($fila = mysqli_fetch_object($resultado)) {
                $productos[] = $fila;
            }
    
            return $productos;
        }

        public function postCantidadProductoCarrito($username, $idProducto, $cantidad){
          $queryCarrito = "
        SELECT c.idCarrito
        FROM Carrito c
        JOIN Usuario u ON c.ci = u.ci
        WHERE u.username = '$username'";
        $resultCarrito = mysqli_query($this->db_conn, $queryCarrito);

            if (!$resultCarrito || mysqli_num_rows($resultCarrito) === 0) {
                http_response_code(404);
                echo json_encode(["error" => "Carrito no encontrado para el usuario."]);
                exit;
            }

    $row = mysqli_fetch_assoc($resultCarrito);
    $idCarrito = $row['idCarrito'];

    // 2. Insertar o actualizar producto
    $query = "
        INSERT INTO Carrito_Productos (idCarrito, idProducto, cantidad)
        VALUES ('$idCarrito', '$idProducto', '$cantidad')
        ON DUPLICATE KEY UPDATE cantidad = cantidad + VALUES(cantidad)";

        $resultado = mysqli_query($this->db_conn, $query);

        if (!$resultado) {
            http_response_code(500);
            echo json_encode(["error" => "Error en la consulta a la base de datos."]);
            exit;
        } else {
            http_response_code(200);
            echo json_encode(["success" => "Cantidad actualizada correctamente."]);
            exit;
        }
                
            }


        public function deleteProductoCarrito($username, $idProducto){
            $query = "DELETE cp
                        FROM Carrito_Productos cp
                        JOIN Carrito c ON cp.idCarrito = c.idCarrito
                        JOIN Usuario u ON c.ci = u.ci
                        WHERE u.username = '$username' AND cp.idProducto = '$idProducto'";

            $resultCarrito = mysqli_query($this->db_conn, $query);
    
                if (!$resultCarrito) {
                    http_response_code(500);
                    echo json_encode(["error" => "Carrito no encontrado para el usuario."]);
                    exit;
                }else{
                    http_response_code(200);
                    echo json_encode(["success" => "Producto eliminado correctamente."]);
                    exit;
                }
    
    }

    public function comprarCarrito($username,$idProducto,$costoCarrito, $cantidad){
        $query = "INSERT INTO Comprador (ci, cel)
                    SELECT u.ci, '098898888'
                    FROM Usuario u
                    WHERE u.username = '$username'
                    AND NOT EXISTS (
                    SELECT 1 FROM Comprador c WHERE c.ci = u.ci
                    )";
        $resultado = mysqli_query($this->db_conn, $query);

        $query2 = "INSERT INTO Compra_Producto (idCompra,idProducto,precioUnitario,cantidad)
                    SELECT c.IDcompra,'$idProducto',$costoCarrito, $cantidad
                    FROM (SELECT IDcompra
                                FROM Compra,Usuario
                                WHERE Usuario.username = '$username'
                                AND Compra.ci = Usuario.ci
                                
                                ORDER BY IDcompra DESC
                                LIMIT 1) as c";


        $resultado2 = mysqli_query($this->db_conn, $query2);

        $query3 = "UPDATE Productos
                    SET stock = stock - $cantidad
                    WHERE id = '$idProducto'";

        $resultado3 = mysqli_query($this->db_conn, $query3);

         if (!$resultado2) {
    http_response_code(500);
    echo json_encode(["error" => mysqli_error($this->db_conn)]);
    exit;
}

http_response_code(200);
header("Content-Type: application/json");
echo json_encode(["success" => "Compra registrada correctamente."]);
exit;

                    
    }


public function getHistorialCompras($username){
        $query = "SELECT Compra_Producto.precioUnitario,Productos.id,Productos.stock,Productos.precio,Productos.imagen,Productos.nombre,Productos.descripcion,Productos.marca_nombre,Compra.fechaCompra,Compra.costoCarrito,Compra.depto,Compra.direccion,Compra.ci,Compra_Producto.cantidad,Compra_Producto.idProducto from Compra,Usuario,Productos,Compra_Producto where Compra.ci = Usuario.ci and Usuario.username = '$username'and Productos.id = Compra_Producto.idProducto and Compra_producto.idCompra = Compra.IDcompra ORDER BY Compra.fechaCompra DESC";

        $resultado = mysqli_query($this->db_conn, $query);
        if (!$resultado) {
            http_response_code(500);
            echo json_encode(["error" => "Error en la consulta a la base de datos."]);
            exit;
        }
        $productos = [];
        while ($fila = mysqli_fetch_object($resultado)) {
            $productos[] = $fila;
        }

        return $productos;
    }

    public function crearCompra($username,$costoCarrito){
        
        $query = "INSERT INTO Compra (fechaCompra, costoCarrito, depto,direccion,ci)
                    SELECT CURDATE(),'$costoCarrito','Maldonado','Las Malvinas', u.ci
                    FROM usuario u
                    WHERE u.username = '$username'";
        $resultado = mysqli_query($this->db_conn, $query);
        if (!$resultado) {
            http_response_code(500);
            echo json_encode(["error" => mysqli_error($this->db_conn)]);
            exit;
        }
    }
}
