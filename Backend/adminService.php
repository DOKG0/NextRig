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


    public function addProducto($id, $nombre, $precio, $stock, $descripcion, $imagen, $categoria, $admin_ci, $marca_nombre)
    {
        $query = "INSERT INTO Productos (id, nombre, precio, stock, descripcion, imagen, admin_ci, marca_nombre) 
                      VALUES ('$id', '$nombre', '$precio', '$stock', '$descripcion', '$imagen', '$admin_ci', '$marca_nombre')";
        mysqli_query($this->db_conn, $query);
        if (mysqli_affected_rows($this->db_conn) > 0) {
            switch ($categoria) {
                case 'cpu':
                    $query = "INSERT INTO Componentes (id,categoria) 
                              VALUES ('$id', 'CPU')";
                    break;
                case 'motherboard':
                    $query = "INSERT INTO Componentes (id,categoria) 
                    VALUES ('$id', 'MOTHERBOARD')";
                    break;

                case 'tarjeta_grafica':
                    $query = "INSERT INTO Componentes (id,categoria) 
                    VALUES ('$id', 'TARJETA_GRAFICA')";
                    break;

                case 'almacenamiento':
                    $query = "INSERT INTO Componentes (id,categoria) 
                    VALUES ('$id', 'ALMACENAMIENTO')";
                    break;

                case 'memmorias':
                    $query = "INSERT INTO Componentes (id,categoria) 
                    VALUES ('$id', 'MEMORIAS')";
                    break;

                case 'cooling':
                    $query = "INSERT INTO Componentes (id,categoria) 
                    VALUES ('$id', 'COOLING')";
                    break;

                case 'gabinetes':
                    $query = "INSERT INTO Componentes (id,categoria) 
                    VALUES ('$id', 'GABINETES')";
                    break;

                case 'monitores':
                    $query = "INSERT INTO Componentes (id,categoria) 
                    VALUES ('$id', 'MONITORES')";
                    break;

                case 'teclados':
                    $query = "INSERT INTO Componentes (id,categoria) 
                    VALUES ('$id', 'TECLADOS')";
                    break;

                case 'mouse':
                    $query = "INSERT INTO Componentes (id,categoria) 
                    VALUES ('$id', 'MOUSE')";
                    break;

                default:
                    mysqli_query($this->db_conn, "DELETE FROM Productos WHERE id = '$id'");
                    return false;
            }
            mysqli_query($this->db_conn, $query);
            return true;
        } else return false;
    }
    public function eliminarProducto($producto_id)
    {

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
}
