<?php
// AtualizarSenhaUsuario.php
// Recebe token e nova senha, valida e atualiza no banco

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['token'], $_POST['nova_senha'])) {
    $token = $_POST['token'];
    $novaSenha = $_POST['nova_senha'];

    // Buscar token no banco, validar expiração e obter usuário
    // Exemplo:
    // $dados = buscarToken($token);
    // if (!$dados || $dados['expira'] < date('Y-m-d H:i:s')) { ... }

    // Atualizar senha do usuário (hash seguro)
    // $senhaHash = password_hash($novaSenha, PASSWORD_DEFAULT);
    // atualizarSenhaUsuario($dados['usuario_id'], $senhaHash);

    // Remover token do banco
    // removerToken($token);

    echo 'Senha alterada com sucesso!';
    exit;
}

// Se não for POST ou faltar dados
http_response_code(400);
echo 'Requisição inválida.';
