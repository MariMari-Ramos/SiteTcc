
<?php
session_start();
// conectar ao banco para buscar perfil (se o usuário estiver logado)
include(__DIR__ . '/../conexao.php');

$showProfileName = false;
$profileName = '';
$profilePhoto = '';

if (!empty($_SESSION['usuario_id'])) {
  $usuario_id = intval($_SESSION['usuario_id']);
  $stmt = $conn->prepare("SELECT p.nome_perfil, p.foto_perfil FROM perfis p WHERE p.usuario_id = ? LIMIT 1");
  
  if ($stmt) {
    $stmt->bind_param('i', $usuario_id);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($res && $res->num_rows > 0) {
      $row = $res->fetch_assoc();
      $profileName = $row['nome_perfil'] ?? '';
      $foto = $row['foto_perfil'] ?? '';

      if (!empty($foto)) {
        // Se for upload local "/uploads/xxx.jpg"
        if (strpos($foto, '/uploads/') === 0) {
          // Ajusta para URL acessável
          $profilePhoto = '/SiteTcc' . $foto;
        } else {
          // Caso seja URL completa (Azure)
          $profilePhoto = $foto;
        }
      }

      $showProfileName = true;
    }
    $stmt->close();
  }
}
?>


<script>
window.MinhasFichas = {
  getAll: () => <?= json_encode($fichas); ?>
};
</script>

<!DOCTYPE html>
<html lang="pt-BR" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title data-translate="title">SystemForge - Início</title>

  <!-- CSS Global -->
  <link rel="stylesheet" href="../CSS/EstilosGlobais/GlobalStylesConfigurationCss.css" defer/>
  <!-- CSS da página -->
  <link rel="stylesheet" href="../CSS/TelaPrinciapal/home.css" defer />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css" />

  <!-- JS Global (sem defer para aplicar tema/estado inicial) -->
  <script src="../JavaScript/ConfiguraçõesGlobais/GlobaConfigurationlJavaScript.js"></script>
  <!-- JS da página (defer) -->
  <script src="../JavaScript/PrincipalTela/index.js" defer ></script>
</head>
<body>
      <script>
        // Garante aplicação das configurações globais (fonte, acessibilidade, etc.)
        document.addEventListener('DOMContentLoaded', function() {
          if (window.updateGlobalSettings) window.updateGlobalSettings();
        });
      </script>
    <!-- Botão flutuante do Guia do Mapa Mental da Ficha -->
    <button id="fichaMindmapGuideBtn" title="Guia das Ações da Ficha" style="position:absolute;top:24px;right:24px;z-index:2100;background:#fff;border:2px solid #ffc38a;border-radius:50%;width:48px;height:48px;box-shadow:0 4px 16px rgba(0,0,0,0.13);display:none;align-items:center;justify-content:center;cursor:pointer;transition:box-shadow .2s;">
      <img src="../img/MascoteCertoPNG.png" alt="Guia" style="width:32px;height:32px;" />
    </button>
    <!-- Guia do Mapa Mental da Ficha -->
    <div id="fichaMindmapGuide" class="guide-speech" style="position:absolute;top:80px;right:24px;z-index:2000;display:none;max-width:370px;">
      <div class="guide-speech-header">
        <div class="guide-speech-title" id="fichaMindmapGuideTitle">Guia das Ações da Ficha</div>
        <button class="guide-speech-close" onclick="document.getElementById('fichaMindmapGuide').style.display='none'" aria-label="Fechar">×</button>
      </div>
      <div class="guide-speech-content" id="fichaMindmapGuideContent">
        <strong>Clique em um dos tópicos do mapa mental da ficha para ver o que faz:</strong>
        <ul style="margin-top:10px;">
          <li><b>Editar Ficha</b>: Permite modificar as informações e atributos do personagem.</li>
          <li><b>Excluir Ficha</b>: Remove permanentemente esta ficha do sistema.</li>
        </ul>
        <span style="font-size:0.95em;color:#888;">Você pode fechar este guia a qualquer momento.</span>
      </div>
    </div>
    <!-- Modal / Mapa Mental da Ficha -->
    <div id="fichaMindmapOverlay" class="overlay" aria-hidden="true" style="z-index: 1001;" onclick="closeFichaModal()">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="fichaMindmapTitle" onclick="event.stopPropagation()" style="position: relative; display: grid; grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 1fr; gap: 0; min-width: 520px; min-height: 220px; max-width: 95vw; max-height: 90vh; align-items: center; justify-items: center;">
        <svg class="connections" aria-hidden="true" focusable="false" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;">
          <line class="connection-line" x1="42%" y1="50%" x2="25%" y2="50%"></line>
          <line class="connection-line" x1="58%" y1="50%" x2="75%" y2="50%"></line>
        </svg>

		<div class="section top-left" data-action="edit" onclick="selectFichaSection(event, 'edit')" style="position: relative; z-index: 2; grid-column: 1; grid-row: 1; margin-right: 24px;">
		  <div class="section-icon">✏️</div>
		  <div class="section-title" data-translate="modal_edit_title">Editar ficha</div>
		  <div class="section-description" data-translate="modal_edit_desc">Abrir edição da ficha</div>
		</div>

		<div class="section center" style="position: relative; z-index: 2; grid-column: 2; grid-row: 1;">
		  <i class="bi bi-person-badge" style="font-size:2.5em;"></i>
		  <div id="fichaMindmapTitle" class="section-title" data-translate="modal_ficha_actions">Ações da Ficha</div>
		</div>

		<div class="section top-right" data-action="delete" onclick="selectFichaSection(event, 'delete')" style="position: relative; z-index: 2; grid-column: 3; grid-row: 1; margin-left: 24px;">
		  <div class="section-icon">🗑️</div>
		  <div class="section-title" data-translate="modal_delete_title">Excluir ficha</div>
		  <div class="section-description" data-translate="modal_delete_desc">Remover esta ficha</div>
		</div>

        <button class="close-button" type="button" onclick="closeFichaModal()" style="grid-column: 1 / span 3; margin-top: 32px; z-index: 3;" data-translate="voltar">← Voltar</button>
      </div>
    </div>

    <!-- Modal de confirmação de exclusão de ficha -->
    <div id="modalConfirmDeleteFicha" class="modal-confirm-delete-ficha" aria-hidden="true">
      <div class="modal-confirm-content">
        <div class="modal-confirm-icon">🗑️</div>
        <div class="modal-confirm-title" data-translate="modal_delete_title">Excluir ficha</div>
        <div class="modal-confirm-message" data-translate="modal_delete_confirm">Tem certeza que deseja excluir esta ficha? Essa ação não pode ser desfeita.</div>
        <div class="modal-confirm-actions">
          <button type="button" class="btn-cancel-delete" onclick="closeModalConfirmDeleteFicha()" data-translate="cancelar">Cancelar</button>
          <button type="button" class="btn-confirm-delete" id="btnConfirmDeleteFicha" data-translate="excluir">Excluir</button>
        </div>
      </div>
    </div>
  <header>
    <div class="logo">
      <a href="#">
        <img src="../img/PETO E BANCO-Photoroom.png" alt="SystemForge" />
      </a>
    </div>

    <nav class="menu">
      <?php if (!empty($showProfileName)): ?>
        <a href="./Perfil_ConfiguracaoDePerfil/Perfil.php" class="profile-link" title="Ir para Perfil">
          <?php if (!empty($profilePhoto)): ?>
            <img src="<?php echo htmlspecialchars($profilePhoto); ?>" alt="<?php echo htmlspecialchars($profileName ?: 'Perfil'); ?>" style="width:32px;height:32px;border-radius:50%;object-fit:cover;" />
          <?php else: ?>
            <i class="bi bi-person-circle" aria-hidden="true"></i>
          <?php endif; ?>
          <span><?php echo htmlspecialchars($profileName ?: 'Perfil'); ?></span>
        </a>
      <?php else: ?>
        <a href="./Perfil_ConfiguracaoDePerfil/Perfil.php">
          <i class="bi bi-person-circle" aria-hidden="true"></i>
          <span data-translate="perfil">Perfil</span>
        </a>
      <?php endif; ?>
      <a href="Configurações/config.html">
        <i class="bi bi-gear-fill" aria-hidden="true"></i>
        <span data-translate="configuracoes">Configurações</span>
      </a>
      <a href="#" class="guide-trigger" onclick="toggleGuide(); return false;">
        <img src="../img/MascoteCertoPNG.png" alt="Guia" />
        <span data-translate="guia">Guia</span>
      </a>
    </nav>
  </header>

  <!-- Balão de fala do guia -->
  <div id="guideSpeech" class="guide-speech" role="dialog" aria-modal="true" aria-labelledby="guideTitle" aria-hidden="true">
    <div class="guide-speech-header">
      <div class="guide-speech-title" id="guideTitle" data-translate="guide_title">Hefélio, o Guia</div>
      <button class="guide-speech-close" onclick="closeGuide()" aria-label="Fechar" data-translate="close" data-translate-attr="aria-label">×</button>
    </div>
    <div class="guide-speech-content" id="guideContent" data-translate="guide_intro">
      Olá, aventureiro! 👋 Sou seu guia nesta interface. Estou aqui para ajudá-lo a navegar e entender todos os elementos e funcionalidades disponíveis. Por onde iremos começar?
    </div>
    <div class="guide-speech-options">
      <button class="guide-option" onclick="showGuideInfo('modal')" data-translate="guide_option_systems">📋 O que são os sistemas?</button>
      <button class="guide-option" onclick="showGuideInfo('ficha')" data-translate="guide_option_my_sheets">📝 O que são as minhas fichas? E onde estão elas?</button>
      <button class="guide-option" onclick="showGuideInfo('recursos')" data-translate="guide_option_random">🧪 O que são as fichas randômicas? E onde estão elas?</button>
      <button class="guide-option" onclick="showGuideInfo('dicas')" data-translate="guide_option_tips">💡 Dicas para iniciantes</button>
    </div>
  </div>

<label for="System"><span class="highlight-word" data-translate="sistemas">Sistemas</span></label>
<section class="carrossel">
    <div class="slides">
      <div class="card">
        <!-- 3DeT Victory  -->
        <div class="has-hover-video system-3DeT" tabindex="0" onclick="openModal('3DeT Victory','../img/Logo3DeT.png')">
          <video class="hover-video" muted loop playsinline preload="auto">
            <source src="../videos/DarkStarJhin.mp4" type="video/mp4" />
          </video>
          <img src="../img/Logo3DeT.png" alt="3DeT" />
          <p>3DeT Victory</p>
        </div>

        <!-- Feiticeiros e Maldições -->
        <div class="has-hover-video system-FM" tabindex="0" onclick="openModal('Feiticeiros e Maldições','../img/LogoJujutsuKaisen.png')">
          <video class="hover-video" muted loop playsinline preload="auto">
            <source src="../videos/GojoVsSukuna2.mp4" type="video/mp4" />
          </video>
          <img src="../img/LogoJujutsuKaisen.png" alt="Feiticeiros e Maldições" />
          <p>Feiticeiros e Maldições</p>
        </div>

        <!-- Cyberpunk -->
        <div class="has-hover-video system-cyberpunk" tabindex="0" onclick="openModal('Cyberpunk','../img/icons8-cyberpunk-512.png')">
          <video class="hover-video" muted loop playsinline preload="auto">
            <source src="../videos/GojoVsSukuna2.mp4" type="video/mp4" />
          </video>
          <img src="../img/icons8-cyberpunk-512.png" alt="Cyberpunk" />
          <p>Cyberpunk</p>
        </div>

        <!-- Dungeons and Dragons -->
        <div class="has-hover-video system-dnd" tabindex="0" onclick="openModal('Dungeons and Dragons','../img/icons8-dungeons-and-dragons-256.png')">
          <video class="hover-video" muted loop playsinline preload="auto">
            <source src="../videos/D&D_GoldenDragon.mp4" type="video/mp4" />
          </video>
          <img src="../img/icons8-dungeons-and-dragons-256.png" alt="Dungeons and Dragons" />
          <p>Dungeons and Dragons</p>
        </div>

        <!-- Vampiro a Mascara -->
        <div class="has-hover-video system-vampiro" tabindex="0" onclick="openModal('Vampiro a Mascara','../img/icons8-vampire-100.png')">
          <video class="hover-video" muted loop playsinline preload="auto">
            <source src="../videos/DarkStarJhin.mp4" type="video/mp4" />
          </video>
          <img src="../img/icons8-vampire-100.png" alt="Vampiro a Mascara" />
          <p>Vampiro a Mascara</p>
        </div>
      </div>
    </div>
  </section>

  <label for="MinhasFichas"><span class="highlight-word" data-translate="minhasFichas">Minhas Fichas</span></label>
  <section>
    <div class="CaixaMinhasFichas">
      <div id="minhasFichasList" class="fichas-list" aria-live="polite"></div>
    </div>
  </section>

  <label for="MinhasFichasRandomicas"><span class="highlight-word" data-translate="minhasFichasRandomicas">Minhas Fichas Randômicas</span></label>
  <section>
    <div class="CaixaMinhasFichas">
      <div id="minhasFichasRandomicasList" class="fichas-list" aria-live="polite"></div>
    </div>
  </section>

  <footer>
    <div class="footer-content">
      <div class="footer-links">
        <span data-translate="patrocinadores">Patrocinadores:</span>
        <a href="#">Onigiri</a>
      </div>

      <div class="footer-links">
        <span data-translate="linksRapidos">Links Rápidos:</span>
        <a href="#" data-translate="sistemas">Sistemas</a>
        <a href="#" data-translate="minhasFichas">Minhas fichas</a>
        <a href="#" data-translate="minhasFichasRandomicas">Fichas Randômicas</a>
        <a href="#" onclick="toggleGuide(); return false;" data-translate="guia">Guia</a>
        <a href="#" data-translate="configuracoes">Configurações</a>
        <a href="#" data-translate="perfil">Perfil</a>
      </div>

      <div class="footer-links">
        <span data-translate="contatoSuporte">Contato & Suporte:</span>
        <a href="mailto:contato@systemforge.com" data-translate="email">Email</a>
        <a href="https://wa.me/seunumero" rel="noopener" target="_blank" data-translate="whatsapp">Whatsapp</a>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="social-media">
        <a href="#" class="social-icon" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
        <a href="#" class="social-icon" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
        <a href="#" class="social-icon" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
        <a href="#" class="social-icon" aria-label="X/Twitter"><i class="bi bi-twitter-x"></i></a>
      </div>
      <div class="footer-legal">
        <span>©2025 System Forge. <span data-translate="direitosReservados">Todos os direitos reservados</span></span>
        <div class="legal-links">
          <a href="#" data-translate="politicasPrivacidade">Políticas de Privacidade</a>
          <a href="#" data-translate="termosUso">Termos de Uso</a>
          <a href="#" data-translate="termosCookies">Termos de Cookies</a>
          <a href="#" data-translate="acessibilidade">Acessibilidade</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- Modal / Mapa Mental -->
  <div id="mindmapOverlay" class="overlay" aria-hidden="true" onclick="closeModal()">
    <!-- Botão flutuante do Guia do Mapa Mental -->
    <button id="mindmapGuideBtn" title="Guia do Sistema" style="position:absolute;top:24px;right:24px;z-index:2100;background:#fff;border:2px solid #ffc38a;border-radius:50%;width:48px;height:48px;box-shadow:0 4px 16px rgba(0,0,0,0.13);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:box-shadow .2s;">
      <img src="../img/MascoteCertoPNG.png" alt="Guia" style="width:32px;height:32px;" />
    </button>
    <!-- Guia do Mapa Mental -->
    <div id="mindmapGuide" class="guide-speech" style="position:absolute;top:80px;right:24px;z-index:2000;display:none;max-width:370px;">
      <div class="guide-speech-header">
        <div class="guide-speech-title" id="mindmapGuideTitle">Guia do Sistema</div>
        <button class="guide-speech-close" onclick="document.getElementById('mindmapGuide').style.display='none'" aria-label="Fechar">×</button>
      </div>
      <div class="guide-speech-content" id="mindmapGuideContent">
        <strong>Clique em um dos tópicos do mapa mental para ver o que faz:</strong>
        <ul style="margin-top:10px;">
          <li><b>Criar Ficha</b>: Inicie uma nova ficha de personagem para este sistema.</li>
          <li><b>Resumo do Sistema</b>: Veja um guia ou resumo das regras e recursos do sistema.</li>
          <li><b>Fichas Randômicas</b>: Gere fichas de personagem aleatórias para inspiração ou diversão.</li>
          <li><b>Recursos Presentes</b>: Acesse materiais, tabelas e extras do sistema.</li>
        </ul>
        <span style="font-size:0.95em;color:#888;">Você pode fechar este guia a qualquer momento.</span>
      </div>
    </div>
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="mindmapSystemName" onclick="event.stopPropagation()">
      <svg class="connections" aria-hidden="true" focusable="false">
        <line class="connection-line" x1="42%" y1="35%" x2="25%" y2="35%"></line>
        <line class="connection-line" x1="58%" y1="35%" x2="75%" y2="35%"></line>
        <line class="connection-line" x1="42%" y1="65%" x2="25%" y2="65%"></line>
        <line class="connection-line" x1="58%" y1="65%" x2="75%" y2="65%"></line>
      </svg>

      <div class="section top-left" data-action="create-sheet" onclick="selectSection(event, 'create-sheet')">
        <div class="section-icon">📝</div>
        <div class="section-title" data-translate="modal_create_title">Criar Ficha</div>
        <div class="section-description" data-translate="modal_create_desc">Criar nova ficha de personagem</div>
      </div>

      <div class="section top-right" data-action="system-summary" onclick="selectSection(event, 'system-summary')">
        <div class="section-icon">📋</div>
        <div class="section-title" data-translate="modal_summary_title">Resumo do Sistema</div>
        <div class="section-description" data-translate="modal_summary_desc">Guia completo do sistema</div>
      </div>

      <div class="section center">
        <img id="modalCenterIcon" alt="Ícone do Sistema" data-translate="modal_icon_alt" data-translate-attr="alt" />
        <div id="mindmapSystemName" class="section-title" data-translate="modal_center_title">Sistema</div>
      </div>

      <div class="section bottom-left" data-action="random-sheets" onclick="selectSection(event, 'random-sheets')">
        <div class="section-icon">🎯</div>
        <div class="section-title" data-translate="modal_random_title">Fichas Randômicas</div>
        <div class="section-description" data-translate="modal_random_desc">Gerador aleatório</div>
      </div>

      <div class="section bottom-right" data-action="resources" onclick="selectSection(event, 'resources')">
        <div class="section-icon">🧪</div>
        <div class="section-title" data-translate="modal_resources_title">Recursos Presentes</div>
        <div class="section-description" data-translate="modal_resources_desc">Materiais disponíveis</div>
      </div>

      <button class="close-button" type="button" onclick="closeModal()" data-translate="voltar">← Voltar</button>
    </div>
  </div>
</body>
</html>