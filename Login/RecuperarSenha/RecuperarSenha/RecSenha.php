<?php


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../../../src/Exception.php';
require __DIR__ . '/../../../src/PHPMailer.php';
require __DIR__ . '/../../../src/SMTP.php';


$mail = new PHPMailer(true);

$email=$_POST["email"];
$token= bin2hex(random_bytes (16));
$token_hash=hash("sha256",$token);
$expire= date("Y-m-d H:i:s", time() + 60 * 30);
$mysql=require __DIR__ . "/../../../conexao.php";
$sql= "UPDATE usuarios
    SET reset_token_hash=?
        reset_token_expires_at=?
    WHERE email=?";
$stmt=

try {
    // Configurações do servidor SMTP
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';  // ex: smtp.gmail.com
    $mail->SMTPAuth   = true;
    $mail->Username   = 'systemforgerpg@gmail.com';
    $mail->Password   = 'nauc ulnh gdto djtq';
    $mail->SMTPSecure = 'PHPMailer::ENCRYPTION_STARTTLS'; // ou PHPMailer::ENCRYPTION_SMTPS
    $mail->Port       = 587; // 465 para SMTPS

    // Remetente e destinatário
    $mail->setFrom('systemforgerpg@gmail.com', 'System Forge');
    $mail->addAddress('$emailUsuario', 'Mariana');

    // Conteúdo
    $mail->isHTML(true);
    $mail->Subject = 'Teste com PHPMailer';
    $mail->Body    = '<p>Olá — este é um teste <b>HTML</b>!</p>';
    $mail->AltBody = 'Olá — este é um teste em texto simples.';

    $mail->send();
    echo "Mensagem enviada com sucesso!";
} catch (Exception $e) {
    echo "Não foi possível enviar. Mailer Error: {$mail->ErrorInfo}";
}
?>

