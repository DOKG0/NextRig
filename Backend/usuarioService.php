<?php
require_once('config.php');
class UsuarioService
{
    private $db_conn;
    public function __construct()
    {
        $database = new Database();
        $this->db_conn = $database->getConnection();
    }

    public function login($correo, $password)
    {
        // Sanear los datos
        $correo = mysqli_real_escape_string($this->db_conn, $correo);

        $query = "SELECT ci, nombre, apellido, username, correo, password FROM Usuario WHERE correo = '$correo'";
        $result = mysqli_query($this->db_conn, $query);

        if ($result && mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);

            if (password_verify($password, $row['password'])) {
                // inicia la sesion si no hay
                if (session_status() == PHP_SESSION_NONE) {
                    session_start();
                }

                $ci = $row['ci'];
                $adminQuery = "SELECT ci FROM Administrador WHERE ci = '$ci'";
                $adminResult = mysqli_query($this->db_conn, $adminQuery);
                $isAdmin = ($adminResult && mysqli_num_rows($adminResult) > 0);

                //guarda datos en la sesion
                $_SESSION['usuario'] = [
                    "ci" => $row['ci'],
                    "nombre" => $row['nombre'],
                    "apellido" => $row['apellido'],
                    "username" => $row['username'],
                    "correo" => $row['correo'],
                    "isAdmin" => $isAdmin
                ];
                return [
                    "success" => true,
                    "mensaje" => "Login exitoso",
                    "usuario" => $_SESSION['usuario']
                ];
            }
        }
        http_response_code(401);
        return [
            "success" => false,
            "mensaje" => "Credenciales inválidas"
        ];
    }
    public function registro($ci, $nombre, $apellido, $username, $correo, $password, $fechaNac)
    {
        // Sanear los datos
        $ci = mysqli_real_escape_string($this->db_conn, $ci);
        $nombre = mysqli_real_escape_string($this->db_conn, $nombre);
        $apellido = mysqli_real_escape_string($this->db_conn, $apellido);
        $username = mysqli_real_escape_string($this->db_conn, $username);
        $correo = mysqli_real_escape_string($this->db_conn, $correo);
        $fechaNac = mysqli_real_escape_string($this->db_conn, $fechaNac);


        // $ci = 'U' . bin2hex(random_bytes(8)); // genera un id, puede ser util

        // verificarsi el correo ya esta registrado
        $checkQuery = "SELECT ci FROM Usuario WHERE correo = '$correo' OR username = '$username'";
        $checkResult = mysqli_query($this->db_conn, $checkQuery);

        if ($checkResult && mysqli_num_rows($checkResult) > 0) {
            http_response_code(409);
            return [
                "success" => false,
                "mensaje" => "El correo o nombre de usuario ya están registrados"
            ];
        }

        // hashear la contraseña
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $query = "INSERT INTO Usuario (ci, nombre, apellido, username, correo, password, fechanac) 
                      VALUES ('$ci', '$nombre', '$apellido', '$username', '$correo', '$hashedPassword', '$fechaNac')";

        if (mysqli_query($this->db_conn, $query)) {
            return [
                "success" => true,
                "mensaje" => "Usuario registrado exitosamente",
                "usuario" => [
                    "ci" => $ci,
                    "nombre" => $nombre,
                    "apellido" => $apellido,
                    "username" => $username,
                    "correo" => $correo
                ]
            ];
        } else {
            http_response_code(500);
            return [
                "success" => false,
                "mensaje" => "Error al registrar el usuario: " . mysqli_error($this->db_conn)
            ];
        }
    }
}
