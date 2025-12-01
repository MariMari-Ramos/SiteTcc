<?php
// SolicitarAlteracaoSenha.php
// Processa o pedido de alteração de senha e envia o e-mail com link/token

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['email'])) {
    $email = $_POST['email'];
    // Aqui você deve validar o e-mail e buscar o usuário no banco
    // Exemplo:
    // $usuario = buscarUsuarioPorEmail($email);
    // if ($usuario) { ... }

    // Gerar token seguro
    $token = bin2hex(random_bytes(32));
    $expira = date('Y-m-d H:i:s', strtotime('+1 hour'));

    // Salvar token e expiração no banco (crie uma tabela para isso se necessário)
    // Exemplo:
    // salvarTokenAlteracaoSenha($usuario['id'], $token, $expira);

    // Montar link de alteração de senha
    $link = "http://localhost:8080/SiteTcc/A_TelaPrincipal/Perfil_ConfiguracaoDePerfil/ValidarTokenAlteracaoSenha.php?token=$token";

    // Enviar e-mail para o usuário (use sua lógica de envio de e-mail)
    // mail($email, 'Alteração de senha', "Clique no link para alterar sua senha: $link");

    echo json_encode(['success' => true, 'message' => 'Se o e-mail existir, um link foi enviado.']);
    exit;
}

// Se não for POST ou faltar e-mail
http_response_code(400);
echo json_encode(['success' => false, 'message' => 'Requisição inválida.']);
