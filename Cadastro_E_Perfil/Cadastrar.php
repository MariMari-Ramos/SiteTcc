<?php
session_start();
include("../conexao.php");
require_once __DIR__ . "/../password.php";


header('Content-Type: application/json; charset=utf-8');

// (Opcional) evitar que avisos quebrem o JSON
ini_set('display_errors', 0);
error_reporting(E_ALL);

$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$senha = isset($_POST['password']) ? $_POST['password'] : '';
$confirma_senha = isset($_POST['confirm-password']) ? $_POST['confirm-password'] : '';

if ($email === '' || $senha === '' || $confirma_senha === '') {
    echo json_encode(["status" => "error", "message" => "Preencha todos os campos!"]);
    exit;
}

if ($senha !== $confirma_senha) {
    echo json_encode(["status" => "error", "message" => "As senhas não coincidem!"]);
    exit;
}

if (strlen($senha) < 6) {
    echo json_encode(["status" => "error", "message" => "A senha deve ter no mínimo 6 caracteres!"]);
    exit;
}

// Verifica se o email já existe
$sql_check = "SELECT id FROM usuarios WHERE email = ?";
$stmt = $conn->prepare($sql_check);
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Erro interno (prepare check)."]);
    exit;
}
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Email já cadastrado!"]);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Verificação da função password_hash
if (!function_exists('password_hash')) {
    echo json_encode([
        "status" => "error",
        "message" => "password_hash indisponível. Atualize o PHP (>=5.5) ou inclua a biblioteca password_compat."
    ]);
    $conn->close();
    exit;
}

// Hash seguro da senha
$senha_hash = password_hash($senha, PASSWORD_DEFAULT);

// Inserção
$sql_insert = "INSERT INTO usuarios (email, senha) VALUES (?, ?)";
$stmt = $conn->prepare($sql_insert);
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Erro interno (prepare insert)."]);
    $conn->close();
    exit;
}
$stmt->bind_param("ss", $email, $senha_hash);

if ($stmt->execute()) {
    $usuario_id = $conn->insert_id;
    $_SESSION['usuario_id'] = $usuario_id;
    $_SESSION['user_id'] = $usuario_id;
    $_SESSION['email'] = $email;

    echo json_encode([
        "status" => "success",
        "message" => "Usuário criado com sucesso!",
        "redirect" => "CPerfilhtml.php"
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Erro ao criar usuário."
    ]);
}

$stmt->close();
$conn->close();
exit;
?>