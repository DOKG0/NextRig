<?php 
require_once('config.php');
class CarritoService{
        private $db_conn;
        public function __construct(){
            $database = new Database();
            $this->db_conn = $database->getConnection();
        }

        public function getProductosCarrito($username){
            $query = "select id,precio,stock,descripcion,imagen,nombre,marca_nombre,cantidad from (select idProducto,cantidad from (select idCarrito from (select ci from Usuario where username = '$username') as consulta1,Carrito where Carrito.ci = consulta1.ci) as consulta2,Carrito_Productos where Carrito_Productos.idCarrito = consulta2.idCarrito) as consulta3,Productos where Productos.id = consulta3.idProducto AND Productos.habilitado = 1";
            
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
                 $agregarIDcarrito = "INSERT INTO Carrito(costoCarrito,ci) SELECT 0,ci FROM Usuario u 
                WHERE u.username = '$username'";
                $resultagregar = mysqli_query($this->db_conn,$agregarIDcarrito);
            }
               

            $queryCarrito4 = "
        SELECT c.idCarrito
        FROM Carrito c
        JOIN Usuario u ON c.ci = u.ci
        WHERE u.username = '$username'";
        $resultCarrito4 = mysqli_query($this->db_conn, $queryCarrito4);

    $row = mysqli_fetch_assoc($resultCarrito4);
    $idCarrito = $row['idCarrito'];
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
        $query = "SELECT Compra_Producto.precioUnitario,Productos.id,Productos.stock,Productos.precio,Productos.imagen,Productos.nombre,Productos.descripcion,Productos.marca_nombre,Compra.fechaCompra,Compra.costoCarrito,Compra.depto,Compra.direccion,Compra.ci,Compra_Producto.cantidad,Compra_Producto.idProducto from Compra,Usuario,Productos,Compra_Producto where Compra.ci = Usuario.ci and Usuario.username = '$username'and Productos.id = Compra_Producto.idProducto and Compra_Producto.idCompra = Compra.IDcompra ORDER BY Compra.fechaCompra DESC";

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

    public function crearCompra($username,$costoCarrito,$telefono,$direccion,$departamento){
        
        $query = "INSERT INTO Compra (fechaCompra, costoCarrito, depto,direccion,ci,telefono)
                    SELECT CURDATE(),'$costoCarrito','$departamento','$direccion', u.ci, '$telefono'
                    FROM Usuario u
                    WHERE u.username = '$username'";
        $resultado = mysqli_query($this->db_conn, $query);
        if (!$resultado) {
            http_response_code(500);
            echo json_encode(["error" => mysqli_error($this->db_conn)]);
            exit;
        }

        // obtengo el id de la compra creada
        $idCompra = mysqli_insert_id($this->db_conn);
        
        http_response_code(200);
        return [
            "success" => "Compra creada correctamente",
            "idCompra" => $idCompra
        ];
    }

     public function getUsuario($username){

        $query = "SELECT  u.username, u.nombre, u.apellido, u.correo, u.imagen
                    FROM Usuario u
                    WHERE u.username = '$username'";
        $resultado = mysqli_query($this->db_conn, $query);
        if (!$resultado) {
            http_response_code(500);
            echo json_encode(["error" => "Error en la consulta a la base de datos."]);
            exit;
        }
        $usuario = mysqli_fetch_object($resultado);
        return $usuario;
    }

    public function actualizarUsuario($username,$campo, $valor){
        if($campo == 'username' || $campo == 'correo'){
        $query = "SELECT * FROM Usuario WHERE $campo = '$valor'";
        $resultado = mysqli_query($this->db_conn, $query);
        if(mysqli_num_rows($resultado) > 0){
            http_response_code(400);
            echo json_encode(["error" => "El $campo ya está en uso."]);
            exit;
        }
        }
        $query2 = "UPDATE Usuario SET $campo = '$valor' WHERE username = '$username'";
        $resultado2 = mysqli_query($this->db_conn, $query2);
        if (!$resultado2) {
            http_response_code(500);
            echo json_encode(["error" => "Error en la consulta a la base de datos."]);
            exit;
        } else {
            http_response_code(200);
            echo json_encode(["success" => "Usuario actualizado correctamente."]);
            exit;
        }
    }

    public function getCantidadProducto($username,$idProducto){
        $query = "SELECT cantidad FROM Carrito_Productos,Carrito,Usuario WHERE Usuario.username = '$username' AND Carrito.ci = Usuario.ci AND Carrito_Productos.idProducto = '$idProducto'";
        $resultado = mysqli_query($this->db_conn,$query);
        http_response_code(200);
        
        $cantidad = mysqli_fetch_object($resultado);
        if($cantidad == null){
            return 0;

        }else{
            return $cantidad->cantidad;
        }
        
    }

    public function eliminarUsuario($username){
        $query = "UPDATE Usuario SET estado = false WHERE username = '$username'";
        $resultado = mysqli_query($this->db_conn, $query);
        if (!$resultado) {
            http_response_code(500);
            echo json_encode(["error" => "Error al eliminar el usuario."]);
            exit;
        } else {
            http_response_code(200);
            echo json_encode(["success" => "Usuario eliminado correctamente."]);
            exit;
        }
    }

    public function habilitarUsuario($correo){
        $query = "UPDATE Usuario SET estado = true WHERE correo = '$correo'";
        $resultado = mysqli_query($this->db_conn, $query);
        if (!$resultado) {
            http_response_code(500);
            echo json_encode(["error" => "Error al habilitar el usuario."]);
            exit;
        } else {
            http_response_code(200);
            echo json_encode(["success" => "Usuario habilitado correctamente."]);
            exit;
        }
    }
}
