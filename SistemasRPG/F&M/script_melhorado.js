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
            const bonus = Math.floor((level - 1) / 4) + 2;
            bonusInput.value = `+${bonus}`;
        });
        levelInput.dispatchEvent(new Event('input'));
    }
}

// ===== CÁLCULO DE CLASSE DE ARMADURA =====
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
            <input type="text" placeholder="Nome da Invocação" class="form-control">
            <button class="btn-remove" onclick="this.parentElement.parentElement.remove(); saveCharacter();">×</button>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Grau</label>
                <select class="form-control styled-select">
                    <option>4º Grau</option>
                    <option>3º Grau</option>
                    <option>2º Grau</option>
                    <option>1º Grau</option>
                    <option>Grau Especial</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Custo (PE)</label>
                <input type="number" class="form-control" min="0">
            </div>
            <div class="form-group">
                <label class="form-label">PV</label>
                <input type="number" class="form-control">
            </div>
            <div class="form-group">
                <label class="form-label">CA</label>
                <input type="number" class="form-control">
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">Características</label>
            <textarea class="form-control" rows="3" placeholder="Descreva as características da invocação..."></textarea>
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
    const closeModalBtn = document.querySelector('.modal-close');
    const diceModal = document.getElementById('dice-modal');
    if (closeModalBtn && diceModal) {
      closeModalBtn.addEventListener('click', function() {
        diceModal.classList.remove('active');
      });
    }
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





console.log('🎲 Sistema Feiticeiros & Maldições v2.0 carregado!');
