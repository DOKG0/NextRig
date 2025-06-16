<?php 
    require_once('config.php');
    require_once('utils/ResponseBuilder.php');

    class ReviewService{
        private $db_conn;

        public function __construct(){
            $database = new Database();
            $this->db_conn = $database->getConnection();
        }

        public function getReviewsDeProducto($idProducto) {
            //verifico que haya recibido el id del producto
            if (is_null($idProducto) || empty($idProducto)) {
                return CustomResponseBuilder::build(
                    false, "Error al obtener las reseñas del producto", null, 400,
                    "Error: Id de producto faltante"
                );
            }

            //format para evitar sql injection
            $idProducto = mysqli_real_escape_string($this->db_conn, $idProducto);

             //busco el producto a partir de su id
            $query_busqueda_producto = "SELECT id FROM Productos WHERE id = '$idProducto'";
            $producto = mysqli_query($this->db_conn, $query_busqueda_producto);
            $id = mysqli_fetch_object($producto);

            if (!$id) {
                return CustomResponseBuilder::build(
                    false, "Error al obtener los reviews del producto", $id, 404,
                    "Error: no se encontró el producto"
                );
            }

            //selecciono las reseñas de un producto dado su id e incluyo el nombre de usuario que la dejo
            $query = "SELECT r.id, r.mensaje, r.puntaje, r.idProducto, u.username 
                FROM (Resena r JOIN Usuario u ON r.ciUsuario = u.ci)
                WHERE r.idProducto = '$idProducto'";

            $result = mysqli_query($this->db_conn, $query);

            $reviews = [];
            while ($row = mysqli_fetch_object($result)) {
                $reviews[] = $row;
            }

            return CustomResponseBuilder::build(
                true, "Reseñas encontradas para el producto '$idProducto'", $idProducto, 200, null, null, $reviews
            );
        }

        public function getReviewsDeUsuario($username) {
            //verifico que haya recibido el username
            if (is_null($username) || empty($username)) {
                return CustomResponseBuilder::build(
                    false, "Error al obtener los reviews del usuario", null, 400,
                    "Error: nombre de usuario faltante"
                );
            }

            //format para evitar sql injection
            $username = mysqli_real_escape_string($this->db_conn, $username);

             //busco el usuario a partir de su username y extraigo su cedula
            $query_busqueda_usuario = "SELECT ci FROM Usuario WHERE username = '$username'";
            $usuario = mysqli_query($this->db_conn, $query_busqueda_usuario);
            $ci_usuario = mysqli_fetch_object($usuario);

            if (!$ci_usuario) {
                return CustomResponseBuilder::build(
                    false, "Error al obtener los reviews del usuario", $username, 404,
                    "Error: no se encontró el usuario"
                );
            }

            //selecciono las reseñas de un usuario dado su username
            $query = "SELECT r.id, r.mensaje, r.puntaje, r.idProducto, u.username 
                FROM (Resena r JOIN Usuario u ON r.ciUsuario = u.ci)
                WHERE u.username='$username'";

            $result = mysqli_query($this->db_conn, $query);

            $reviews = [];
            while ($row = mysqli_fetch_object($result)) {
                $reviews[] = $row;
            }

            return CustomResponseBuilder::build(
                true, "Reseñas encontradas para el usuario '$username'", $username, 200, null, null, $reviews
            );
        }

        public function publicarReview($mensaje, $puntaje, $idProducto, $username) {
            //verifico que haya recibido todos los parametros y no sean null
            foreach ([$mensaje, $puntaje, $idProducto, $username] as $param) {
                if (is_null($param) || empty($param)) {
                    return CustomResponseBuilder::build(
                        false, "Existe al menos un parámetro faltante", null, 400, 
                        "Error: no se puede procesar la solicitud con un parámetro faltante."
                    );
                }
            }

            //format para evitar sql injection
            $mensaje = mysqli_real_escape_string($this->db_conn, $mensaje);
            $puntaje = mysqli_real_escape_string($this->db_conn, $puntaje);
            $idProducto = mysqli_real_escape_string($this->db_conn, $idProducto);
            $username = mysqli_real_escape_string($this->db_conn, $username);

            //busco la cedula del usuario segun el username recibido
            $query_busqueda_usuario = "SELECT ci FROM Usuario WHERE username = '$username'";
            $resultado_query_usuario = mysqli_query($this->db_conn, $query_busqueda_usuario);
            $usuario = mysqli_fetch_object($resultado_query_usuario);

            //si el usuario no existe
            if (!$usuario) {
                return CustomResponseBuilder::build(
                        false, "Error al insertar la reseña", $username, 404, 
                        "Error: no se encontró ningún usuario con el nombre de usuario enviado"
                    );
            }

            //verifico que el usuario este habilitado para dejar una reseña
            //verifico que haya comprado el producto que esta intentando calificar
            if (!$this->usuarioComproProducto($idProducto, $usuario->ci)) {
                return CustomResponseBuilder::build(
                        false, "Error al insertar la reseña", $username, 400, 
                        "Error: el usuario no ha comprado el producto"
                    );
            }

            //verifico si ya dejo una reseña de ese producto
            // sujeto a cambios en la estructura de tablas de la base de datos
            if ($this->usuarioCalificoProducto($idProducto, $usuario->ci)) {
                return CustomResponseBuilder::build(
                        false, "Error al insertar la reseña", $username, 400, 
                        "Error: el usuario ya tiene una reseña del producto"
                    );
            }

            $query_review = "INSERT INTO Resena (mensaje, puntaje, idProducto, ciUsuario) 
                VALUES ('$mensaje','$puntaje','$idProducto','$usuario->ci')";
            //transaccion del insert de la reseña
            mysqli_begin_transaction($this->db_conn);
            try {
                mysqli_query($this->db_conn, $query_review);
                $id_review = mysqli_insert_id($this->db_conn);
                
                mysqli_commit($this->db_conn);

                return CustomResponseBuilder::build(
                    true, "Reseña creada exitosamente", $id_review, 201
                );

            } catch (mysqli_sql_exception $err) {
                mysqli_rollback($this->db_conn);

                return CustomResponseBuilder::build(
                    false, "Error al insertar la reseña", null, 500,
                    $err->getMessage(), $err->getCode()
                );
            }
        }

        public function eliminarReview($idProducto, $username) {
            //verifico que los parametros no sean nulos
            foreach ([$idProducto, $username] as $param) {
                if (is_null($param) || empty($param)) {
                    return CustomResponseBuilder::build(
                        false, "Existe al menos un parámetro faltante", null, 400, 
                        "Error: no se puede procesar la solicitud con un parámetro faltante."
                    );
                }
            }

            //format para evitar sql injection
            $idProducto = mysqli_real_escape_string($this->db_conn, $idProducto);
            $username = mysqli_real_escape_string($this->db_conn, $username);

            //busco el usuario a partir de su username y extraigo su cedula
            $query_busqueda_usuario = "SELECT ci FROM Usuario WHERE username = '$username'";
            $resultado_query_usuario = mysqli_query($this->db_conn, $query_busqueda_usuario);
            $usuario = mysqli_fetch_object($resultado_query_usuario);

            //si el usuario no existe
            if (!$usuario) {
                return CustomResponseBuilder::build(
                        false, "Error al eliminar la reseña", $username, 404, 
                        "Error: no se encontró ningún usuario con el nombre de usuario enviado"
                    );
            }

            $query_delete = "DELETE FROM Resena WHERE idProducto = '$idProducto' AND ciUsuario = '$usuario->ci'";
            //transaccion del delete de la reseña
            mysqli_begin_transaction($this->db_conn);
            try {
                mysqli_query($this->db_conn, $query_delete);
                $filas_modificadas = mysqli_affected_rows($this->db_conn);
                
                if ($filas_modificadas == 0) {
                    return CustomResponseBuilder::build(
                        false, "Error al eliminar la reseña", null, 404, 
                        "Error: no se encontró ninguna reseña con los parámetros enviados"
                    );
                }

                mysqli_commit($this->db_conn);

                return CustomResponseBuilder::build(
                    true, "Reseña eliminada exitosamente", null, 200
                );

            } catch (mysqli_sql_exception $err) {
                mysqli_rollback($this->db_conn);

                return CustomResponseBuilder::build(
                    false, "Error al eliminar la reseña", null, 500,
                    $err->getMessage(), $err->getCode()
                );
            }
        }

        public function getPuntajeProducto($idProducto) {
            //format para evitar sql injection
            $idProducto = mysqli_real_escape_string($this->db_conn, $idProducto);

            //verifico que el producto exista
            $query_producto = "SELECT id FROM Productos WHERE id='$idProducto'";
            $result_query_producto = mysqli_query($this->db_conn, $query_producto);
            $producto = mysqli_fetch_object($result_query_producto);

            if (!$producto) {
                return CustomResponseBuilder::build(
                    false, "Error al obtener el puntaje del producto", $idProducto, 404,
                    "El producto con el id enviado no existe"
                );
            }

            //calculo el promedio
            $puntajePromedio = $this->calcularPuntajePromedioDeProducto($idProducto);

            //el promedio es null cuando el producto existe pero no tiene reseñas
            return CustomResponseBuilder::build(
                true, "Promedio de puntaje de reseñas de producto", $idProducto, 200,
                null, null, $puntajePromedio
            );
        }

        public function calcularPuntajePromedioDeProducto($idProducto) {
            //en esta funcion se asume que el producto existe
            $query_puntaje = "SELECT ROUND(AVG(puntaje),1) as puntajePromedio FROM Resena WHERE idProducto='$idProducto'";
            $resultado_query_puntaje = mysqli_query($this->db_conn, $query_puntaje);
            $puntajePromedio = mysqli_fetch_object($resultado_query_puntaje);

            return $puntajePromedio;
        }

        public function usuarioHabilitadoParaReview($idProducto, $username) {
            //verifico que los parametros no sean nulos
            foreach ([$idProducto, $username] as $param) {
                if (is_null($param) || empty($param)) {
                    return CustomResponseBuilder::build(
                        false, "Error procesar la solicitud", null, 400, 
                        "Error: no se puede procesar la solicitud con un parámetro faltante."
                    );
                }
            }

            //format para evitar sql injection
            $username = mysqli_real_escape_string($this->db_conn, $username);

            //busco el usuario a partir de su username y extraigo su cedula
            $query_busqueda_usuario = "SELECT ci FROM Usuario WHERE username = '$username'";
            $resultado_query_usuario = mysqli_query($this->db_conn, $query_busqueda_usuario);
            $usuario = mysqli_fetch_object($resultado_query_usuario);

            //si el usuario no existe
            if (!$usuario) {
                return CustomResponseBuilder::build(
                        false, "Error procesar la solicitud", $username, 404, 
                        "Error: no se encontró ningún usuario con el nombre de usuario enviado"
                    );
            }

            //format para evitar sql injection
            $idProducto = mysqli_real_escape_string($this->db_conn, $idProducto);

             //busco el producto a partir de su id
            $query_busqueda_producto = "SELECT id FROM Productos WHERE id = '$idProducto'";
            $resultado_query_producto = mysqli_query($this->db_conn, $query_busqueda_producto);
            $producto = mysqli_fetch_object($resultado_query_producto);

            if (!$producto) {
                return CustomResponseBuilder::build(
                    false, "Error al procesar la solicitud", $idProducto, 404,
                    "Error: no se encontró el producto"
                );
            }

            $habilitado = !$this->usuarioCalificoProducto($producto->id, $usuario->ci) 
                        && $this->usuarioComproProducto($producto->id, $usuario->ci);

            return CustomResponseBuilder::build(
                true, "Solicitud procesada correctamente", null, 200, 
                null, null, ['habilitado' => $habilitado]
            );

        }

        private function usuarioComproProducto($idProducto, $ciUsuario) {

            //verifico que el usuario haya comprado el producto
            $query_compra = "SELECT Compra.IDcompra 
                FROM (Compra JOIN Usuario ON Compra.ci = Usuario.ci) 
                    JOIN Compra_Producto ON Compra.IDcompra = Compra_Producto.idCompra  
                WHERE Compra_Producto.idProducto = '$idProducto' 
                AND Compra.ci = '$ciUsuario'";
            $resultado_query_compra = mysqli_query($this->db_conn, $query_compra);
            $compra = mysqli_fetch_object($resultado_query_compra);

            //si no ha comprado, entonces no esta habilitado para dejar una reseña
            if (!$compra) {
                return false;
            }

            return true;
        }

        private function usuarioCalificoProducto($idProducto, $ciUsuario) {
            //verifico que el usuario no tenga ya una reseña de ese producto
            $query_review = "SELECT id 
                FROM Resena 
                WHERE idProducto = '$idProducto' 
                AND ciUsuario = '$ciUsuario'";
            $resultado_query_review = mysqli_query($this->db_conn, $query_review);
            $review = mysqli_fetch_object($resultado_query_review);

            //si ya dejo una reseña, entonces no esta habilitado para dejar otra
            if ($review) {
                return true;
            }
            
            return false;
        }
    }
?>