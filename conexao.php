
<?php
$serverName = "ds-team.database.windows.net,1433"; // endereço do SQL remoto + porta (1433 é padrão)
$database   = "TCC_banco";          // nome do seu banco
$username   = "AdminAzure";     // login SQL
$password   = "Mineirotop123";     // senha SQL

try {
    $conn = new PDO("sqlsrv:server=$serverName;Database=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Conexão realizada com sucesso!";
} catch (PDOException $e) {
    die("Conexão falhou: " . $e->getMessage());
}
?>


