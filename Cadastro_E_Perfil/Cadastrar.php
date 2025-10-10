<?php
session_start();
include("../conexao.php");

header('Content-Type: application/json; charset=utf-8');

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

// Verifica se o email já existe
$sql_check = "SELECT id FROM usuarios WHERE email = ?";
$stmt = $conn->prepare($sql_check);
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Email já cadastrado!"]);
    exit;
}
$stmt->close();

// Cria o usuário
$senha_hash = md5($senha); // compatibilidade
$sql_insert = "INSERT INTO usuarios (email, senha) VALUES (?, ?)";
$stmt = $conn->prepare($sql_insert);
$stmt->bind_param("ss", $email, $senha_hash);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Usuário criado com sucesso! Verifique seu e-mail."]);
} else {
    echo json_encode(["status" => "error", "message" => "Erro ao criar usuário: " . $conn->error]);
}

$stmt->close();
$conn->close();
