<?php
header('Content-Type: application/json; charset=utf-8');
session_start();

require_once __DIR__ . '/../../conexao.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([ 'success' => false, 'message' => 'invalid_method' ]);
    exit;
}

if (empty($_SESSION['usuario_id'])) {
    echo json_encode([ 'success' => false, 'message' => 'not_authenticated' ]);
    exit;
}

$usuario_id = intval($_SESSION['usuario_id']);

$raw = file_get_contents('php://input');
if (empty($raw)) {
    echo json_encode([ 'success' => false, 'message' => 'empty_payload' ]);
    exit;
}

$data = json_decode($raw, true);
if (!is_array($data)) {
    echo json_encode([ 'success' => false, 'message' => 'invalid_json' ]);
    exit;
}

// Sanitize/validate basics if needed (this example accepts any JSON object)
$settingsJson = json_encode($data, JSON_UNESCAPED_UNICODE);
if ($settingsJson === false) {
    echo json_encode([ 'success' => false, 'message' => 'encode_error' ]);
    exit;
}

// Usar INSERT ... ON DUPLICATE KEY UPDATE para manter um registro por usuário
$sql = "INSERT INTO user_settings (usuario_id, settings) VALUES (?, ?) ON DUPLICATE KEY UPDATE settings = VALUES(settings), updated_at = CURRENT_TIMESTAMP";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode([ 'success' => false, 'message' => 'db_prepare_failed', 'error' => $conn->error ]);
    exit;
}

$stmt->bind_param('is', $usuario_id, $settingsJson);
$ok = $stmt->execute();

if ($ok) {
    echo json_encode([ 'success' => true, 'message' => 'saved' ]);
} else {
    echo json_encode([ 'success' => false, 'message' => 'db_execute_failed', 'error' => $stmt->error ]);
}

$stmt->close();
exit;

/*
 * Cliente (exemplo):
 * fetch('/A_TelaPrincipal/Configurações/saveConfig.php', {
 *   method: 'POST',
 *   credentials: 'include',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ theme: 'dark', highContrast: true })
 * }).then(r => r.json()).then(console.log);
 */
