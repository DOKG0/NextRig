<?php
require_once('config.php');
require_once 'vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;

class PDFService
{
    private $db_conn;

    public function __construct()
    {
        $database = new Database();
        $this->db_conn = $database->getConnection();
    }

    public function generarFacturaCompra($username, $idCompra)
    {
        if (is_null($username) || empty($username) || is_null($idCompra) || empty($idCompra)) {
            return [
                'success' => false,
                'error' => 'Parámetros faltantes'
            ];
        }

        $username = mysqli_real_escape_string($this->db_conn, $username);
        $idCompra = mysqli_real_escape_string($this->db_conn, $idCompra);

        $queryCompra = "SELECT c.IDcompra, c.fechaCompra, c.costoCarrito, c.depto, c.direccion, c.telefono,
                               u.nombre, u.apellido, u.correo
                        FROM Compra c
                        JOIN Usuario u ON c.ci = u.ci
                        WHERE u.username = '$username' AND c.IDcompra = '$idCompra'";
        
        $resultCompra = mysqli_query($this->db_conn, $queryCompra);
        
        if (!$resultCompra || mysqli_num_rows($resultCompra) === 0) {
            return [
                'success' => false,
                'error' => 'Compra no encontrada'
            ];
        }

        $compra = mysqli_fetch_object($resultCompra);

        $queryProductos = "SELECT p.nombre, p.imagen, cp.precioUnitario, cp.cantidad,
                                  (cp.precioUnitario * cp.cantidad) as subtotal
                           FROM Compra_Producto cp
                           JOIN Productos p ON cp.idProducto = p.id
                           WHERE cp.idCompra = '$idCompra'
                           ORDER BY p.nombre";
        
        $resultProductos = mysqli_query($this->db_conn, $queryProductos);
        
        if (!$resultProductos) {
            return [
                'success' => false,
                'error' => 'Error al obtener productos'
            ];
        }

        try {
            $html = $this->generarHTMLFactura($compra, $resultProductos);

            $options = new Options();
            $options->set('defaultFont', 'DejaVu Sans');
            $options->set('isRemoteEnabled', true);
            $options->set('isHtml5ParserEnabled', true);
            
            $dompdf = new Dompdf($options);
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();
            
            $filename = 'factura_' . $idCompra . '_' . date('Y-m-d') . '.pdf';
            $filepath = 'facturas/' . $filename;
            
            if (!file_exists('facturas/')) {
                mkdir('facturas/', 0777, true);
            }

            file_put_contents($filepath, $dompdf->output());
           
            return [
                'success' => true,
                'filename' => $filename,
                'filepath' => $filepath
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => 'Error al generar PDF: ' . $e->getMessage()
            ];
        }
    }

    private function generarHTMLFactura($compra, $resultProductos)
    {
        $html = '<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { 
                    font-family: DejaVu Sans, Arial, sans-serif; 
                    margin: 20px; 
                    color: #333;
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 30px;
                    border-bottom: 2px solid #007bff;
                    padding-bottom: 15px;
                }
                .company-name { 
                    font-size: 28px; 
                    font-weight: bold; 
                    color: #007bff;
                    margin-bottom: 5px;
                }
                .invoice-title { 
                    font-size: 16px; 
                    color: #666;
                }
                .section { 
                    margin-bottom: 25px; 
                }
                .section-title { 
                    font-size: 14px; 
                    font-weight: bold; 
                    margin-bottom: 10px; 
                    background-color: #f8f9fa;
                    padding: 8px;
                    border-left: 4px solid #007bff;
                }
                .info-row { 
                    margin-bottom: 6px; 
                    line-height: 1.4;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin-top: 15px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                th, td { 
                    border: 1px solid #ddd; 
                    padding: 10px; 
                    text-align: left; 
                }
                th { 
                    background-color: #007bff; 
                    color: white;
                    font-weight: bold; 
                }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
                .total-section { 
                    margin-top: 30px; 
                }
                .total-table {
                    width: 300px; 
                    margin-left: auto;
                    border: 2px solid #007bff;
                }
                .total-row { 
                    background-color: #f8f9fa; 
                }
                .grand-total { 
                    background-color: #007bff; 
                    color: white;
                    font-size: 16px; 
                    font-weight: bold;
                }
                .footer {
                    margin-top: 50px; 
                    text-align: center; 
                    font-size: 12px; 
                    color: #666;
                    border-top: 1px solid #eee;
                    padding-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="company-name">NextRig</div>
                <div class="invoice-title">Factura de Compra</div>
            </div>

            <div class="section">
                <div class="section-title">Información del Cliente</div>
                <div class="info-row"><strong>Nombre:</strong> ' . htmlspecialchars($compra->nombre . ' ' . $compra->apellido) . '</div>
                <div class="info-row"><strong>Email:</strong> ' . htmlspecialchars($compra->correo) . '</div>
                <div class="info-row"><strong>Teléfono:</strong> ' . htmlspecialchars($compra->telefono) . '</div>
                <div class="info-row"><strong>Dirección:</strong> ' . htmlspecialchars($compra->direccion . ', ' . $compra->depto) . '</div>
            </div>

            <div class="section">
                <div class="section-title">Detalles de la Compra</div>
                <div class="info-row"><strong>Número de Factura:</strong> #' . str_pad($compra->IDcompra, 6, '0', STR_PAD_LEFT) . '</div>
                <div class="info-row"><strong>Fecha de Compra:</strong> ' . date('d/m/Y', strtotime($compra->fechaCompra)) . '</div>
                <div class="info-row"><strong>Hora:</strong> ' . date('H:i:s') . '</div>
            </div>

            <div class="section">
                <div class="section-title">Productos Adquiridos</div>
                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Precio Unitario</th>
                            <th>Cantidad</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>';

        $total = 0;
        while ($producto = mysqli_fetch_object($resultProductos)) {
            $html .= '<tr>
                        <td>' . htmlspecialchars($producto->nombre) . '</td>
                        <td class="text-right">$' . number_format($producto->precioUnitario, 2) . '</td>
                        <td class="text-center">' . $producto->cantidad . '</td>
                        <td class="text-right">$' . number_format($producto->subtotal, 2) . '</td>
                      </tr>';
            $total += $producto->subtotal;
        }

        $descuento = $total * 0.15;
        $totalFinal = $total - $descuento;

        $html .= '
                    </tbody>
                </table>
            </div>

            <div class="total-section">
                <table class="total-table">
                    <tr class="total-row">
                        <td><strong>Subtotal:</strong></td>
                        <td class="text-right">$' . number_format($total, 2) . '</td>
                    </tr>
                    <tr class="total-row">
                        <td><strong>Descuento (15%):</strong></td>
                        <td class="text-right">-$' . number_format($descuento, 2) . '</td>
                    </tr>
                    <tr class="grand-total">
                        <td><strong>TOTAL A PAGAR:</strong></td>
                        <td class="text-right"><strong>$' . number_format($totalFinal, 2) . '</strong></td>
                    </tr>
                </table>
            </div>

            <div class="footer">
                <p><strong>¡Gracias por elegir NextRig!</strong></p>
                <p>Tu tienda de confianza para componentes de PC</p>
                <p><em>Esta factura fue generada automáticamente el ' . date('d/m/Y H:i:s') . '</em></p>
            </div>
        </body>
        </html>';

        return $html;
    }
}
?>