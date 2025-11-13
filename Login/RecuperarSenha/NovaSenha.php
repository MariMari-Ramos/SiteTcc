<?php
$token=$_POST["token"];
date_default_timezone_set('America/Sao_Paulo');
$token_hash=hash("sha256", $token);
$mysqli= require __DIR__ . "/../../conexao.php";
$sql= "SELECT * FROM usuarios
    WHERE reset_token_hash=?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("s", $token_hash);
$stmt->execute();
$result= $stmt->get_result();
$usuario= $result->fetch_assoc();
if($usuario===null){
    die("Token inválido.");
}
if (strtotime($usuario["reset_token_expires_at"]) <= time()){
    die("Token expirado.");
}

$sql = "UPDATE usuarios
    SET senha=?,
        reset_token_hash=NULL,
        reset_token_expires_at=NULL
    WHERE id=?";
$stmt = $mysqli->prepare($sql);
$password_hash = password_hash($_POST["NovaSenha"], PASSWORD_DEFAULT);

$stmt->bind_param("ss", $password_hash, $usuario["id"]);
$stmt->execute();
echo "Senha redefinida com sucesso.";
?>