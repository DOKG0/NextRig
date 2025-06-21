<?php 
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

class ContactoService {
    public function recibirCorreo($nombre, $email, $mensaje){
        file_put_contents('debug.txt', json_encode([$nombre, $email, $mensaje]));
        include 'mailCredentials.php';
        $mail = new PHPMailer(true);
        try{
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = $mail_credentials_username;
            $mail->Password = $mail_credentials_password;
            $mail->SMTPSecure = 'tls';
            $mail->Port = 587;

            $mail->setFrom($email, $nombre);
            $mail->addAddress($mail_credentials_username, 'NextRig');

            $mail->isHTML(true);
            $mail->Subject = 'Nuevo mensaje de contacto desde NextRig';
            $mail->Body    = "<b>Nombre:</b> $nombre<br><b>Email:</b> $email<br><b>Mensaje:</b><br>$mensaje";

            $mail->send();
            return ['success' => true, 'mensaje' => 'Correo enviado correctamente'];
        } catch (Exception $e) {
            return ['success' => false, 'mensaje' => "Error al enviar el correo: {$mail->ErrorInfo}"];
        }
    }

    public function enviarFacturaPorEmail($email, $nombreCompleto, $idCompra, $pathFactura)
    {
        include 'mailCredentials.php';
        $mail = new PHPMailer(true);
        
        try {
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = $mail_credentials_username;
            $mail->Password = $mail_credentials_password;
            $mail->SMTPSecure = 'tls';
            $mail->Port = 587;

            $mail->setFrom($mail_credentials_username, 'NextRig');
            $mail->addAddress($email, $nombreCompleto);

            $mail->isHTML(true);
            $mail->Subject = 'Factura de tu compra en NextRig - Orden #' . str_pad($idCompra, 6, '0', STR_PAD_LEFT);
            
            $mail->Body = "
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <div style='background-color: #007bff; color: white; padding: 20px; text-align: center;'>
                    <h1 style='margin: 0; font-size: 28px;'>NextRig</h1>
                    <p style='margin: 5px 0 0 0; font-size: 16px;'>Tu tienda de confianza para componentes de PC</p>
                </div>
                
                <div style='padding: 30px; background-color: #f8f9fa;'>
                    <h2 style='color: #333; margin-bottom: 20px;'>¡Gracias por tu compra!</h2>
                    
                    <p>Hola <strong>{$nombreCompleto}</strong>,</p>
                    
                    <p>Tu compra ha sido procesada exitosamente. En el archivo adjunto encontrarás tu factura detallada.</p>
                    
                    <div style='background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;'>
                        <h3 style='margin-top: 0; color: #007bff;'>Detalles de tu orden:</h3>
                        <p><strong>Número de factura:</strong> #" . str_pad($idCompra, 6, '0', STR_PAD_LEFT) . "</p>
                        <p><strong>Fecha:</strong> " . date('d/m/Y H:i:s') . "</p>
                    </div>
                    
                    <p>Si tienes alguna pregunta sobre tu compra, no dudes en contactarnos.</p>
                    
                    <p style='margin-top: 30px;'>
                        Saludos cordiales,<br>
                        <strong>El equipo de NextRig</strong>
                    </p>
                </div>
                
                <div style='background-color: #333; color: white; padding: 15px; text-align: center; font-size: 12px;'>
                    <p style='margin: 0;'>Este correo fue generado automáticamente. Por favor no respondas a este mensaje.</p>
                </div>
            </div>";

            if (file_exists($pathFactura)) {
                $mail->addAttachment($pathFactura, 'factura_' . $idCompra . '.pdf');
            }

            $mail->send();
            return ['success' => true, 'mensaje' => 'Factura enviada por email correctamente'];
            
        } catch (Exception $e) {
            return ['success' => false, 'mensaje' => "Error al enviar la factura: {$mail->ErrorInfo}"];
        }
    }
}

?>