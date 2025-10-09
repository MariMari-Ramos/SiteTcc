
<?php
$servername = "localhost";
$username = "root"; 
$password = "usbw"; // ou sua senha do MySQL
$dbname = "bancotcc";    // senha SQL


try {
    $conn = new mysqli($servername, $username, $password, $dbname);
} catch (Exception $e) {
        die("Falha na conexão: " . $e->getMessage());
    }
?>


