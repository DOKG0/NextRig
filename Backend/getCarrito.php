<?php 
require_once('config.php');
class CarritoService{
        private $db_conn;
        public function __construct(){
            $database = new Database();
            $this->db_conn = $database->getConnection();
        }

        public function getProductosCarrito($username){

            $username = mysqli_real_escape_string($this->db_conn, $username);

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

        $username = mysqli_real_escape_string($this->db_conn, $username);
        $idProducto = mysqli_real_escape_string($this->db_conn, $idProducto);
        $cantidad = mysqli_real_escape_string($this->db_conn, $cantidad);

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

        $username = mysqli_real_escape_string($this->db_conn, $username);
        $idProducto = mysqli_real_escape_string($this->db_conn, $idProducto);
        $costoCarrito = mysqli_real_escape_string($this->db_conn, $costoCarrito);
        $cantidad = mysqli_real_escape_string($this->db_conn, $cantidad);
       

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

        $username = mysqli_real_escape_string($this->db_conn, $username);

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

        $username = mysqli_real_escape_string($this->db_conn, $username);
        $costoCarrito = mysqli_real_escape_string($this->db_conn, $costoCarrito);
        $telefono = mysqli_real_escape_string($this->db_conn, $telefono);
        $direccion = mysqli_real_escape_string($this->db_conn, $direccion);
        $departamento = mysqli_real_escape_string($this->db_conn, $departamento);

        
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

        $username = mysqli_real_escape_string($this->db_conn, $username);

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

        $username = mysqli_real_escape_string($this->db_conn, $username);
        $campo = mysqli_real_escape_string($this->db_conn, $campo);
        $valor = mysqli_real_escape_string($this->db_conn, $valor);


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

        $username = mysqli_real_escape_string($this->db_conn, $username);
        $idProducto = mysqli_real_escape_string($this->db_conn, $idProducto);

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

        $username = mysqli_real_escape_string($this->db_conn, $username);

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

        $correo = mysqli_real_escape_string($this->db_conn, $correo);

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

    public function cambiarImagen($username, $imagen){
        //error_log("Username recibido: " . $username);

        $username = mysqli_real_escape_string($this->db_conn, $username);

       include './imgurApiCredentials.php';

        $query = "SELECT username,nombre FROM Usuario WHERE username = '$username'";
        $result = mysqli_query($this->db_conn, $query);

        if (!$result || mysqli_num_rows($result) === 0) {
            return CustomResponseBuilder::build(false, "Usuario no encontrado", null, 404);
        }

        $producto = mysqli_fetch_assoc($result); 

        $postFields = [
            'image' => new CURLFile($imagen),
            'album' => $albumHash,
            'type' => 'file',
            'title' => $producto['username'],
            'description' => $producto['nombre']
        ];

        // Iniciar CURL
        $ch = curl_init();

        curl_setopt_array($ch, [
            CURLOPT_URL => 'https://api.imgur.com/3/image',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $postFields,
            CURLOPT_HTTPHEADER => [
                "Authorization: Bearer $accessToken"
            ]
        ]);

        // Ejecuta el curl
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($response === false) {
            return CustomResponseBuilder::build(false, "Error al subir imagen del producto", $httpCode, 500);
        } else {
            $responseData = json_decode($response, true);
            $link = $responseData['data']['link'] ?? null;
            if (is_null($link)) {
                return CustomResponseBuilder::build(false, "Error al obtener el enlace de la imagen", null, 500);
            }
            $query = "UPDATE Usuario SET imagen = '$link' WHERE username = '$username'";
            $resultado = mysqli_query($this->db_conn, $query);

            return CustomResponseBuilder::build(true, $link, 200, $response);
        }
    }
}
