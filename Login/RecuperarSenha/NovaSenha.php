<?php
require_once __DIR__ . "/../../password.php";
$token=$_POST["token"];
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

$erro = null;
$sucesso = false;

if($usuario===null){
    $erro = "Token inválido.";
} elseif (strtotime($usuario["reset_token_expires_at"]) <= time()){
    $erro = "Token expirado.";
} else {
    $sql = "UPDATE usuarios
        SET senha=?,
            reset_token_hash=NULL,
            reset_token_expires_at=NULL
        WHERE id=?";
    $stmt = $mysqli->prepare($sql);
    $password_hash = password_hash($_POST["NovaSenha"], PASSWORD_DEFAULT);
    $stmt->bind_param("ss", $password_hash, $usuario["id"]);
    $stmt->execute();
    $sucesso = true;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $sucesso ? 'Senha Redefinida' : 'Erro na Redefinição'; ?></title>
    <link rel="stylesheet" href="../../CSS/Login/RecuperarSenha/NovaSenha.css">
        <link rel="stylesheet" href="../../CSS/Login/RecuperarSenha/infoEmail.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <script src="../../JavaScript/Login/RecuperarSenha/NovaSenha.js" defer></script>
</head>
<body>
    <canvas id="waveCanvas" aria-hidden="true"></canvas>
    
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
    
    <div class="resultado-container">
        <?php if($sucesso): ?>
            <div class="icone-resultado icone-sucesso">
                <i class="bi bi-check-circle-fill"></i>
            </div>
            <h1 class="titulo-resultado">Senha Redefinida!</h1>
            <p class="mensagem-resultado">
                Sua senha foi alterada com sucesso. Agora você já pode fazer login com sua nova senha.
            </p>
            <a href="../loginhtml.php" class="btn-acao">Ir para o Login</a>
        <?php else: ?>
            <div class="icone-resultado icone-erro">
                <i class="bi bi-x-circle-fill"></i>
            </div>
            <h1 class="titulo-resultado">Ops! Algo deu errado</h1>
            <p class="mensagem-resultado">
                <?php echo htmlspecialchars($erro); ?><br>
                Por favor, solicite um novo link de recuperação.
            </p>
            <a href="InfoEmail.html" class="btn-acao">Voltar</a>
        <?php endif; ?>
    </div>
</body>
</html>