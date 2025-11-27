<?php
session_start();

require_once '../../conexao.php'; // ajuste o caminho se necessário
if (!isset($conn) || !$conn) {
    http_response_code(500);
    echo json_encode(['error' => 'Conexão com o banco não estabelecida.']);
    exit;
}

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Usuário não autenticado']);
    exit;
}

$usuario_id = $_SESSION['usuario_id'];


$sql = "SELECT configuracoes FROM configuracoes_principal WHERE usuario_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $usuario_id);
$stmt->execute();
$stmt->bind_result($config_json);

if ($stmt->fetch() && $config_json) {
    header('Content-Type: application/json');
    echo $config_json;
} else {
    // Retorna padrão se não houver config
    echo json_encode([
        "theme" => "light",
        "language" => "pt-BR",
        "carousel" => true,
        "guide" => true,
        "alerts" => true,
        "fontSize" => "16",
        "fontType" => "OpenDyslexic",
        "lineSpacing" => "1.5",
        "highContrast" => false,
        "autoRead" => false
    ]);
}

$stmt->close();
$conn->close();
?>