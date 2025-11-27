<?php
session_start();
include("../conexao.php");
// caminho correto para o arquivo password.php (corrige erro que injetava HTML na resposta JSON)
require_once __DIR__ . "/../password.php";

// Garantir que sempre retornemos JSON (evita que warnings/erros imprimam HTML)
ini_set('display_errors', '0');
ini_set('display_startup_errors', '0');
error_reporting(E_ALL);
header('Content-Type: application/json; charset=utf-8');

// Verificar se está logado
if(!isset($_SESSION['usuario_id'])){
    echo json_encode(['success' => false, 'message' => 'Usuário não autenticado']);
    exit();
}

$usuario_id = $_SESSION['usuario_id'];

// Verificar se já tem perfil
$stmt = $conn->prepare("SELECT id FROM perfis WHERE usuario_id = ?");
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
if($stmt->get_result()->num_rows > 0){
    echo json_encode(['success' => false, 'message' => 'Perfil já existe']);
    exit();
}
$stmt->close();

// Obter dados do formulário
$nome_perfil = trim($_POST['NomePerfil'] ?? $_POST['NomesSugerido'] ?? '');
$tipo_foto = $_POST['tipoFoto'] ?? null;
$avatar_selecionado = $_POST['avatarSelecionado'] ?? null;
$foto_perfil = null;

// Validar nome do perfil
if(empty($nome_perfil)){
    echo json_encode(['success' => false, 'message' => 'Nome do perfil é obrigatório']);
    exit();
}

// Processar upload de foto para Azure Blob Storage
if(isset($_FILES['FotoPerfil']) && $_FILES['FotoPerfil']['error'] === UPLOAD_ERR_OK){
    require_once __DIR__ . '/../src/azure_blob_upload.php';
    $extensao = strtolower(pathinfo($_FILES['FotoPerfil']['name'], PATHINFO_EXTENSION));
    $extensoes_permitidas = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if(!in_array($extensao, $extensoes_permitidas)){
        echo json_encode(['success' => false, 'message' => 'Formato de imagem não permitido']);
        exit();
    }
    $nome_arquivo = $usuario_id . '_' . time() . '.' . $extensao;
    $erroBlob = null;
    $urlBlob = uploadToAzureBlob($_FILES['FotoPerfil']['tmp_name'], $nome_arquivo, $erroBlob);
    if($urlBlob){
        $foto_perfil = $urlBlob;
        $tipo_foto = 'upload';
        $avatar_selecionado = null;
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao enviar imagem para Azure Blob: ' . $erroBlob]);
        exit();
    }
} elseif(!empty($avatar_selecionado)){
    // Normaliza avatares que venham com ../ para um caminho público
    // Ex: "../img/bigorna.png" -> "/SiteTcc/img/bigorna.png"
    $normalized = $avatar_selecionado;
    $normalized = preg_replace('#^\.\./#', '', $normalized);
    $foto_perfil = '/' . trim('SiteTcc/' . ltrim($normalized, '/'), '/');
    $tipo_foto = 'avatar';
}

// Inserir perfil no banco
$stmt = $conn->prepare("INSERT INTO perfis (usuario_id, nome_perfil, foto_perfil, tipo_foto, avatar_selecionado) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("issss", $usuario_id, $nome_perfil, $foto_perfil, $tipo_foto, $avatar_selecionado);

if($stmt->execute()){
    // Destruir a sessão para que o usuário faça login novamente
    session_destroy();
    
    echo json_encode([
        'success' => true, 
        'message' => 'Perfil criado com sucesso! Faça login novamente para continuar.',
        'redirect' => '../Login/loginhtml.php'
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao criar perfil: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>