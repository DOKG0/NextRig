<?php 
require_once('config.php');
    class ProductoService{
        private $db_conn;
        public function __construct(){
            $database = new Database();
            $this->db_conn = $database->getConnection();
        }

        public function getComponentsByCategory($categoria){
            $query = "SELECT * FROM Componentes JOIN Productos ON Componentes.id = Productos.id WHERE Componentes.categoria = '$categoria'";
            $resultado = mysqli_query($this->db_conn, $query);
            if (!$resultado) {
                http_response_code(500);
                echo json_encode(["error" => "Error en la consulta a la base de datos."]);
                exit;
            }
            $componentes = [];
            while ($fila = mysqli_fetch_object($resultado)) {
                $componentes[] = $fila;
            }
    
            return $componentes;
        }

        public function getComponentById($Id){
            $query = "SELECT * FROM Componentes JOIN Productos ON Componentes.id = Productos.id WHERE Componentes.id = ?";
            $stmt = mysqli_prepare($this->db_conn, $query);
            if (!$stmt) {
                http_response_code(500);
                echo json_encode(["error" => "Error preparando la consulta."]);
                exit;
            }
            mysqli_stmt_bind_param($stmt, "s", $Id);
            mysqli_stmt_execute($stmt);

            $resultado = mysqli_stmt_get_result($stmt);
            if (!$resultado) {
                http_response_code(500);
                echo json_encode(["error" => "Error ejecutando la consulta."]);
                exit;
            }

            $componente = mysqli_fetch_object($resultado);
            return $componente;
        }

        public function listarProductos() {
            $query = "SELECT * FROM Productos";
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

        public function getTopRatedProducts($limit = 5) {
            $query = "SELECT p.*, AVG(r.puntaje) as promedio
                    FROM Productos p
                    JOIN Resena r ON p.id = r.idProducto
                    GROUP BY p.id
                    ORDER BY promedio DESC
                    LIMIT ?";
            $stmt = mysqli_prepare($this->db_conn, $query);
            mysqli_stmt_bind_param($stmt, "i", $limit);
            mysqli_stmt_execute($stmt);
            $resultado = mysqli_stmt_get_result($stmt);

            $productos = [];
            while ($fila = mysqli_fetch_object($resultado)) {
                $productos[] = $fila;
            }
            return $productos;
        }
    }
?>