<?php
header('Content-Type: application/json; charset=utf-8');
session_start();

// Conexão com DB
require_once __DIR__ . '/../../conexao.php';

// Defaults unificados
$defaults = [
    'enableWaves' => true,
    'theme' => 'light',
    'enableClickEffect' => true,
    'enableHoldEffect' => true,
    'highContrast' => false,
    'largerText' => false,
    'fontSize' => '16',
    'fontType' => 'OpenDyslexic',
    'lineSpacing' => '1.5',
    'carousel' => true,
    'guide' => true,
    'alerts' => true,
    'language' => 'pt-BR',
    'autoRead' => false
];

if (empty($_SESSION['usuario_id'])) {
    echo json_encode([ 'success' => false, 'message' => 'not_authenticated', 'settings' => $defaults ]);
    exit;
}

$usuario_id = intval($_SESSION['usuario_id']);

// Buscar configurações do usuário
$stmt = $conn->prepare('SELECT settings FROM user_settings WHERE usuario_id = ? LIMIT 1');
if (!$stmt) {
    echo json_encode([ 'success' => false, 'message' => 'db_error', 'error' => $conn->error, 'settings' => $defaults ]);
    exit;
}

$stmt->bind_param('i', $usuario_id);
$stmt->execute();
$res = $stmt->get_result();

if ($res && $res->num_rows > 0) {
    $row = $res->fetch_assoc();
    $settings = json_decode($row['settings'], true);
    if (!is_array($settings)) $settings = $defaults;
    echo json_encode([ 'success' => true, 'settings' => $settings ]);
} else {
    // sem registro -> retorna defaults
    echo json_encode([ 'success' => true, 'settings' => $defaults ]);
}

$stmt->close();
exit;

