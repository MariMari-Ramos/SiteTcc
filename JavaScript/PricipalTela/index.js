(function () {
  const linesSelector = '.connection-line';

  function getOverlay() {
    return document.getElementById('mindmapOverlay');
  }
  
  function getSystemNameEl() {
    return document.getElementById('mindmapSystemName');
  }

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
    evt = evt || window.event;
    const target = (evt.currentTarget) ? evt.currentTarget : evt.target;
    const icon = target && target.querySelector ? target.querySelector('.section-icon') : null;
    if (icon) {
      icon.style.transform = 'scale(0.9)';
      setTimeout(() => icon.style.transform = '', 140);
    }

    switch (action) {
      case 'create-sheet':
        alert('Abrir: Criar nova ficha (básico)');
        break;
      case 'system-summary':
        alert('Abrir: Resumo do sistema selecionado');
        break;
      case 'random-sheets':
        alert('Abrir: Gerador de fichas aleatórias');
        break;
      case 'resources':
        alert('Abrir: Recursos e materiais do sistema');
        break;
      default:
        console.log('Ação desconhecida:', action);
    }
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

})();