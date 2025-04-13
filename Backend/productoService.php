<?php 
require_once('config.php');
    class ProductoService{
        private $db_conn;
        public function __construct(){
            $database = new Database();
            $this->db_conn = $database->getConnection();
        }
    }
?>