<?php
require_once('config.php');
require_once('utils/ResponseBuilder.php');

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
        $idProducto = mysqli_real_escape_string($this->db_conn, $idProducto);
        $urlImagen = mysqli_real_escape_string($this->db_conn, $urlImagen);

        $existeProductoQuery = "SELECT id FROM Productos WHERE id='$idProducto'";
        $producto = mysqli_query($this->db_conn, $existeProductoQuery);

        if (mysqli_num_rows($producto) == 0) {
            return CustomResponseBuilder::build(
                false, "Error al actualizar el producto", $idProducto, 404, "Error: El producto no existe"
            );
        }

        $queryActualizacion = "UPDATE Productos SET imagen = '$urlImagen' WHERE id = '$idProducto'";
        $resultado = mysqli_query($this->db_conn, $queryActualizacion);

        if ($resultado) {
            return CustomResponseBuilder::build(true, "Actualización de producto exitosa", $idProducto, 200);
        } else {
            return CustomResponseBuilder::build(false, "Error al actualizar el producto", $idProducto, 500, "No se pudo actualizar la imagen del producto");
        }
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
