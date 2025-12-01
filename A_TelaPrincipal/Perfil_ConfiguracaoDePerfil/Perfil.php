<?php
session_start();
include("../../conexao.php");

// Redireciona para login se não estiver autenticado
if (!isset($_SESSION['usuario_id'])) {
    header('Location: ../../Login/loginhtml.php');
    exit;
}

$usuario_id = $_SESSION['usuario_id'];

// Buscar dados do perfil do usuário

$stmt = $conn->prepare("SELECT p.nome_perfil, p.foto_perfil, p.tipo_foto, p.avatar_selecionado, u.email 
                        FROM usuarios u 
                        LEFT JOIN perfis p ON p.usuario_id = u.id 
                        WHERE u.id = ?");
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$result = $stmt->get_result();

if($result->num_rows > 0) {
    $perfil = $result->fetch_assoc();
    $nome_perfil = $perfil['nome_perfil'];
    $foto_perfil = $perfil['foto_perfil'];

if (!empty($foto_perfil) && strpos($foto_perfil, '/uploads/') === 0) {
    // Corrige caminho local
    $foto_perfil = '/SiteTcc' . $foto_perfil;
}

    $tipo_foto = $perfil['tipo_foto'];
    $avatar_atual = $perfil['avatar_selecionado'];
    $email = $perfil['email'];
} else {
    // Não deveria acontecer, mas fallback
    $nome_perfil = '';
    $foto_perfil = '';
    $tipo_foto = '';
    $avatar_atual = '';
    $email = '';
}

$stmt->close();

// Não há mais verificação de arquivo local, pois imagens são servidas via Azure Blob Storage ou avatares locais.


?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../../CSS/EstilosGlobais/GlobalStylesPerfil.css">
    <link rel="stylesheet" href="../../CSS/TelaPrinciapal/ConfiguraçõesDePerfil/Perfil.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
    <script src="../../JavaScript/ConfiguraçõesGlobais/GlobalConfigurationPerfil.js" defer></script>
    <script src="../../JavaScript/PerfilDoUsuario/PerfilDoUsuario.js" defer></script>
    <title data-translate="perfil_title">Ações e configurações de  Perfil - SystemForge</title>
</head>
<body>

    <!-- Guia: trigger flutuante -->
    <button class="guide-trigger" id="perfilGuideTrigger" aria-label="Abrir Guia" data-translate="perfil_abrir_guia" data-translate-attr="aria-label" title="Guia" data-translate-title="perfil_guia_title" style="display:flex; position:fixed; top:18px; right:18px; z-index:9999; align-items:center; gap:8px;">
        <img src="../../img/MascoteCertoPNG.png" alt="" class="guide-trigger-avatar">
        <span data-translate="guia">Guia</span>
    </button>

    <!-- Balão do Guia (escondido por padrão) -->
    <div id="guideSpeech" class="guide-speech" aria-hidden="true" style="display:block;">
        <div class="guide-speech-header">
            <div style="display:flex;align-items:center;gap:10px;">
                <img id="guideAvatar" class="guide-avatar" src="../../img/MascoteCertoPNG.png" alt="Guia" data-translate-alt="perfil_guia_alt" />
                <div class="guide-speech-title" id="guideTitle" data-translate="guide_title">Hefélio, o Guia</div>
            </div>
            <button class="guide-speech-close" id="closeGuideBtn" aria-label="Fechar Guia" data-translate="close" data-translate-attr="aria-label">×</button>
        </div>
        <div class="guide-speech-content" id="guideContent" data-translate="guide_intro">Olá, aventureiro! 👋 Sou seu guia. Escolha um tópico abaixo para saber mais sobre esta página.</div>
        <div class="guide-speech-options" id="guideOptions">
            <button class="guide-option" data-topic="nome" data-translate="perfil_guide_nome">Nome do Perfil — O que é?</button>
            <button class="guide-option" data-topic="foto" data-translate="perfil_guide_foto">Foto do Perfil — Como alterar?</button>
            <button class="guide-option" data-topic="senha" data-translate="perfil_guide_senha">Alterar senha — Quando usar?</button>
            <button class="guide-option" data-topic="acoes" data-translate="perfil_guide_acoes">Ações da Conta — O que fazem?</button>
            <button class="guide-option" data-topic="salvar" data-translate="perfil_guide_salvar">Salvar / Voltar — Como finalizar</button>
        </div>
    </div>

    <!-- Modal de Alerta -->
    <div class="overlay" id="alertOverlay" style="display: none;">
        <div class="modal">
            <p id="alertMessage"></p>
            <div class="modal-actions">
                <button id="alertOk" data-translate="perfil_ok">OK</button>
                <button id="alertCancel" style="display: none;" data-translate="perfil_cancelar">Cancelar</button>
            </div>
        </div>
    </div>

    <!-- Modal de Avatares (restaurado) -->
    <div id="avatarModal" class="avatar-modal" style="display: none;">
        <div class="avatar-modal-content">
            <button class="close-avatar" id="closeAvatar" title="Fechar" data-translate-title="perfil_fechar_avatar_title">
                <i class="bi bi-x"></i>
            </button>
            <h3 data-translate="perfil_escolha_avatar">Escolha seu Avatar</h3>
            <div class="avatar-grid">
                <div class="avatar-option" data-avatar="../../img/bigorna.png">
                    <img src="../../img/bigorna.png" alt="Avatar 1" data-translate-alt="perfil_avatar1_alt">
                </div>
                <div class="avatar-option" data-avatar="../../img/MascoteCertoPNG.png">
                    <img src="../../img/MascoteCertoPNG.png" alt="Avatar 2" data-translate-alt="perfil_avatar2_alt">
                </div>
                <div class="avatar-option" data-avatar="../../img/cthulhu.png">
                    <img src="../../img/cthulhu.png" alt="Avatar 3" data-translate-alt="perfil_avatar3_alt">
                </div>
                <div class="avatar-option" data-avatar="">
                    <div class="no-avatar">
                        <i class="bi bi-x-circle"></i>
                        <p data-translate="perfil_sem_foto_label">Sem Foto</p>
                    </div>
                </div>
            </div>
            <button type="button" id="confirmAvatar" class="confirm-button" data-translate="perfil_confirmar">Confirmar</button>
        </div>
    </div>

    <div class="perfil-column">
        <h2 class="page-title" data-translate="perfil_acoes_conta">Ações e configurações do Usuário</h2>

        <section class="CaixaEditarPerfil">
        <form id="formPerfil" method="POST" action="AtualizarPerfil.php" enctype="multipart/form-data">


            <input type="hidden" id="avatarSelecionado" name="avatarSelecionado" value="<?php echo htmlspecialchars($avatar_atual ?? ''); ?>">
            <input type="hidden" id="tipoFoto" name="tipoFoto" value="<?php echo htmlspecialchars($tipo_foto ?? ''); ?>">
            <input type="hidden" id="removerFoto" name="removerFoto" value="0">
            
            <div class="Colunas">
                <!-- 1. Nome do Perfil -->
                <div class="Coluna">
                    <label for="username" data-translate="perfil_nome">Nome do Perfil:</label>
                    <input type="text" id="username" name="username" value="<?php echo htmlspecialchars($nome_perfil); ?>" placeholder="Digite o nome do seu perfil" data-translate-placeholder="perfil_nome_placeholder">

                    <label for="email" data-translate="perfil_email">Email Vinculado:</label>
                    <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($email); ?>" disabled readonly data-translate-placeholder="perfil_email_placeholder">
                </div>

                <!-- 2 / 3 / 4. Foto do Perfil + botões relacionados -->
                <div class="Coluna">
                    <label data-translate="perfil_foto">Foto do Perfil:</label>
                    <!-- Preview da foto atual -->
                    <div class="perfil-foto-preview" id="fotoPreviewContainer" title="Foto de perfil — apenas visualização" data-translate-title="perfil_foto_preview_title">
                        <?php if(!empty($foto_perfil)): ?>
                               <img id="previewFoto" 
                                   src="<?php echo htmlspecialchars($foto_perfil); ?>" 
                                   alt="Foto de perfil" data-translate-alt="perfil_foto_alt">
                        <?php else: ?>
                            <div class="no-photo" id="noPhotoPlaceholder">
                                <i class="bi bi-person-circle"></i>
                                <p data-translate="perfil_sem_foto">Sem foto</p>
                            </div>
                        <?php endif; ?>
                    </div>

                    <div class="photo-action-buttons">
                        <button type="button" id="btnUploadPhoto" class="btn-secondary" title="Enviar foto" data-translate="perfil_upload">Upload</button>
                        <button type="button" id="btnChooseAvatar" class="btn-outline" title="Escolher avatar" data-translate="perfil_escolher_avatar">Escolher Avatar</button>
                        <button type="button" id="btnRemovePhoto" class="btn-danger" title="Remover foto" data-translate="perfil_remover_foto">Remover Foto</button>
                    </div>
                    
                    <input type="file" id="profilePhoto" name="profilePhoto" accept="image/*" style="display: none;">
                </div>

                <!-- 5. Área de ações da conta -->
                <div class="Coluna">
                    <div class="acoes-conta">
                        <h3 data-translate="perfil_acoes_conta">Ações da Conta</h3>

                        <div class="action-row">
                            <div class="action-label" data-translate="perfil_alterar_senha">Alterar senha:</div>
                            <div class="action-controls">
                                <button type="button" class="action-button btn-secondary" onclick="window.location.href='../../Login/RecuperarSenha/InfoEmail.html'" data-translate="perfil_btn_alterar_senha">Alterar Senha</button>
                            </div>
                        </div>

                        <div class="action-row">
                            <div class="action-label" data-translate="perfil_sair">Sair da conta:</div>
                            <div class="action-controls">
                                <button type="button" class="action-button btn-warning" id="btnSair" data-translate="perfil_btn_sair">Sair</button>
                            </div>
                        </div>

                        <div class="action-row">
                            <div class="action-label" data-translate="perfil_excluir">Excluir conta:</div>
                            <div class="action-controls">
                                <button type="button" class="action-button btn-danger" id="btnExcluirConta" data-translate="perfil_btn_excluir">Excluir Conta</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 6. Botões SALVAR / VOLTAR -->
                <div class="Coluna">
                    <div class="button-container" style="display:flex; gap:12px; margin-top:18px;">
                        <button type="submit" id="ButtonSalvarPerfil" class="btn-save" data-translate="perfil_salvar">SALVAR ALTERAÇÕES</button>
                        <button type="button" id="btnVoltar" class="btn-back" onclick="window.location.href='../index.php'" data-translate="perfil_voltar">VOLTAR</button>
                    </div>
                </div>
            </div>
        </form>
        </section>
    </div>
    <script>
document.getElementById('btnSair').addEventListener('click', function() {
    // Redireciona para o PHP que encerra a sessão
    window.location.href = 'Logout.php';
});

document.getElementById('btnExcluirConta').addEventListener('click', function() {
    if (confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.")) {
        window.location.href = 'ExcluirConta.php';
    }
});
</script>
</body>
</html>
