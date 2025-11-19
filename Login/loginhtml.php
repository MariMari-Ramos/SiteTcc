<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../CSS/Login/Login.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
    <title>Login</title>
</head>
<body>

    <canvas id="waveCanvas" aria-hidden="true"></canvas>

    <!-- Botão Voltar - Canto Superior Esquerdo -->
    <button class="back-btn" id="backBtn" title="Voltar" data-no-wave>
        <i class="bi bi-arrow-left"></i>
    </button>

    <!-- Botão de Configurações - Canto Superior Direito -->
    <button class="settings-btn" id="settingsBtn" title="Configurações" data-no-wave>
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

            <!-- Grupo: Efeitos de Interação -->
            <div class="settings-group">
                <label>✨ Efeitos de Interação</label>
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

            
        </div>
    </div>

    <section>
        <div class="CaixaLogin">
            <div class="login">
                <img src="../img/PETO E BANCO-Photoroom.png" alt="Logo" class="CaixaLoginImg">
                <label for="TituloLogin">Login</label>
               <form id="formLogin" method="POST" action="login.php" onsubmit="event.preventDefault()">

                    <label for="Subtitulo">Nome do Perfil ou E-mail:</label>
                    <input type="email" id="email" name="email" placeholder="Digite seu Perfil ou E-mail" required>

                    <label for="Subtitulo">Senha:</label>
                    <div class="password-container">
                        <input type="password" id="senha" name="senha" placeholder="Digite sua senha" required>
                        <i class="bi bi-eye-fill" id="BtnVerSenha" title="Mostrar/ocultar senha"></i>
                    </div>

                    <div class="LembrarMeContainer">
                        <input type="checkbox" id="CBXLembrarSenha" name="LembrarSenha">
                        <label for="LembrarSenhaSubtitulo">Lembrar-me</label>
                    </div>

                    <div class="form-buttons">
                        <button type="button" id="ButtonEntrar">Entrar</button>
                        <button id="ButtonCriarConta" type="button"
                            onclick="window.location.href='../Cadastro_E_Perfil/Cadastro.html'">Criar Conta</button>
                    </div>

                    <span class="nao-quebrar-linha">
                        <h5>Esqueceu sua senha?
                            <a href="RecuperarSenha/InfoEmail.html">Recuperar</a>
                        </h5>
                    </span>

                    <div class="overlay" id="overlay">
                        <div class="modal">
                            <h2>Alerta:</h2>
                            <p></p>
                            <button id="fecharModal">X</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </section>

    <script src="../JavaScript/Login/login.js" defer></script>
</body>
</html>