<?php
session_start();
include("../conexao.php");

//tentativa de um login automatico via cookie
if(!isset($_SESSION['user_id']) && isset($_COOKIE['usuario'])) {
    $email_cookie = $_COOKIE['usuario'];
    $sql = "SELECT * FROM usuarios WHERE email='$email_cookie' LIMIT 1";
    $result = $conn->query($sql);

    if($result && $result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email'] = $user['email'];
    }
}

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

    if($user['senha'] === md5($senha)) {
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['email'] = $user['email'];

    // Se o usuário marcou "lembrar de mim", cria o cookie
    if(isset($_POST['CBXLembrarSenha']) && $_POST['CBXLembrarSenha'] == '1') {
        setcookie("usuario", $user['email'], [
            'expires' =>  strtotime("+1 minute"), // 1 minuto
            'path' => '/SiteTcc/Login/loginhtml.php',
            'domain' => 'localhost', // Adapte conforme necessário
            'secure' => false, // true se estiver usando HTTPS
            'httponly' => true,
            'samesite' => 'Lax' // Pode ser 'Lax', 'Strict', ou 'None'
        ]); // 7 dias
    }

    echo json_encode(["status"=>"success","message"=>"Login realizado com sucesso!"]);
    } else {
        echo json_encode(["status"=>"error","message"=>"Senha incorreta!"]);
    }
} else {
    echo json_encode(["status"=>"error","message"=>"Email não encontrado!"]);
}

