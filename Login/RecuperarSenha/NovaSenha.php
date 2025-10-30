<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
   

    $senha = isset($_POST['NovaSenha']) ? $_POST['NovaSenha'] : '';
    $confirmasenha = isset($_POST['ConfirmarNovaSenha']) ? $_POST['ConfirmarNovaSenha'] : '';

    // Verifica se as senhas coincidem
    if ($senha !== $confirmasenha) {
        die("As senhas não coincidem. Tente novamente.");
    }
}  

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

if ($_SERVER["REQUEST_METHOD"] === "POST") {
   

    $senha = isset($_POST['NovaSenha']) ? $_POST['NovaSenha'] : '';
    $confirmasenha = isset($_POST['ConfirmarNovaSenha']) ? $_POST['ConfirmarNovaSenha'] : '';

    // Verifica se as senhas coincidem
    if ($senha !== $confirmasenha) {
        die("As senhas não coincidem. Tente novamente.");
    }
}  
?>