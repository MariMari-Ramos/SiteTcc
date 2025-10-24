<?php
date_default_timezone_set('America/Sao_Paulo');
$email=$_POST["email"];
$token = bin2hex(openssl_random_pseudo_bytes(16));
$token_hash=hash("sha256", $token);
$expire= date("Y-m-d H:i:s", time() + 60 * 30);
require __DIR__ . "/../../../conexao.php";
$sql= "UPDATE usuarios
    SET reset_token_hash=?,
        reset_token_expires_at=?
    WHERE email=?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("sss", $token_hash, $expire, $email);
$stmt->execute();
?>

