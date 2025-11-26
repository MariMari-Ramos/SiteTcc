<?php
session_start();
include("../../conexao.php");

header('Content-Type: application/json');

// Verificar autenticação
if(!isset($_SESSION['usuario_id'])){
    echo json_encode(['success' => false, 'message' => 'Usuário não autenticado']);
    exit();
}

$usuario_id = $_SESSION['usuario_id'];

// Não é mais necessário deletar arquivos locais de foto de perfil, pois imagens são servidas via Azure Blob Storage.

// Deletar perfil (CASCADE vai deletar automaticamente devido à FK)
$stmt = $conn->prepare("DELETE FROM perfis WHERE usuario_id = ?");
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$stmt->close();

// Deletar usuário
$stmt = $conn->prepare("DELETE FROM usuarios WHERE id = ?");
$stmt->bind_param("i", $usuario_id);

if($stmt->execute()){
    // Destruir sessão
    session_destroy();
    
    echo json_encode([
        'success' => true, 
        'message' => 'Conta excluída com sucesso!',
        'redirect' => '../../Login/loginhtml.php'
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao excluir conta: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>