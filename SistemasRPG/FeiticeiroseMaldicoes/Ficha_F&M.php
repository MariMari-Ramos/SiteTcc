<?php
include "../../conexao.php";
session_start();

// Pega os dados do formulário (podem vir vazios)
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


$id_ficha = $_POST['id_ficha'] ?? null;

// Monta o JSON
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
];

$dados_json = json_encode($dados, JSON_UNESCAPED_UNICODE);

// Se for update (ficha já existe)
if (!empty($id_ficha)) {

    $stmt = $mysqli->prepare("UPDATE ficha_per SET dados_json = ?, ultima_atualizacao = NOW()
                              WHERE id_ficha = ?");
    $stmt->bind_param("si", $dados_json, $id_ficha);
    $stmt->execute();

    exit;
}

$id_usuario = $_SESSION["usuario_id"] ?? null;

var_dump($id_usuario);
$stmt = $mysqli->prepare("
    INSERT INTO ficha_per (nome_personagem, dados_json, data_criacao, ultima_atualizacao, id_usuario, id_sistema)
    VALUES (?, ?, NOW(), NOW(), ?, 1)
");

$stmt->bind_param("ssi", $nome, $dados_json, $id_usuario);
$stmt->execute();

$id_gerado = $stmt->insert_id;

