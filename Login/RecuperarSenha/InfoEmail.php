<?php
// Confirmação de solicitação de redefinição no mesmo estilo do Login/Cadastro
date_default_timezone_set('America/Sao_Paulo');

$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$statusEnvio = false;
$erroEnvio = null;

if ($email !== '') {
    $token = bin2hex(openssl_random_pseudo_bytes(16));
    $token_hash = hash('sha256', $token);
    $expire = date('Y-m-d H:i:s', time() + 60 * 30);

    require __DIR__ . '/../../conexao.php';
    $sql = "UPDATE usuarios SET reset_token_hash=?, reset_token_expires_at=? WHERE email=?";
    $stmt = $mysqli->prepare($sql);
    if ($stmt) {
        $stmt->bind_param('sss', $token_hash, $expire, $email);
        $stmt->execute();
        if ($mysqli->affected_rows) {
            // Envia email apenas se existir; saída sempre neutra
            $mail = require __DIR__ . '/Mailer.php';
            $mail->CharSet = 'UTF-8';
            $mail->setFrom('noreply@example.com', 'System Forge RPG');
            $mail->addAddress($email);
            $mail->Subject = 'Redefinição de senha';
            $link = "http://localhost/SiteTcc/Login/RecuperarSenha/ValiToken.php?token=$token";
            $mail->isHTML(true);
            $mail->Body = '<p>Solicitação de redefinição de senha.</p>' .
                          '<p>Clique <a href="' . htmlspecialchars($link, ENT_QUOTES, 'UTF-8') . '">aqui</a> para redefinir sua senha.</p>' .
                          '<p>Este link expira em 30 minutos.</p>';
            try { $mail->send(); $statusEnvio = true; } catch (Exception $e) { $erroEnvio = $mail->ErrorInfo; }
        }
    }
}

$titulo = 'Verifique seu e-mail';
$mensagemPrincipal = 'Se a conta existir, enviamos um link de redefinição para o e-mail informado. O link expira em 30 minutos.';
$badgeTexto = $statusEnvio ? 'Solicitação registrada' : 'Processamento concluído';
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redefinição de Senha - Confirmação</title>
    <link rel="stylesheet" href="../../CSS/EstilosGlobais/GlobalStylesConfigurationCss.css">
    <link rel="stylesheet" href="../../CSS/Login/RecuperarSenha/InfoEmail.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
    <script>
      // Sincroniza tema com preferências do Login (quando disponíveis)
      (function(){
        try {
          var s = localStorage.getItem('loginPageSettings') || localStorage.getItem('recPageSettings');
          if(!s) return;
          s = JSON.parse(s);
          var b = document.body, r = document.documentElement;
          var add = function(cls){ b.classList.add(cls); r.classList.add(cls); };
          var rem = function(cls){ b.classList.remove(cls); r.classList.remove(cls); };
          rem('light-theme'); rem('dark-theme'); rem('large-text'); rem('high-contrast');
          if(s.theme==='dark') add('dark-theme'); else add('light-theme');
          if(s.highContrast) add('high-contrast');
          if(s.largerText) add('large-text');
        } catch(e){}
      })();
    </script>
  </head>
<body>
    <canvas id="waveCanvas" aria-hidden="true"></canvas>
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

    <div class="container-confirmacao">
        <div class="header-icon"><i class="bi bi-envelope-fill"></i></div>
        <div class="badge-status"><i class="bi bi-check-circle-fill"></i> <?php echo htmlspecialchars($badgeTexto); ?></div>
        <h1><?php echo htmlspecialchars($titulo); ?></h1>
        <p class="mensagem-principal"><?php echo htmlspecialchars($mensagemPrincipal); ?></p>
        <ul class="lista-passos">
            <li>Abra seu aplicativo de e-mail (Gmail, Outlook, etc.).</li>
            <li>Procure por <strong>"Redefinição de senha"</strong> ou pelo remetente <em>noreply@example.com</em>.</li>
            <li>Verifique a pasta de Spam/Lixo eletrônico caso não esteja na caixa de entrada.</li>
            <li>Clique no link para continuar o processo dentro de 30 minutos.</li>
        </ul>
        <div class="acao-btns">
            <a href="InfoEmail.html">Reenviar Solicitação</a>
        </div>
        <p class="aviso-extra">Por segurança, mostramos sempre esta confirmação independente de o e-mail existir ou não.</p>
        <?php if($erroEnvio): ?>
            <p style="color:#d9534f; font-size:.75rem; text-align:center; margin-top:8px;">Aviso interno: falha ao tentar enviar e-mail. Tente novamente mais tarde.</p>
        <?php endif; ?>
    </div>
    <script src="../../JavaScript/Login/RecuperarSenha/InfoEmail.js" defer></script>
    <script>
      document.getElementById('backBtn')?.addEventListener('click', function(){
        window.location.href = 'InfoEmail.html';
      });
    </script>
</body>
</html>