<?php
date_default_timezone_set('America/Sao_Paulo');
$email=$_POST["email"];
$token = bin2hex(openssl_random_pseudo_bytes(16));
$token_hash=hash("sha256", $token);
$expire= date("Y-m-d H:i:s", time() + 60 * 30);
require __DIR__ . "/../../conexao.php";
$sql= "UPDATE usuarios
    SET reset_token_hash=?,
        reset_token_expires_at=?
    WHERE email=?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("sss", $token_hash, $expire, $email);
$stmt->execute();
if($mysqli->affected_rows){
    $mail= require __DIR__ . "/Mailer.php";
    $mail->CharSet = 'UTF-8';
    $mail->setFrom('noreply@example.com', 'System Forge RPG');
    $mail->addAddress($email);
    $mail->Subject = 'Redefinição de senha';
    $mail->Body = <<<END

Clique <a href="http://localhost/SiteTcc/Login/RecuperarSenha/ValiToken.php?token=$token">aqui</a> para redefinir sua senha. Este link expirará em 30 minutos.

END;
    
    try {
        $mail->send();
    } catch (Exception $e) {
        echo "Erro ao enviar email: {$mail->ErrorInfo}";
    }
}
?>