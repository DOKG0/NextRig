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
                    false, "Id de producto faltante", null, 400
                );
            }

            //format para evitar sql injection
            $idProducto = mysqli_real_escape_string($this->db_conn, $idProducto);

            //selecciono las reseñas de un producto dado su id e incluyo el nombre de usuario que la dejo
            $query = "SELECT r.id, r.mensaje, r.puntaje, r.idProducto, u.username 
                FROM (Resena r JOIN Usuario u ON r.ciComprador = u.ci)
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
            $usuario = mysqli_query($this->db_conn, $query_busqueda_usuario);
            $ci_usuario = mysqli_fetch_object($usuario);

            //si el usuario no existe
            if (!$ci_usuario) {
                return CustomResponseBuilder::build(
                        false, "Error al insertar la reseña", $username, 404, 
                        "Error: no se encontró ningún usuario con el nombre de usuario enviado"
                    );
            }

            //verifico que el usuario este habilitado para dejar una reseña
            //verifico que haya comprado el producto que esta intentando calificar
            if (!$this->usuarioComproProducto($idProducto, $ci_usuario->ci)) {
                return CustomResponseBuilder::build(
                        false, "Error al insertar la reseña", $username, 400, 
                        "Error: el usuario no ha comprado el producto"
                    );
            }

            //verifico si ya dejo una reseña de ese producto
            // sujeto a cambios en la estructura de tablas de la base de datos
            if ($this->usuarioCalificoProducto($idProducto, $ci_usuario)) {
                return CustomResponseBuilder::build(
                        false, "Error al insertar la reseña", $username, 400, 
                        "Error: el usuario ya tiene una reseña del producto"
                    );
            }

            $query_review = "INSERT INTO Resena (mensaje, puntaje, idProducto, ciComprador) 
                VALUES ('$mensaje','$puntaje','$idProducto','$ci_usuario->ci')";
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
            $usuario = mysqli_query($this->db_conn, $query_busqueda_usuario);
            $ci_usuario = mysqli_fetch_object($usuario);

            //si el usuario no existe
            if (!$ci_usuario) {
                return CustomResponseBuilder::build(
                        false, "Error al eliminar la reseña", $username, 404, 
                        "Error: no se encontró ningún usuario con el nombre de usuario enviado"
                    );
            }

            $query_delete = "DELETE FROM Resena WHERE idProducto = '$idProducto' AND ciComprador = '$ci_usuario->ci'";
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

        private function usuarioComproProducto($idProducto, $ciUsuario) {

            //sujeto a cambio en estructura de tablas: idProducto no deberia estar en Compra

            //verifico que el usuario haya comprado el producto
            // $query_compra = "SELECT IDcompra 
            //     FROM (Compra JOIN Comprador ON Compra.ci = Comprador.ci) 
            //     WHERE Compra.idProducto = '$idProducto' 
            //     AND Compra.ci = '$ciUsuario'";
            // $resultado_query_compra = mysqli_query($this->db_conn, $query_compra);
            // $compra = mysqli_fetch_object($resultado_query_compra);

            //si no ha comprado, entonces no esta habilitado para dejar una reseña
            // if (!$compra) {
            //     return false;
            // }

            return true;
        }

        private function usuarioCalificoProducto($idProducto, $ciUsuario) {
            //verifico que el usuario no tenga ya una reseña de ese producto
            $query_review = "SELECT id 
                FROM Resena 
                WHERE idProducto = '$idProducto' 
                AND ciComprador = '$ciUsuario'";
            $resultado_query_review = mysqli_query($this->db_conn, $query_review);
            $review = mysqli_fetch_object($resultado_query_review);

            //si ya dejo una reseña, entonces no esta habilitado para dejar otra
            if ($review) {
                return false;
            }
            
            return true;
        }
    }
?>