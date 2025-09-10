<?php
session_start();
include("../conexao.php");

header('Content-Type: application/json; charset=utf-8');

$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$senha = isset($_POST['senha']) ? $_POST['senha'] : '';

if (empty($email) || empty($senha)) {
    echo json_encode(["status"=>"error","message"=>"Preencha todos os campos!"]);
    exit;
}

$sql = "SELECT * FROM usuarios WHERE email = '$email' LIMIT 1";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $user = $result->fetch_assoc();

    if ($user['senha'] === md5($senha)) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email'] = $user['email'];

        echo json_encode(["status"=>"success","message"=>"Login realizado com sucesso!"]);
    } else {
        echo json_encode(["status"=>"error","message"=>"Senha incorreta!"]);
    }
} else {
    echo json_encode(["status"=>"error","message"=>"Email não encontrado!"]);
}

