<?php
include_once 'usuarioService.php';
include_once 'adminService.php';
include_once 'productoService.php';
include_once 'marcaService.php';

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

            default:
                $productos = $productosService->listarProductos();
                echo json_encode($productos);
                break;
        }
    }
    if ($request[0] == 'marcas') {
        $marcasService = new MarcaService();
        $marcas = $marcasService->listarMarcas();
        echo json_encode($marcas);
    }
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
    }
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

        default:
            http_response_code(404);
            echo json_encode(['error' => 'Acción no encontrada']);
            break;
    }
}

function handleAdminRequest($adminService, $action, $data)
{
    switch ($action) {
        case 'addProducto':
            echo json_encode($adminService->addProducto(
                $data['id'],
                $data['nombre'],
                $data['precio'],
                $data['stock'],
                $data['descripcion'],
                $data['imagen'],
                $data['categoria'],
                $data['admin_ci'],
                $data['marca_nombre']
            ));
            break;
        case 'addMarca':
            if (!requiredFieldsExist($data, ['marca'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos incompletos']);
                return;
            }
            echo json_encode($adminService->addMarca);
            break;
    }
}
