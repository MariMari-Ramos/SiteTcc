<?php
$servername = "localhost";  // normalmente localhost se estiver rodando localmente
$username = "root";         // usuário do MySQL
$password = "usbw";             // senha do MySQL
$database = "bancotcc";       // nome do banco de dados

// Criar conexão
$conn = new mysqli($servername, $username, $password, $database);

// Checar conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}
?>
