<!DOCTYPE html>
<html lang="pt-BR" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title data-translate="title">SystemForge - Início</title>

  <link rel="stylesheet" href="../CSS/TelaPrinciapal/home.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css" />
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
      <div class="guide-speech-title" id="guideTitle">
        <span>🔥</span>
        <span>Hefelio, o Guia</span>
      </div>
      <button class="guide-speech-close" onclick="closeGuide()" aria-label="Fechar">×</button>
    </div>
    <div class="guide-speech-content" id="guideContent">
      Olá, aventureiro! 👋 Sou seu guia nesta interface. Estou aqui para ajudá-lo a navegar e entender todos os elementos e funcionalidades disponíveis. Por onde iremos começar?
    </div>
    <div class="guide-speech-options">
      <button class="guide-option" onclick="showGuideInfo('modal')">📋 O que são os sitemas?</button>
      <button class="guide-option" onclick="showGuideInfo('ficha')">📝 O que são as minhas fichas? E onde estão elas?</button>
      <button class="guide-option" onclick="showGuideInfo('recursos')">🧪 O são as fichas randômicas? E onde estão elas?</button>
      <button class="guide-option" onclick="showGuideInfo('dicas')">💡 Dicas para iniciantes</button>
    </div>
  </div>

  <label for="System" data-translate="sistemas">Sistemas</label>
  <section class="carrossel">
    <div class="slides">
      <div class="card">
        <div onclick="openModal('Tormenta 20')">
          <img src="../img/1-8d3a9a38.png" alt="Tormenta 20" />
          <p>Tormenta 20</p>
        </div>
        <div onclick="openModal('Call of the Cthulhu')">
          <img src="../img/cthulhu.png" alt="Call of the Cthulhu" />
          <p>Call of the Cthulhu</p>
        </div>
        <div onclick="openModal('Cyberpunk')">
          <img src="../img/icons8-cyberpunk-512.png" alt="Cyberpunk" />
          <p>Cyberpunk</p>
        </div>
        <div onclick="openModal('Dungeons and Dragons')">
          <img src="../img/icons8-dungeons-and-dragons-256.png" alt="Dungeons and Dragons" />
          <p>Dungeons and Dragons</p>
        </div>
        <div onclick="openModal('Vampiro a Mascara')">
          <img src="../img/icons8-vampire-100.png" alt="Vampiro a Mascara" />
          <p>Vampiro a Mascara</p>
        </div>
      </div>
    </div>
    <button class="prev" type="button" aria-label="Anterior">‹</button>
    <button class="next" type="button" aria-label="Próximo">›</button>
  </section>

  <label for="MinhasFichas" data-translate="minhasFichas">Minhas Fichas</label>
  <section>
    <div class="CaixaMinhasFichas"></div>
  </section>

  <label for="MinhasFichasRandomicas" data-translate="minhasFichasRandomicas">Minhas Fichas Randômicas</label>

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
        <a href="#" data-translate="fichasRandomicas">Fichas Randômicas</a>
        <a href="#" onclick="toggleGuide(); return false;" data-translate="guia">Guia</a>
        <a href="#" data-translate="configuracoes">Configurações</a>
        <a href="#" data-translate="perfil">Perfil</a>
      </div>

      <div class="footer-links">
        <span data-translate="contatoSuporte">Contato & Suporte:</span>
        <a href="mailto:contato@systemforge.com">Email</a>
        <a href="https://wa.me/seunumero" rel="noopener" target="_blank">Whatsapp</a>
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
        <span>©2025 System Forge. Todos os direitos reservados</span>
        <div class="legal-links">
          <a href="#">Políticas de Privacidades</a>
          <a href="#">Termos de Uso</a>
          <a href="#">Termos de Cookies</a>
          <a href="#">Acessibilidade</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- Modal / Mapa Mental -->
  <div id="mindmapOverlay" class="overlay" aria-hidden="true" onclick="closeModal()">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="mindmapTitle" onclick="event.stopPropagation()">
      <svg class="connections" aria-hidden="true" focusable="false">
        <line class="connection-line" x1="42%" y1="35%" x2="25%" y2="35%"></line>
        <line class="connection-line" x1="58%" y1="35%" x2="75%" y2="35%"></line>
        <line class="connection-line" x1="42%" y1="65%" x2="25%" y2="65%"></line>
        <line class="connection-line" x1="58%" y1="65%" x2="75%" y2="65%"></line>
      </svg>

      <div class="section top-left" data-action="create-sheet" onclick="selectSection(event, 'create-sheet')">
        <div class="section-icon">📝</div>
        <div class="section-title">Criar Ficha</div>
        <div class="section-description">Criar nova ficha de personagem</div>
      </div>

      <div class="section top-right" data-action="system-summary" onclick="selectSection(event, 'system-summary')">
        <div class="section-icon">📋</div>
        <div class="section-title">Resumo do Sistema</div>
        <div class="section-description">Guia completo do sistema</div>
      </div>

      <div class="section center">
        <div id="mindmapTitle" class="section-icon">🎲</div>
        <div id="mindmapSystemName" class="section-title">Sistema</div>
      </div>

      <div class="section bottom-left" data-action="random-sheets" onclick="selectSection(event, 'random-sheets')">
        <div class="section-icon">🎯</div>
        <div class="section-title">Fichas Randômicas</div>
        <div class="section-description">Gerador aleatório</div>
      </div>

      <div class="section bottom-right" data-action="resources" onclick="selectSection(event, 'resources')">
        <div class="section-icon">🧪</div>
        <div class="section-title">Recursos Presentes</div>
        <div class="section-description">Materiais disponíveis</div>
      </div>

      <button class="close-button" type="button" onclick="closeModal()">← Voltar</button>
    </div>
  </div>
</body>
</html>