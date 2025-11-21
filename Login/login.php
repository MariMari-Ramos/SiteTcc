<?php
session_start();
include("../conexao.php");
require_once __DIR__ . "/../password.php";

error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json; charset=utf-8');

$identificador = isset($_POST['email']) ? trim($_POST['email']) : '';
$senha = isset($_POST['senha']) ? $_POST['senha'] : '';

if (empty($identificador) || empty($senha)) {
    echo json_encode(["status" => "error", "message" => "Preencha todos os campos!"]);
    exit;
}

// Buscar usuário pelo email OU pelo nome do perfil associado
// Usa LEFT JOIN em perfis para permitir login usando o nome de perfil
$sql = "SELECT u.id, u.email, u.senha
        FROM usuarios u
        LEFT JOIN perfis p ON p.usuario_id = u.id
        WHERE u.email = ? OR p.nome_perfil = ?
        LIMIT 1";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Erro no prepare: " . $conn->error);
}

$stmt->bind_param("ss", $identificador, $identificador);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {

    $user = $result->fetch_assoc();

    // Verifica senha antiga MD5 OU senha nova com password_hash
    $senhaCorreta =
        (strlen($user['senha']) === 32 && md5($senha) === $user['senha']) ||
        password_verify($senha, $user['senha']);

    if ($senhaCorreta) {

        $_SESSION['usuario_id'] = $user['id'];
        $_SESSION['email'] = $user['email'];

        echo json_encode([
            "status" => "success",
            "message" => "Login realizado com sucesso!",
            "redirect" => "../A_TelaPrincipal/index.php"
        ]);

    } else {
        echo json_encode(["status" => "error", "message" => "Senha incorreta!"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Email ou Nome de Perfil não encontrado!"]);
}

$stmt->close();
$conn->close();
?>
