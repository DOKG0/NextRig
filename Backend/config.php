<?php 

    class Database{
        private $host = "localhost";
        private $db_name = "NextRig";
        public $db_conn;

        public function getConnection(){
            include './dbCredentials.php';

            $this->db_conn = null;
            try{
                $this->db_conn = mysqli_connect($this->host, $DB_credentials_user, $DB_credentials_password); 
                mysqli_select_db($this->db_conn, $this->db_name);
            }catch(Exception $exception){
                echo "Error de conexion" . $exception->getMessage();
            }
            return $this->db_conn;
        }
    }
?>