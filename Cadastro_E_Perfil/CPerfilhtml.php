<?php
session_start();
include("../conexao.php");

// Verificar se o usuário está logado
if(!isset($_SESSION['usuario_id'])){
    header("Location: ../Login/loginhtml.php");
    exit();
}

$usuario_id = $_SESSION['usuario_id'];

// Verificar se já tem perfil criado
$stmt = $conn->prepare("SELECT * FROM perfis WHERE usuario_id = ?");
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$resultado = $stmt->get_result();

if($resultado->num_rows > 0){
    // Já tem perfil, redirecionar
    header("Location: ../Home/index.php");
    exit();
}
$stmt->close();
?>
<!DOCTYPE html>
<html lang="pt-br" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../CSS/CriarPerfil/StylesCPerfil.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
    <script src="../JavaScript/CriarPerfil/CriarPerfil.js" defer></script>
    <title>Criar Perfil</title>
</head>
<body>

    <canvas id="waveCanvas" aria-hidden="true"></canvas>

    <!-- Modal de Alerta/Confirmação Reutilizável -->
    <div class="overlay" id="alertOverlay" role="dialog" aria-modal="true" aria-labelledby="alertMessage" style="display:none;">
        <div class="modal">
            <p id="alertMessage">Tem certeza que deseja substituir sua escolha anterior?</p>
            <div class="modal-actions">
                <button type="button" id="alertCancel">Cancelar</button>
                <button type="button" id="alertOk">Continuar</button>
            </div>
        </div>
    </div>

    <!-- Botão de Configurações - Canto Superior Direito -->
    <button class="settings-btn" id="settingsBtn" title="Configurações">
        <i class="bi bi-gear-fill"></i>
    </button>

    <!-- Modal de Configurações -->
    <div class="settings-modal" id="settingsModal">
        <div class="settings-content">
            <div class="settings-header">
                <h2>Configurações</h2>
                <button class="close-settings" id="closeSettings">
                    <i class="bi bi-x"></i>
                </button>
            </div>

            <div class="settings-group">
                <label>🎨 Exibição</label>
                <div class="settings-option">
                    <input type="checkbox" id="enableWaves" checked>
                    <span>Ativar Ondas Animadas</span>
                </div>
            </div>

            <div class="settings-divider"></div>

            <div class="settings-group">
                <label>🌙 Tema</label>
                <div class="settings-option">
                    <input type="radio" name="theme" id="themeLight" value="light" checked>
                    <span>Claro</span>
                </div>
                <div class="settings-option">
                    <input type="radio" name="theme" id="themeDark" value="dark">
                    <span>Escuro</span>
                </div>
                <div class="settings-option">
                    <input type="radio" name="theme" id="themeAuto" value="auto">
                    <span>Automático</span>
                </div>
            </div>

            <div class="settings-divider"></div>

            <div class="settings-group">
                <label>✨ Efeitos de Clique</label>
                <div class="settings-option">
                    <input type="checkbox" id="enableClickEffect" checked>
                    <span>Efeito ao Clicar</span>
                </div>
                <div class="settings-option">
                    <input type="checkbox" id="enableHoldEffect" checked>
                    <span>Efeito ao Segurar</span>
                </div>
            </div>

            <div class="settings-divider"></div>

            <div class="settings-group">
                <label>♿ Acessibilidade</label>
                <div class="settings-option">
                    <input type="checkbox" id="highContrast">
                    <span>Alto Contraste</span>
                </div>
                <div class="settings-option">
                    <input type="checkbox" id="largerText">
                    <span>Texto Maior</span>
                </div>
            </div>

        </div>
    </div>
    
    <section class="CaixaCriarPerfil">
        <h2>Criação do Perfil</h2>
        <form id="formCriarPerfil" method="POST" action="CriarPerfil.php" enctype="multipart/form-data">
            <input type="hidden" id="avatarSelecionado" name="avatarSelecionado">
            <input type="hidden" id="tipoFoto" name="tipoFoto" value="">
            
            <div class="Colunas">
                <div class="Coluna">
                    <label for="NomePerfil">Nome do Perfil:</label>
                    <input type="text" id="NomePerfil" name="NomePerfil" placeholder="Digite o nome do seu perfil">
                    <hr>
                    <p class="ou">ou</p>
                    <label for="NomesSugerido">Nomes Sugeridos:</label>
                    <select id="NomesSugerido" name="NomesSugerido">
                        <option value="">Ver nomes sugeridos</option>
                        <option value="Optimus Oprime">Optimus Oprime</option>
                        <option value="Vladimir Putinks">Vladimir Putinks</option>
                        <option value="Valdemar Glaive">Valdemar Glaive</option>
                        <option value="Vaarus">Vaarus</option>
                        <option value="Aatrox">Aatrox</option>
                        <option value="Rhaast">Rhaast</option>
                        <option value="Naafiri">Naafiri</option>
                    </select>
                    <hr>
                    <div class="button-container">
                        <button type="submit" id="ButtonCriarPerfil">Criar Perfil</button>
                        <button type="button" id="btnVoltar">Voltar</button>
                    </div>
                </div>

                <div class="divisor"></div>
                <div class="Coluna">
                    <label for="FotoDoPerfil">Foto do Perfil:</label>
                    <label class="CustomFile">
                        <input type="file" id="FotoPerfil" name="FotoPerfil" accept="image/*">
                        Escolha um arquivo
                    </label>
                    <p class="ou">ou</p>
                    <label for="NossosAvatares">Nossos Avatares:</label>
                    <button type="button" class="CustomFile" id="chooseAvatar">
                        <label for="SubtituloDoAvatar">Escolher Avatar</label>
                    </button>
                    <p class="Aviso">Aviso: A foto do perfil é um elemento opcional na criação do perfil, podendo ser criado agora mesmo ou posteriormente.</p>
                </div>
            </div>
        </form>
    </section>

    <div id="avatarModal" class="avatar-modal">
        <div class="avatar-modal-content">
            <button class="close-avatar" id="closeAvatar" title="Fechar">
                <i class="bi bi-x"></i>
            </button>
            <h3>Escolha seu Avatar</h3>
            <div class="avatar-grid">
                <div class="avatar-option" data-avatar="../img/bigorna.png">
                    <img src="../img/bigorna.png" alt="Avatar 1">
                </div>
                <div class="avatar-option" data-avatar="../img/MascoteVesgo.png">
                    <img src="../img/MascoteVesgo.png" alt="Avatar 2">
                </div>
                <div class="avatar-option" data-avatar="../img/cthulhu.png">
                    <img src="../img/cthulhu.png" alt="Avatar 3">
                </div>
            </div>
            <button type="button" id="confirmAvatar" class="confirm-button">Confirmar</button>
        </div>
    </div>
</body>
</html>