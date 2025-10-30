<?php
session_start();

// Redireciona para login se não estiver autenticado
if (!isset($_SESSION['user_id'])) {
    header('Location: ../../Login/loginhtml.php');
    exit;
}
?>


<!DOCTYPE html>
<html lang="pt-BR" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../../CSS/EstilosGlobais/GlobalStylesConfigurationCss.css">
    <link rel="stylesheet" href="../../CSS/TelaPrinciapal/ConfiguraçõesDePerfil/Perfil.css">
    <script src="../../JavaScript/ConfiguraçõesGlobais/GlobaConfigurationlJavaScript.js"></script>
    <title data-translate="profileTitle">Perfil do Usuário - SystemForge</title>
</head>
<body>
    <div class="container-perfil">
        <section class="perfil-wrapper">
            <div class="CaixaEditarPerfil">
                <h1 data-translate="profileTitle">Perfil do Usuário</h1>
                <p data-translate="profileDescription">Nesta tela é possível a visualização e edição dos elementos da sua conta.</p>

                <div class="perfil-info">
                    <div class="input-group">
                        <label for="username" data-translate="username">Nome de usuário:</label>
                        <input type="text" id="username" name="username" value="<?php echo htmlspecialchars($_SESSION['username'] ?? ''); ?>" />
                    </div>

                    <div class="input-group">
                        <label for="email" data-translate="email">Email vinculado:</label>
                        <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($_SESSION['email'] ?? ''); ?>" disabled readonly />
                    </div>

                    <div class="input-group">
                        <label for="profilePhoto" data-translate="profilePhoto">Foto de perfil:</label>
                        
                        <!-- Input de arquivo (oculto) -->
                        <input type="file" id="profilePhoto" name="profilePhoto" accept="image/*" />
                        
                        <!-- Preview da foto de perfil (clicável) -->
                        <div class="perfil-foto-preview">
                            <img id="previewFoto" 
                                 src="../../assets/images/default-avatar.png" 
                                 alt="Foto de perfil"
                                 title="Clique para alterar a foto de perfil">
                        </div>
                        
                        <!-- Dica de upload -->
                        <p class="foto-upload-hint">Clique na foto ou arraste uma imagem para alterar | Duplo clique para escolher avatar</p>
                    </div>

                    <div class="input-group action-group">
                        <label data-translate="changePassword">Alterar senha:</label>
                        <button class="btn-secondary" onclick="window.location.href='../../Login/RecuperarSenha/RedefinirSenha/RedefinicaoDeSenha.html'">
                            <span data-translate="changePasswordBtn">Alterar Senha</span>
                        </button>
                    </div>

                    <div class="input-group action-group">
                        <label data-translate="deleteAccount">Excluir conta:</label>
                        <button class="btn-danger" onclick="if(confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível!')) { alert('Conta excluída'); }">
                            <span data-translate="deleteAccountBtn">Excluir Conta</span>
                        </button>
                    </div>
                </div>

                <div class="botoes-acao">
                    <input type="button" class="btn-save" value="Salvar alterações" data-translate="saveChanges" onclick="alert('Alterações salvas com sucesso!')">
                    <input type="button" class="btn-back" value="Voltar" data-translate="backButton" onclick="window.location.href='../index.php'">
                </div>
            </div>
        </section>
    </div>

    <!-- Script de perfil do usuário (com defer) -->
    <script src="../../JavaScript/PerfilDoUsuário/PerfilDoUsuário.js" defer></script>
</body>
</html>