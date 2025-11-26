<?php
header("Content-Type: application/json; charset=utf-8");
error_reporting(E_ALL);
ini_set("display_errors", 1);

include "../../conexao.php";
session_start();

$nome = $_POST['char-name'] ?? null;
$archetype = $_POST['char-archetype'] ?? null;
$poder = $_POST['attr-poder'] ?? null;
$habilidade = $_POST['attr-habilidade'] ?? null;
$resistencia = $_POST['attr-resistencia'] ?? null;