<?php
session_start();
if (!isset($_SESSION['usuario_id'])) {
    echo "Usuário não autenticado.";
    exit;
}

include("../../../conexao.php");


// ========== EXCLUSÃO DE FICHA ========== //
if (isset($_POST['delete_ficha']) && isset($_POST['id_ficha'])) {
    $id_ficha = intval($_POST['id_ficha']);
    $id_usuario = intval($_SESSION['usuario_id']);
    $sql = "DELETE FROM ficha_per WHERE id_ficha = ? AND id_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $id_ficha, $id_usuario);
    if ($stmt->execute()) {
        header('Content-Type: application/json');
        echo json_encode(["success" => true]);
    } else {
        header('Content-Type: application/json');
        echo json_encode(["success" => false, "error" => "Erro ao excluir ficha."]);
    }
    exit;
}

// ========== SALVAR/EDITAR FICHA ========== //
if (!isset($_POST["id_ficha"])) {
    echo "ID não enviado.";
    exit;
}

$id_ficha = intval($_POST["id_ficha"]);
$id_usuario = intval($_SESSION["usuario_id"]);

/* =======================================================
   COLETA DE DADOS ENVIADOS PELO FORMULÁRIO
======================================================= */

// info básicas
$nome = $_POST["nome"] ?? "";
$level = $_POST["level"] ?? 0;
$proficiency_bonus = $_POST["proficiency_bonus"] ?? 0;
$origin = $_POST["origin"] ?? "";
$specialization = $_POST["specialization"] ?? "";

$str = $_POST["str"] ?? 0;
$dex = $_POST["dex"] ?? 0;
$con = $_POST["con"] ?? 0;
$wis = $_POST["wis"] ?? 0;
$int = $_POST["int"] ?? 0;
$cha = $_POST["cha"] ?? 0;

$ac_natural = $_POST["ac_natural"] ?? 0;
$ac_armor = $_POST["ac_armor"] ?? 0;
$ac_shield = $_POST["ac_shield"] ?? 0;
$ac_dex = $_POST["ac_dex"] ?? 0;
$ac_other = $_POST["ac_other"] ?? 0;
$ac_total = $_POST["ac_total"] ?? 0;

// combate
$hp_max = $_POST["hp_max"] ?? 0;
$hp_current = $_POST["hp_current"] ?? 0;
$hp_temp = $_POST["hp_temp"] ?? 0;

$pe_max = $_POST["pe_max"] ?? 0;
$pe_current = $_POST["pe_current"] ?? 0;
$pe_temp = $_POST["pe_temp"] ?? 0;

$integrity_max = $_POST["integrity_max"] ?? 0;
$integrity_current = $_POST["integrity_current"] ?? 0;
$integrity_temp = $_POST["integrity_temp"] ?? 0;

$movement = $_POST["movement"] ?? 0;
$initiative = $_POST["initiative"] ?? 0;
$attention = $_POST["attention"] ?? 0;

// arrays e jsons
$pericias = json_decode($_POST["pericias_json"] ?? "[]", true);
$habilidades = json_decode($_POST["habilidades_json"] ?? "[]", true);

$talentos = json_decode($_POST["talentos_json"] ?? "[]", true);
$treinamentos = json_decode($_POST["treinamentos_json"] ?? "[]", true);

$energy = $_POST["energy"] ?? 0;
$control_reading = $_POST["control_reading"] ?? 0;
$barrier = $_POST["barrier"] ?? 0;
$domain = $_POST["domain"] ?? 0;
$reverse_energy = $_POST["reverse_energy"] ?? 0;

$tecnica_amaldiçoada = json_decode($_POST["tecnica_json"] ?? "{}", true);
$invocations = json_decode($_POST["invocations_json"] ?? "[]", true);

/* =======================================================
   MONTA O JSON NO FORMATO QUE VOCÊ USA HOJE
======================================================= */

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

    "tecnica_amaldiçoada" => $tecnica_amaldiçoada,
    "invocations" => $invocations
];

$dados_json = json_encode($dados, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

/* =======================================================
   SALVANDO NO BANCO
======================================================= */

$sql = "UPDATE ficha_per SET dados_json = ? WHERE id_ficha = ? AND id_usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sii", $dados_json, $id_ficha, $id_usuario);

if ($stmt->execute()) {
    echo "OK";
} else {
    echo "Erro ao salvar.";
}