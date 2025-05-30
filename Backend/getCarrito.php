<?php 
require_once('config.php');
class CarritoService{
        private $db_conn;
        public function __construct(){
            $database = new Database();
            $this->db_conn = $database->getConnection();
        }

        public function getProductosCarrito($username){
            $query = "select id,precio,stock,descripcion,imagen,nombre,marca_nombre,cantidad from (select idProducto,cantidad from (select idCarrito from (select ci from usuario where username = '$username') as consulta1,carrito where carrito.ci = consulta1.ci) as consulta2,carrito_productos where carrito_productos.idCarrito = consulta2.idCarrito) as consulta3,productos where productos.id = consulta3.idProducto";
            
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
        FROM carrito c
        JOIN usuario u ON c.ci = u.ci
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
        INSERT INTO carrito_productos (idCarrito, idProducto, cantidad)
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
                        FROM carrito_productos cp
                        JOIN carrito c ON cp.idCarrito = c.idCarrito
                        JOIN usuario u ON c.ci = u.ci
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
        $query = "INSERT INTO comprador (ci, cel)
                    SELECT u.ci, '098898888'
                    FROM usuario u
                    WHERE u.username = '$username'
                    AND NOT EXISTS (
                    SELECT 1 FROM comprador c WHERE c.ci = u.ci
                    )";
        $resultado = mysqli_query($this->db_conn, $query);

        $query2 = "INSERT INTO compra_producto (idCompra,idProducto,precioUnitario,cantidad)
                    SELECT c.IDcompra,'$idProducto',$costoCarrito, $cantidad
                    FROM (SELECT IDcompra
                                FROM compra,usuario
                                WHERE usuario.username = '$username'
                                AND compra.ci = usuario.ci
                                
                                ORDER BY IDcompra DESC
                                LIMIT 1) as c";


        $resultado2 = mysqli_query($this->db_conn, $query2);

        $query3 = "UPDATE productos
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
        $query = "SELECT compra_producto.precioUnitario,productos.id,productos.stock,productos.precio,productos.imagen,productos.nombre,productos.descripcion,productos.marca_nombre,compra.fechaCompra,compra.costoCarrito,compra.depto,compra.direccion,compra.ci,compra_producto.cantidad,compra_producto.idProducto from compra,usuario,productos,compra_producto where compra.ci = usuario.ci and usuario.username = '$username'and productos.id = compra_producto.idProducto and compra_producto.idCompra = compra.IDcompra ORDER BY compra.fechaCompra DESC";

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
        
        $query = "INSERT INTO compra (fechaCompra, costoCarrito, depto,direccion,ci)
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
