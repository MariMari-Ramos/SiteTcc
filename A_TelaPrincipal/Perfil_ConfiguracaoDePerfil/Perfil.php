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
                        FROM perfis p 
                        INNER JOIN usuarios u ON p.usuario_id = u.id 
                        WHERE p.usuario_id = ?");
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$result = $stmt->get_result();

if($result->num_rows > 0) {
    $perfil = $result->fetch_assoc();
    $nome_perfil = $perfil['nome_perfil'];
    $foto_perfil = $perfil['foto_perfil'];
    $tipo_foto = $perfil['tipo_foto'];
    $avatar_atual = $perfil['avatar_selecionado'];
    $email = $perfil['email'];
} else {
    // Se não tem perfil, redireciona para criar
    header('Location: ../../Cadastro_E_Perfil/CPerfilhtml.php');
    exit;
}

$stmt->close();

// Se foto_perfil for um caminho público (ex: "/SiteTcc/uploads/.."), verifica se o arquivo existe
if(!empty($foto_perfil) && strpos($foto_perfil, '/') === 0){
    $physical = rtrim($_SERVER['DOCUMENT_ROOT'], '/') . $foto_perfil;
    if(!file_exists($physical)){
        // arquivo não encontrado no servidor — não mostrar imagem
        $foto_perfil = null;
    }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../../CSS/EstilosGlobais/GlobalStylesConfigurationCss.css">
    <link rel="stylesheet" href="../../CSS/TelaPrinciapal/ConfiguraçõesDePerfil/Perfil.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
    <script src="../../JavaScript/ConfiguraçõesGlobais/GlobaConfigurationlJavaScript.js" defer></script>
    <script src="../../JavaScript/PerfilDoUsuário/PerfilDoUsuário.js" defer></script>
    <title>Editar Perfil - SystemForge</title>
</head>
<body>

    <!-- Guia: trigger flutuante -->
    <button class="guide-trigger" id="perfilGuideTrigger" aria-label="Abrir Guia" title="Guia" style="display:flex; position:fixed; top:18px; right:18px; z-index:9999; align-items:center; gap:8px;">
        <img src="../../img/MascoteVesgo.png" alt="" class="guide-trigger-avatar">
        <span>Guia</span>
    </button>

    <!-- Balão do Guia (escondido por padrão) -->
    <div id="guideSpeech" class="guide-speech" aria-hidden="true" style="display:block;">
        <div class="guide-speech-header">
            <div style="display:flex;align-items:center;gap:10px;">
                <img id="guideAvatar" class="guide-avatar" src="../../img/MascoteVesgo.png" alt="Guia" />
                <div class="guide-speech-title" id="guideTitle">Hefélio, o Guia</div>
            </div>
            <button class="guide-speech-close" id="closeGuideBtn" aria-label="Fechar Guia">×</button>
        </div>
        <div class="guide-speech-content" id="guideContent">Olá, aventureiro! 👋 Sou seu guia. Escolha um tópico abaixo para saber mais sobre esta página.</div>
        <div class="guide-speech-options" id="guideOptions">
            <button class="guide-option" data-topic="nome">Nome do Perfil — O que é?</button>
            <button class="guide-option" data-topic="foto">Foto do Perfil — Como alterar?</button>
            <button class="guide-option" data-topic="senha">Alterar senha — Quando usar?</button>
            <button class="guide-option" data-topic="acoes">Ações da Conta — O que fazem?</button>
            <button class="guide-option" data-topic="salvar">Salvar / Voltar — Como finalizar</button>
        </div>
    </div>

    <!-- Modal de Alerta -->
    <div class="overlay" id="alertOverlay" style="display: none;">
        <div class="modal">
            <p id="alertMessage"></p>
            <div class="modal-actions">
                <button id="alertOk">OK</button>
                <button id="alertCancel" style="display: none;">Cancelar</button>
            </div>
        </div>
    </div>

    <!-- Modal de Avatares (restaurado) -->
    <div id="avatarModal" class="avatar-modal" style="display: none;">
        <div class="avatar-modal-content">
            <button class="close-avatar" id="closeAvatar" title="Fechar">
                <i class="bi bi-x"></i>
            </button>
            <h3>Escolha seu Avatar</h3>
            <div class="avatar-grid">
                <div class="avatar-option" data-avatar="../../img/bigorna.png">
                    <img src="../../img/bigorna.png" alt="Avatar 1">
                </div>
                <div class="avatar-option" data-avatar="../../img/MascoteVesgo.png">
                    <img src="../../img/MascoteVesgo.png" alt="Avatar 2">
                </div>
                <div class="avatar-option" data-avatar="../../img/cthulhu.png">
                    <img src="../../img/cthulhu.png" alt="Avatar 3">
                </div>
                <div class="avatar-option" data-avatar="">
                    <div class="no-avatar">
                        <i class="bi bi-x-circle"></i>
                        <p>Sem Foto</p>
                    </div>
                </div>
            </div>
            <button type="button" id="confirmAvatar" class="confirm-button">Confirmar</button>
        </div>
    </div>

    <div class="perfil-column">
        <h2 class="page-title">Perfil do Usuário</h2>

        <section class="CaixaEditarPerfil">
        <form id="formPerfil" enctype="multipart/form-data">
            <input type="hidden" id="avatarSelecionado" name="avatarSelecionado" value="<?php echo htmlspecialchars($avatar_atual ?? ''); ?>">
            <input type="hidden" id="tipoFoto" name="tipoFoto" value="<?php echo htmlspecialchars($tipo_foto ?? ''); ?>">
            <input type="hidden" id="removerFoto" name="removerFoto" value="0">
            
            <div class="Colunas">
                <!-- 1. Nome do Perfil -->
                <div class="Coluna">
                    <label for="username">Nome do Perfil:</label>
                    <input type="text" id="username" name="username" value="<?php echo htmlspecialchars($nome_perfil); ?>" placeholder="Digite o nome do seu perfil">

                    <label for="email">Email Vinculado:</label>
                    <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($email); ?>" disabled readonly>
                </div>

                <!-- 2 / 3 / 4. Foto do Perfil + botões relacionados -->
                <div class="Coluna">
                    <label>Foto do Perfil:</label>
                    <!-- Preview da foto atual -->
                    <div class="perfil-foto-preview" id="fotoPreviewContainer" title="Foto de perfil — apenas visualização">
                        <?php if(!empty($foto_perfil)): ?>
                            <img id="previewFoto" 
                                 src="<?php echo htmlspecialchars($foto_perfil); ?>" 
                                 alt="Foto de perfil">
                        <?php else: ?>
                            <div class="no-photo" id="noPhotoPlaceholder">
                                <i class="bi bi-person-circle"></i>
                                <p>Sem foto</p>
                            </div>
                        <?php endif; ?>
                    </div>

                    <!-- Botões explícitos para manipular foto de perfil -->
                    <div class="photo-action-buttons">
                        <button type="button" id="btnUploadPhoto" class="btn-secondary" title="Enviar foto">Upload</button>
                        <button type="button" id="btnChooseAvatar" class="btn-outline" title="Escolher avatar">Escolher Avatar</button>
                        <button type="button" id="btnRemovePhoto" class="btn-danger" title="Remover foto">Remover Foto</button>
                    </div>
                    
                    <input type="file" id="profilePhoto" name="profilePhoto" accept="image/*" style="display: none;">
                </div>

                <!-- 5. Área de ações da conta -->
                <div class="Coluna">
                    <div class="acoes-conta">
                        <h3>Ações da Conta</h3>

                        <div class="action-row">
                            <div class="action-label">Alterar senha:</div>
                            <div class="action-controls">
                                <button type="button" class="action-button btn-secondary" onclick="window.location.href='../../Login/RecuperarSenha/RedefinirSenha/RedefinicaoDeSenha.html'">
                                    Alterar Senha
                                </button>
                            </div>
                        </div>

                        <div class="action-row">
                            <div class="action-label">Sair da conta:</div>
                            <div class="action-controls">
                                <button type="button" class="action-button btn-warning" id="btnSair">
                                    Sair
                                </button>
                            </div>
                        </div>

                        <div class="action-row">
                            <div class="action-label">Excluir conta:</div>
                            <div class="action-controls">
                                <button type="button" class="action-button btn-danger" id="btnExcluirConta">
                                    Excluir Conta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 6. Botões SALVAR / VOLTAR -->
                <div class="Coluna">
                    <div class="button-container" style="display:flex; gap:12px; margin-top:18px;">
                        <button type="submit" id="ButtonSalvarPerfil" class="btn-save">
                            SALVAR ALTERAÇÕES
                        </button>
                        <button type="button" id="btnVoltar" class="btn-back" onclick="window.location.href='../index.php'">
                            VOLTAR
                        </button>
                    </div>
                </div>
            </div>
        </form>
        </section>
    </div>

</body>
</html>