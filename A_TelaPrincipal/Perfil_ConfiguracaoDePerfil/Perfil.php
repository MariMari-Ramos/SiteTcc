<?php
session_start();

// Redireciona para login se não estiver autenticado
if (!isset($_SESSION['user_id'])) {
    header('Location: ../../Login/loginhtml.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../../CSS/TelaPrincipal/ConfiguracoesDePerfil/Perfil.css">
    <title>Perfil e Configurações do Usuário</title>
</head>
<body>
    <section>
        <div class="CaixaEditarPerfil">
            <h1>Perfil e Configurações do Usuário</h1>
            <p>Esta seção permite que você visualize e edite as configurações do seu perfil de usuário.</p>

            <div class="perfil-info">
            <label>Nome de usuário:</label>
                <input type="text" value="<?php echo htmlspecialchars($_SESSION['username'] ?? ''); ?>" />

                <label>Email vinculado:</label>
                <input type="email" value="<?php echo htmlspecialchars($_SESSION['email'] ?? ''); ?>" />

                <label>Foto de perfil:</label>
                <input type="file" accept="image/*" />

                <label>Alterar senha:</label>
                <button onclick="window.location.href='../../Login/RecuperarSenha/RedefinirSenha/RedefinicaoDeSenha.html'">Alterar Senha</button>

                <label>Excluir conta:</label>
                <button onclick="if(confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível!')) { alert('Conta excluída'); }">Excluir Conta</button>
            </div>

            <div class="botoes-acao">
                <input type="button" value="Salvar alterações" onclick="alert('Alterações salvas com sucesso!')">
                <input type="button" value="Voltar" onclick="window.location.href='../index.php'">
            </div>
        </div>
    </section>
</body>
</html>