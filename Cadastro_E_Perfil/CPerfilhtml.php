
 <?php
session_start();
include("../conexao.php");

if(!isset($_COOKIE['lembrar_tolken'])){
    $tolken =$_COOKIE['lembrar_tolken'];
}
?>
<!DOCTYPE html>
<html lang="pt-br">
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

            <!-- Grupo: Preferências de Exibição -->
            <div class="settings-group">
                <label>🎨 Exibição</label>
                <div class="settings-option">
                    <input type="checkbox" id="enableWaves" checked>
                    <span>Ativar Ondas Animadas</span>
                </div>
            </div>

            <div class="settings-divider"></div>

            <!-- Grupo: Tema -->
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

            <!-- Grupo: Efeitos de Clique -->
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

            <!-- Grupo: Acessibilidade -->
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

            <div class="settings-divider"></div>
            
            <button id="resetSettings" class="settings-btn-secondary">Restaurar Padrões</button>
            <button id="closeSettingsBtn" class="settings-btn-primary">Salvar e Fechar</button>
        </div>
    </div>
    
    <section class="CaixaCriarPerfil">
        <h2>Criação do Perfil</h2>
        <div class="Colunas">
            <div class="Coluna">
                <label for="NomePerfil">Nome do Perfil:</label>
                <input type="text" id="NomePerfil" name="NomePerfil" placeholder="Digite o nome do seu perfil" required>
                <hr>
                <p class="ou">ou</p>
                <label for="NomesSugerido">Nomes Sugeridos:</label>
                <select id="NomesSugerido" name="NomesSugerido">
                    <option value="">Clique para ver os nomes sugeridos</option>
                    <option value="Avatar1">Optimus Oprime</option>
                    <option value="Avatar2">Vladimir Putinks</option>
                    <option value="Avatar2">Valdemar Glaive</option>
                    <option value="Avatar2">Vaarus</option>
                    <option value="Avatar2">Aatrox</option>
                    <option value="Avatar2">Rhaast</option>
                    <option value="Avatar2">Naafiri</option>
                </select>
                <hr>
                <input type="submit" id="ButtonCriarPerfil" value="Criar Perfil">
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
                <button class="CustomFile" id="chooseAvatar">
                    <label for="SubtituloDoAvatar">Escolher Avatar</label>
                </button>
                <p class="Aviso">Aviso: A foto do perfil é um elemento opcional na criação do perfil, podendo ser criado agora mesmo ou posteriormente.</p>
            </div>
        </div>
    </section>




    <div id="avatarModal" class="avatar-modal">
        <div class="avatar-modal-content">
            <h3>Escolha seu Avatar</h3>
            <div class="avatar-grid">
                <div class="avatar-option">
                    <img src="../img/bigorna.png" alt="Avatar 1">
                </div>
                <div class="avatar-option">
                    <img src="../img/MascoteVesgo.png" alt="Avatar 2">
                </div>
                <div class="avatar-option">
                    <img src="../img/cthulhu.png" alt="Avatar 3">
                </div>
                
            </div>
            <button id="confirmAvatar" class="confirm-button">Confirmar</button>
        </div>
    </div>
</body>
</html>