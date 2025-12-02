// ===== FEITICEIROS E MALDIÇÕES - SISTEMA DE FICHA MELHORADO =====
// Estado da aplicação com todas as melhorias integradas

// ===== SISTEMA DE TRADUÇÃO (i18n) =====
const I18N = { dict: null, lang: 'pt-BR' };

function normalizeLang(raw) {
    const s = String(raw || localStorage.getItem('language') || 'pt-BR').toLowerCase();
    if (s.startsWith('en')) return 'en-US';
    if (s.startsWith('es')) return 'es-ES';
    return 'pt-BR';
}

async function loadLocale(lang) {
    try {
        const res = await fetch(`../../locales/${lang}.json`, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (e) {
        if (lang !== 'pt-BR') {
            try {
                const res = await fetch(`../../locales/pt-BR.json`, { cache: 'no-cache' });
                if (res.ok) return await res.json();
            } catch (_) {}
        }
        return null;
    }
}

function applyI18nToElement(el, dict) {
    if (!dict || !el) return;

    const textKey = el.getAttribute('data-i18n');
    const attrList = (el.getAttribute('data-i18n-attr') || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

    // Per-attribute keys
    const attrs = ['title','alt','placeholder','aria-label'];
    attrs.forEach(a => {
        const k = el.getAttribute(`data-i18n-${a}`);
        if (k && dict[k] != null) el.setAttribute(a, dict[k]);
    });

    // If there is a text key and a list of attributes, assign the same value to them
    if (textKey && attrList.length && dict[textKey] != null) {
        attrList.forEach(a => el.setAttribute(a, dict[textKey]));
    }

    // Apply text content (or document title) from textKey
    if (textKey && dict[textKey] != null) {
        const val = dict[textKey];
        if (el.tagName.toLowerCase() === 'title') {
            document.title = val;
        } else if (!attrList.length) {
            el.textContent = val;
        }
    }
}

function applyI18n(dict) {
    if (!dict) return;
    document.documentElement.lang = I18N.lang;
    const sel = [
        '[data-i18n]',
        '[data-i18n-attr]',
        '[data-i18n-title]',
        '[data-i18n-alt]',
        '[data-i18n-placeholder]',
        '[data-i18n-aria-label]'
    ].join(',');
    document.querySelectorAll(sel).forEach(el => applyI18nToElement(el, dict));
}

async function initI18n() {
    I18N.lang = normalizeLang(localStorage.getItem('language'));
    I18N.dict = await loadLocale(I18N.lang);
    applyI18n(I18N.dict);
}

const t = (key, fallback="") => (I18N.dict && I18N.dict[key]) || fallback;

// ===== SISTEMA DE LEITURA AUTOMÁTICA =====
const AutoRead = {
    enabled: false,
    synth: window.speechSynthesis,
    currentUtterance: null,
    selectionTimeout: null,

    init() {
        const autoReadEnabled = localStorage.getItem('autoRead') === 'true';
        this.enabled = autoReadEnabled;
        
        if (this.enabled) {
            this.setupListeners();
        }

        // Monitor mudanças no localStorage
        window.addEventListener('storage', (e) => {
            if (e.key === 'autoRead') {
                this.enabled = e.newValue === 'true';
                if (this.enabled) {
                    this.setupListeners();
                } else {
                    this.removeListeners();
                    this.stop();
                }
            }
        });
    },

    setupListeners() {
        document.addEventListener('click', this.handleClick.bind(this));
        document.addEventListener('mouseup', this.handleSelection.bind(this));
    },

    removeListeners() {
        document.removeEventListener('click', this.handleClick.bind(this));
        document.removeEventListener('mouseup', this.handleSelection.bind(this));
    },

    handleClick(e) {
        if (!this.enabled) return;
        
        const target = e.target;
        
        // Ignorar cliques em inputs, botões, links
        if (target.matches('input, textarea, select, button, a, [contenteditable="true"]')) {
            return;
        }

        const text = this.getElementText(target);
        if (text && text.length > 0 && text.length < 500) {
            this.speak(text);
        }
    },

    handleSelection() {
        if (!this.enabled) return;

        clearTimeout(this.selectionTimeout);
        this.selectionTimeout = setTimeout(() => {
            const selection = window.getSelection();
            const text = selection.toString().trim();
            
            if (text && text.length > 0) {
                this.speak(text);
            }
        }, 300);
    },

    getElementText(element) {
        if (!element) return '';
        
        // Pegar texto direto do elemento, ignorando filhos com classes específicas
        let text = '';
        element.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent.trim() + ' ';
            } else if (node.nodeType === Node.ELEMENT_NODE && 
                       !node.matches('script, style, button, input, select, textarea')) {
                text += node.textContent.trim() + ' ';
            }
        });
        
        return text.trim();
    },

    speak(text) {
        if (!text || !this.synth) return;

        this.stop();

        const sentences = this.extractSentences(text);
        
        if (sentences.length === 0) return;

        this.speakQueue(sentences, 0);
    },

    extractSentences(text) {
        // Usar Intl.Segmenter se disponível
        if (Intl.Segmenter) {
            const segmenter = new Intl.Segmenter(I18N.lang, { granularity: 'sentence' });
            const segments = segmenter.segment(text);
            return Array.from(segments).map(s => s.segment.trim()).filter(Boolean);
        }
        
        // Fallback: split por pontuação
        return text
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 0);
    },

    speakQueue(sentences, index) {
        if (index >= sentences.length) return;

        const utterance = new SpeechSynthesisUtterance(sentences[index]);
        
        // Configurações de voz
        const lang = I18N.lang || 'pt-BR';
        utterance.lang = lang;
        
        const voices = this.synth.getVoices();
        const voice = voices.find(v => v.lang.startsWith(lang.substring(0, 2))) || voices[0];
        if (voice) utterance.voice = voice;

        const rate = parseFloat(localStorage.getItem('speechRate')) || 1.0;
        const pitch = parseFloat(localStorage.getItem('speechPitch')) || 1.0;
        
        utterance.rate = rate;
        utterance.pitch = pitch;

        utterance.onend = () => {
            setTimeout(() => this.speakQueue(sentences, index + 1), 200);
        };

        utterance.onerror = (e) => {
            console.error('Erro na síntese de fala:', e);
        };

        this.currentUtterance = utterance;
        this.synth.speak(utterance);
    },

    stop() {
        if (this.synth) {
            this.synth.cancel();
        }
        this.currentUtterance = null;
    }
};

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
    initI18n(); // Inicializa tradução primeiro
    AutoRead.init(); // Inicializa leitura automática
    fillSelectionBoxes();
    setupAttributeModifiers();
    setupArmorClass();
    setupProficiencyBonus();
    updatePageDisplay();
    loadCharacter();
    setupAutoSave();
    initializeProgressBars();
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

    // Gera o JSON de habilidades
    const abilitiesJson = getAbilitiesJson();

    // 🔥 Adicionar técnica amaldiçoada
    document.getElementById("tecnica-amaldicada-json").value = getTechniquesJson();


    // Salva no input hidden
    document.getElementById("habilidades-json").value = getAbilitiesJson();
    document.getElementById("talentos-json").value = getTalentsJson();
    document.getElementById("treinamentos-json").value = getTrainingsJson();
    document.getElementById('invocations-json').value =
    JSON.stringify(getInvocations());


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
    // Salvar histórico do dado
    characterData['diceHistory'] = diceHistory;
    try {
        localStorage.setItem('fichaPersonagemFM', JSON.stringify(characterData));
        console.log('Ficha salva:', Object.keys(characterData).length, 'campos');
    } catch (e) {
        console.error('Erro ao salvar:', e);
        showNotification('Erro ao salvar ficha!');
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

    setTimeout(() => {
        toast.style.animation = 'slideOutDown 0.4s ease';
        setTimeout(() => toast.remove(), 400);
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

    


document.getElementById("save-btn").addEventListener("click", async () => {
    const form = document.getElementById("character-form");
    const dados = new FormData(form);

    // 🔥 adiciona pericias ao form antes de enviar
    adicionarPericiasNoFormData(dados);

    const resp = await fetch("Ficha_F&M.php", {
        method: "POST",
        body: dados
    });

    const json = await resp.json();
    alert(json.message);
});


function getAbilitiesJson() {
    const abilityCards = document.querySelectorAll('.ability-card');
    const abilities = [];

    abilityCards.forEach(card => {
        const name = card.querySelector('.ability-name')?.value || "";
        const cost = card.querySelector('input[type="number"]')?.value || 0;
        const type = card.querySelector('select')?.value || "";
        const description = card.querySelector('textarea')?.value || "";

        abilities.push({
            nome: name,
            custo: Number(cost),
            tipo: type,
            descricao: description
        });
    });

    return JSON.stringify(abilities);
}

function getTalentsJson() {
    const talentCards = document.querySelectorAll('.talent-card');
    const talents = [];

    talentCards.forEach(card => {
        const name = card.querySelector('input')?.value || "";
        const description = card.querySelector('textarea')?.value || "";

        talents.push({
            nome: name,
            descricao: description
        });
    });

    return JSON.stringify(talents);
}

function getTrainingsJson() {
    const trainingCards = document.querySelectorAll('.training-card');
    const trainings = [];

    trainingCards.forEach(card => {
        const name = card.querySelector('input')?.value || "";
        const description = card.querySelector('textarea')?.value || "";

        trainings.push({
            nome: name,
            descricao: description
        });
    });

    return JSON.stringify(trainings);
}

function getTechniquesJson() {
    const name = document.getElementById("technique-name")?.value || "";
    const description = document.getElementById("technique-description")?.value || "";
    
    const data = {
        nome: name,
        descricao: description,
        habilidades: abilitiesByLevel   // já está no seu código
    };

    return JSON.stringify(data);
}

function getInvocations() {
    const cards = document.querySelectorAll('.invocation-card');
    const invocations = [];

    cards.forEach(card => {
        invocations.push({
            name: card.querySelector('.invocation-name').value.trim(),
            grade: card.querySelector('.invocation-grade').value,
            cost: Number(card.querySelector('.invocation-cost').value) || 0,
            pv: Number(card.querySelector('.invocation-pv').value) || 0,
            ca: Number(card.querySelector('.invocation-ca').value) || 0,
            description: card.querySelector('.invocation-description').value.trim()
        });
    });

    return invocations;
}



console.log('🎲 Sistema Feiticeiros & Maldições v2.0 carregado!');
