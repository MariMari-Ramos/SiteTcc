  // ===== Modal da Ficha (Mapa Mental de Ações) =====
  let fichaIdSelecionada = null;

  window.openFichaModal = function (idFicha) {
    fichaIdSelecionada = idFicha;
    const overlay = document.getElementById('fichaMindmapOverlay');
    if (!overlay) return;
    overlay.classList.remove('closing');
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    restartFichaLineAnimations();
  };

  window.closeFichaModal = function () {
    const overlay = document.getElementById('fichaMindmapOverlay');
    if (!overlay) return;
    overlay.classList.add('closing');
    setTimeout(() => {
      overlay.classList.remove('active');
      overlay.classList.remove('closing');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      fichaIdSelecionada = null;
    }, 600);
  };

  function restartFichaLineAnimations() {
    const overlay = document.getElementById('fichaMindmapOverlay');
    if (!overlay) return;
    const lines = overlay.querySelectorAll('.connection-line');
    lines.forEach((line) => {
      line.style.animation = 'none';
      line.offsetHeight;
      line.style.animation = '';
    });
  }

  window.selectFichaSection = function (evt, action) {
    if (evt && typeof evt.stopPropagation === 'function') evt.stopPropagation();
    if (!fichaIdSelecionada) return closeFichaModal();
    switch (action) {
      case 'edit':
        // Redireciona para edição da ficha
        window.location.href = `/SiteTcc/SistemasRPG/F&M/Edicao/EdicaoFicha_F&M.php?id=${fichaIdSelecionada}`;
        break;
      case 'delete':
        openModalConfirmDeleteFicha();
        break;
      default:
        closeFichaModal();
        break;
    }
  };

  // Modal de confirmação de exclusão de ficha
  function openModalConfirmDeleteFicha() {
    const modal = document.getElementById('modalConfirmDeleteFicha');
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }
  window.closeModalConfirmDeleteFicha = function() {
    const modal = document.getElementById('modalConfirmDeleteFicha');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  // Handler do botão "Excluir" do modal customizado
  document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('btnConfirmDeleteFicha');
    if (btn) {
      btn.onclick = function() {
        if (!fichaIdSelecionada) return window.closeModalConfirmDeleteFicha();
        btn.disabled = true;
        btn.textContent = 'Excluindo...';
        fetch('/SiteTcc/SistemasRPG/F&M/Edicao/phpFichaF&M.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `delete_ficha=1&id_ficha=${encodeURIComponent(fichaIdSelecionada)}`
        })
          .then(r => r.json())
          .then(resp => {
            btn.disabled = false;
            btn.textContent = 'Excluir';
            if (resp && resp.success) {
              window.closeModalConfirmDeleteFicha();
              closeFichaModal();
              window.dispatchEvent(new Event('minhasFichas:changed'));
              alert('Ficha excluída com sucesso!');
            } else {
              alert('Erro ao excluir ficha.');
            }
          })
          .catch(() => {
            btn.disabled = false;
            btn.textContent = 'Excluir';
            alert('Erro ao excluir ficha.');
          });
      };
    }
  });
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
          window.location.href = '../SistemasRPG/3DeT/Ficha3DeT.html';
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
      host.innerHTML = '<p style="color:#666;margin:6px 8px;text-align:center;display:block;" data-translate="nenhuma_ficha">Nenhuma ficha salva ainda.</p>';
      if (window.applyTranslationsNow) window.applyTranslationsNow();
      if (window.updateGlobalSettings) window.updateGlobalSettings();
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
      const sysKey = sistema.toLowerCase().replace(/\s+/g, '');
      group.setAttribute('data-system', sysKey);

      // Título + botão (apenas para D&D 5e)
      const title = document.createElement('div');
      title.className = 'fichas-title';
      title.style.display = 'flex';
      title.style.alignItems = 'center';
      title.style.justifyContent = 'space-between';
      title.style.gap = '12px';

      let showDatas = false;
      let order = 'default'; // 'default', 'newest', 'oldest'
      let menuBtn = null;
      let dropdown = null;
      let toggleDataBtn = null;
      if (sysKey === 'd&d5e' || sysKey === 'd&d') {
        // Container para alinhar botões à direita
        const btnContainer = document.createElement('div');
        btnContainer.style.display = 'flex';
        btnContainer.style.gap = '8px';

        // Botão de exibir data
        toggleDataBtn = document.createElement('button');
        toggleDataBtn.type = 'button';
        toggleDataBtn.setAttribute('data-translate', 'exibir_data');
        toggleDataBtn.textContent = 'Exibir data';
        toggleDataBtn.className = 'btn-toggle-datas global-btn-theme';
        toggleDataBtn.style.fontSize = '0.9em';
        toggleDataBtn.style.padding = '2px 10px';
        toggleDataBtn.style.borderRadius = '8px';
        toggleDataBtn.style.border = '1px solid #d4a574';
        toggleDataBtn.style.background = '';
        toggleDataBtn.style.cursor = 'pointer';
        toggleDataBtn.addEventListener('click', function() {
          showDatas = !showDatas;
          toggleDataBtn.setAttribute('data-translate', showDatas ? 'ocultar_data' : 'exibir_data');
          toggleDataBtn.textContent = showDatas ? 'Ocultar data' : 'Exibir data';
          if (window.applyTranslationsNow) window.applyTranslationsNow();
          renderChips();
        });

        // Botão de ordenação
        menuBtn = document.createElement('button');
        menuBtn.type = 'button';
        menuBtn.setAttribute('data-translate', 'ordenar_fichas');
        menuBtn.textContent = 'Ordenar fichas';
        menuBtn.className = 'btn-toggle-datas global-btn-theme';
        menuBtn.style.fontSize = '0.9em';
        menuBtn.style.padding = '2px 10px';
        menuBtn.style.borderRadius = '8px';
        menuBtn.style.border = '1px solid #d4a574';
        menuBtn.style.background = '';
        menuBtn.style.cursor = 'pointer';
        menuBtn.style.position = 'relative';

        dropdown = document.createElement('div');
        dropdown.className = 'dropdown-ordem-fichas';
        dropdown.style.display = 'none';
        dropdown.style.position = 'absolute';
        dropdown.style.top = '110%';
        dropdown.style.left = '0';
        dropdown.style.background = '';
        dropdown.style.border = '1px solid #d4a574';
        dropdown.style.borderRadius = '8px';
        dropdown.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
        dropdown.style.zIndex = '10';
        dropdown.style.minWidth = '160px';

        const opt1 = document.createElement('button');
        opt1.type = 'button';
        opt1.setAttribute('data-translate', 'mais_nova_primeiro');
        opt1.textContent = 'Mais nova primeiro';
        opt1.className = 'dropdown-opt';
        opt1.style.width = '100%';
        opt1.style.padding = '8px 12px';
        opt1.style.background = 'none';
        opt1.style.border = 'none';
        opt1.style.textAlign = 'left';
        opt1.style.cursor = 'pointer';
        opt1.addEventListener('click', function() {
          order = 'newest';
          dropdown.style.display = 'none';
          renderChips();
        });

        const opt2 = document.createElement('button');
        opt2.type = 'button';
        opt2.setAttribute('data-translate', 'mais_velha_primeiro');
        opt2.textContent = 'Mais velha primeiro';
        opt2.className = 'dropdown-opt';
        opt2.style.width = '100%';
        opt2.style.padding = '8px 12px';
        opt2.style.background = 'none';
        opt2.style.border = 'none';
        opt2.style.textAlign = 'left';
        opt2.style.cursor = 'pointer';
        opt2.addEventListener('click', function() {
          order = 'oldest';
          dropdown.style.display = 'none';
          renderChips();
        });

        dropdown.appendChild(opt1);
        dropdown.appendChild(opt2);
        menuBtn.appendChild(dropdown);

        menuBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', function(e) {
          if (dropdown && !menuBtn.contains(e.target)) {
            dropdown.style.display = 'none';
          }
        });

        btnContainer.appendChild(toggleDataBtn);
        btnContainer.appendChild(menuBtn);

        // Título à esquerda, botões à direita
        const titleText = document.createElement('span');
        titleText.textContent = sistema;
        title.appendChild(titleText);
        title.appendChild(btnContainer);
      } else {
        // Apenas o nome do sistema
        title.textContent = sistema;
      }

      const chips = document.createElement('div');
      chips.className = 'fichas-chips';

      function renderChips() {
        chips.innerHTML = '';
        const now = new Date();
        let fichasOrdenadas = [...list];
        if (sysKey === 'd&d5e' || sysKey === 'd&d') {
          if (order === 'newest') {
            fichasOrdenadas.sort((a, b) => new Date(b.data_criacao) - new Date(a.data_criacao));
          } else if (order === 'oldest') {
            fichasOrdenadas.sort((a, b) => new Date(a.data_criacao) - new Date(b.data_criacao));
          }
        }
        fichasOrdenadas.forEach(f => {
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'ficha-chip';
          chip.dataset.id = f.id_ficha;

          let dados = {};
          try { dados = JSON.parse(f.dados_json); } catch(e){}

          let specialization =
            (dados.info_basicas && dados.info_basicas.specialization)
            ? dados.info_basicas.specialization
            : null;
          if (!specialization) {
            specialization = `<span data-translate="nao_definido">Não definido</span>`;
          }

          const dataObj = new Date(f.data_criacao);
          const dataCriacao = dataObj.toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric' });

          chip.innerHTML = `
            <strong>${f.nome_personagem}</strong><br>
            <span style="font-size: 12px; color: #ccc;">
                ${specialization}
                ${showDatas ? `• <span data-translate='criada_em'>Criada em</span> ${dataCriacao}` : ''}
            </span>
          `;
          if (window.applyTranslationsNow) window.applyTranslationsNow();

          chip.title = `${f.nome_personagem} (${sistema})`;

          chip.addEventListener('click', (e) => {
            e.preventDefault();
            window.openFichaModal(f.id_ficha);
          });

          chips.appendChild(chip);
        });
      }

      renderChips();
      if (window.applyTranslationsNow) window.applyTranslationsNow();
      if (window.updateGlobalSettings) window.updateGlobalSettings();

      const rail = document.createElement('div');
      rail.className = 'fichas-rail';

      group.appendChild(title);
      group.appendChild(chips);
      group.appendChild(rail);
      frag.appendChild(group);
    });

    host.innerHTML = '';
    host.appendChild(frag);
    if (window.applyTranslationsNow) window.applyTranslationsNow();
    if (window.updateGlobalSettings) window.updateGlobalSettings();
}


  /* ===== Minhas Fichas Randômicas: renderização (placeholder) ===== */
  function renderMinhasFichasRandomicas() {
    const host = document.getElementById('minhasFichasRandomicasList');
    if (!host) return;
    
    // Placeholder - ainda não há fichas randômicas salvas
    host.innerHTML = '<p style="color:#666;margin:6px 8px;text-align:center;display:block;" data-translate="nenhuma_ficha_randomica">Nenhuma ficha randômica salva ainda.</p>';
    if (window.applyTranslationsNow) window.applyTranslationsNow();
    if (window.updateGlobalSettings) window.updateGlobalSettings();
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