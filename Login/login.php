<?php
session_start();
include("../conexao.php");

error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: text/plain; charset=utf-8');


header('Content-Type: application/json; charset=utf-8');

$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$senha = isset($_POST['senha']) ? $_POST['senha'] : '';
$lembrar =isset($_POST["CBXLembrarSenha"]);

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

    if($lembrar){
        $token = bin2hex(random_bytes(32));
        setcookie('lembrar_tolken', $tolken, time() + (60), "/", "", false, true);
        $sqlTolken = "UPDATE usuarios SET token_login = '$token' WHERE id = " . $usuario['id'];
        mysqli_query($conexao, $sqlTolken);
    }

    echo json_encode(["status"=>"success","message"=>"Login realizado com sucesso!"]);
    } else {
        echo json_encode(["status"=>"error","message"=>"Senha incorreta!"]);
    }
} else {
    echo json_encode(["status"=>"error","message"=>"Email não encontrado!"]);
}

