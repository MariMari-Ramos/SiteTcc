(function () {
  const linesSelector = '.connection-line';

  function getOverlay() {
    return document.getElementById('mindmapOverlay');
  }

  function getSystemNameEl() {
    return document.getElementById('mindmapSystemName');
  }

  function getCenterIconEl() {
    return document.getElementById('modalCenterIcon');
  }

  // Variável para armazenar o sistema atual selecionado
  let currentSystem = null;

  // Modal: abrir (recebe o nome e o ícone do sistema)
  window.openModal = function (systemName, iconUrl) {
    const overlay = getOverlay();
    if (!overlay) return;

    currentSystem = systemName;

    const nameEl = getSystemNameEl();
    if (nameEl) nameEl.textContent = systemName || 'Sistema';

    const iconEl = getCenterIconEl();
    if (iconEl) {
      if (iconUrl) {
        iconEl.src = iconUrl;
        iconEl.alt = systemName ? `Ícone de ${systemName}` : 'Ícone do Sistema';
        iconEl.style.display = 'block';
      } else {
        iconEl.removeAttribute('src');
        iconEl.style.display = 'none';
      }
    }

    overlay.classList.remove('closing');
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    restartLineAnimations();
  };

  // Modal: fechar (com animação inversa - ordem contrária da abertura)
  window.closeModal = function () {
    const overlay = getOverlay();
    if (!overlay) return;
    
    overlay.classList.add('closing');
    
    setTimeout(() => {
      overlay.classList.remove('active');
      overlay.classList.remove('closing');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      currentSystem = null;
    }, 600);
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
        console.log('Criar ficha para:', currentSystem);
        alert(`Criação de ficha para ${currentSystem} em desenvolvimento.`);
        window.closeModal();
        break;
        
      case 'system-summary':
        console.log('Resumo do sistema:', currentSystem);
        alert(`Resumo do sistema ${currentSystem} em desenvolvimento.`);
        window.closeModal();
        break;
        
      case 'random-sheets':
        console.log('Fichas randômicas:', currentSystem);
        alert(`Gerador de fichas randômicas para ${currentSystem} em desenvolvimento.`);
        window.closeModal();
        break;
        
      case 'resources':
        console.log('Recursos:', currentSystem);
        alert(`Recursos para ${currentSystem} em desenvolvimento.`);
        window.closeModal();
        break;
        
      default:
        window.closeModal();
        break;
    }
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

  // ===== Vídeo no hover dos cards (com transition suave - 0.5s) =====
  function bindCardHover(card) {
    const video = card.querySelector('.hover-video');
    const img = card.querySelector('img');
    
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

  // Previne navegação acidental com clique duplo
  document.addEventListener('dblclick', function(e) {
    if (e.target.closest('.has-hover-video')) {
      e.preventDefault();
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.has-hover-video').forEach(bindCardHover);

    const iconEl = getCenterIconEl();
    if (iconEl) iconEl.style.display = 'none';

    console.log('Script da página inicial carregado com sucesso');
  });

  // Fechar modal com ESC
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      const overlay = getOverlay();
      if (overlay && overlay.classList.contains('active')) {
        window.closeModal();
      }
    }
  });
})();