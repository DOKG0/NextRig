<?php 

    class Database{
        private $host = "localhost";
        private $user = "NextRig";
        private $db_name = "root";
        private $password = "";
        public $db_conn;

        public function getConnection(){
            $this->db_conn = null;
            try{
                $this->db_conn = mysqli_connect($this->host, $this->user, $this->password); 
                mysqli_select_db($this->db_conn, $this->db_name);
            }catch(Exception $exception){
                echo "Error de conexion" . $exception->getMessage();
            }
            return $this->db_conn;
        }
    }
?>