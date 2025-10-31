<!DOCTYPE html>
<html lang="pt-BR" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title data-translate="title">SystemForge - Início</title>

  <!-- CSS Global -->
  <link rel="stylesheet" href="../CSS/EstilosGlobais/GlobalStylesConfigurationCss.css" />
  <!-- CSS da página -->
  <link rel="stylesheet" href="../CSS/TelaPrinciapal/home.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css" />

  <!-- JS Global (sem defer para aplicar tema/estado inicial) -->
  <script src="../JavaScript/ConfiguraçõesGlobais/GlobaConfigurationlJavaScript.js"></script>
  <!-- JS da página (defer) -->
  <script src="../JavaScript/PrincipalTela/index.js" defer></script>
</head>
<body>
  <header>
    <div class="logo">
      <a href="#">
        <img src="../img/PETO E BANCO-Photoroom.png" alt="SystemForge" />
      </a>
    </div>

    <nav class="menu">
      <a href="./Perfil_ConfiguracaoDePerfil/Perfil.php">
        <i class="bi bi-person-circle" aria-hidden="true"></i>
        <span data-translate="perfil">Perfil</span>
      </a>
      <a href="Configurações/config.html">
        <i class="bi bi-gear-fill" aria-hidden="true"></i>
        <span data-translate="configuracoes">Configurações</span>
      </a>
      <a href="#" class="guide-trigger" onclick="toggleGuide(); return false;">
        <img src="../img/image-Photoroom (1).png" alt="Guia" />
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

  <label for="System" data-translate="sistemas">Sistemas</label>
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
            <source src="../videos/FeiticeirosEMaldiçõesHoover.mp4" type="video/mp4" />
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
            <source src="../videos/DarkStarJhin.mp4" type="video/mp4" />
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

  <label for="MinhasFichas" data-translate="minhasFichas">Minhas Fichas</label>
  <section>
    <div class="CaixaMinhasFichas"></div>
  </section>

  <label for="MinhasFichasRandomicas" data-translate="minhasFichasRandomicas">Minhas Fichas Randômicas</label>

<section>
    <div class="CaixaMinhasFichas"></div>
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