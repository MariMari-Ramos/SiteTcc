<?php
session_start();
include("../conexao.php");

error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json; charset=utf-8');

$identificador = isset($_POST['email']) ? trim($_POST['email']) : '';
$senha = isset($_POST['senha']) ? $_POST['senha'] : '';

if (empty($identificador) || empty($senha)) {
    echo json_encode(["status" => "error", "message" => "Preencha todos os campos!"]);
    exit;
}

// Buscar usuário por email OU nome de perfil
$sql = "SELECT u.id, u.email, u.senha FROM usuarios u 
        LEFT JOIN perfis p ON u.id = p.usuario_id 
        WHERE u.email = ? OR p.nome_perfil = ? 
        LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $identificador, $identificador);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $user = $result->fetch_assoc();

    // Verifica tanto senhas antigas (md5) quanto novas (password_hash)
    if (
        (strlen($user['senha']) === 32 && md5($senha) === $user['senha']) ||
        password_verify($senha, $user['senha'])
    ) {
        // CORREÇÃO: Garantir que usuario_id seja salvo na sessão
        $_SESSION['usuario_id'] = $user['id'];
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email'] = $user['email'];

        // Buscar informações do perfil
        $stmt_perfil = $conn->prepare("SELECT nome_perfil, foto_perfil FROM perfis WHERE usuario_id = ?");
        $stmt_perfil->bind_param("i", $user['id']);
        $stmt_perfil->execute();
        $result_perfil = $stmt_perfil->get_result();
        
        if($result_perfil->num_rows > 0) {
            $perfil = $result_perfil->fetch_assoc();
            $_SESSION['nome_perfil'] = $perfil['nome_perfil'];
            $_SESSION['foto_perfil'] = $perfil['foto_perfil'];
            
            echo json_encode([
                "status" => "success", 
                "message" => "Login realizado com sucesso!",
                "redirect" => "../Home/index.php"
            ]);
        } else {
            // Usuário não tem perfil, redirecionar para criar
            echo json_encode([
                "status" => "success", 
                "message" => "Complete seu cadastro criando um perfil!",
                "redirect" => "../Cadastro_E_Perfil/CPerfilhtml.php"
            ]);
        }
        
        $stmt_perfil->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Senha incorreta!"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Email ou nome de perfil não encontrado!"]);
}

$stmt->close();
$conn->close();
?>