<?php
setcookie("cookieteste","content", [
    'expires' => time() + 60,
    'path' => '/SiteTcc/teste.php',
    'domain' => '', // Adapte conforme necessário
    'secure' => false, // true se estiver usando HTTPS
    'httponly' => true,
    'samesite' => 'Lax' // Pode ser 'Lax', 'Strict', ou 'None'
]);
?>

