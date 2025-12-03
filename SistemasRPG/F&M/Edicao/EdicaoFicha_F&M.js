// ===== FEITICEIROS E MALDIÇÕES - SISTEMA DE FICHA MELHORADO =====
// Estado da aplicação com todas as melhorias integradas

// Listas de origens e especializações baseadas no sistema F&M
const origens = [
    'Inato',
    'Herdado', 
    'Derivado',
    'Restringido',
    'Feto Amaldiçoado Híbrido',
    'Sem Técnica',
    'Corpo Amaldiçoado Mutante'
];

const especializacoes = [
    'Lutador',
    'Especialista em Combate',
    'Especialista em Técnica',
    'Controlador',
    'Suporte',
    'Restringido'
];

function adicionarPericiasNoFormData(fd) {
    const pericias = montarPericiasJSON();
    fd.set("pericias_json", JSON.stringify(pericias));
}


// Navegação entre páginas
const pages = ['index', 'pagina2', 'pagina3', 'pagina4', 'pagina5', 'pagina6', 'pagina7'];
let currentPage = 1;
const totalPages = 7;
let diceHistory = [];

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema F&M carregado!');
    fillSelectionBoxes();
    setupAttributeModifiers();
    setupArmorClass();
    setupProficiencyBonus();
    updatePageDisplay();
    loadCharacter();
    setupAutoSave();
    initializeProgressBars();
    // Aplica i18n aos elementos com data-i18n ou data-translate
    try { if (window.TranslationManager) { window.TranslationManager.applyToDOM(document); } } catch(_) {}
        // Anuncia a página atual pelo AutoRead, se disponível
        try {
            if (window.AutoRead && typeof window.AutoRead.speak === 'function') {
                const h2 = document.querySelector(`#page-${currentPage} .section-header, #page-${currentPage} h2`);
                if (h2 && h2.textContent) {
                    window.AutoRead.speak(h2.textContent.trim());
                }
            }
        } catch(_) {}
});

// ===== PREENCHER SELECT BOXES =====
function fillSelectionBoxes() {
    const origemSelect = document.getElementById('origin');
    if (origemSelect && origemSelect.tagName === 'SELECT') {
        origemSelect.innerHTML = '<option value="">Selecione...</option>' + 
            origens.map(o => `<option value="${o}">${o}</option>`).join('');
        origemSelect.className += ' styled-select';
    }

    const especSelect = document.getElementById('specialization');
    if (especSelect && especSelect.tagName === 'SELECT') {
        especSelect.innerHTML = '<option value="">Selecione...</option>' + 
            especializacoes.map(e => `<option value="${e}">${e}</option>`).join('');
        especSelect.className += ' styled-select';
    }
}

// ===== CÁLCULO DE MODIFICADORES DE ATRIBUTOS =====
function calculateModifier(attributeValue) {
    return Math.floor((parseInt(attributeValue) - 10) / 2);
}
// ===== CÁLCULO DE Classe de Armadura =====

function setupArmorClass() {
    const acInputs = ['ac-natural', 'ac-armor', 'ac-shield', 'ac-dex', 'ac-other'];

    acInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', calculateTotalAC);
        }
    });

    calculateTotalAC();
}

function calculateTotalAC() {
    const natural = parseInt(document.getElementById('ac-natural')?.value) || 0;
    const armor = parseInt(document.getElementById('ac-armor')?.value) || 0;
    const shield = parseInt(document.getElementById('ac-shield')?.value) || 0;
    const dex = parseInt(document.getElementById('ac-dex')?.value) || 0;
    const other = parseInt(document.getElementById('ac-other')?.value) || 0;

    const total = natural + armor + shield + dex + other;
    const totalElement = document.getElementById('ac-total');
    if (totalElement) {
        totalElement.value = total;
    }
}

function setupAttributeModifiers() {
    const attributes = ['str', 'dex', 'con', 'wis', 'int', 'cha'];


    attributes.forEach(attr => {
        const input = document.getElementById(attr);
        const modSpan = document.getElementById(`${attr}-mod`);

        if (input && modSpan) {
            input.addEventListener('input', function() {
                const value = parseInt(this.value) || 10;
                const modifier = calculateModifier(value);
                modSpan.textContent = modifier >= 0 ? `+${modifier}` : `${modifier}`;

                // Atualizar DEX na CA automaticamente
                if (attr === 'dex') {
                    const acDex = document.getElementById('ac-dex');
                    if (acDex) acDex.value = modifier;
                    calculateTotalAC();
                }
            });
            // Trigger inicial
            input.dispatchEvent(new Event('input'));
        }
    });
}

// ===== CÁLCULO DE BÔNUS DE MAESTRIA =====
function setupProficiencyBonus() {
    const levelInput = document.getElementById('level');
    const bonusInput = document.getElementById('proficiency-bonus');

    if (levelInput && bonusInput) {
        levelInput.addEventListener('input', function() {
            const level = parseInt(this.value) || 1;
            let bonus;
            if (level < 1) {
                bonus = -1 * (Math.floor((level - 1) / 4) + 2); // valor negativo quando menor que 10
            } else {
                bonus = Math.floor((level - 1) / 4) + 2; // lógica padrão para 10 ou mais
            }
            bonusInput.value = `${bonus >= 0 ? '+' : ''}${bonus}`;
        });
        levelInput.dispatchEvent(new Event('input'));
    }
}



// ===== NAVEGAÇÃO ENTRE PÁGINAS =====
function goToPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === currentPage) return;

    // Salvar dados da página atual antes de mudar
    saveCharacter(); 

    // Esconder página atual
    const currentPageEl = document.getElementById(`page-${currentPage}`);
    if (currentPageEl) currentPageEl.classList.remove('active');

    // Atualizar o número da página
    currentPage = pageNumber;

    // Mostrar nova página
    const newPageEl = document.getElementById(`page-${currentPage}`);
    if (newPageEl) newPageEl.classList.add('active');

    // Atualizar UI (pontos, etc.)
    updatePageDisplay(); 
    window.scrollTo(0, 0);
    // Reaplica i18n após mudança de página
    try { if (window.TranslationManager) { window.TranslationManager.applyToDOM(document); } } catch(_) {}
        // Anuncia o título da nova página
        try {
            if (window.AutoRead && typeof window.AutoRead.speak === 'function') {
                const h2 = newPageEl ? newPageEl.querySelector('.section-header, h2') : null;
                if (h2 && h2.textContent) {
                    window.AutoRead.speak(h2.textContent.trim());
                }
            }
        } catch(_) {}
}

function previousPage() {
    if (currentPage > 1) {
        saveCharacter();
        const currentPageEl = document.getElementById(`page-${currentPage}`);
        if (currentPageEl) currentPageEl.classList.remove('active');

        currentPage--;

        const prevPageEl = document.getElementById(`page-${currentPage}`);
        if (prevPageEl) prevPageEl.classList.add('active');

        updatePageDisplay();
        window.scrollTo(0, 0);
    }
}

function updatePageDisplay() {
    // Atualizar indicadores visuais
    const dots = document.querySelectorAll('.page-dot');
    dots.forEach((dot, index) => {
        if (index === (currentPage - 1)) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}




// ===== SISTEMA DE PERSISTÊNCIA (localStorage) =====
function saveCharacter() {
    const characterData = {};

    // usa a função existente que retorna um array
    const abilitiesArray = carregarHabilidadesParaSalvar(); // retorna array
    const abilitiesJson = JSON.stringify(abilitiesArray);

    // Técnica amaldicoada
    const tecnicaObj = carregarTecnicaAmaldicoadaParaSalvar ? carregarTecnicaAmaldicoadaParaSalvar() : { nome: "", descricao: "", habilidades: {} };
    document.getElementById("tecnica-amaldicada-json").value = JSON.stringify(tecnicaObj);

    // Salva no input hidden (strings)
    document.getElementById("habilidades-json").value = abilitiesJson;
    document.getElementById("talentos-json").value = JSON.stringify(carregarTalentosParaSalvar());
    document.getElementById("treinamentos-json").value = JSON.stringify(carregarTreinamentosParaSalvar());
    document.getElementById('invocations-json').value = JSON.stringify(carregarInvocationsParaSalvar());

    // Salvar todos os inputs, selects e textareas
    document.querySelectorAll('input, select, textarea').forEach(el => {
        if (el.id) {
            if (el.type === 'checkbox') {
                characterData[el.id] = el.checked;
            } else {
                characterData[el.id] = el.value;
            }
        }
    });

    characterData['diceHistory'] = window.diceHistory || [];

    try {
        localStorage.setItem('fichaPersonagemFM', JSON.stringify(characterData));
        console.log('Ficha salva:', Object.keys(characterData).length, 'campos');
    } catch (e) {
        console.error('Erro ao salvar:', e);
        showNotification && showNotification('Erro ao salvar ficha!');
    }
}




function loadCharacter() {
    try {
        const saved = localStorage.getItem('fichaPersonagemFM');
        if (saved) {
            const data = JSON.parse(saved);

            Object.entries(data).forEach(([id, value]) => {
                const el = document.getElementById(id);
                if (el) {
                    if (el.type === 'checkbox') {
                        el.checked = value;
                    } else {
                        el.value = value;
                    }
                    // Trigger eventos para recalcular valores
                    el.dispatchEvent(new Event('input'));
                }

                // Carregar histórico do dado
            if (data['diceHistory']) {
                diceHistory = data['diceHistory'];
            } else {
                diceHistory = []; // Garantir que está limpo se não houver nada salvo
            }
            updateDiceHistory(); // Popular a UI
            });

            console.log('Ficha carregada:', Object.keys(data).length, 'campos');
        }
    } catch (e) {
        console.error('Erro ao carregar:', e);
    }
}

function clearCharacter() {
    if (confirm('Tem certeza que deseja limpar toda a ficha? Esta ação não pode ser desfeita.')) {
        localStorage.removeItem('fichaPersonagemFM');
        diceHistory = []; // Limpa o array em memória
        showNotification('Ficha limpa!');
        setTimeout(() => location.reload(), 1000);
    }
}

// ===== AUTO-SAVE =====
function setupAutoSave() {
    let autoSaveTimeout;

    document.addEventListener('input', function() {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
            saveCharacter();
        }, 2000); // Auto-save após 2 segundos de inatividade
    });
}

// ===== NOTIFICAÇÕES TOAST =====
function showNotification(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

        // Fala o conteúdo do toast se leitura automática estiver ativa
        try {
            if (window.AutoRead && typeof window.AutoRead.speak === 'function') {
                window.AutoRead.speak(String(message || ''));
            }
        } catch(_) {}

    setTimeout(() => {
                toast.style.animation = 'slideOutDown 0.35s ease forwards';
                setTimeout(() => toast.remove(), 380);
    }, 2500);
}

// ===== ADICIONAR/REMOVER HABILIDADES =====
function addAbility(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const abilityCard = document.createElement('div');
    abilityCard.className = 'ability-card';
    abilityCard.innerHTML = `
        <div class="card-header">
            <input type="text" placeholder="Nome da Habilidade" class="form-control ability-name">
            <button class="btn-remove" onclick="this.parentElement.parentElement.remove(); saveCharacter();">×</button>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Custo (PE)</label>
                <input type="number" class="form-control" min="0" placeholder="0">
            </div>
            <div class="form-group">
                <label class="form-label">Tipo</label>
                <select class="form-control styled-select">
                    <option>Ação Comum</option>
                    <option>Ação Bônus</option>
                    <option>Ação Livre</option>
                    <option>Reação</option>
                    <option>Passiva</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">Descrição</label>
            <textarea class="form-control" rows="3" placeholder="Descreva os efeitos da habilidade..."></textarea>
        </div>
    `;
    container.appendChild(abilityCard);
    saveCharacter();
    try { if (window.TranslationManager) { window.TranslationManager.applyToDOM(abilityCard); } } catch(_) {}
}

// ===== ADICIONAR TALENTO =====
function addTalent() {
    const container = document.getElementById('talents-list');
    if (!container) return;

    const talentCard = document.createElement('div');
    talentCard.className = 'talent-card';
    talentCard.innerHTML = `
        <div class="card-header">
            <input type="text" placeholder="Nome do Talento" class="form-control">
            <button class="btn-remove" onclick="this.parentElement.parentElement.remove(); saveCharacter();">×</button>
        </div>
        <textarea class="form-control" placeholder="Descrição do talento..." rows="2"></textarea>
    `;
    container.appendChild(talentCard);
    saveCharacter();
    try { if (window.TranslationManager) { window.TranslationManager.applyToDOM(talentCard); } } catch(_) {}
}

// ===== ADICIONAR INVOCAÇÃO =====
function addInvocation() {
    const container = document.getElementById('invocations-list');
    if (!container) return;

    const invocationCard = document.createElement('div');
    invocationCard.className = 'invocation-card';
    invocationCard.innerHTML = `
        <div class="card-header">
            <input type="text" placeholder="Nome da Invocação" class="form-control invocation-name">
            <button class="btn-remove" onclick="this.parentElement.parentElement.remove(); saveCharacter();">×</button>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Grau</label>
                <select class="form-control styled-select invocation-grade">
                    <option>4º Grau</option>
                    <option>3º Grau</option>
                    <option>2º Grau</option>
                    <option>1º Grau</option>
                    <option>Grau Especial</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Custo (PE)</label>
                <input type="number" class="form-control invocation-cost" min="0">
            </div>
            <div class="form-group">
                <label class="form-label">PV</label>
                <input type="number" class="form-control invocation-pv">
            </div>
            <div class="form-group">
                <label class="form-label">CA</label>
                <input type="number" class="form-control invocation-ca">
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">Características</label>
            <textarea class="form-control invocation-description" rows="3" placeholder="Descreva as características da invocação..."></textarea>
        </div>
    `;
    container.appendChild(invocationCard);
    saveCharacter();
    try { if (window.TranslationManager) { window.TranslationManager.applyToDOM(invocationCard); } } catch(_) {}
}

// ===== ADICIONAR TREINAMENTO =====
function addTraining() {
    const container = document.getElementById('trainings-list');
    if (!container) return;

    const trainingCard = document.createElement('div');
    trainingCard.className = 'training-card';
    trainingCard.innerHTML = `
        <div class="card-header">
            <input type="text" placeholder="Nome do Treinamento" class="form-control">
            <button class="btn-remove" onclick="this.parentElement.parentElement.remove(); saveCharacter();">×</button>
        </div>
        <textarea class="form-control" placeholder="Descrição do treinamento..." rows="2"></textarea>
    `;
    container.appendChild(trainingCard);
    saveCharacter();
    try { if (window.TranslationManager) { window.TranslationManager.applyToDOM(trainingCard); } } catch(_) {}
}

// ===== BARRAS DE PROGRESSO =====
function initializeProgressBars() {
    updateProgressBar('hp');
    updateProgressBar('pe');
    updateProgressBar('integrity');
}

function updateProgressBar(type) {
    const current = parseInt(document.getElementById(`${type}-current`)?.value) || 0;
    const max = parseInt(document.getElementById(`${type}-max`)?.value) || 100;
    const fillElement = document.getElementById(`${type}-fill`);

    if (fillElement && max > 0) {
        const percentage = Math.min((current / max) * 100, 100);
        fillElement.style.width = `${percentage}%`;
        fillElement.textContent = `${current}/${max}`;
    }
}

function updateDiceHistory() {
    const historyContainer = document.getElementById('dice-history');
    if (historyContainer) {
        if (diceHistory.length === 0) {
            historyContainer.innerHTML = `<span style="color: var(--color-text-secondary); font-style: italic;">Nenhuma rolagem ainda.</span>`;
        } else {
            historyContainer.innerHTML = diceHistory.map(roll => 
                `<span class="dice-history-item">${roll}</span>`
            ).join('');
        }
    }
}

// ===== ROLAGEM DE D20 =====
function rollD20() {
    const result = Math.ceil(Math.random() * 20);
    const bonus = parseInt(document.getElementById('dice-bonus')?.value) || 0;
    const total = result + bonus;

    // Atualizar histórico
    diceHistory.unshift(total); // Adiciona no início
    if (diceHistory.length > 5) {
        diceHistory.pop(); // Remove o último
    }
    updateDiceHistory();
    saveCharacter(); // Salva o novo histórico

    const resultElement = document.getElementById('dice-result');
    if (resultElement) {
        resultElement.textContent = total;
        // Atualiza a cor basedo no resultado do DADO (não o total)
        resultElement.style.color = result === 20 ? 'var(--color-success)' : result === 1 ? 'var(--color-error)' : 'var(--color-primary)';
    }

    
    // Abrir modal se existir
    const modal = document.getElementById('dice-modal');
    if (modal) modal.classList.add('active');
        // ...código original da rolagem...
        // Após exibir o modal do dado, aplicar configurações globais
        setTimeout(function() {
            if (window.updateGlobalSettings) window.updateGlobalSettings();
        }, 10);

        // Fala o resultado do dado
        try {
            if (window.AutoRead && typeof window.AutoRead.speak === 'function') {
                const base = (window.I18N && I18N.dict && I18N.dict['3det_d20_resultado']) ? I18N.dict['3det_d20_resultado'] : '🎲 Resultado:';
                const extra = result === 20 ? (I18N?.dict?.['3det_d20_critico'] || ' - CRÍTICO! 🎉') : (result === 1 ? (I18N?.dict?.['3det_d20_falha_critica'] || ' - Falha Crítica! 💀') : '');
                window.AutoRead.speak(`${base} ${result}${extra}`);
            }
        } catch(_) {}
    }

// ===== FECHAR MODAL DO D20 =====
function closeDiceModal() {
    const modal = document.getElementById('dice-modal');
    if (modal) modal.classList.remove('active');
}

// ===== EXPORTAR FICHA =====
function exportCharacter() {
    window.print();
}

// Adicionar eventos aos botões
document.addEventListener('DOMContentLoaded', function() {
    const btnSave = document.getElementById('save-btn');
    if (btnSave) btnSave.addEventListener('click', () => {
        saveCharacter();
        showNotification('Ficha salva com sucesso!');
    });

    const btnClear = document.getElementById('clear-btn');
    if (btnClear) btnClear.addEventListener('click', clearCharacter);

    const btnExport = document.getElementById('export-btn');
    if (btnExport) btnExport.addEventListener('click', exportCharacter);

// Setup Page Indicator Clicks
const dots = document.querySelectorAll('.page-dot');
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        goToPage(index + 1); // +1 porque index é 0-based
    });
});

});

document.addEventListener('DOMContentLoaded', function() {
    // Setup de rolagem automática e outras inicializações
    window.scrollTo(0, 0);
});

  function nextPage() {
    if (currentPage < totalPages) {
      saveCharacter();
      const currentPageEl = document.getElementById(`page-${currentPage}`);
      if (currentPageEl) currentPageEl.classList.remove('active');
      currentPage++;
      const nextPageEl = document.getElementById(`page-${currentPage}`);
      if (nextPageEl) nextPageEl.classList.add('active');
      updatePageDisplay();
      window.scrollTo(0, 0);
      updateNavButtons();
    }
  }
  
  function previousPage() {
    if (currentPage > 1) {
      saveCharacter();
      const currentPageEl = document.getElementById(`page-${currentPage}`);
      if (currentPageEl) currentPageEl.classList.remove('active');
      currentPage--;
      const prevPageEl = document.getElementById(`page-${currentPage}`);
      if (prevPageEl) prevPageEl.classList.add('active');
      updatePageDisplay();
      window.scrollTo(0, 0);
      updateNavButtons();
    }
  }

  // ===== SISTEMA DE AJUDA POR SEÇÃO =====
// Descrições de ajuda associadas aos headers via data-help
// Para adicionar uma descrição individual, simplesmente adicione data-help="Sua descrição" no HTML do header
const sectionHelpDescriptions = {
  "Informações Básicas do Personagem": "Dados pessoais do personagem, como nome, origem e especialização.",
  "Atributos": "Aqui você define os atributos principais que caracterizam seu personagem.",
  "Classe de Armadura": "Informações e cálculo de defesa do personagem.",
  "Perícias": "Listagem das habilidades e conhecimentos específicos do personagem.",
  "Valores de Combate": "Configura pontos de vida, energia, integridade e valores relevantes para batalhas.",
  "Habilidades de Especialização": "Habilidades exclusivas relacionadas à especialização do personagem.",
  "Perfil Amaldiçoado": "Traços e histórico de personagens com maldição ou poderes especiais.",
  "Técnica Amaldiçoada": "Área para definir e explicar a técnica amaldiçoada do personagem.",
  "Invocações Shikigami": "Configure e registre as invocações que seu personagem pode usar."
};

document.addEventListener('DOMContentLoaded', function() {
  // Setup botões de ajuda das seções
  document.querySelectorAll('.section-header').forEach(function(header) {
    // Evita botão duplicado se alterar demais o DOM
    if (!header.querySelector('.section-header-help')) {
      const btn = document.createElement('button');
      btn.className = 'section-header-help';
      btn.type = 'button';
      btn.innerHTML = "?";
      btn.title = "Ajuda sobre esta seção";

      btn.onclick = function(e) {
        e.stopPropagation(); // Previne propagação
        const modal = document.getElementById('section-help-modal');
        if (modal) {
          const headerText = header.innerText.trim();
          // Prioriza descrição no data-help do header, depois usa o mapa global
          const description = header.getAttribute('data-help') || 
                            sectionHelpDescriptions[headerText] || 
                            "Descrição não disponível para esta seção.";
          
          document.getElementById('modal-header-title').innerText = headerText;
          document.getElementById('modal-header-desc').innerText = description;
          modal.style.display = "flex";
        }
      };

      header.appendChild(btn);
    }
  });

  // Fecha o modal de ajuda ao clicar no botão [X]
  const closeHelpBtn = document.getElementById('close-help-modal');
  if (closeHelpBtn) {
    closeHelpBtn.onclick = function(e) {
      e.stopPropagation();
      const modal = document.getElementById('section-help-modal');
      if (modal) modal.style.display = "none";
    };
  }

  // Fecha o modal de ajuda ao clicar fora do conteúdo
  const helpModal = document.getElementById('section-help-modal');
  if (helpModal) {
    helpModal.onclick = function(e) {
      // Só fecha se clicar especificamente no modal, não no conteúdo
      if (e.target === this) {
        this.style.display = "none";
      }
    };
  }
});

// ==================== AUTO READ (SPEECH SYNTHESIS) ====================
// Replica da funcionalidade usada nas outras telas
(function(global){
    if (global.AutoRead) {
        try {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => global.AutoRead.init && global.AutoRead.init());
            } else {
                global.AutoRead.init && global.AutoRead.init();
            }
        } catch(_) {}
        return;
    }

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
                const lang = localStorage.getItem('language') || localStorage.getItem('app_locale') || 'pt-BR';
                this.speech.voice = voices.find(v => v.lang.startsWith((lang||'pt-BR').substring(0,2))) || voices[0] || null;
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
                const lang = localStorage.getItem('language') || localStorage.getItem('app_locale') || 'pt-BR';
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
            } catch(e) {}
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

        setupSelectionRead() {
            this._handleSelectionRead = (e) => this.handleSelectionRead(e);
            document.addEventListener('mouseup', this._handleSelectionRead, true);
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
                    const eventTarget = (e && e.target) ? e.target : null;
                    const containerEl = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
                        ? range.commonAncestorContainer
                        : range.commonAncestorContainer.parentElement;
                    const targetForCheck = eventTarget || containerEl;
                    if (this._isInteractiveElement(targetForCheck)) return;

                    const selectedText = sel.toString().trim();
                    if (!selectedText) return;

                    const blockEl = this._closestBlockContainer(containerEl || document.body);
                    if (!blockEl || !blockEl.textContent) {
                        this.speak(selectedText);
                        return;
                    }

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
            } catch(err) {}
        },

        _extractSentencesInRange(text, startOffset, endOffset, lang) {
            const out = [];
            if (!text) return out;
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

            const pieces = text.split(/([\.!\?…]+)/);
            const sentences = [];
            for (let i = 0; i < pieces.length; i += 2) {
                const body = (pieces[i] || '').trim();
                const punct = (pieces[i + 1] || '').trim();
                const s = (body + (punct ? (' ' + punct) : '')).trim();
                if (s) sentences.push(s);
            }
            let pos = 0;
            const bounds = sentences.map(sn => {
                const start = pos;
                const end = pos + sn.length;
                pos = end + 1;
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
                const IGNORE_SEL = 'button, a, input, textarea, select, [contenteditable], .toggle-button, .switch, .config-button, .action-button, .guide-option, .slider, .modal, .modal-backdrop, .ficha-chip, .has-hover-video';
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

                const ignore = e.target.closest('button, a, input, textarea, select, [contenteditable], .toggle-button, .switch, .ficha-chip, .guide-option');
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
            } catch(err) {}
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
    try {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => AutoRead.init());
        } else {
            AutoRead.init();
        }
    } catch(_) {}
})(window);





console.log('🎲 Sistema Feiticeiros & Maldições v2.0 carregado!');