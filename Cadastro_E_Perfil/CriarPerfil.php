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

// caminho do log (arquivo será criado ao lado do script)
$logFile = __DIR__ . '/../debug_criarperfil.log';

// Função util para registrar logs (append)
function log_debug($msg) {
    global $logFile;
    $time = date('Y-m-d H:i:s');
    @file_put_contents($logFile, "[$time] $msg\n", FILE_APPEND);
}

// Transformar warnings/notices em exceções
set_error_handler(function($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
});
set_exception_handler(function($e) {
    // registra o erro e responde JSON de erro (sem mais texto)
    log_debug("EXCEPTION: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro interno. Verifique o log.']);
    exit();
});

// Evitar que PHP envie warnings ao cliente
ini_set('display_errors', '0');
error_reporting(E_ALL);

try {
    

    // Verificar sessão
    if(!isset($_SESSION['usuario_id'])){
        echo json_encode(['success' => false, 'message' => 'Usuário não autenticado']);
        exit();
    }
    $usuario_id = $_SESSION['usuario_id'];

    // Verificar se já tem perfil
    $stmt = $conn->prepare("SELECT id FROM perfis WHERE usuario_id = ?");
    if(!$stmt) throw new Exception("Erro no prepare SELECT: " . $conn->error);
    $stmt->bind_param("i", $usuario_id);
    $stmt->execute();
    $res = $stmt->get_result();
    if($res && $res->num_rows > 0){
        echo json_encode(['success' => false, 'message' => 'Perfil já existe']);
        exit();
    }
    $stmt->close();

    // Obter dados do formulário
    $nome_perfil = trim($_POST['NomePerfil'] ?? $_POST['NomesSugerido'] ?? '');
    $tipo_foto = $_POST['tipoFoto'] ?? null;
    $avatar_selecionado = $_POST['avatarSelecionado'] ?? null;
    $foto_perfil = null;

    if(empty($nome_perfil)){
        echo json_encode(['success' => false, 'message' => 'Nome do perfil é obrigatório']);
        exit();
    }

    // Processar upload local (sempre salva local; upload para Azure só se função existir)
    if(isset($_FILES['FotoPerfil']) && $_FILES['FotoPerfil']['error'] === UPLOAD_ERR_OK){
        $extensao = strtolower(pathinfo($_FILES['FotoPerfil']['name'], PATHINFO_EXTENSION));
        $extensoes_permitidas = ['jpg','jpeg','png','gif','webp'];
        if(!in_array($extensao, $extensoes_permitidas)){
            echo json_encode(['success' => false, 'message' => 'Formato de imagem não permitido']);
            exit();
        }

        $nome_arquivo = $usuario_id . '_' . time() . '.' . $extensao;
        $caminhoSalvar = __DIR__ . '/../uploads/' . $nome_arquivo;

        if(!is_dir(__DIR__ . '/../uploads')){
            if(!mkdir(__DIR__ . '/../uploads', 0777, true)){
                throw new Exception("Não foi possível criar pasta uploads");
            }
        }

        if(!move_uploaded_file($_FILES['FotoPerfil']['tmp_name'], $caminhoSalvar)){
            throw new Exception("move_uploaded_file falhou: " . $_FILES['FotoPerfil']['error']);
        }

        // Primeiro assume-se que a imagem será local
        $foto_perfil = '/uploads/' . $nome_arquivo;
        $tipo_foto = 'upload';
        $avatar_selecionado = null;

        // Se a função azure existir, tenta enviar (mas SEM quebrar se não existir)
        if(function_exists('uploadToAzureBlob')){
            $erroBlob = null;
            $urlBlob = uploadToAzureBlob($caminhoSalvar, $nome_arquivo, $erroBlob);
            if($urlBlob){
                $foto_perfil = $urlBlob;
            } else {
                // registra erro do blob, mas continua com o caminho local
                log_debug("Azure upload failed: " . var_export($erroBlob, true));
            }
        } else {
            log_debug("uploadToAzureBlob não existe — pulando envio para Azure");
        }
    }
    elseif(!empty($avatar_selecionado)){
        $normalized = preg_replace('#^\.\./#', '', $avatar_selecionado);
        $foto_perfil = '/' . trim('SiteTcc/' . ltrim($normalized, '/'), '/');
        $tipo_foto = 'avatar';
    }

    // Garantir que tipo_foto tenha valor válido (evita erro enum/not null)
    if(empty($tipo_foto)) $tipo_foto = 'avatar';

    // Inserir perfil no banco
    $stmt = $conn->prepare("INSERT INTO perfis (usuario_id, nome_perfil, foto_perfil, tipo_foto, avatar_selecionado) VALUES (?, ?, ?, ?, ?)");
    if(!$stmt) throw new Exception("Erro no prepare INSERT: " . $conn->error);
    $stmt->bind_param("issss", $usuario_id, $nome_perfil, $foto_perfil, $tipo_foto, $avatar_selecionado);
    if(!$stmt->execute()){
        throw new Exception("Erro no execute INSERT: " . $stmt->error);
    }
    $stmt->close();
    $conn->close();

    // Logout
    session_destroy();

    // Resposta de sucesso
    echo json_encode([
        'success' => true,
        'message' => 'Perfil criado com sucesso! Faça login novamente.',
        'redirect' => '../Login/loginhtml.php'
    ]);
    exit();

} catch (Exception $e) {
    // Qualquer exceção cai aqui: grava no log e retorna JSON de erro (sem qualquer texto extra)
    log_debug("CATCH: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro interno. Verifique debug_criarperfil.log']);
    exit();
}
?>
