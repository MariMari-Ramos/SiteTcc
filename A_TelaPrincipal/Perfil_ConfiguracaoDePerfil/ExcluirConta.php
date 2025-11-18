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

// Buscar foto de perfil para deletar arquivo
$stmt = $conn->prepare("SELECT foto_perfil, tipo_foto FROM perfis WHERE usuario_id = ?");
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$result = $stmt->get_result();

if($result->num_rows > 0){
    $perfil = $result->fetch_assoc();
    $foto_perfil = $perfil['foto_perfil'];
    $tipo_foto = $perfil['tipo_foto'];
    
    // Deletar arquivo de foto se for upload
    if($foto_perfil && $tipo_foto === 'upload' && file_exists($foto_perfil)){
        unlink($foto_perfil);
    }
}
$stmt->close();

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