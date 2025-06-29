<?php 
require_once('config.php');
    class ProductoService{
        private $db_conn;
        public function __construct(){
            $database = new Database();
            $this->db_conn = $database->getConnection();
        }

        public function getComponentsByCategory($categoria){
            $query = "SELECT 
                p.id, p.precio, p.stock, p.descripcion, p.imagen, p.nombre, p.admin_ci, p.marca_nombre, c.categoria  
                FROM Componentes c JOIN Productos p ON c.id = p.id 
                WHERE c.categoria = '$categoria' AND p.habilitado = '1'";
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

        public function getComponentsByCategoryAndMarca($categoria, $marca){
            $query = "SELECT p.id, p.precio, p.stock, p.descripcion, p.imagen, p.nombre, p.admin_ci, p.marca_nombre, c.categoria 
                FROM Componentes c JOIN Productos p ON c.id = p.id WHERE c.categoria = '$categoria' 
                AND p.marca_nombre = '$marca' AND p.habilitado = '1'";
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
            $query = "SELECT 
                p.id, p.precio, p.stock, p.descripcion, p.imagen, p.nombre, p.admin_ci, p.marca_nombre, c.categoria 
                FROM Componentes c
                JOIN Productos p ON c.id = p.id 
                WHERE c.id = ?
                AND p.habilitado = '1'";
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
            $query = "SELECT id, precio, nombre, stock, descripcion, imagen, marca_nombre 
                FROM Productos 
                WHERE habilitado = '1'";
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

        public function getProductosMasBaratos($limit) {
            $query = "SELECT id, precio, nombre, stock, imagen, marca_nombre 
                FROM Productos 
                WHERE habilitado = '1' 
                ORDER BY precio ASC LIMIT $limit";
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
            $query = "SELECT 
                p.id, p.precio, p.stock, p.imagen, p.nombre, p.marca_nombre, AVG(r.puntaje) as promedio
                FROM Productos p 
                JOIN Resena r ON p.id = r.idProducto
                WHERE p.habilitado = '1' 
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

        public function buscarProductos($search) {
            //para evitar devolver todos los productos existentes si no se ingresa nada o se envian espacios en blanco
            if (is_null($search) || empty($search)) {
                return [];
            }

            $query_busqueda = "SELECT id, precio, nombre, stock, imagen, marca_nombre 
                FROM Productos 
                WHERE (nombre LIKE '%$search%' 
                OR marca_nombre = '$search') 
                AND habilitado = '1'";
            $resultado = mysqli_query($this->db_conn, $query_busqueda);

            $productos = [];
            while ($fila = mysqli_fetch_object($resultado)) {
                $productos[] = $fila;
            }

            return $productos;
        }
    }
?>