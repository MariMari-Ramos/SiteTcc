<?php
header("Content-Type: application/json; charset=utf-8");
error_reporting(E_ALL);
ini_set("display_errors", 1);

include "../../conexao.php";
session_start();

// Pega os dados do formulário
$nome = $_POST['char-name'] ?? null;
$level = $_POST['level'] ?? null;
$proficiency_bonus = $_POST['proficiency-bonus'] ?? null;
$origin = $_POST['origin'] ?? null;
$specialization = $_POST['specialization'] ?? null;

$str = $_POST['str'] ?? null;
$dex = $_POST['dex'] ?? null;
$con = $_POST['con'] ?? null;
$wis = $_POST['wis'] ?? null;
$int = $_POST['int'] ?? null;
$cha = $_POST['cha'] ?? null;

$ac_natural = $_POST['ac-natural'] ?? null;
$ac_armor = $_POST['ac-armor'] ?? null;
$ac_shield = $_POST['ac-shield'] ?? null;
$ac_dex = $_POST['ac-dex'] ?? null;
$ac_other = $_POST['ac-other'] ?? null;
$ac_total = $_POST['ac-total'] ?? null;

$hp_max = $_POST['hp-max'] ?? null;
$hp_current = $_POST['hp-current'] ?? null;
$hp_temp = $_POST['hp-temp'] ?? null;

$pe_max = $_POST['pe-max'] ?? null;
$pe_current = $_POST['pe-current'] ?? null;
$pe_temp = $_POST['pe-temp'] ?? null;

$integrity_max = $_POST['integrity-max'] ?? null;
$integrity_current = $_POST['integrity-current'] ?? null;
$integrity_temp = $_POST['integrity-temp'] ?? null;

$movement = $_POST['movement'] ?? null;
$initiative = $_POST['initiative'] ?? null;
$attention = $_POST['attention'] ?? null;

$pericias_json = $_POST["pericias_json"] ?? "{}";
$pericias = json_decode($pericias_json, true);

$habilidades = json_decode($_POST["habilidades"] ?? "[]", true);


$energy = $_POST['energy'] ?? null;
$control_reading = $_POST['control-reading'] ?? null;
$barrier = $_POST['barrier'] ?? null;
$domain = $_POST['domain'] ?? null;
$reverse_energy = $_POST['reverse-energy'] ?? null;
$talentos = json_decode($_POST["talentos"] ?? "[]", true);
$treinamentos = json_decode($_POST["treinamentos"] ?? "[]", true);

$id_usuario = $_SESSION["usuario_id"] ?? null;
$id_ficha = isset($_POST['id_ficha']) ? intval($_POST['id_ficha']) : 0;

// Montagem do JSON final
$dados = [
    "info_basicas" => [
        "nome" => $nome,
        "level" => $level,
        "proficiency_bonus" => $proficiency_bonus,
        "origin" => $origin,
        "specialization" => $specialization,
        "str" => $str,
        "dex" => $dex,
        "con" => $con,
        "wis" => $wis,
        "int" => $int,
        "cha" => $cha,
        "ac_natural" => $ac_natural,
        "ac_armor" => $ac_armor,
        "ac_shield" => $ac_shield,
        "ac_dex" => $ac_dex,
        "ac_other" => $ac_other,
        "ac_total" => $ac_total,
    ],

    "combate" => [
        "hp_max" => $hp_max,
        "hp_current" => $hp_current,
        "hp_temp" => $hp_temp,
        "pe_max" => $pe_max,
        "pe_current" => $pe_current,
        "pe_temp" => $pe_temp,
        "integrity_max" => $integrity_max,
        "integrity_current" => $integrity_current,
        "integrity_temp" => $integrity_temp,
        "movement" => $movement,
        "initiative" => $initiative,
        "attention" => $attention,
    ],

    "pericias" => $pericias,
    "habilidades" => $habilidades,

    "perfil_amaldiçoado" => [
        "talentos" => $talentos,
        "energy" => $energy,
        "control_reading" => $control_reading,
        "barrier" => $barrier,
        "domain" => $domain,
        "reverse_energy" => $reverse_energy,
        "treinamentos" => $treinamentos,
    ],
];

$dados_json = json_encode($dados, JSON_UNESCAPED_UNICODE);

// ------------------------------
// UPDATE
// ------------------------------
if ($id_ficha > 0) {

    $stmt = $mysqli->prepare("
        UPDATE ficha_per 
        SET dados_json = ?, ultima_atualizacao = NOW()
        WHERE id_ficha = ?
    ");

    $stmt->bind_param("si", $dados_json, $id_ficha);
    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Ficha atualizada!",
        "id_ficha" => $id_ficha
    ]);
    exit;
}

// ------------------------------
// INSERT
// ------------------------------
$stmt = $mysqli->prepare("
    INSERT INTO ficha_per (nome_personagem, dados_json, data_criacao, ultima_atualizacao, id_usuario, id_sistema)
    VALUES (?, ?, NOW(), NOW(), ?, 1)
");

$stmt->bind_param("ssi", $nome, $dados_json, $id_usuario);
$stmt->execute();

$id_gerado = $stmt->insert_id;

echo json_encode([
    "success" => true,
    "message" => "Ficha criada!",
    "id_ficha" => $id_gerado
]);
exit;
