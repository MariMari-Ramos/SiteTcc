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
      host.innerHTML = '<p style="color:#666;margin:6px 8px;text-align:center;display:block;" data-i18n="nenhuma_ficha">Nenhuma ficha salva ainda.</p>';
      if (window.TranslationManager) window.TranslationManager.applyToDOM();
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
    host.innerHTML = '<p style="color:#666;margin:6px 8px;text-align:center;display:block;" data-i18n="nenhuma_ficha_randomica">Nenhuma ficha randômica salva ainda.</p>';
    if (window.TranslationManager) window.TranslationManager.applyToDOM();
  }

  // ===== Animações de surgimento (entrada progressiva) =====
  function applyEntranceAnimations(scope = document) {
    // Seleciona elementos principais evitando aqueles dentro de modais ativos
    const selectors = [
      'header', 'header .menu a',
      'label[for="System"]', 'label[for="MinhasFichas"]', 'label[for="MinhasFichasRandomicas"]',
      '.carrossel .card > div', '.CaixaMinhasFichas', '.fichas-group', '.ficha-chip',
      'footer', 'footer .footer-links a', '.guide-trigger'
    ];
    const elements = selectors.flatMap(sel => Array.from(scope.querySelectorAll(sel)))
      .filter(el => !el.closest('.overlay.active')); // não interferir em animações próprias do modal

    if (!elements.length) return;

    elements.forEach((el, i) => {
      // Evita reaplicar se já animado
      if (el.classList.contains('fx-in')) return;
      el.classList.add('fx-pre');
      el.style.setProperty('--fx-delay', (i * 0.06).toFixed(2) + 's');
    });

    // Duplo rAF para garantir aplicação inicial antes de iniciar animação
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        elements.forEach(el => el.classList.add('fx-in'));
      });
    });
  }

  // Reaplica animação em grupos novos (fichas) após renderização
  function animateNewFichas() {
    const host = document.getElementById('minhasFichasList');
    if (host) applyEntranceAnimations(host);
    const hostRand = document.getElementById('minhasFichasRandomicasList');
    if (hostRand) applyEntranceAnimations(hostRand);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.has-hover-video').forEach(bindCardHover);

    const iconEl = getCenterIconEl();
    if (iconEl) iconEl.style.display = 'none';

    // Renderiza "Minhas Fichas"
    renderMinhasFichas();
    
    // Renderiza "Minhas Fichas Randômicas"
    renderMinhasFichasRandomicas();

    // Anima elementos iniciais
    applyEntranceAnimations();

    console.log('Script da página inicial carregado com sucesso');
  });

  // Reanima quando fichas mudarem
  window.addEventListener('minhasFichas:changed', () => {
    renderMinhasFichas();
    animateNewFichas();
  });

  // Atualiza quando a lista de fichas mudar
  window.addEventListener('minhasFichas:changed', renderMinhasFichas);

  // Fechar modal com ESC
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      const overlay = getOverlay();
      if (overlay && overlay.classList.contains('active')) {
        closeModal();
      }
    }
  });
})();

// ==================== AUTO READ (SPEECH SYNTHESIS) ====================
// Funcionalidade de leitura automática de texto ao clicar
(function(global){
  const AutoRead = {
    speech: {
      supported: 'speechSynthesis' in window,
      utterance: null,
      speaking: false,
      voice: null,
      rate: 1,
      pitch: 1,
      lang: (navigator.language || 'pt-BR')
    },
    _speechQueue: [],
    _selectionDebounceTimer: null,
    _handleSelectionRead: null,
    _handleSelectionKey: null,
    
    init() {
      this.initSpeechVoices();
      this.setupWordClickRead();
    },
    
    initSpeechVoices() {
      const setVoice = () => {
        if (!this.speech.supported) return;
        const voices = window.speechSynthesis.getVoices();
        const lang = localStorage.getItem('language') || 'pt-BR';
        this.speech.voice = voices.find(v => v.lang.startsWith(lang.substring(0,2))) || voices[0] || null;
      };
      setVoice();
      if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = setVoice;
      }
    },
    
    speak(text) {
      const autoReadEnabled = localStorage.getItem('autoRead') === 'true';
      if (!this.speech.supported || !autoReadEnabled || !text) return;
      try {
        this.stopSpeaking();
        const u = new SpeechSynthesisUtterance(text);
        const lang = localStorage.getItem('language') || 'pt-BR';
        u.lang = lang;
        if (this.speech.voice) u.voice = this.speech.voice;
        this.speech.rate = Number(localStorage.getItem('speechRate') || 1);
        this.speech.pitch = Number(localStorage.getItem('speechPitch') || 1);
        u.rate = this.speech.rate;
        u.pitch = this.speech.pitch;
        u.onstart = () => { this.speech.speaking = true; };
        u.onend = () => { this.speech.speaking = false; };
        this.speech.utterance = u;
        window.speechSynthesis.speak(u);
      } catch(e) {
        // Silencioso
      }
    },
    
    stopSpeaking() {
      try {
        if (this.speech.supported) {
          window.speechSynthesis.cancel();
        }
        this.speech.speaking = false;
        this.speech.utterance = null;
        this._speechQueue = [];
      } catch(e) {}
    },
    
    setupWordClickRead() {
      document.addEventListener('click', (e) => this.handleWordClick(e), true);
      this.setupSelectionRead();
    },
    
       // ==================== LEITURA POR SELEÇÃO (FRASE INTEIRA) ====================
       // Lê a frase inteira quando o usuário seleciona texto com o mouse (com debounce)
       setupSelectionRead() {
         this._handleSelectionRead = (e) => this.handleSelectionRead(e);
         document.addEventListener('mouseup', this._handleSelectionRead, true);
         // Suporte básico a seleção por teclado (Shift+setas) com debounce
         this._handleSelectionKey = (e) => {
           if (!e) return;
           if (e.key === 'Shift' || (typeof e.key === 'string' && e.key.startsWith('Arrow'))) {
             this.handleSelectionRead(e);
           }
         };
         document.addEventListener('keyup', this._handleSelectionKey, true);
       },

       handleSelectionRead(e) {
         try {
           const autoReadEnabled = localStorage.getItem('autoRead') === 'true';
           if (!this.speech.supported || !autoReadEnabled) return;

           if (this._selectionDebounceTimer) {
             clearTimeout(this._selectionDebounceTimer);
             this._selectionDebounceTimer = null;
           }

           this._selectionDebounceTimer = setTimeout(() => {
             const sel = window.getSelection ? window.getSelection() : null;
             if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;

             const range = sel.getRangeAt(0);
             // Evitar inputs, botões, links, áreas editáveis e backdrop/modal
             const eventTarget = (e && e.target) ? e.target : null;
             const containerEl = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
               ? range.commonAncestorContainer
               : range.commonAncestorContainer.parentElement;
             const targetForCheck = eventTarget || containerEl;
             if (this._isInteractiveElement(targetForCheck)) return;

             const selectedText = sel.toString().trim();
             if (!selectedText) return;

             // Encontrar contêiner de bloco para obter contexto de sentença(s)
             const blockEl = this._closestBlockContainer(containerEl || document.body);
             if (!blockEl || !blockEl.textContent) {
               // Sem contexto: lê o próprio texto selecionado
               this.speak(selectedText);
               return;
             }

             // Calcula offsets dentro do texto completo do bloco
             const rStart = document.createRange();
             rStart.setStart(blockEl, 0);
             rStart.setEnd(range.startContainer, range.startOffset);
             const startOffset = rStart.toString().length;

             const rEnd = document.createRange();
             rEnd.setStart(blockEl, 0);
             rEnd.setEnd(range.endContainer, range.endOffset);
             const endOffset = rEnd.toString().length;

             const fullText = blockEl.textContent;
             const lang = localStorage.getItem('language') || this.speech.lang || 'pt-BR';
             const sentences = this._extractSentencesInRange(fullText, startOffset, endOffset, lang);
             if (sentences && sentences.length > 1) {
               this.speakSequence(sentences);
             } else {
               const sentence = sentences[0] || selectedText;
               if (sentence && sentence.trim()) this.speak(sentence.trim());
             }
           }, 250);
         } catch(err) {
           // silencioso
         }
       },

       _extractSentencesInRange(text, startOffset, endOffset, lang) {
         const out = [];
         if (!text) return out;
         // Intl.Segmenter por sentenças
         try {
           if (window.Intl && typeof Intl.Segmenter === 'function') {
             const seg = new Intl.Segmenter(lang || 'pt-BR', { granularity: 'sentence' });
             let capturing = false;
             for (const part of seg.segment(text)) {
               const s = part.index;
               const e = s + part.segment.length;
               if (!capturing && startOffset >= s && startOffset < e) {
                 out.push(part.segment.trim());
                 capturing = endOffset > e;
                 if (!capturing) break;
               } else if (capturing) {
                 out.push(part.segment.trim());
                 if (endOffset <= e) break;
               }
             }
             if (out.length) return out;
           }
         } catch(_) {}

         // Fallback: cortar por pontuação comum e espaços
         const pieces = text.split(/([\.\!\?…]+)/);
         // Reconstituir mantendo pontuação
         const sentences = [];
         for (let i = 0; i < pieces.length; i += 2) {
           const body = (pieces[i] || '').trim();
           const punct = (pieces[i + 1] || '').trim();
           const s = (body + (punct ? (' ' + punct) : '')).trim();
           if (s) sentences.push(s);
         }
         // Mapear para offsets aproximados
         let pos = 0;
         const bounds = sentences.map(sn => {
           const start = pos;
           const end = pos + sn.length;
           pos = end + 1; // considera espaço
           return { start, end, text: sn };
         });
         const selected = [];
         for (const b of bounds) {
           if (startOffset < b.end && endOffset > b.start) {
             selected.push(b.text);
           }
         }
         return selected.length ? selected : [text.slice(startOffset, endOffset).trim()];
       },

       _isInteractiveElement(el) {
         try {
           const IGNORE_SEL = 'button, a, input, textarea, select, [contenteditable], .toggle-button, .switch, .config-button, .action-button, .guide-option, .slider, .modal, .modal-backdrop, .card, .ficha-chip, .section, .has-hover-video';
           let node = el;
           while (node && node !== document && node.nodeType === Node.ELEMENT_NODE) {
             if (node.matches && node.matches(IGNORE_SEL)) return true;
             node = node.parentElement;
           }
         } catch(_) {}
         return false;
       },

       _closestBlockContainer(node) {
         let el = node && (node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement);
         const isBlockTag = (tag) => /^(P|DIV|LI|SECTION|ARTICLE|MAIN|ASIDE|NAV|H1|H2|H3|H4|H5|H6)$/i.test(tag);
         while (el && el !== document.body) {
           if (isBlockTag(el.tagName)) return el;
           try {
             const cs = window.getComputedStyle(el);
             if (cs && (cs.display === 'block' || cs.display === 'list-item' || cs.display === 'table' || cs.display === 'table-row' || cs.display === 'table-cell')) {
               return el;
             }
           } catch(_) {}
           el = el.parentElement;
         }
         return document.body;
       },

       // Fala uma sequência de sentenças, enfileirando-as
       speakSequence(sentences) {
         if (!this.speech.supported || !sentences || sentences.length === 0) return;
         if (this.speech.speaking) {
           this.stopSpeaking();
         }
         this._speechQueue = sentences.slice();
         this._speakNext();
       },

       _speakNext() {
         if (this._speechQueue.length === 0) {
           this.speech.speaking = false;
           return;
         }
         const text = this._speechQueue.shift();
         if (!text || !text.trim()) {
           this._speakNext();
           return;
         }
         this.speech.speaking = true;
         this.speech.utterance = new SpeechSynthesisUtterance(text.trim());
         this.speech.utterance.voice = this.speech.voice;
         this.speech.utterance.rate = this.speech.rate;
         this.speech.utterance.pitch = this.speech.pitch;
         this.speech.utterance.lang = this.speech.lang;
         this.speech.utterance.onend = () => {
           this._speakNext();
         };
         this.speech.utterance.onerror = () => {
           this.speech.speaking = false;
           this._speechQueue = [];
         };
         try {
           window.speechSynthesis.speak(this.speech.utterance);
         } catch(err) {
           this.speech.speaking = false;
           this._speechQueue = [];
         }
       },

    handleWordClick(e) {
      try {
        const autoReadEnabled = localStorage.getItem('autoRead') === 'true';
        if (!autoReadEnabled) return;
        if (e.button !== 0) return;
        
        const ignore = e.target.closest('button, a, input, textarea, select, [contenteditable], .toggle-button, .switch, .ficha-chip, .guide-option, .card, .section');
        if (ignore) return;
        
        if (e.target.classList && (e.target.classList.contains('modal') || e.target.classList.contains('overlay'))) return;
        
        let node = null, offset = 0;
        const x = e.clientX, y = e.clientY;
        if (document.caretRangeFromPoint) {
          const range = document.caretRangeFromPoint(x, y);
          if (!range) return;
          node = range.startContainer;
          offset = range.startOffset;
        } else if (document.caretPositionFromPoint) {
          const pos = document.caretPositionFromPoint(x, y);
          if (!pos) return;
          node = pos.offsetNode;
          offset = pos.offset;
        } else {
          return;
        }
        
        if (!node || node.nodeType !== Node.TEXT_NODE) return;
        const text = node.textContent || '';
        if (!text.trim()) return;
        
        const word = this.extractWordAt(text, offset);
        if (word) {
          this.speak(word);
        }
      } catch(err) {
        // silencioso
      }
    },
    
    extractWordAt(text, offset) {
      const isWordChar = (ch) => /[\p{L}\p{N}''_-]/u.test(ch);
      let i = Math.max(0, Math.min(offset, text.length));
      let start = i, end = i;
      while (start > 0 && isWordChar(text[start-1])) start--;
      while (end < text.length && isWordChar(text[end])) end++;
      const word = text.substring(start, end).trim();
      return word.length >= 2 ? word : '';
    }
  };
  
  global.AutoRead = AutoRead;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AutoRead.init());
  } else {
    AutoRead.init();
  }
})(window);

// ==================== TRANSLATION MANAGER ====================
// Sistema de internacionalização (i18n) para tradução dinâmica de conteúdo
(function(global){
  const DEFAULT_LOCALE = 'pt-BR';
  const SUPPORTED_LOCALES = ['pt-BR','en-US','es-ES'];
  // Usa caminho absoluto para evitar problemas de diretório relativo em páginas internas
  const LOCALE_PATH = '/SiteTcc/locales';

  class TranslationManager {
    constructor(){
      this.locale = this._detectInitialLocale();
      this.translations = {};
      this.loaded = false;
      this.loadingPromise = null;
    }

    _detectInitialLocale(){
      try {
        const stored = localStorage.getItem('app_locale');
        if(stored && SUPPORTED_LOCALES.includes(stored)) return stored;
        const nav = (navigator.language || navigator.userLanguage || '').trim();
        const match = SUPPORTED_LOCALES.find(l => l.toLowerCase() === nav.toLowerCase());
        return match || DEFAULT_LOCALE;
      } catch(e){
        return DEFAULT_LOCALE;
      }
    }

    setLocale(newLocale){
      if(!SUPPORTED_LOCALES.includes(newLocale)) {
        console.warn('[i18n] Unsupported locale:', newLocale);
        return;
      }
      if(this.locale === newLocale) return;
      this.locale = newLocale;
      try { localStorage.setItem('app_locale', newLocale); } catch(e){}
      this.loaded = false;
      this.translations = {};
      return this.load();
    }

    async load(){
      if(this.loaded) return;
      if(this.loadingPromise) return this.loadingPromise;
      const url = `${LOCALE_PATH}/${this.locale}.json`;
      this.loadingPromise = fetch(url, {cache:'no-store'})
        .then(r => {
          if(!r.ok) throw new Error('Failed to load locale '+this.locale);
          return r.json();
        })
        .then(json => {
          this.translations = json || {};
          this.loaded = true;
          this.loadingPromise = null;
        })
        .catch(err => {
          console.error('[i18n] Load error', err);
          this.loadingPromise = null;
        });
      return this.loadingPromise;
    }

    t(key, vars){
      // Silencia aviso se não carregado ainda - fallback para a chave
      let raw = this._resolveKey(key);
      if(vars && raw){
        Object.keys(vars).forEach(k => {
          raw = raw.replace(new RegExp(`{{${k}}}`,'g'), vars[k]);
        });
      }
      return raw != null ? raw : key;
    }

    _resolveKey(key){
      if(!key) return null;
      // Primeiro tenta acesso direto (chaves com pontos como "guide.info.dark")
      if(Object.prototype.hasOwnProperty.call(this.translations, key)){
        const val = this.translations[key];
        return typeof val === 'string' ? val : null;
      }
      // Fallback: tenta navegação aninhada (guide -> info -> dark)
      const parts = key.split('.');
      let cur = this.translations;
      for(const p of parts){
        if(cur && Object.prototype.hasOwnProperty.call(cur, p)){
          cur = cur[p];
        } else {
          return null;
        }
      }
      return typeof cur === 'string' ? cur : null;
    }

    applyToDOM(root=document){
      const elements = root.querySelectorAll('[data-i18n]');
      elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(!key) return;
        const text = this.t(key);
        if(text && text !== key){
          el.textContent = text;
        }
      });
    }
  }

  const manager = new TranslationManager();
  console.log('[i18n] TranslationManager criado, locale:', manager.locale);
  manager.load().then(()=>{
    console.log('[i18n] Tradução carregada com sucesso!', Object.keys(manager.translations).length, 'chaves');
    manager.applyToDOM();
    document.dispatchEvent(new CustomEvent('i18n:loaded',{detail:{locale:manager.locale}}));
  }).catch(err => {
    console.error('[i18n] Erro ao carregar:', err);
  });

  global.TranslationManager = manager;
  console.log('[i18n] TranslationManager exposto em window.TranslationManager');
})(window);