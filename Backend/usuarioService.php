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
        include './imgurApiCredentials.php';
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

                if ($isAdmin) {
                    if (!$this->isImgurTokenValid($accessToken)) {
                        $this->renewImgurToken();
                        error_log("Token de Imgur valido.");
                    }else{
                        error_log("Token de Imgur invalido.");
                    }                      
                }
                

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

       // Iniciar transacción
        mysqli_begin_transaction($this->db_conn);

        try {
            // Hashear la contraseña
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            // Insertar en Usuario
            $queryUsuario = "INSERT INTO Usuario (ci, nombre, apellido, username, correo, password, fechanac) 
                            VALUES ('$ci', '$nombre', '$apellido', '$username', '$correo', '$hashedPassword', '$fechaNac')";
            if (!mysqli_query($this->db_conn, $queryUsuario)) {
                throw new Exception("Error al registrar el usuario: " . mysqli_error($this->db_conn));
            }

            // Insertar en Carrito 
            $queryCarrito = "INSERT INTO Carrito (costoCarrito, ci) VALUES (0.00, '$ci')";
            if (!mysqli_query($this->db_conn, $queryCarrito)) {
                throw new Exception("Error al crear el carrito: " . mysqli_error($this->db_conn));
            }

            // Confirmar transacción
            mysqli_commit($this->db_conn);


        
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

        } catch (Exception $e) {
            // Algo falló: deshacer todos los cambios
            mysqli_rollback($this->db_conn);
            http_response_code(500);
            return [
                "success" => false,
                "mensaje" => $e->getMessage()
            ];
        }
    }

    function isImgurTokenValid($accessToken) {
        $ch = curl_init();

        curl_setopt_array($ch, [
            CURLOPT_URL => 'https://api.imgur.com/3/account/Spaghettini2003',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                "Authorization: Bearer $accessToken"
            ]
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        return $httpCode === 200;
    }

    function renewImgurToken() {
        include './imgurApiCredentials.php';

        $ch = curl_init('https://api.imgur.com/oauth2/token');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query([
                'refresh_token' => $imgur_refresh_token,
                'client_id' => $imgur_client_id,
                'client_secret' => $imgur_client_secret,
                'grant_type' => 'refresh_token'
            ])
        ]);

        $newTokenResponse = curl_exec($ch);
        curl_close($ch);

        $newTokenData = json_decode($newTokenResponse, true);

        if (isset($newTokenData['access_token'])) {
            // Sobrescribe todo el archivo con los nuevos tokens
            $contenido = "<?php\n"
            . '$imgur_client_id = ' . var_export($imgur_client_id, true) . ";\n"
            . '$imgur_client_secret = ' . var_export($imgur_client_secret, true) . ";\n"
            . '$imgur_refresh_token = ' . var_export($newTokenData['refresh_token'] ?? $imgur_refresh_token, true) . ";\n \n"
            . '$accessToken = ' . var_export($newTokenData['access_token'], true) . ";\n"
            . '$albumHash = ' . var_export($albumHash ?? 'cF71yFW', true) . ";\n"
            . "?>";

            file_put_contents('./imgurApiCredentials.php', $contenido);
            return true;
        }
        return false;
    }
}
