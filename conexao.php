
<?php
$servername = "localhost";
$username = "root"; 
$password = "usbw"; 
$dbname = "bancotcc";  


try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    return $mysqli= $conn;
} catch (Exception $e) {
        die("Falha na conexão: " . $e->getMessage());
    }

?>
