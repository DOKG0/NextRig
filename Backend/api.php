<?php
include_once 'usuarioService.php';
include_once 'adminService.php';
include_once 'productoService.php';
include_once 'marcaService.php';
include_once 'contactoService.php';
include_once 'reviewService.php';
include_once 'getCarrito.php';

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
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
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
    $data = json_decode(file_get_contents("php://input"), true);

    if ($request[0] == 'contacto') {
        $contactoService = new ContactoService();
        $result = $contactoService->recibirCorreo(
            $data['nombre'],
            $data['email'],
            $data['mensaje']
        );
        echo json_encode($result);
        return;
    }

    // Verifica si se pudo decodificar el JSON correctamente
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'JSON inválido: ' . json_last_error_msg()]);
        return;
    }

    error_log("Datos recibidos: " . print_r($data, true));

    if (empty($request[0])) {
        http_response_code(400);
        echo json_encode(['error' => 'Recurso no especificado']);
        return;
    }

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
                $data['username']   ?? null);
            http_response_code($result['httpCode']);
            echo json_encode($result);
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

    if ($request[0] == 'productos') {
        $productosService = new ProductoService();
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
        //recibo el nombre de usuario por query param
        $resultado = $reviewService->getReviewsDeUsuario($_GET['username'] ?? null);
        http_response_code($resultado['httpCode']);
        echo json_encode($resultado);
        return;
    }

    if ($request[0] == 'usuario' && sizeof($request) > 1 && $request[1] == 'habilitado-para-reseña') {
        $reviewService = new ReviewService();
        //recibo el nombre de usuario por query param
        $resultado = $reviewService->usuarioHabilitadoParaReview(
            $_GET['idProducto'] ?? null,
            $_GET['username'] ?? null);
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

    if ($request[0] == 'admin' && $request[1] == 'eliminarProducto') {
        $adminService = new AdminService();
        echo json_encode($adminService->eliminarProducto($data->producto_id));
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
            $_GET['username'] ?? null
        );
        http_response_code($result['httpCode']);
        echo json_encode($result);
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
            echo json_encode($carritoService->crearCompra($data['username'],$data['costoCarrito']));
            break;

        default:
            http_response_code(404);
            echo json_encode(['error' => 'Acción no encontrada']);
            break;
    }
}

function handleAdminRequest($adminService, $action, $data)
{
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
    }
}
