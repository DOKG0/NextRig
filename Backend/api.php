<?php

ini_set('session.cookie_lifetime', 86400 * 7);
ini_set('session.gc_maxlifetime', 86400 * 7);
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.use_only_cookies', 1);

date_default_timezone_set('America/Montevideo');

session_start();

include_once 'usuarioService.php';
include_once 'adminService.php';
include_once 'productoService.php';
include_once 'marcaService.php';
include_once 'contactoService.php';
include_once 'reviewService.php';
include_once 'getCarrito.php';
include_once 'pdfService.php';

setHeaders();

// Manejo de preflight requests para CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$request = explode("/", trim(substr(@$_SERVER['PATH_INFO'] ?? '', 1)));

error_log("Método: $method, Ruta: " . print_r($request, true));

switch ($method) {
    case 'POST':
        handlePostRequest($request);
        break;
    case 'GET':
        handleGetRequest($request);
        break;
    case 'PUT':
        handlePutRequest($request);
        break;
    case 'DELETE':
        handleDeleteRequest($request);
        break;
    default:
        http_response_code(405); // Method Not Allowed
        echo json_encode(['error' => 'Método no permitido']);
        break;
}

function setHeaders()
{
    error_log("setHeaders ejecutado");
    header("Access-Control-Allow-Origin: http://localhost:4200");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");
}

function requireAdminSession() {

    error_log("SESSION DEBUG: " . print_r($_SESSION, true));
    error_log("Cookies recibidas: " . print_r($_COOKIE, true));

    if (!isset($_SESSION['usuario']) || empty($_SESSION['usuario']['isAdmin']) || !$_SESSION['usuario']['isAdmin']) {
        http_response_code(401);
        echo json_encode(['error' => 'No autorizado']);
        exit;
    }
}

function requiredFieldsExist($data, $fields)
{
    foreach ($fields as $field) {
        if (!isset($data[$field])) {
            return false;
        }
    }
    return true;
}

function handlePostRequest($request)
{
    $contentType = $_SERVER["CONTENT_TYPE"] ?? '';

    if (empty($request[0])) {
        http_response_code(400);
        echo json_encode(['error' => 'Recurso no especificado']);
        return;
    }

    if (strpos($contentType, 'application/json') !== false) {
        $data = json_decode(file_get_contents("php://input"), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['error' => 'JSON inválido: ' . json_last_error_msg()]);
            return;
        }
    } else if (strpos($contentType, 'multipart/form-data') !== false) {
        $data = $_POST;
    } else {
        $data = [];
    }

    error_log("Datos recibidos: " . print_r($data, true));
    switch ($request[0]) {
        case 'usuario':
            $usuarioService = new UsuarioService();
            handleUsuarioRequest($usuarioService, $request[1] ?? '', $data);
            break;
        case 'admin':
            $adminService = new AdminService();
            handleAdminRequest($adminService, $request[1] ?? '', $data);
            break;
        case 'reseña':
            $reviewService = new ReviewService();
            $result = $reviewService->publicarReview(
                $data['mensaje']    ?? null,
                $data['puntaje']    ?? null,
                $data['idProducto'] ?? null,
                $_SESSION['usuario']['username'] ?? null);
            http_response_code($result['httpCode']);
            echo json_encode($result);
            break;
        case 'contacto':
            $contactoService = new ContactoService();
            $result = $contactoService->recibirCorreo(
                $data['nombre'],
                $data['email'],
                $data['mensaje']
            );
            echo json_encode($result);
            break;
        case 'generar-factura':
            if (!isset($_SESSION['usuario']['username'])) {
                http_response_code(401);
                echo json_encode(['error' => 'Usuario no autenticado']);
                return;
            }
            
            $pdfService = new PDFService();
            $contactoService = new ContactoService();
            $username = $_SESSION['usuario']['username'];
            $idCompra = $data['idCompra'] ?? null;
            
            if (!$idCompra) {
                http_response_code(400);
                echo json_encode(['error' => 'ID de compra no proporcionado']);
                return;
            }
            
            $result = $pdfService->generarFacturaCompra($username, $idCompra);
            
            if ($result['success']) {
                $carritoService = new CarritoService();
                $usuario = $carritoService->getUsuario($username);
                
                if ($usuario) {
                    $nombreCompleto = $usuario->nombre . ' ' . $usuario->apellido;
                    $email = $usuario->correo;
                    $pathFactura = $result['filepath'];
                    
                    $emailResult = $contactoService->enviarFacturaPorEmail(
                        $email, 
                        $nombreCompleto, 
                        $idCompra, 
                        $pathFactura
                    );
                    
                    echo json_encode([
                        'success' => true,
                        'filename' => $result['filename'],
                        'downloadUrl' => 'Backend/facturas/' . $result['filename'],
                        'emailSent' => $emailResult['success'],
                        'emailMessage' => $emailResult['mensaje']
                    ]);
                } else {
                    echo json_encode([
                        'success' => true,
                        'filename' => $result['filename'],
                        'downloadUrl' => 'Backend/facturas/' . $result['filename'],
                        'emailSent' => false,
                        'emailMessage' => 'No se pudo obtener datos del usuario para envio del email'
                    ]);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => $result['error']]);
            }
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Recurso no encontrado']);
            break;
    }
}

function handleGetRequest($request)
{
    if (empty($request[0])) {
        http_response_code(400);
        echo json_encode(['error' => 'Recurso no especificado']);
        return;
    }

    if ($request[0] == 'descargar-factura' && sizeof($request) > 1) {
        if (!isset($_SESSION['usuario']['username'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Usuario no autenticado']);
            return;
        }
        
        $idCompra = $request[1];
        $filename = 'factura_' . $idCompra . '_' . date('Y-m-d') . '.pdf';
        $filepath = 'facturas/' . $filename;
        
        if (file_exists($filepath)) {
            header('Content-Type: application/pdf');
            header('Content-Disposition: attachment; filename="' . $filename . '"');
            header('Content-Length: ' . filesize($filepath));
            readfile($filepath);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Factura no encontrada']);
        }
        return;
    }

    if ($request[0] == 'productos') {
        $productosService = new ProductoService();

        if (sizeof($request) == 1) {
            $productos = $productosService->listarProductos();
            echo json_encode($productos);
            return;
        }

        if (isset($request[2]) && $request[2] == 'marca' && isset($request[3])) {
            $productos = $productosService->getComponentsByCategoryAndMarca($request[1], $request[3]);
            echo json_encode($productos);
            return;
        }

        switch ($request[1]) {
            case 'cpu':
                echo json_encode($productosService->getComponentsByCategory('CPU'));
                break;

            case 'motherboard':
                echo json_encode($productosService->getComponentsByCategory('MOTHERBOARD'));
                break;

            case 'tarjeta_grafica':
                echo json_encode($productosService->getComponentsByCategory('TARJETA_GRAFICA'));
                break;

            case 'almacenamiento':
                echo json_encode($productosService->getComponentsByCategory('ALMACENAMIENTO'));
                break;

            case 'memorias':
                echo json_encode($productosService->getComponentsByCategory('MEMORIAS'));
                break;

            case 'cooling':
                echo json_encode($productosService->getComponentsByCategory('COOLING'));
                break;

            case 'gabinetes':
                echo json_encode($productosService->getComponentsByCategory('GABINETES'));
                break;

            case 'monitores':
                echo json_encode($productosService->getComponentsByCategory('MONITORES'));
                break;

            case 'teclados':
                echo json_encode($productosService->getComponentsByCategory('TECLADOS'));
                break;

            case 'mouse':
                echo json_encode($productosService->getComponentsByCategory('MOUSE'));
                break;
            
            case 'id':
                echo json_encode($productosService->getComponentById($request[2]));
                break;

            case 'top-rated':
                echo json_encode($productosService->getTopRatedProducts(5));
                break;

            case 'mas-baratos':
                echo json_encode($productosService->getProductosMasBaratos(10));
                break;

            default:
                $productos = $productosService->listarProductos();
                echo json_encode($productos);
                break;
        }
        return;
    }

    if ($request[0] == 'marcas') {
        $marcasService = new MarcaService();

        if (sizeof($request) > 1) {
            $result = $marcasService->existeMarca($request[1]);
        } else {
            $result = $marcasService->listarMarcas();
        }
        echo json_encode($result);
        return;
    }

    if($request[0] ==  'controlStock'){
        $carritoService = new CarritoService();
        echo json_encode($carritoService->getCantidadProducto($request[1],$request[2]));
        return;
    }

    if($request[0] == 'carrito') {
        $carritoService = new CarritoService();
        $productos = $carritoService->getProductosCarrito($request[1]);
        echo json_encode($productos);
        return;
    }

    if( $request[0] == 'historial'){
        $carritoService = new CarritoService();
        echo json_encode($carritoService->getHistorialCompras($request[1]));
        return;
    }

    if( $request[0] == 'perfil'){
            $carritoService = new CarritoService();
            echo json_encode($carritoService->getUsuario($request[1]));
            return;
    }

    if ($request[0] == 'reseñas') {
        $reviewService = new ReviewService();
        $resultado = $reviewService->getReviewsDeProducto($request[1]);
        http_response_code($resultado['httpCode']);
        echo json_encode($resultado);
        return;
    }

    if ($request[0] == 'usuario' && sizeof($request) > 1 && $request[1] == 'misReseñas') {
        $reviewService = new ReviewService();
        //tomo el usuario de la sesion
        $resultado = $reviewService->getReviewsDeUsuario($_SESSION['usuario']['username'] ?? null);
        http_response_code($resultado['httpCode']);
        echo json_encode($resultado);
        return;
    }

    if ($request[0] == 'usuario' && sizeof($request) > 1 && $request[1] == 'habilitado-para-reseña') {
        $reviewService = new ReviewService();
        //recibo el nombre de usuario por la sesion activa y el id del producto por query param
        $resultado = $reviewService->usuarioHabilitadoParaReview(
            $_GET['idProducto'] ?? null,
            $_SESSION['usuario']['username'] ?? null);
        http_response_code($resultado['httpCode']);
        echo json_encode($resultado);
        return;
    }

    if ($request[0] == 'producto' && sizeof($request) > 1 && $request[1] == 'puntaje') {
        $reviewService = new ReviewService();
        //se recibe el id del producto por query param
        $resultado = $reviewService->getPuntajeProducto($_GET['idProducto'] ?? null);
        http_response_code($resultado['httpCode']);
        echo json_encode($resultado);
        return;
    }

    if ($request[0] == 'search') {
        $productosService = new ProductoService();
        $productos = $productosService->buscarProductos($_GET['query'] ?? null);
        echo json_encode($productos);
        return;
    }

    http_response_code(404);
    echo json_encode(['error' => 'Recurso no especificado']);    
}

function handlePutRequest($request)
{
    $data = json_decode(file_get_contents("php://input"), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'JSON inválido: ' . json_last_error_msg()]);
        return;
    }

    if (empty($request[0])) {
        http_response_code(400);
        echo json_encode(['error' => 'Recurso no especificado']);
        return;
    }

    switch ($request[0]) {
        case 'actualizar':
            $carritoService = new CarritoService();
            echo json_encode($carritoService->actualizarUsuario(
                $data['username'] ?? null,
                $data['campo'] ?? null,
                $data['valor'] ?? null
            ));
            break;
        case 'usuario':
            if($request[1] == 'eliminar') {
                $carritoService = new CarritoService();
                echo json_encode($carritoService->eliminarUsuario($data['username'] ?? null));
                return;
            }else{
                if($request[1] == 'habilitar') {
                    $carritoService = new CarritoService();
                    echo json_encode($carritoService->habilitarUsuario($data['correo'] ?? null));
                    return;
                }
            }
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Recurso no encontrado']);
            break;
    }
}

function handleDeleteRequest($request)
{
    if (empty($request[0])) {
        http_response_code(400);
        echo json_encode(['error' => 'Recurso no especificado']);
        return;
    }

    $data = json_decode(file_get_contents("php://input"));

    if ($request[0] == 'admin') {
        $adminService = new AdminService();
        handleAdminRequest($adminService, $request[1] ?? '', $data);
        return;
    }
    
    if ($request[0] == 'usuario' && $request[1] == 'eliminarProductoCarrito') {
        $carritoService = new CarritoService();
        echo json_encode($carritoService->deleteProductoCarrito($data->username, $data->idProducto));
        return;
    }

    if($request[0] == 'reseña') {
        $reviewService = new ReviewService();
        $result = $reviewService->eliminarReview(
            $_GET['idProducto'] ?? null,
            $_SESSION['usuario']['username'] ?? null
        );
        http_response_code($result['httpCode']);
        echo json_encode($result);
        return;
    }

    if ($request[0] == 'eliminar-factura' && sizeof($request) > 1) {

        $idCompra = $request[1];
        $filename = 'factura_' . $idCompra . '_' . date('Y-m-d') . '.pdf';
        $filepath = 'facturas/' . $filename;
        
        if (file_exists($filepath)) {
            if (unlink($filepath)) {
                echo json_encode(['success' => true, 'message' => 'Factura eliminada correctamente']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'No se pudo eliminar la factura']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Factura no encontrada']);
        }
        return;
    }

    http_response_code(404);
    echo json_encode(['error' => 'Recurso no encontrado']);
}

function handleUsuarioRequest($usuarioService, $action, $data)
{
    switch ($action) {
        case 'login':
            if (!requiredFieldsExist($data, ['correo', 'password'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos incompletos']);
                return;
            }
            $result = $usuarioService->login($data['correo'], $data['password']);
            echo json_encode($result);
            break;

        case 'registro':
            if (!requiredFieldsExist($data, ['ci', 'nombre', 'apellido', 'username', 'correo', 'password', 'fechaNac'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos incompletos']);
                return;
            }
            $result = $usuarioService->registro(
                $data['ci'],
                $data['nombre'],
                $data['apellido'],
                $data['username'],
                $data['correo'],
                $data['password'],
                $data['fechaNac']
            );
            echo json_encode($result);
            break;

        case 'cantidad':
            $carritoService = new CarritoService();
            echo json_encode($carritoService->postCantidadProductoCarrito(
                $data['username'],
                $data['idProducto'],
                $data['cantidad']
            ));
            break;

        case 'comprarCarrito':
            $carritoService = new CarritoService();
            echo json_encode($carritoService->comprarCarrito($data['username'],$data['idProducto'],$data['costoCarrito'], $data['cantidad']));
            break;

            case 'crearCompra':
            $carritoService = new CarritoService();
            echo json_encode($carritoService->crearCompra($data['username'],$data['costoCarrito'],$data['telefono'],$data['direccion'],$data['departamento']));
            break;
        case 'cambiarImagen':
            $carritoService = new CarritoService();
            echo json_encode($carritoService->cambiarImagen($_POST['username'], $_FILES['imagen']['tmp_name']));
            break;

        default:
            http_response_code(404);
            echo json_encode(['error' => 'Acción no encontrada']);
            break;
    }
}

function handleAdminRequest($adminService, $action, $data)
{
    requireAdminSession();

    switch ($action) {
        case 'addProduct':

            $marca = $data['marca_nombre'] ?? null;
            $result_addProduct = $adminService->addProducto(
                $data['id'] ?? null,
                $data['nombre'] ?? null,
                $data['precio'] ?? null,
                $data['stock'] ?? null,
                $data['descripcion'] ?? null,
                $data['imagen'] ?? null,
                $data['categoria'] ?? null,
                $data['admin_ci'] ?? null,
                $marca
            );
            http_response_code($result_addProduct['httpCode']);
            echo json_encode($result_addProduct);
            break;
        case 'updateProduct':
            $result_updateProduct = $adminService->updateProducto(
                $data['id'] ?? null,
                $data['nombre'] ?? null,
                $data['precio'] ?? null,
                $data['stock'] ?? null,
                $data['descripcion'] ?? null,
                $data['imagen'] ?? null,
                $data['categoria'] ?? null,
                $data['admin_ci'] ?? null,
                $data['marca_nombre'] ?? null
            );
            http_response_code($result_updateProduct['httpCode']);
            echo json_encode($result_updateProduct);
            break;
        case 'addMarca':
            $result_addMarca = $adminService->addMarca($data['marca_nombre'] ?? null);
            http_response_code($result_addMarca['httpCode']);
            echo json_encode($result_addMarca);
            break;
        case 'eliminarProducto':
            $result_eliminarProducto = $adminService->eliminarProducto($data->producto_id);
            echo json_encode($result_eliminarProducto);
            break;
        case 'uploadImgurImage':
            $result_uploadProductImage = $adminService->uploadImgurImage(
                $_POST['idProducto'] ?? null,
                $_FILES['imagen']['tmp_name'] ?? null
            );
            http_response_code((int)$result_uploadProductImage['httpCode']);
            echo json_encode($result_uploadProductImage);
            break;
    }
}
