<?php
session_start();
header('Content-Type: application/json');
include("../conexao.php");

if (empty($_SESSION['usuario_id'])) {
    echo json_encode([]);
    exit;
}

$id_usuario = intval($_SESSION['usuario_id']);

$sql = "
SELECT 
    f.id_ficha,
    f.nome_personagem,
    f.nivel,
    f.dados_json,
    f.data_criacao,
    s.nome_sistema
FROM ficha_per f
LEFT JOIN sis_rpg s ON s.id_sistema = f.id_sistema
WHERE f.id_usuario = ?
ORDER BY f.data_criacao DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_usuario);
$stmt->execute();
$res = $stmt->get_result();

$fichas = [];
while ($row = $res->fetch_assoc()) {
    $row['dados_json'] = json_decode($row['dados_json'], true);
    $fichas[] = $row;
}

echo json_encode($fichas);
