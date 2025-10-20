(function () {
  const linesSelector = '.connection-line';

  function getOverlay() {
    return document.getElementById('mindmapOverlay');
  }

  function getSystemNameEl() {
    return document.getElementById('mindmapSystemName');
  }

  // Modal: abrir
  window.openModal = function (systemName) {
    const overlay = getOverlay();
    if (!overlay) return;
    const nameEl = getSystemNameEl();
    if (nameEl) nameEl.textContent = systemName || 'Sistema';

    overlay.classList.remove('closing');
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    restartLineAnimations();
  };

  // Modal: fechar (com animação)
  window.closeModal = function () {
    const overlay = getOverlay();
    if (!overlay) return;
    overlay.classList.add('closing');
    overlay.classList.remove('active');

    setTimeout(() => {
      overlay.classList.remove('closing');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }, 300);
  };

  function restartLineAnimations() {
    const overlay = getOverlay();
    if (!overlay) return;
    const lines = overlay.querySelectorAll(linesSelector);
    lines.forEach((line) => {
      line.style.animation = 'none';
      // Força reflow
      // eslint-disable-next-line no-unused-expressions
      line.offsetHeight;
      line.style.animation = '';
    });
  }

  // Ações do mapa mental
  window.selectSection = function (evt, action) {
    if (evt && typeof evt.stopPropagation === 'function') evt.stopPropagation();
    switch (action) {
      case 'create-sheet':
        console.log('Criar ficha');
        break;
      case 'system-summary':
        console.log('Resumo do sistema');
        break;
      case 'random-sheets':
        console.log('Fichas randômicas');
        break;
      case 'resources':
        console.log('Recursos');
        break;
      default:
        break;
    }
    closeModal();
  };

  // ===== Guia (balão) =====
  window.toggleGuide = function () {
    const speech = document.getElementById('guideSpeech');
    const trigger = document.querySelector('.guide-trigger');
    if (!speech) return;
    const willOpen = !speech.classList.contains('active');
    speech.classList.toggle('active', willOpen);
    if (willOpen) trigger && trigger.classList.add('viewed');
  };

  window.closeGuide = function () {
    const speech = document.getElementById('guideSpeech');
    if (speech) speech.classList.remove('active');
  };

  window.showGuideInfo = function (key) {
    const el = document.getElementById('guideContent');
    if (!el) return;
    const texts = {
      modal: 'Os sistemas são agrupamentos com recursos, fichas e guias específicos. Clique em um para abrir o mapa mental.',
      ficha: 'Minhas fichas mostra suas fichas salvas. Você pode criar, editar e duplicar.',
      recursos: 'Fichas randômicas geram personagens automaticamente com base no sistema.',
      dicas: 'Dica: passe o mouse nos cards para ver a prévia em vídeo. Use Tab para navegar por teclado.'
    };
    el.textContent = texts[key] || texts.modal;
  };

  // ===== Vídeo no hover dos cards =====
  function bindCardHover(card) {
    const video = card.querySelector('.hover-video');
    if (!video) return;

    const play = () => {
      try {
        video.muted = true;
        video.playsInline = true;
        if (video.readyState < 2) video.load();
        video.currentTime = 0;
        const p = video.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } catch {}
    };

    const stop = () => {
      try {
        video.pause();
        video.currentTime = 0;
      } catch {}
    };

    card.addEventListener('mouseenter', play, { passive: true });
    card.addEventListener('mouseleave', stop, { passive: true });
    card.addEventListener('focusin', play);
    card.addEventListener('focusout', stop);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.has-hover-video').forEach(bindCardHover);
  });
})();