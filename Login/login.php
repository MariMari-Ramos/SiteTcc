<?php
session_start();
include("../conexao.php");

error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json; charset=utf-8');

$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$senha = isset($_POST['senha']) ? $_POST['senha'] : '';

if (empty($email) || empty($senha)) {
    echo json_encode(["status" => "error", "message" => "Preencha todos os campos!"]);
    exit;
}

// Usar prepared statements para evitar SQL Injection
$sql = "SELECT * FROM usuarios WHERE email = ? LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $user = $result->fetch_assoc();

    // Verifica tanto senhas antigas (md5) quanto novas (password_hash)
    if (
        (strlen($user['senha']) === 32 && md5($senha) === $user['senha']) ||
        password_verify($senha, $user['senha'])
    ) {
        // login bem-sucedido
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email'] = $user['email'];

        echo json_encode(["status" => "success", "message" => "Login realizado com sucesso!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Senha incorreta!"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Email não encontrado!"]);
}
?>
