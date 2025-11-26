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
        
        // Redireciona para a página de criação de ficha baseado no sistema
        if (currentSystem === '3DeT Victory') {
          window.location.href = '../SistemasRPG/Pasta3DeT/Ficha_3DeT.html';
        } else if (currentSystem === 'Dungeons and Dragons') {
          window.location.href = '../SistemasRPG/DnD5e/CriarFichaDnD.html';
        } else if (currentSystem === 'Cyberpunk') {
          window.location.href = '../SistemasRPG/Cyberpunk/CriarFichaCyberpunk.html';
        } else if (currentSystem === 'Feiticeiros e Maldições') {
          window.location.href = '../SistemasRPG/F&M/fichaf_completo.php';
        } else if (currentSystem === 'Vampiro a Mascara') {
          window.location.href = '../SistemasRPG/Vampiro/CriarFichaVampiro.html';
        } else {
          alert(`Sistema ${currentSystem} ainda não possui página de criação de ficha.`);
          window.closeModal();
        }
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

  async function fetchFichasDoServidor() {
    const r = await fetch("../SistemasRPG/listar_fichas.php" );
    return await r.json();
  }

  /* ===== Minhas Fichas: renderização ===== */
  async function renderMinhasFichas() {
    const host = document.getElementById('minhasFichasList');
    if (!host) return;

    const fichas = await fetchFichasDoServidor();

    if (!fichas.length) {
      host.innerHTML = '<p style="color:#666;margin:6px 8px;">Nenhuma ficha salva ainda.</p>';
      return;
    }

    const bySys = fichas.reduce((acc, f) => {
      const sys = f.nome_sistema || 'Outros';
      (acc[sys] ||= []).push(f);
      return acc;
    }, {});

    const frag = document.createDocumentFragment();

    Object.entries(bySys).forEach(([sistema, list]) => {
      const group = document.createElement('div');
      group.className = 'fichas-group';
      group.setAttribute('data-system', sistema.toLowerCase().replace(/\s+/g, ''));

      const title = document.createElement('div');
      title.className = 'fichas-title';
      title.textContent = sistema;

      const chips = document.createElement('div');
      chips.className = 'fichas-chips';

      list.forEach(f => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'ficha-chip';
        chip.dataset.id = f.id_ficha;

        let dados = {};
        try { dados = JSON.parse(f.dados_json); } catch(e){}

        const specialization =
          (dados.info_basicas && dados.info_basicas.specialization)
          ? dados.info_basicas.specialization
        : "Não definido";


        const dataCriacao = new Date(f.data_criacao)
          .toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric' });

        chip.innerHTML = `
          <strong>${f.nome_personagem}</strong><br>
          <span style="font-size: 12px; color: #ccc;">
              ${specialization} • Criada em ${dataCriacao}
          </span>
        `;

        chip.title = `${f.nome_personagem} (${sistema})`;

        chip.addEventListener('click', () => {
          window.location.href = `/SiteTcc/SistemasRPG/F&M/Edicao/EdicaoFicha_F&M.php?id=${f.id_ficha}`;
        });

        chips.appendChild(chip);
      });


      const rail = document.createElement('div');
      rail.className = 'fichas-rail';

      group.appendChild(title);
      group.appendChild(chips);
      group.appendChild(rail);
      frag.appendChild(group);
    });

    host.innerHTML = '';
    host.appendChild(frag);
}


  /* ===== Minhas Fichas Randômicas: renderização (placeholder) ===== */
  function renderMinhasFichasRandomicas() {
    const host = document.getElementById('minhasFichasRandomicasList');
    if (!host) return;
    
    // Placeholder - ainda não há fichas randômicas salvas
    host.innerHTML = '<p style="color:#666;margin:6px 8px;">Nenhuma ficha randômica salva ainda.</p>';
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.has-hover-video').forEach(bindCardHover);

    const iconEl = getCenterIconEl();
    if (iconEl) iconEl.style.display = 'none';

    // Renderiza "Minhas Fichas"
    renderMinhasFichas();
    
    // Renderiza "Minhas Fichas Randômicas"
    renderMinhasFichasRandomicas();

    console.log('Script da página inicial carregado com sucesso');
  });

  // Atualiza quando a lista de fichas mudar
  window.addEventListener('minhasFichas:changed', renderMinhasFichas);

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