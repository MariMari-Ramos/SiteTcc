<?php
session_start();
include("../conexao.php");
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Login</title>
  <script src="../login.js" defer></script>
</head>
<body>
<?php
$email = $_POST['email'] ?? '';
$senha = $_POST['senha'] ?? '';

if (empty($email) || empty($senha)) {
    echo "<script>mostrarAlerta('Preencha todos os campos!');</script>";
    exit;
}

// Busca usuário no banco
$sql = "SELECT * FROM usuarios WHERE email = '$email' LIMIT 1";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $user = $result->fetch_assoc();

    // Se você ainda usa MD5:
    if ($user['senha'] === md5($senha)) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email'] = $user['email'];

        // Sucesso → mostra modal e redireciona
        echo "<script>
                mostrarAlerta('Login realizado com sucesso!');
                setTimeout(()=>{window.location.href='../A_TelaPrincipal/index.html';},1500);
              </script>";
    } else {
        echo "<script>mostrarAlerta('Senha incorreta!');</script>";
    }
} else {
    echo "<script>mostrarAlerta('Email não encontrado!');</script>";
}
?>
