<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ficha F&M - Feiticeiros e Maldições</title>
    <link rel="stylesheet" href="style_melhorado.css">
</head>
<body>
    <!-- Header Principal com Navegação -->
    <header class="header page-theme-teal">
        <div class="header-content">
            <div class="header-left">
                <h1 class="title">⚡ Feiticeiros & Maldições</h1>
                <span class="subtitle">Sistema de RPG v2.0</span>
            </div>

            <div class="page-indicator">
                <span class="page-dot active" title="Informações Básicas"></span>
                <span class="page-dot" title="Perícias"></span>
                <span class="page-dot" title="Combate"></span>
                <span class="page-dot" title="Habilidades"></span>
                <span class="page-dot" title="Perfil Amaldiçoado"></span>
                <span class="page-dot" title="Técnica"></span>
                <span class="page-dot" title="Invocações"></span>
            </div>

            <div class="header-actions" >
                <button type="submit" id="save-btn" class="btn btn--sm btn--secondary" title="Salvar Ficha" action="Ficha_F&M" method="post">💾 Salvar</button>
                <button type="button" id="clear-btn" class="btn btn--sm btn--secondary" title="Limpar Ficha">🗑️ Limpar</button>
                <button type="button" id="export-btn" class="btn btn--sm btn--secondary" title="Exportar/Imprimir">📄 Exportar</button>
            </div>
        </div>
    </header>
    <form id="character-form" action="Ficha_F&M.php" method="POST">
    <!-- Container Principal -->
     <input type="hidden" id="pericias-json" name="pericias">
    <div class="container">

        <!-- ===== PÁGINA 1: INFORMAÇÕES BÁSICAS ===== -->
        <div id="page-1" class="page active">
            <h2 class="section-header">📋 Informações Básicas do Personagem</h2>

            <div class="card section-border-teal">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="char-name">Nome do Personagem</label>
                        <input type="text" id="char-name" class="form-control" placeholder="Digite o nome..." name="char-name">
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="level">Nível</label>
                        <input type="number" id="level" min="1" max="20" value="1" class="form-control" name="level">
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="proficiency-bonus">Bônus de Maestria</label>
                        <input type="text" id="proficiency-bonus" readonly value="+2" class="form-control" name="proficiency-bonus">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="origin">Origem</label>
                        <select id="origin" name="origin" class="form-control styled-select">
                            <option value="">Selecione...</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="specialization">Especialização</label>
                        <select id="specialization" name="specialization" class="form-control styled-select">
                            <option value="">Selecione...</option>
                        </select>
                    </div>
                </div>
            </div>

            <h2 class="section-header">💪 Atributos</h2>

            <div class="attribute-grid card section-border-teal">
                <div class="attribute-box">
                    <div class="attribute-name">Força</div>
                    <input type="number" id="str" value="10" min="0" max="30" class="form-control attribute-value" name="str">
                    <div class="attribute-modifier">Modificador: <span id="str-mod" class="mod">+0</span></div>
                </div>

                <div class="attribute-box">
                    <div class="attribute-name">Destreza</div>
                    <input type="number" id="dex" value="10" min="0" max="30" class="form-control attribute-value" name="dex">
                    <div class="attribute-modifier">Modificador: <span id="dex-mod" class="mod">+0</span></div>
                </div>

                <div class="attribute-box">
                    <div class="attribute-name">Constituição</div>
                    <input type="number" id="con" value="10" min="0" max="30" class="form-control attribute-value" name="con">
                    <div class="attribute-modifier">Modificador: <span id="con-mod" class="mod">+0</span></div>
                </div>

                <div class="attribute-box">
                    <div class="attribute-name">Sabedoria</div>
                    <input type="number" id="wis" value="10" min="0" max="30" class="form-control attribute-value" name="wis">
                    <div class="attribute-modifier">Modificador: <span id="wis-mod" class="mod">+0</span></div>
                </div>

                <div class="attribute-box">
                    <div class="attribute-name">Inteligência</div>
                    <input type="number" id="int" value="10" min="0" max="30" class="form-control attribute-value" name="int">
                    <div class="attribute-modifier">Modificador: <span id="int-mod" class="mod">+0</span></div>
                </div>

                <div class="attribute-box">
                    <div class="attribute-name">Carisma</div>
                    <input type="number" id="cha" value="10" min="0" max="30" class="form-control attribute-value" name="cha">
                    <div class="attribute-modifier">Modificador: <span id="cha-mod" class="mod">+0</span></div>
                </div>
            </div>

            <h2 class="section-header">🛡️ Classe de Armadura</h2>

            <div class="card section-border-teal">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="ac-natural">Natural</label>
                        <input type="number" id="ac-natural" value="10" class="form-control" name="ac-natural">
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="ac-armor">Uniforme</label>
                        <input type="number" id="ac-armor" value="0" class="form-control" name="ac-armor">
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="ac-shield">Escudo</label>
                        <input type="number" id="ac-shield" value="0" class="form-control" name="ac-shield">
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="ac-dex">Destreza</label>
                        <input type="number" id="ac-dex" value="0" readonly class="form-control" name="ac-dex">
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="ac-other">Outros</label>
                        <input type="number" id="ac-other" value="0" class="form-control" name="ac-other">
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="ac-total"><strong>Total CA</strong></label>
                        <input type="number" id="ac-total" value="10" readonly class="form-control" style="font-weight: bold; font-size: 1.2em;" name="ac-total">
                    </div>
                </div>
            </div>

            <!-- Navegação -->
            <div class="navigation">
                <button id="prev-btn" type="button" class="btn btn--secondary" onclick="previousPage()" disabled>← Anterior</button>
                <span class="page-info">Página <span id="current-page">1</span> de <span id="total-pages">7</span></span>
                <button id="next-btn" type="button" class="btn btn--primary" onclick="nextPage()">Próxima →</button>
            </div>
        </div>

               <!-- ===== PÁGINA 2: PERÍCIAS ===== -->
        <div id="page-2" class="page">
            <h2 class="section-header section-border-purple">🎯 Perícias</h2>

             <!-- Cole no local desejado na sua página de perícias -->
<div style="display: flex; gap:40px;">
  <!-- Primeira coluna -->
  <div style="flex:1;">
    <table>
      <thead>
        <tr>
          <th>Perícia</th>
          <th>Atributo</th>
          <th>Mt.</th>
          <th>Es.</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody id="coluna1"></tbody>
    </table>
  </div>
  <!-- Segunda coluna -->
  <div style="flex:1;">
    <table>
      <thead>
        <tr>
          <th>Perícia</th>
          <th>Atributo</th>
          <th>Mt.</th>
          <th>Es.</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody id="coluna2"></tbody>
    </table>
  </div>
</div>

<script>
const pericias = [
  { nome: 'Luta', attr: 'str' }, { nome: 'Atletismo', attr: 'str' },
  { nome: 'Acrobacia', attr: 'dex' }, { nome: 'Furtividade', attr: 'dex' },
  { nome: 'Pontaria', attr: 'dex' }, { nome: 'Prestidigitação', attr: 'dex' },
  { nome: 'Reflexos', attr: 'dex' }, { nome: 'Fortitude', attr: 'con' },
  { nome: 'Integridade', attr: 'con' }, { nome: 'Intuição', attr: 'wis' },
  { nome: 'Medicina', attr: 'wis' }, { nome: 'Percepção', attr: 'wis' },
  { nome: 'Ocultismo', attr: 'wis' }
];
const pericias2 = [
  { nome: 'Vontade', attr: 'wis' }, { nome: 'Astúcia', attr: 'int' },
  { nome: 'Feitiçaria', attr: 'int' }, { nome: 'Investigação', attr: 'int' },
  { nome: 'História', attr: 'int' }, { nome: 'Ofício (_____1)', attr: 'int' },
  { nome: 'Ofício (_____2)', attr: 'int' }, { nome: 'Ofício (_____3)', attr: 'int' },
  { nome: 'Religião', attr: 'int' }, { nome: 'Tecnologia', attr: 'int' },
  { nome: 'Persuasão', attr: 'cha' }, { nome: 'Enganação', attr: 'cha' },
  { nome: 'Intimidação', attr: 'cha' }, { nome: 'Performance', attr: 'cha' }
];

const attrName = { str:'FOR', dex:'DES', con:'CON', int:'INT', wis:'SAB', cha:'CAR' };

function getMod(attr) {
  const el = document.getElementById(attr);
  const val = el ? parseInt(el.value) : 10;
  return Math.floor((val - 10)/2);
}
function getProficiencyBonus() {
  const el = document.getElementById('proficiency-bonus');
  if (!el) return 0;
  const val = el.value.replace('+','');
  return parseInt(val) || 0;
}

// Adiciona duas checkboxes em cada linha: proficiência e especialização
function renderPericias(lista, id, colunaIndex) {
  document.getElementById(id).innerHTML = lista
    .map((p, idx) => {
      const attrId = p.attr;
      const mod = getMod(attrId);
      const profId = `prof_${colunaIndex}_${idx}`;
      const especId = `espec_${colunaIndex}_${idx}`;
      const totalId = `total_${colunaIndex}_${idx}`;
      return `
        <tr>
          <td>${p.nome}</td>
          <td>${attrName[attrId]}</td>
          <td><input type="checkbox" id="${profId}" data-attr="${attrId}"></td>
          <td><input type="checkbox" id="${especId}" data-attr="${attrId}"></td>
          <td><input type="number" value="${mod}" readonly style="width:50px" id="${totalId}"></td>
        </tr>
      `;
    }).join('');
}

// Atualiza total das perícias, soma proficiência se checkbox marcada e soma 1.5x proficiência se especialização marcada
function updateTotals(lista, colunaIndex) {
  lista.forEach((p, idx) => {
    const attrId = p.attr;
    const mod = getMod(attrId);
    const totalId = `total_${colunaIndex}_${idx}`;
    const profId = `prof_${colunaIndex}_${idx}`;
    const especId = `espec_${colunaIndex}_${idx}`;
    const checkProf = document.getElementById(profId);
    const checkEspec = document.getElementById(especId);
    const input = document.getElementById(totalId);
    let total = mod;
    if (checkProf && checkProf.checked) total += getProficiencyBonus();
    if (checkEspec && checkEspec.checked) total += Math.floor(getProficiencyBonus() * 1.5);
    if (input) input.value = total;
  });
}

// Eventos para os checkboxes e atributos
function setupListeners() {
  [...pericias, ...pericias2].forEach((p, idx) => {
    const colunaIndex = idx < pericias.length ? 1 : 2;
    const arrayIdx = colunaIndex === 1 ? idx : idx - pericias.length;
    const profId = `prof_${colunaIndex}_${arrayIdx}`;
    const especId = `espec_${colunaIndex}_${arrayIdx}`;
    const elemProf = document.getElementById(profId);
    const elemEspec = document.getElementById(especId);
    if (elemProf) elemProf.addEventListener('change', () => updateTotals(
      colunaIndex === 1 ? pericias : pericias2, colunaIndex));
    if (elemEspec) elemEspec.addEventListener('change', () => updateTotals(
      colunaIndex === 1 ? pericias : pericias2, colunaIndex));
  });

  ['str','dex','con','int','wis','cha'].forEach(id => {
    if (document.getElementById(id)) {
      document.getElementById(id).addEventListener('input', () => {
        updateTotals(pericias, 1);
        updateTotals(pericias2, 2);
      });
    }
  });
  // Proficiência bônus change
  const el = document.getElementById('proficiency-bonus');
  if (el) {
    el.addEventListener('input', () => {
      updateTotals(pericias, 1);
      updateTotals(pericias2, 2);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderPericias(pericias, 'coluna1', 1);
  renderPericias(pericias2, 'coluna2', 2);
  updateTotals(pericias, 1);
  updateTotals(pericias2, 2);
  setupListeners();
});
</script>

            <div class="navigation">
                <button type="button" class="btn btn--secondary" onclick="previousPage()">← Anterior</button>
                <span class="page-info">Página <span id="nav-current-page">2</span> de 7</span>
                <button class="btn btn--primary" onclick="nextPage()">Próxima →</button>
            </div>
        </div>

        <!-- ===== PÁGINA 3: COMBATE ===== -->
        <div id="page-3" class="page">
            <h2 class="section-header section-border-red">⚔️ Valores de Combate</h2>

            <div class="card section-border-red">
                <h3> Pontos de Vida</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label>Máximo</label>
                        <input type="number" id="hp-max" name="hp-max" value="100" class="form-control" onchange="updateProgressBar('hp')">
                    </div>
                    <div class="form-group">
                        <label>Atuais</label>
                        <input type="number" id="hp-current" name="hp-current" value="100" class="form-control" onchange="updateProgressBar('hp')">
                    </div>
                    <div class="form-group">
                        <label>Temporários</label>
                        <input type="number" id="hp-temp" name="hp-temp" value="0" class="form-control">
                    </div>
                </div>
                <div class="progress-bar">
                    <div id="hp-fill" class="progress-fill" style="width: 100%;">100/100</div>
                </div>
            </div>

            <div class="card section-border-red">
                <h3> Pontos de Energia</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label>Máximo</label>
                        <input type="number" id="pe-max" name="pe-max" value="50" class="form-control" onchange="updateProgressBar('pe')">
                    </div>
                    <div class="form-group">
                        <label>Atuais</label>
                        <input type="number" id="pe-current" name="pe-current" value="50" class="form-control" onchange="updateProgressBar('pe')">
                    </div>
                    <div class="form-group">
                        <label>Temporários</label>
                        <input type="number" id="pe-temp" value="0" class="form-control">
                    </div>
                </div>
                <div class="progress-bar">
                    <div id="pe-fill" class="progress-fill" style="width: 100%;">50/50</div>
                </div>
            </div>

            <div class="card section-border-red">
                <h3>👻 Integridade da Alma</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label>Máximo</label>
                        <input type="number" id="integrity-max" name="integrity-max" value="100" class="form-control" onchange="updateProgressBar('integrity')">
                    </div>
                    <div class="form-group">
                        <label>Atuais</label>
                        <input type="number" id="integrity-current" name="integrity-current" value="100" class="form-control" onchange="updateProgressBar('integrity')">
                    </div>
                    <div class="form-group">
                        <label>Temporários</label>
                        <input type="number" id="integrity-temp" name="integrity-temp" value="0" class="form-control">
                    </div>
                </div>
                <div class="progress-bar">
                    <div id="integrity-fill" class="progress-fill" style="width: 100%;">100/100</div>
                </div>
            </div>

            <div class="card section-border-red">
                <h3>📊 Outros Valores</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label>Deslocamento (metros)</label>
                        <input type="number" id="movement" name="movement" value="9" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Iniciativa</label>
                        <input type="number" id="initiative" name="initiative" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Atenção</label>
                        <input type="number" id="attention" name="attention" class="form-control">
                    </div>
                </div>
            </div>

            <div class="navigation">
                <button type="button" class="btn btn--secondary" onclick="previousPage()">← Anterior</button>
                <span class="page-info">Página 3 de 7</span>
                <button type="button" class="btn btn--primary" onclick="nextPage()">Próxima →</button>
            </div>
        </div>

        <!-- ===== PÁGINA 4: HABILIDADES ===== -->
        <div id="page-4" class="page">
            <h2 class="section-header section-border-orange">✨ Habilidades de Especialização</h2>

            <div class="card section-border-orange">
                <button type="button" class="btn-add" onclick="addAbility('abilities-list')">Adicionar Habilidade</button>
                <div id="abilities-list" style="margin-top: 20px;">
                    <!-- Habilidades adicionadas dinamicamente -->
                </div>
            </div>

            <div class="navigation">
                <button type="button" class="btn btn--secondary" onclick="previousPage()">← Anterior</button>
                <span class="page-info">Página 4 de 7</span>
                <button type="button" class="btn btn--primary" onclick="nextPage()">Próxima →</button>
            </div>
        </div>

        <!-- ===== PÁGINA 5: PERFIL AMALDIÇOADO ===== -->
        <div id="page-5" class="page">
            <h2 class="section-header section-border-indigo">🔮 Perfil Amaldiçoado</h2>

            <div class="card section-border-indigo">
                <h3>🎖️ Talentos</h3>
                <button type="button" class="btn-add" onclick="addTalent()">Adicionar Talento</button>
                <div id="talents-list" style="margin-top: 20px;">
                    <!-- Talentos adicionados dinamicamente -->
                </div>
            </div>

            <div class="card section-border-indigo">
                <h3>📊 Níveis de Aptidão</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label>Energia</label>
                        <input type="number" min="0" max="5" value="0" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Controle/Leitura</label>
                        <input type="number" min="0" max="5" value="0" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Barreira</label>
                        <input type="number" min="0" max="5" value="0" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Domínio</label>
                        <input type="number" min="0" max="5" value="0" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Energia Reversa</label>
                        <input type="number" min="0" max="5" value="0" class="form-control">
                    </div>
                </div>
            </div>

            <div class="card section-border-indigo">
                <h3>🏋️ Treinamentos</h3>
                <button type="button" class="btn-add" onclick="addTraining()">Adicionar Treinamento</button>
                <div id="trainings-list" style="margin-top: 20px;">
                    <!-- Treinamentos adicionados dinamicamente -->
                </div>
            </div>

            <div class="navigation">
                <button type="button" class="btn btn--secondary" onclick="previousPage()">← Anterior</button>
                <span class="page-info">Página 5 de 7</span>
                <button type="button" class="btn btn--primary" onclick="nextPage()">Próxima →</button>
            </div>
        </div>

        <!-- ===== PÁGINA 6: TÉCNICA AMALDIÇOADA ===== -->
        <div id="page-6" class="page">
            <h2 class="section-header section-border-pink">🌀 Técnica Amaldiçoada</h2>

            <div class="card section-border-pink">
                <div class="form-group">
                    <label class="form-label">Nome da Técnica</label>
                    <input type="text" id="technique-name" class="form-control" placeholder="Ex: Limitless, Ten Shadows, etc.">
                </div>

                <div class="form-group">
                    <label class="form-label">Funcionamento Básico</label>
                    <textarea id="technique-description" class="form-control" rows="5" placeholder="Descreva o funcionamento básico da sua técnica amaldiçoada..."></textarea>
                </div>
            </div>

            <div class="card section-border-pink">
                <h3>✨ Habilidades de Técnica</h3>
                <div class="tabs">
                    <button type="button" class="tab active">Nível 0</button>
                    <button type="button" class="tab">Nível 1</button>
                    <button type="button" class="tab">Nível 2</button>
                    <button type="button" class="tab">Nível 3</button>
                    <button type="button" class="tab">Nível 4</button>
                    <button type="button" class="tab">Nível 5</button>
                </div>
                <button type="button" class="btn-add" onclick="addAbility('technique-abilities')">Adicionar Habilidade de Técnica</button>
                <div id="technique-abilities" style="margin-top: 20px;">
                    <!-- Habilidades de técnica adicionadas dinamicamente -->
                </div>
                <script>
// Registro das habilidades por nível
const abilitiesByLevel = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] };
let currentLevel = 0;

// Função de renderização: exibe só habilidades do nível ativo
function renderAbilities() {
  const container = document.getElementById('technique-abilities');
  container.innerHTML = '';
  abilitiesByLevel[currentLevel].forEach((ability, idx) => {
    const node = document.createElement('div');
    node.className = 'technique-ability-card';
    node.textContent = ability;
    // Botão remover (opcional)
    const rmBtn = document.createElement('button');
    rmBtn.textContent = 'Remover';
    rmBtn.onclick = () => {
      abilitiesByLevel[currentLevel].splice(idx,1);
      renderAbilities();
    };
    rmBtn.style.marginLeft = '12px';
    node.appendChild(rmBtn);
    container.appendChild(node);
  });
}

// Altera aba ativa e atualiza habilidades mostradas
document.querySelectorAll('.tabs .tab').forEach((btn, idx) => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    currentLevel = idx;
    renderAbilities();
  });
});

// Sobrescreve o addAbility usando a assinatura original
window.addAbility = function(targetId) {
  const abilityName = prompt(`Nome da habilidade para Nível ${currentLevel}:`);
  if(abilityName && abilityName.trim()) {
    abilitiesByLevel[currentLevel].push(abilityName.trim());
    renderAbilities();
  }
}
// Inicializa mostrando habilidades do nível 0
document.addEventListener('DOMContentLoaded', renderAbilities);

                </script>
            </div>

            <div class="navigation">
                <button type="button" class="btn btn--secondary" onclick="previousPage()">← Anterior</button>
                <span class="page-info">Página 6 de 7</span>
                <button type="button" class="btn btn--primary" onclick="nextPage()">Próxima →</button>
            </div>
        </div>

        <!-- ===== PÁGINA 7: INVOCAÇÕES ===== -->
        <div id="page-7" class="page">
            <h2 class="section-header section-border-cyan">👹 Invocações / Shikigamis</h2>

            <div class="card section-border-cyan">
                <button type="button" class="btn-add" onclick="addInvocation()">Adicionar Invocação</button>
                <div id="invocations-list" style="margin-top: 20px;">
                    <!-- Invocações adicionadas dinamicamente -->
                </div>
            </div>

            <div class="navigation">
                <button type="button" class="btn btn--secondary" onclick="previousPage()">← Anterior</button>
                <span class="page-info">Página 7 de 7</span>
                <button class="btn btn--primary" onclick="nextPage()" disabled>Próxima →</button>
            </div>
        </div>

    </div>
    </form>
    <!-- Botão D20 Flutuante -->
    <div class="d20-container">
        <button class="d20-btn" onclick="rollD20()" title="Rolar D20">🎲</button>
    </div>

    <!-- Modal D20 -->
    <div class="modal" id="dice-modal">
        <div class="modal-content">
            <button class="modal-close" onclick="closeDiceModal()">×</button>
            <h2>🎲 Rolagem de D20</h2>
            <div class="form-group">
                <label>Bônus/Modificador</label>
                <input type="number" id="dice-bonus" value="0" class="form-control" style="width: 100px; margin: 0 auto;">
            </div>
            <div class="dice-result" id="dice-result" style="font-size: 4em; text-align: center; margin: 20px 0; font-weight: bold;">--</div>
            
            <div class="dice-history-container">
                <label class="form-label" style="text-align: center; display: block;">Últimas Rolagens:</label>
                <div id="dice-history" class="dice-history">
                    </div>
            </div>
            <button class="btn btn--primary" onclick="rollD20()">🎲 Rolar Novamente</button>
        </div>
    </div>
    
    <script>
        document.getElementById("character-form").addEventListener("keydown", e => {
            if (e.key === "Enter") e.preventDefault();
        });
        
       function montarPericiasJSON() {
    const resultado = {};

    const todasPericias = [...pericias, ...pericias2];

    todasPericias.forEach((p, idx) => {
        const colunaIndex = idx < pericias.length ? 1 : 2;
        const arrayIdx = colunaIndex === 1 ? idx : idx - pericias.length;

        const profId = `prof_${colunaIndex}_${arrayIdx}`;
        const especId = `espec_${colunaIndex}_${arrayIdx}`;

        const profChecked  = document.getElementById(profId)?.checked ?? false;
        const especChecked = document.getElementById(especId)?.checked ?? false;

        resultado[p.nome] = {
            proficient: profChecked,
            specialized: especChecked
        };
    });

    
    return resultado;
}
document.getElementById("character-form").addEventListener("submit", (ev) => {
    const form = ev.target;

    const fd = new FormData(form);

    // 🔥 coloca pericias no FormData igualmente
    adicionarPericiasNoFormData(fd);

    // impedimos envio automático
    ev.preventDefault();

    // enviamos igual ao fetch do botão salvar
    fetch("Ficha_F&M.php", {
        method: "POST",
        body: fd
    })
    .then(r => r.json())
    .then(json => alert(json.message));
});

document.getElementById("character-form").addEventListener("submit", () => {
    const pericias = montarPericiasJSON();
    document.getElementById("pericias-json").value = JSON.stringify(pericias);
});

    </script>

    <script src="script_melhorado.js"></script>
</body>
</html>
