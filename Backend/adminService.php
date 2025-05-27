<?php
require_once('config.php');
class AdminService
{
    private $db_conn;
    public function __construct()
    {
        $database = new Database();
        $this->db_conn = $database->getConnection();
    }

    public function addMarca($nombreMarca) 
    {   
        //formateando los datos para evitar sql injection
        $nombreMarca = mysqli_real_escape_string($this->db_conn, $nombreMarca);

        $query = "INSERT INTO Marca VALUES ('$nombreMarca')";

        try {
            mysqli_query($this->db_conn, $query);
            return $this->responseBuilder(true, "Marca agregada exitosamente", $nombreMarca);
        } catch (mysqli_sql_exception $e) {
            return $this->responseBuilder(
                false, "Error al insertar la nueva marca", $nombreMarca, 
                $e->getMessage(), $e->getCode());
        }
    }

    public function addProducto($id, $nombre, $precio, $stock, $descripcion, $imagen, $categoria, $admin_ci, $marca_nombre)
    {
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
            return $this->responseBuilder(
                false, "Error al insertar el producto", $id, 
                $err->getMessage(), $err->getCode());
        }

        $query_insert_componente = "INSERT INTO Componentes 
            (id,categoria) 
            VALUES 
            ('$id', '$categoria')";

        try {
            mysqli_query($this->db_conn, $query_insert_componente);
            mysqli_commit($this->db_conn);

            return $this->responseBuilder(true, "Producto creado exitosamente", $id);
        } catch (mysqli_sql_exception $err) {

            mysqli_rollback($this->db_conn);

            return $this->responseBuilder(
                false, "Error al insertar el producto", $id,
                $err->getMessage(), $err->getCode()
            );
        }        
    }

    public function eliminarProducto($producto_id)
    {

        $producto_id = mysqli_real_escape_string($this->db_conn, $producto_id);

        $query = "DELETE FROM Componentes WHERE id = '$producto_id'";
        mysqli_query($this->db_conn, $query);

        $query = "DELETE FROM Productos WHERE id = ?";
        $stmt = mysqli_prepare($this->db_conn, $query);

        mysqli_stmt_bind_param($stmt, "s", $producto_id);

        if (mysqli_stmt_execute($stmt)) {
            return true;
        }
        return false;
    }

    public function updateProducto(
        $id, $nombre, $precio, $stock, $descripcion, $imagen, $categoria, $admin_ci, $marca_nombre) 
        {
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
            return $this->responseBuilder(false, "No se encontró el producto", $id, "El producto no existe");
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

            return $this->responseBuilder(true, "Actualización exitosa", $id);
        } catch (mysqli_sql_exception $err) {
            mysqli_rollback($this->db_conn);//rollback si hubo un fallo en alguna de las operaciones

            return $this->responseBuilder(
                false, "Error al actualizar el producto", $id, 
                $err->getMessage(), $err->getCode());
        }
    }

    private function responseBuilder(
        $resultado, 
        $mensaje, 
        $identificador, 
        $error = null, 
        $errCode = null) {

        $response = [
            "success" => $resultado,
            "mensaje" => $mensaje,
            "id" => $identificador
        ];

        if (!is_null($error)) {
            $response["error"] = $error;
            $response["errCode"] = $errCode;
        }

        return $response;
    }
}
