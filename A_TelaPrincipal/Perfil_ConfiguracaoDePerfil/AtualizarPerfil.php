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
$nome_perfil = trim($_POST['username'] ?? '');
$tipo_foto = $_POST['tipoFoto'] ?? null;
$avatar_selecionado = $_POST['avatarSelecionado'] ?? null;
$remover_foto = $_POST['removerFoto'] ?? '0';
$foto_perfil = null;

// Validar nome do perfil
if(empty($nome_perfil)){
    echo json_encode(['success' => false, 'message' => 'Nome do perfil é obrigatório']);
    exit();
}

// Buscar foto atual
$stmt = $conn->prepare("SELECT foto_perfil, tipo_foto FROM perfis WHERE usuario_id = ?");
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$result = $stmt->get_result();
$perfil_atual = $result->fetch_assoc();
$foto_atual = $perfil_atual['foto_perfil'] ?? null;
$stmt->close();

// Remover foto de perfil
if($remover_foto === '1'){
    // Se for upload, remover do Azure Blob Storage (opcional: não implementado aqui)
    $foto_perfil = null;
    $tipo_foto = null;
    $avatar_selecionado = null;
}
// Processar upload de nova foto para Azure Blob Storage
elseif(isset($_FILES['profilePhoto']) && $_FILES['profilePhoto']['error'] === UPLOAD_ERR_OK){
    require_once __DIR__ . '/../../src/azure_blob_upload.php';
    $extensao = strtolower(pathinfo($_FILES['profilePhoto']['name'], PATHINFO_EXTENSION));
    $extensoes_permitidas = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if(!in_array($extensao, $extensoes_permitidas)){
        echo json_encode(['success' => false, 'message' => 'Formato de imagem não permitido']);
        exit();
    }
    $nome_arquivo = $usuario_id . '_' . time() . '.' . $extensao;
    $erroBlob = null;
    $urlBlob = uploadToAzureBlob($_FILES['profilePhoto']['tmp_name'], $nome_arquivo, $erroBlob);
    if($urlBlob){
        $foto_perfil = $urlBlob;
        $tipo_foto = 'upload';
        $avatar_selecionado = null;
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao enviar imagem para Azure Blob: ' . $erroBlob]);
        exit();
    }
}
// Avatar selecionado
elseif(!empty($avatar_selecionado)){
    // Normaliza avatares que venham com ../ para um caminho público
    $normalized = $avatar_selecionado;
    $normalized = preg_replace('#^\.\./#', '', $normalized);
    $foto_perfil = '/' . trim('SiteTcc/' . ltrim($normalized, '/'), '/');
    $tipo_foto = 'avatar';
}
// Manter foto atual
else {
    $foto_perfil = $foto_atual;
    $tipo_foto = $perfil_atual['tipo_foto'];
}

// Atualizar perfil no banco
$stmt = $conn->prepare("UPDATE perfis SET nome_perfil = ?, foto_perfil = ?, tipo_foto = ?, avatar_selecionado = ? WHERE usuario_id = ?");
$stmt->bind_param("ssssi", $nome_perfil, $foto_perfil, $tipo_foto, $avatar_selecionado, $usuario_id);

if($stmt->execute()){
    $_SESSION['nome_perfil'] = $nome_perfil;
    $_SESSION['foto_perfil'] = $foto_perfil;
    
    echo json_encode([
        'success' => true, 
        'message' => 'Perfil atualizado com sucesso!',
        'foto_perfil' => $foto_perfil
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao atualizar perfil: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>