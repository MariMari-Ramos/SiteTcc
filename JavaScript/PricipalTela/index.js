(function () {
  const linesSelector = '.connection-line';

  function getOverlay() { return document.getElementById('mindmapOverlay'); }
  function getSystemNameEl() { return document.getElementById('mindmapSystemName'); }

  window.openModal = function (systemName) {
    const overlay = getOverlay();
    const systemNameEl = getSystemNameEl();
    if (!overlay) return;
    if (systemNameEl) systemNameEl.textContent = systemName;

    overlay.style.display = 'flex';
    overlay.classList.remove('closing');
    requestAnimationFrame(() => {
      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
    });
    document.body.style.overflow = 'hidden';
    restartLineAnimations();
  };

  window.closeModal = function () {
    const overlay = getOverlay();
    if (!overlay) return;
    overlay.classList.remove('active');
    overlay.classList.add('closing');
    setTimeout(() => {
      overlay.classList.remove('closing');
      overlay.style.display = 'none';
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }, 350);
  };

  function restartLineAnimations() {
    const lines = document.querySelectorAll(linesSelector);
    lines.forEach((line, i) => {
      line.style.animation = 'none';
      void line.offsetWidth;
      line.style.animation = `dash 2s linear infinite ${i * 0.08}s`;
    });
  }

  window.selectSection = function (evt, action) {
    const target = evt?.currentTarget || evt?.target;
    const icon = target?.querySelector?.('.section-icon');
    if (icon) {
      icon.style.transform = 'scale(0.9)';
      setTimeout(() => (icon.style.transform = ''), 140);
    }
    switch (action) {
      case 'create-sheet': alert('Abrir: Criar nova ficha (básico)'); break;
      case 'system-summary': alert('Abrir: Resumo do sistema selecionado'); break;
      case 'random-sheets': alert('Abrir: Gerador de fichas aleatórias'); break;
      case 'resources': alert('Abrir: Recursos e materiais do sistema'); break;
      default: console.log('Ação desconhecida:', action);
    }
  };

  // ===== Guia (balão) =====
  let guideOpened = false;

  window.toggleGuide = function () {
    const speech = document.getElementById('guideSpeech');
    if (!speech) return;

    const isActive = speech.classList.toggle('active');
    speech.setAttribute('aria-hidden', isActive ? 'false' : 'true');

    // esconde o badge de notificação na primeira abertura
    if (!guideOpened && isActive) {
      guideOpened = true;
      const headerGuide = document.querySelector('a.guide-trigger');
      if (headerGuide) headerGuide.classList.add('viewed');
      try { localStorage.setItem('guideViewed', '1'); } catch (_) {}
    }
  };

  window.closeGuide = function () {
    const speech = document.getElementById('guideSpeech');
    if (speech) {
      speech.classList.remove('active');
      speech.setAttribute('aria-hidden', 'true');
    }
    try { localStorage.setItem('guideViewed', '1'); } catch (_) {}
    const headerGuide = document.querySelector('a.guide-trigger');
    if (headerGuide) headerGuide.classList.add('viewed');
  };

  window.showGuideInfo = function (key) {
    const guideContent = document.getElementById('guideContent');
    if (!guideContent) return;

    const texts = {
      ficha: 'Como você pode ver, não há nenhuma ficha criada ainda. Quando você futuramente criar uma, ela aparecerá aqui para fácil acesso, e as fichas serão divididas por sistemas e cores que condizem com o determinado sistema.',
      recursos: 'O mesmo vale para as fichas randomicas, quando você criar uma, ela aparecerá aqui para fácil acesso.',
      dicas: '💡 Dicas: comece simples, defina um objetivo para o personagem e evolua a partir das sessões.',
    };

    if (key === 'modal') {
      closeGuide();
      openModal('Mapa Mental');
      return;
    }

    guideContent.textContent = texts[key] || 'Selecione uma das opções para saber mais.';
  };

  // Restaura estado do badge no load
  document.addEventListener('DOMContentLoaded', () => {
    const viewed = (() => { try { return localStorage.getItem('guideViewed') === '1'; } catch (_) { return false; }})();
    const headerGuide = document.querySelector('a.guide-trigger');
    if (headerGuide && viewed) headerGuide.classList.add('viewed');
  });

  // Acessibilidade: ESC fecha guia e modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeModal();
      window.closeGuide();
    }
  });
})();
(function () {
  const linesSelector = '.connection-line';

  function getOverlay() { return document.getElementById('mindmapOverlay'); }
  function getSystemNameEl() { return document.getElementById('mindmapSystemName'); }

  window.openModal = function (systemName) {
    const overlay = getOverlay();
    const systemNameEl = getSystemNameEl();
    if (!overlay) return;
    if (systemNameEl) systemNameEl.textContent = systemName;

    overlay.style.display = 'flex';
    overlay.classList.remove('closing');
    requestAnimationFrame(() => {
      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
    });
    document.body.style.overflow = 'hidden';
    restartLineAnimations();
  };

  window.closeModal = function () {
    const overlay = getOverlay();
    if (!overlay) return;
    overlay.classList.remove('active');
    overlay.classList.add('closing');
    setTimeout(() => {
      overlay.classList.remove('closing');
      overlay.style.display = 'none';
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }, 350);
  };

  function restartLineAnimations() {
    const lines = document.querySelectorAll(linesSelector);
    lines.forEach((line, i) => {
      line.style.animation = 'none';
      void line.offsetWidth;
      line.style.animation = `dash 2s linear infinite ${i * 0.08}s`;
    });
  }

  window.selectSection = function (evt, action) {
    const target = evt?.currentTarget || evt?.target;
    const icon = target?.querySelector?.('.section-icon');
    if (icon) {
      icon.style.transform = 'scale(0.9)';
      setTimeout(() => (icon.style.transform = ''), 140);
    }
    switch (action) {
      case 'create-sheet': alert('Abrir: Criar nova ficha (básico)'); break;
      case 'system-summary': alert('Abrir: Resumo do sistema selecionado'); break;
      case 'random-sheets': alert('Abrir: Gerador de fichas aleatórias'); break;
      case 'resources': alert('Abrir: Recursos e materiais do sistema'); break;
      default: console.log('Ação desconhecida:', action);
    }
  };

  // ===== Guia (balão) =====
  let guideOpened = false;

  window.toggleGuide = function () {
    const speech = document.getElementById('guideSpeech');
    if (!speech) return;

    const isActive = speech.classList.toggle('active');
    speech.setAttribute('aria-hidden', isActive ? 'false' : 'true');

    // esconde o badge de notificação na primeira abertura
    if (!guideOpened && isActive) {
      guideOpened = true;
      const headerGuide = document.querySelector('a.guide-trigger');
      if (headerGuide) headerGuide.classList.add('viewed');
      try { localStorage.setItem('guideViewed', '1'); } catch (_) {}
    }
  };

  window.closeGuide = function () {
    const speech = document.getElementById('guideSpeech');
    if (speech) {
      speech.classList.remove('active');
      speech.setAttribute('aria-hidden', 'true');
    }
    try { localStorage.setItem('guideViewed', '1'); } catch (_) {}
    const headerGuide = document.querySelector('a.guide-trigger');
    if (headerGuide) headerGuide.classList.add('viewed');
  };

  window.showGuideInfo = function (key) {
    const guideContent = document.getElementById('guideContent');
    if (!guideContent) return;

    const texts = {
      ficha: 'Como você pode ver, não há nenhuma ficha criada ainda. Quando você futuramente criar uma, ela aparecerá aqui para fácil acesso, e as fichas serão divididas por sistemas e cores que condizem com o determinado sistema.',
      recursos: 'O mesmo vale para as fichas randomicas, quando você criar uma, ela aparecerá aqui para fácil acesso.',
      dicas: '💡 Dicas: comece simples, defina um objetivo para o personagem e evolua a partir das sessões.',
    };

    if (key === 'modal') {
      closeGuide();
      openModal('Mapa Mental');
      return;
    }

    guideContent.textContent = texts[key] || 'Selecione uma das opções para saber mais.';
  };

  // Restaura estado do badge no load
  document.addEventListener('DOMContentLoaded', () => {
    const viewed = (() => { try { return localStorage.getItem('guideViewed') === '1'; } catch (_) { return false; }})();
    const headerGuide = document.querySelector('a.guide-trigger');
    if (headerGuide && viewed) headerGuide.classList.add('viewed');
  });

  // Acessibilidade: ESC fecha guia e modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeModal();
      window.closeGuide();
    }
  });
})();