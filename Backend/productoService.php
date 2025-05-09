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
    }
?>