<?php
session_start();
require '../conexao.php';
echo "teste";
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $senha = $_POST['senha'];

    // Buscar usuário pelo email
    $stmt = $conn->prepare("SELECT id, senha, active FROM usuarios WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $_SESSION['error'] = "Usuário não encontrado.";
        header("Location: ../Login/login.html");
        exit;
    }

    $user = $result->fetch_assoc();

    if ($user['active'] == 0) {
        $_SESSION['error'] = "Conta não ativada. Verifique seu e-mail.";
        header("Location: ../Login/login.html");
        exit;
    }

    // Verificação da senha
    if (password_verify($senha, $user['senha'])) {
        $_SESSION['user_id'] = $user['id'];
        header("Location: painel.php"); // redireciona após login
        exit;
    } else {
        $_SESSION['error'] = "Senha incorreta.";
        header("Location: ../Login/login.html");
        exit;
    }
} else {
    header("Location: ../Login/login.html");
    exit;
}
