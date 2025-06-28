<?php
require_once('config.php');
require_once('utils/ResponseBuilder.php');

class AdminService
{
    private $db_conn;
    private $FALLBACK_PRODUCT_IMAGE_PATH = "../assets/img/no-image.webp";

    public function __construct()
    {
        $database = new Database();
        $this->db_conn = $database->getConnection();
    }

    public function addMarca($nombreMarca) 
    {   

        if (is_null($nombreMarca) || empty($nombreMarca)) {
            return CustomResponseBuilder::build(
                false, "Existe al menos un parámetro faltante", null, 400, 
                "Error: no se puede procesar la solicitud con un parámetro faltante."
            );
        }

        //formateando los datos para evitar sql injection
        $nombreMarca = mysqli_real_escape_string($this->db_conn, $nombreMarca);

        $query = "INSERT INTO Marca VALUES ('$nombreMarca')";

        try {
            mysqli_query($this->db_conn, $query);
            return CustomResponseBuilder::build(true, "Marca agregada exitosamente", $nombreMarca, 201);
        } catch (mysqli_sql_exception $e) {
            return CustomResponseBuilder::build(
                false, "Error al insertar la nueva marca", $nombreMarca, 500, 
                $e->getMessage(), $e->getCode());
        }
    }

    public function addProducto(
        $id, $nombre, $precio, $stock, $descripcion, $imagen, $categoria, $admin_ci, $marca_nombre) {
        
        foreach ([$id, $nombre, $precio, $stock, $descripcion, $categoria, $admin_ci] as $param) {
            if (is_null($param) || empty($param)) {
                return CustomResponseBuilder::build(
                    false, "Existe al menos un parámetro faltante", null, 400, 
                    "Error: no se puede procesar la solicitud con un parámetro faltante."
                );
            }
        }
        
        //formateando los datos para evitar sql injection
        $id = mysqli_real_escape_string($this->db_conn, $id);
        $nombre = mysqli_real_escape_string($this->db_conn, $nombre);
        $precio = mysqli_real_escape_string($this->db_conn, $precio);
        $stock = mysqli_real_escape_string($this->db_conn, $stock);
        $descripcion = mysqli_real_escape_string($this->db_conn, $descripcion);
        $imagen = mysqli_real_escape_string($this->db_conn, $imagen);
        $categoria = mysqli_real_escape_string($this->db_conn, $categoria);
        $admin_ci = mysqli_real_escape_string($this->db_conn, $admin_ci);
        $marca_nombre = mysqli_real_escape_string($this->db_conn, $marca_nombre);

        //seteo la imagen de respaldo 'no-image.webp' alojada en el frontend si la url recibida es null
        if (empty($imagen) || is_null($imagen)) {
            $imagen = $this->FALLBACK_PRODUCT_IMAGE_PATH;
        }

        if (empty($marca_nombre) || is_null($marca_nombre)) {
            $query_insert_producto = "INSERT INTO Productos 
                (id, nombre, precio, stock, descripcion, imagen, admin_ci) 
                VALUES 
                ('$id', '$nombre', '$precio', '$stock', '$descripcion', '$imagen', '$admin_ci')";
        } else {
            $query_insert_producto = "INSERT INTO Productos 
                (id, nombre, precio, stock, descripcion, imagen, admin_ci, marca_nombre) 
                VALUES 
                ('$id', '$nombre', '$precio', '$stock', '$descripcion', '$imagen', '$admin_ci', '$marca_nombre')";
        }

        mysqli_begin_transaction($this->db_conn);

        try {
            mysqli_query($this->db_conn, $query_insert_producto);
        } catch (mysqli_sql_exception $err) {
            mysqli_rollback($this->db_conn);
            return CustomResponseBuilder::build(
                false, "Error al insertar el producto", $id, 500,
                $err->getMessage(), $err->getCode());
        }

        $query_insert_componente = "INSERT INTO Componentes (id,categoria) 
            VALUES ('$id', '$categoria')";

        try {
            mysqli_query($this->db_conn, $query_insert_componente);
            mysqli_commit($this->db_conn);

            return CustomResponseBuilder::build(true, "Producto creado exitosamente", $id, 201);
        } catch (mysqli_sql_exception $err) {

            mysqli_rollback($this->db_conn);

            return CustomResponseBuilder::build(
                false, "Error al insertar el producto", $id, 500,
                $err->getMessage(), $err->getCode()
            );
        }        
    }

    public function eliminarProducto($producto_id)
    {

        $producto_id = mysqli_real_escape_string($this->db_conn, $producto_id);

        $query = "UPDATE Productos SET habilitado = 0 WHERE id = '$producto_id'";
        $resultado = mysqli_query($this->db_conn, $query);

        if ($resultado) {
            return true;
        }
        return false;
    }

    public function updateImagenProducto($idProducto, $urlImagen) {
        //sanitizar inputs
        $idProducto = mysqli_real_escape_string($this->db_conn, $idProducto);
        $urlImagen = mysqli_real_escape_string($this->db_conn, $urlImagen);

        //seteo la imagen de respaldo 'no-image.webp' alojada en el frontend si la url recibida es null
        if (is_null($urlImagen) || empty($urlImagen)) {
            $urlImagen = $this->FALLBACK_PRODUCT_IMAGE_PATH;
        }

        //no se checkea que el producto exista ya que ya se hace en la funcion uploadImgurImage
        $queryActualizacion = "UPDATE Productos SET imagen = '$urlImagen' WHERE id = '$idProducto'";
        $resultado = mysqli_query($this->db_conn, $queryActualizacion);

        if ($resultado) {
            return true;
        } else {
            return false;
        }
    }

    public function uploadImgurImage($idProducto, $imagen) {
        include './imgurApiCredentials.php';

        if (!file_exists($imagen)) {
            return CustomResponseBuilder::build(false, "Archivo de imagen no encontrado", $idProducto, 400);
        }

        // Buscar producto
        $query = "SELECT nombre, descripcion FROM Productos WHERE id = '$idProducto'";
        $result = mysqli_query($this->db_conn, $query);

        if (!$result || mysqli_num_rows($result) === 0) {
            return CustomResponseBuilder::build(false, "Producto no encontrado", $idProducto, 404);
        }
        
        //intento setear la imagen 'no-image.webp' de respaldo por si falla alguno de los pasos siguientes
        //esto se va a sobreescribir con el enlace generado mas adelante si se ejecuta correctamente
        $this->updateImagenProducto($idProducto, null);

        $producto = mysqli_fetch_assoc($result); 

        $postFields = [
            'image' => new CURLFile($imagen),
            'album' => $albumHash,
            'type' => 'file',
            'title' => $producto['nombre'],
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
            return CustomResponseBuilder::build(
                false, 
                "Error al subir imagen del producto", 
                $idProducto, 
                $httpCode);
        }
        $responseData = json_decode($response, true);
        $link = $responseData['data']['link'] ?? null;

        if (is_null($link)) {
            return CustomResponseBuilder::build(
                false, 
                "Error al obtener el enlace de la imagen", 
                $idProducto, 
                500);
        }

        $resultado = $this->updateImagenProducto($idProducto, $link);

        if (!$resultado) {
            return CustomResponseBuilder::build(
                false, 
                "Error al actualizar la imagen del producto", 
                $idProducto, 
                500);
        }

        return CustomResponseBuilder::build(
            true, 
            "Imagen subida exitosamente y producto actualizado correctamente", 
            $idProducto, 
            200);
    }

    public function updateProducto(
        $id, $nombre, $precio, $stock, $descripcion, $imagen, $categoria, $admin_ci, $marca_nombre) {
        //formateando los datos para evitar sql injection
        $id = mysqli_real_escape_string($this->db_conn, $id);
        $nombre = mysqli_real_escape_string($this->db_conn, $nombre);
        $precio = mysqli_real_escape_string($this->db_conn, $precio);
        $stock = mysqli_real_escape_string($this->db_conn, $stock);
        $descripcion = mysqli_real_escape_string($this->db_conn, $descripcion);
        $imagen = mysqli_real_escape_string($this->db_conn, $imagen);
        $categoria = mysqli_real_escape_string($this->db_conn, $categoria);
        $admin_ci = mysqli_real_escape_string($this->db_conn, $admin_ci);
        $marca_nombre = mysqli_real_escape_string($this->db_conn, $marca_nombre);

        $existeProductoQuery = "SELECT id FROM Productos WHERE id='$id'";
        $producto = mysqli_query($this->db_conn, $existeProductoQuery);

        if (mysqli_num_rows($producto) == 0) {
            return CustomResponseBuilder::build(
                false, "Error al actualizar el producto", $id, 404, "Error: El producto no existe"
            );
        }

        mysqli_begin_transaction($this->db_conn);

        try {
            $updateComponenteQuery = "UPDATE Componentes SET categoria='$categoria' WHERE id='$id'";
            mysqli_query($this->db_conn, $updateComponenteQuery);//actualizo el componente
           
            if (empty($marca_nombre) || is_null($marca_nombre)) {
                $updateProductoQuery = "UPDATE Productos 
                    SET nombre='$nombre', 
                        precio='$precio', 
                        stock='$stock', 
                        descripcion='$descripcion', 
                        imagen='$imagen',
                        admin_ci='$admin_ci' 
                    WHERE id='$id'";
            } else {
                $updateProductoQuery = "UPDATE Productos 
                    SET nombre='$nombre', 
                        precio='$precio', 
                        stock='$stock', 
                        descripcion='$descripcion', 
                        imagen='$imagen',
                        admin_ci='$admin_ci',
                        marca_nombre='$marca_nombre' 
                    WHERE id='$id'";
            }
            
            mysqli_query($this->db_conn, $updateProductoQuery); //actualizo el producto
            
            mysqli_commit($this->db_conn);//commit si nada fallo

            return CustomResponseBuilder::build(true, "Actualización de producto exitosa", $id, 200);
        } catch (mysqli_sql_exception $err) {
            mysqli_rollback($this->db_conn);//rollback si hubo un fallo en alguna de las operaciones

            return CustomResponseBuilder::build(
                false, "Error al actualizar el producto", $id, 500,
                $err->getMessage(), $err->getCode());
        }
    }
}
