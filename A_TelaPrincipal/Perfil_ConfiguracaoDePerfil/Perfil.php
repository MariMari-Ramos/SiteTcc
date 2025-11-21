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

    <!-- Modal de Avatares removido (seleção por avatar desativada) -->
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

    <section class="CaixaEditarPerfil">
        <h2>Perfil do Usuário</h2>
        <p>Nesta tela é possível a visualização e edição dos elementos da sua conta.</p>
        
        <form id="formPerfil" enctype="multipart/form-data">
            <input type="hidden" id="avatarSelecionado" name="avatarSelecionado" value="<?php echo htmlspecialchars($avatar_atual ?? ''); ?>">
            <input type="hidden" id="tipoFoto" name="tipoFoto" value="<?php echo htmlspecialchars($tipo_foto ?? ''); ?>">
            <input type="hidden" id="removerFoto" name="removerFoto" value="0">
            
            <div class="Colunas">
                <div class="Coluna">
                    <label for="username">Nome do Perfil:</label>
                    <input type="text" id="username" name="username" value="<?php echo htmlspecialchars($nome_perfil); ?>" placeholder="Digite o nome do seu perfil">
                    
                    <hr>
                    
                    <label for="email">Email Vinculado:</label>
                    <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($email); ?>" disabled readonly>
                    
                    <hr>
                    
                    <div class="acoes-conta">
                        <h3>Ações da Conta</h3>
                        
                        <button type="button" class="btn-secondary" onclick="window.location.href='../../Login/RecuperarSenha/RedefinirSenha/RedefinicaoDeSenha.html'">
                            <i class="bi bi-key"></i> Alterar Senha
                        </button>
                        
                        <button type="button" class="btn-warning" id="btnSair">
                            <i class="bi bi-box-arrow-right"></i> Sair da Conta
                        </button>
                        
                        <button type="button" class="btn-danger" id="btnExcluirConta">
                            <i class="bi bi-trash"></i> Excluir Conta
                        </button>
                    </div>
                </div>

                <div class="divisor"></div>
                
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
                    <div class="photo-action-buttons" style="text-align:center; margin-top:12px; display:flex; gap:8px; justify-content:center;">
                        <button type="button" id="btnUploadPhoto" class="btn-secondary" title="Enviar foto">Upload</button>
                        <button type="button" id="btnChooseAvatar" class="btn-secondary" title="Escolher avatar">Escolher Avatar</button>
                        <button type="button" id="btnRemovePhoto" class="btn-danger" title="Remover foto">Remover Foto</button>
                    </div>
                    
                    <p class="foto-hint">
                        <i class="bi bi-info-circle"></i>
                        Foto de perfil — apenas visualização. Use os botões abaixo para alterar ou remover.
                    </p>
                    
                    <input type="file" id="profilePhoto" name="profilePhoto" accept="image/*" style="display: none;">
                    
                    <hr>
                    
                    <div class="button-container" style="display:flex; gap:12px; margin-top:18px;">
                        <button type="submit" id="ButtonSalvarPerfil" class="btn-save">
                            <i class="bi bi-check-circle"></i> SALVAR ALTERAÇÕES
                        </button>
                        <button type="button" id="btnVoltar" class="btn-back" onclick="window.location.href='../index.php'">
                            <i class="bi bi-arrow-left"></i> VOLTAR
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </section>

</body>
</html>