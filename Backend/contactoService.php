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
}

?>