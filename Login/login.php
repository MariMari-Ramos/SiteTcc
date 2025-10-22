<?php
session_start();
include("../conexao.php");

error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: text/plain; charset=utf-8');


header('Content-Type: application/json; charset=utf-8');

$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$senha = isset($_POST['senha']) ? $_POST['senha'] : '';
$lembrar = isset($_POST["CBXLembrarSenha"]) ? true : false;
var_dump($_POST);
exit;

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


        $sql = "UPDATE usuarios SET active = 1 WHERE id = " . $user['id'];
        mysqli_query($conexao, $sql);


    echo json_encode(["status"=>"success","message"=>"Login realizado com sucesso!"]);
    } else {
        echo json_encode(["status"=>"error","message"=>"Senha incorreta!"]);
    }
} else {
    echo json_encode(["status"=>"error","message"=>"Email não encontrado!"]);
}

?>