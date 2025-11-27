  <?php
$token=$_GET["token"];
date_default_timezone_set('America/Sao_Paulo');
$token_hash=hash("sha256", $token);
$mysqli= require __DIR__ . "/../../conexao.php";
$sql= "SELECT * FROM usuarios
    WHERE reset_token_hash=?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("s", $token_hash);
$stmt->execute();
$result= $stmt->get_result();
$usuario= $result->fetch_assoc();
if($usuario===null){
    die("Token inválido.");
}
if (strtotime($usuario["reset_token_expires_at"]) <= time()){
    die("Token expirado.");
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Redefinir Senha</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="stylesheet" href="../../CSS/Login/RecuperarSenha/RedefinicaoDeSenha.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
    <script src="../../JavaScript/RecSenha/RedefinicaoDeSenha.js" defer></script>
</head>
<body>
    <canvas id="waveCanvas" aria-hidden="true"></canvas>

    <button class="settings-fab" id="settingsBtn" title="Configurações">
        <i class="bi bi-gear-fill"></i>
    </button>

    <div class="settings-modal" id="settingsModal">
        <div class="settings-content">
            <div class="settings-header">
                <h2>Configurações</h2>
                <button class="close-settings" id="closeSettings"><i class="bi bi-x"></i></button>
            </div>

            <div class="settings-group">
                <label>🎨 Exibição</label>
                <div class="settings-option">
                    <input type="checkbox" id="enableWaves">
                    <span>Ondas animadas</span>
                </div>
            </div>

            <div class="settings-divider"></div>

 <div class="settings-group">
                <label>🌙 Tema</label>
                <div class="settings-option">
                    <input type="radio" name="theme" value="light">
                    <span>Claro</span>
                </div>
                <div class="settings-option">
                    <input type="radio" name="theme" value="dark">
                    <span>Escuro</span>
                </div>
                <div class="settings-option">
                    <input type="radio" name="theme" value="auto">
                    <span>Automático</span>
                </div>

            <div class="settings-divider"></div>

            <div class="settings-group">
                <label>🖱️ Interação</label>
                <div class="settings-option">
                    <input type="checkbox" id="enableClickEffect">
                    <span>Efeito ao clicar</span>
                </div>
                <div class="settings-option">
                    <input type="checkbox" id="enableHoldEffect">
                    <span>Efeito ao segurar</span>
                </div>
            </div>
            </div>

            <div class="settings-divider"></div>

            <div class="settings-group">
                <label>♿ Acessibilidade</label>
                <div class="settings-option">
                    <input type="checkbox" id="highContrast">
                    <span>Alto contraste</span>
                </div>
                <div class="settings-option">
                    <input type="checkbox" id="largerText">
                    <span>Texto maior</span>
                </div>
            </div>

        </div>
    </div>

    <div class="CaixaRedefinirSenha">
        <h1>Redefinir Senha</h1>
        <p class="SubtituloRedefinir">Insira sua nova senha e confirme para redefinir o acesso à sua conta.</p>

        <form id="resetPasswordForm" class="redefinir-form" autocomplete="off" method="post" action="NovaSenha.php">
            <input type="hidden" name="token" value="<?= htmlspecialchars($token) ?>">
            
            <label class="TextoSobreOsCampos" for="NovaSenha">Nova senha:</label>
            <div class="input-group">
                <input type="password" name="NovaSenha" id="NovaSenha" placeholder="Insira sua nova senha" minlength="6" required>
                <button type="button" class="toggle-pass" data-target="NovaSenha" aria-label="Mostrar/ocultar senha"><i class="bi bi-eye-fill"></i></button>
            </div>

            <label class="TextoSobreOsCampos" for="ConfirmarNovaSenha">Confirmar a nova senha:</label>
            <div class="input-group">
                <input type="password" name="ConfirmarNovaSenha" id="ConfirmarNovaSenha" placeholder="Confirme a sua nova senha" minlength="6" required>
                <button type="button" class="toggle-pass" data-target="ConfirmarNovaSenha" aria-label="Mostrar/ocultar confirmação"><i class="bi bi-eye-fill"></i></button>
            </div>

            <div class="button-container">
                <button type="submit" id="btnRedefinirSenha">Redefinir Senha</button>
            </div>
        </form>
    </div>

    <div class="overlay" id="overlay">
        <div class="modal">
            <h2>Aviso</h2>
            <p id="modalMessage"></p>
            <button id="fecharModal">Fechar</button>
        </div>
    </div>
</body>
</html>