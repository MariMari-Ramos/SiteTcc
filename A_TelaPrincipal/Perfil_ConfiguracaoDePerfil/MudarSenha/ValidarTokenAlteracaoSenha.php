<?php
// ValidarTokenAlteracaoSenha.php
// Valida o token recebido por GET e exibe formulário para nova senha

if (!isset($_GET['token'])) {
    echo 'Token ausente.';
    exit;
}
$token = $_GET['token'];

// Aqui você deve buscar o token no banco e validar expiração
// Exemplo:
// $dados = buscarToken($token);
// if (!$dados || $dados['expira'] < date('Y-m-d H:i:s')) { ... }

// Se válido, exibe formulário para nova senha
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Nova Senha</title>
</head>
<body>
    <h1>Definir nova senha</h1>
    <form method="post" action="AtualizarSenhaUsuario.php">
        <input type="hidden" name="token" value="<?php echo htmlspecialchars($token); ?>">
        <label>Nova senha:</label>
        <input type="password" name="nova_senha" required>
        <button type="submit">Alterar senha</button>
    </form>
</body>
</html>
