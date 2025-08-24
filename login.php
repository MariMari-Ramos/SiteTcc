<?php
$usuarioCorreto = "teste@exemplo.com";
$senhaCorretaHash = password_hash("12345", PASSWORD_DEFAULT);

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = $_POST["email"];
    $senha = $_POST["senha"];

    if ($email === $usuarioCorreto && password_verify($senha, $senhaCorretaHash)) {
        header("Location: home.html");
        exit();
    } else {
        echo "E-mail ou senha inválidos!";
    }
}
?>


<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Login - Resultado</title>
</head>
<body>
  <h2><?php echo $mensagem; ?></h2>
  <a href="login.html">Tentar novamente</a>
</body>
</html>
