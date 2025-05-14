<?php 
require_once('config.php');
    class MarcaService{
        private $db_conn;
        public function __construct(){
            $database = new Database();
            $this->db_conn = $database->getConnection();
        }

        public function listarMarcas(){
            $query = "SELECT * FROM Marca";
            $resultado = mysqli_query($this->db_conn, $query);
            if (!$resultado) {
                http_response_code(500);
                echo json_encode(["error" => "Error en la consulta a la base de datos."]);
                exit;
            }
            $marcas = [];
            while ($fila = mysqli_fetch_object($resultado)) {
                $marcas[] = $fila;
            }
    
            return $marcas;
        }

    }
?>