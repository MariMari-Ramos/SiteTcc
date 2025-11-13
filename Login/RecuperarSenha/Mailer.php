<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../../src/Exception.php';
require __DIR__ . '/../../src/PHPMailer.php';
require __DIR__ . '/../../src/SMTP.php';

$mail = new PHPMailer(true);

$mail->isSMTP();
$mail->SMTPAuth=true;

$mail->Host = 'smtp.gmail.com';
$mail->SMTPSecure=PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port = 587;
$mail->Username = 'systemforgerpg@gmail.com';
$mail->Password = 'szvf pkwd lqeh fqcj';

$mail->isHtml(true);

return $mail;
?>