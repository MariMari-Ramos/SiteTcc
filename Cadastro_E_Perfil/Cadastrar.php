<?php
session_start();
include("../conexao.php");

// Pega os dados do formulário
$email = $_POST['email'] ?? '';
$senha = $_POST['password'] ?? '';
$confirma_senha = $_POST['confirm-password'] ?? '';

if (empty($email) || empty($senha) || empty($confirma_senha)) {
    die("Preencha todos os campos!");
}

if ($senha !== $confirma_senha) {
    die("As senhas não coincidem!");
}

// Verifica se o email já existe
// Verifica se o email já existe
// Verifica se o email já existe
$sql_check = "SELECT id FROM usuarios WHERE email = '$email'";
$result = $conn->query($sql_check);

if ($result && $result->num_rows > 0) {
    die("Email já cadastrado!");
}

// Cria o usuário no banco, senha com hash
$senha_hash = md5($senha); // pra compatibilidade com seu banco atual
$sql_insert = "INSERT INTO usuarios (email, senha, active) VALUES ('$email', '$senha_hash', 0)";

if ($conn->query($sql_insert) === TRUE) {
    echo "Usuário criado com sucesso! Verifique seu e-mail para ativar a conta.";
} else {
    echo "Erro ao criar usuário: " . $conn->error;
}

