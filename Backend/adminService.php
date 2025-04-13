<?php 
require_once('config.php');
    class AdminService{
        private $db_conn;
        public function __construct(){
            $database = new Database();
            $this->db_conn = $database->getConnection();
        }
    }
?>