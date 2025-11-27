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

$input = file_get_contents('php://input');
$config = json_decode($input, true);
// Debug temporário para ver o que chega
//file_put_contents('debug_save.txt', $input . "\n" . print_r($config, true));

if (!is_array($config)) {
    http_response_code(400);
    echo json_encode(['error' => 'Configuração inválida']);
    exit;
}

// Upsert (insere ou atualiza)
$sql = "INSERT INTO configuracoes_principal (usuario_id, configuracoes) VALUES (?, ?)
        ON DUPLICATE KEY UPDATE configuracoes = VALUES(configuracoes)";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro no prepare: ' . $conn->error]);
    exit;
}
$json = json_encode($config, JSON_UNESCAPED_UNICODE);
if (!$stmt->bind_param('is', $usuario_id, $json)) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro no bind_param: ' . $stmt->error]);
    exit;
}
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao salvar configurações: ' . $stmt->error]);
}
$stmt->close();
$conn->close();
?>