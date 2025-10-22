<?php
require __DIR__ . '/phpmailer/src/Exception.php';
require __DIR__ . '/phpmailer/src/PHPMailer.php';
require __DIR__ . '/phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    // Configurações do servidor SMTP
    $mail->isSMTP();
    $mail->Host       = 'marianaramos1903@gmail.com';  // ex: smtp.gmail.com
    $mail->SMTPAuth   = true;
    $mail->Username   = 'systemforgerpg@gmail.com';
    $mail->Password   = '150893JapaneseSupravvti123';
    $mail->SMTPSecure = 'tls'; // ou PHPMailer::ENCRYPTION_SMTPS
    $mail->Port       = 587; // 465 para SMTPS

    // Remetente e destinatário
    $mail->setFrom('seu-email@example.com', 'Seu Nome');
    $mail->addAddress('destino@example.com', 'Nome do Destino');

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

