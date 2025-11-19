<?php
session_start();
include("../conexao.php");

header('Content-Type: application/json');

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

// Processar upload de foto
if(isset($_FILES['FotoPerfil']) && $_FILES['FotoPerfil']['error'] === UPLOAD_ERR_OK){
    $diretorio = "../uploads/perfis/";
    
    if(!is_dir($diretorio)){
        mkdir($diretorio, 0777, true);
    }
    
    $extensao = strtolower(pathinfo($_FILES['FotoPerfil']['name'], PATHINFO_EXTENSION));
    $extensoes_permitidas = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    if(!in_array($extensao, $extensoes_permitidas)){
        echo json_encode(['success' => false, 'message' => 'Formato de imagem não permitido']);
        exit();
    }
    
    $nome_arquivo = $usuario_id . '_' . time() . '.' . $extensao;
    $caminho_completo = $diretorio . $nome_arquivo;
    
    if(move_uploaded_file($_FILES['FotoPerfil']['tmp_name'], $caminho_completo)){
        $foto_perfil = $caminho_completo;
        $tipo_foto = 'upload';
        $avatar_selecionado = null;
    }
} elseif(!empty($avatar_selecionado)){
    $foto_perfil = $avatar_selecionado;
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