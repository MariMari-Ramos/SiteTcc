<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ficha F&M - Feiticeiros e Maldições</title>
    <link rel="stylesheet" href="style_melhorado.css">
</head>
<!-- Adicione este modal ao final do seu HTML antes do </body> -->
<div id="section-help-modal" class="modal" style="display:none;">
  <div class="modal-content">
    <span id="close-help-modal" class="modal-close" style="float:right; cursor:pointer; font-size:2em;">&times;</span>
    <h3 id="modal-header-title"></h3>
    <p id="modal-header-desc"></p>
  </div>
</div>
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
                
                <button type="button" id="clear-btn" class="btn btn--sm btn--secondary" title="Limpar Ficha">🗑️ Limpar</button>
                <button type="button" id="export-btn" class="btn btn--sm btn--secondary" title="Exportar/Imprimir">📄 Exportar</button>
            <div class="header-actions">
                <button id="save-btn" class="btn btn--sm btn--secondary" title="Salvar Ficha">💾 Salvar</button>
                <button id="clear-btn" class="btn btn--sm btn--secondary" title="Limpar Ficha">🗑️ Limpar</button>
                <button id="export-btn" class="btn btn--sm btn--secondary" title="Exportar/Imprimir">📄 Exportar</button>
            </div>
        </div>
    </header>
    <form id="character-form" action="Ficha_F&M.php" method="POST">
    <!-- Container Principal -->
     <input type="hidden" id="pericias-json" name="pericias">
    <div class="container">

        <!-- ===== PÁGINA 1: INFORMAÇÕES BÁSICAS ===== -->
        <div id="page-1" class="page active">
            <h2 class="section-header" data-help="Nesta seção, preencha com o Nome do seu personagem, o nivel a origem e a especialização dentre as disponiveis. 
            Sendo a origem representa de onde vem o poder do seu personagem, sendo a fonte
da qual derivam suas capacidades e o motivo dele se destacar acima de um
humano comum.
 Já uma especialização, como diz o nome, é a maneira que um feiticeiro encontrou
ou desenvolveu para enfrentar o perigo das maldições e se tornar poderoso.">📋 Informações Básicas do Personagem</h2>

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
                        <input type="text" id="proficiency-bonus" readonly class="form-control" name="proficiency-bonus">
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

            <h2 class="section-header" data-help="Os atributos representam os aspectos fisicos e caracteristivas variadas do seu personagem! O valor 10 é a média, e representa o padrão de um atributo, estando dentro do
comum. Valores inferiores a 10 começam a representar um déficit naquele
aspecto, enquanto valores maiores significam uma maior aptidão,
desenvolvimento e qualidade.">💪 Atributos</h2>

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

            <h2 class="section-header" data-help="A Classe de Armadura, possui um valor base é igual a 10 + modificador de
destreza. Representa o quão difícil é acertar seu personagem.">🛡️ Classe de Armadura</h2>

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
            <h2 class="section-header section-border-purple" data-help="As Perícias são habilidades específicas dos personagens, as quais são
influenciadas por atributos e englobam o que é essencial para as várias
situações as quais um feiticeiro pode ser imposto.">🎯 Perícias</h2>

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






            <!-- Adicionar perícias de Constituição, Sabedoria, Inteligência e Carisma seguindo o mesmo padrão -->

            <div class="navigation">
                <button type="button" class="btn btn--secondary" onclick="previousPage()">← Anterior</button>
                <span class="page-info">Página <span id="nav-current-page">2</span> de 7</span>
                <button type="button" class="btn btn--primary" onclick="nextPage()">Próxima →</button>
            </div>
        </div>

        <!-- ===== PÁGINA 3: COMBATE ===== -->
        <div id="page-3" class="page">
            <h2 class="section-header section-border-red" data-help="Os Valores de combate, compõe um conjunto de: 
            Vida: Que mede os pontos de vida do seu personagem, definidos pela sua especialização e nivel.
            Energia Amaldiçoada: Que mede os pontos de energia, o combustivel de suas técnicas, definido pela sua especialização e nivel.
            Integridade da Alma: São como os pontos de vida, mas medem a vida da sua alma.
            A Parte Outros Valores: Serve para anotar valores secundarios mais importantes em combate! Como o deslocamento, que mede seu movimento em combate, sua iniciativa para manter a ordem de rodada e a sua Atenção passiva que é 10 + bônus na perícia percepção + outros.">⚔️ Valores de Combate</h2>

            <div class="card section-border-red">
                <h3> Pontos de Vida</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label>Máximo</label>
                        <input type="number" id="hp-max" value="100" class="form-control" onchange="updateProgressBar('hp')">
                    </div>
                    <div class="form-group">
                        <label>Atuais</label>
                        <input type="number" id="hp-current" value="100" class="form-control" onchange="updateProgressBar('hp')">
                    </div>
                    <div class="form-group">
                        <label>Temporários</label>
                        <input type="number" id="hp-temp" value="0" class="form-control">
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
                        <input type="number" id="pe-max" value="50" class="form-control" onchange="updateProgressBar('pe')">
                    </div>
                    <div class="form-group">
                        <label>Atuais</label>
                        <input type="number" id="pe-current" value="50" class="form-control" onchange="updateProgressBar('pe')">
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
                        <input type="number" id="integrity-max" value="100" class="form-control" onchange="updateProgressBar('integrity')">
                    </div>
                    <div class="form-group">
                        <label>Atuais</label>
                        <input type="number" id="integrity-current" value="100" class="form-control" onchange="updateProgressBar('integrity')">
                    </div>
                    <div class="form-group">
                        <label>Temporários</label>
                        <input type="number" id="integrity-temp" value="0" class="form-control">
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
                        <input type="number" id="movement" value="9" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Iniciativa</label>
                        <input type="number" id="initiative" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Atenção</label>
                        <input type="number" id="attention" class="form-control">
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
            <h2 class="section-header section-border-orange" data-help="São as habilidades concedidas pela especialização escolhida, anote todas aqui para que fique facil de se lembrar!">✨ Habilidades de Especialização</h2>

            <div class="card section-border-orange">
                <button class="btn-add" onclick="addAbility('abilities-list')">Adicionar Habilidade</button>
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
            <h2 class="section-header section-border-indigo" data-help="Aqui você deve anotar seus talentos, que podem ser obtidos no lugar de habilidades de especialização ou
obtidos através de outras fontes, como origens ou treinamentos. Anotar seus niveis de aptidão sendo:
 Aptidões de Aura, que alteram as propriedades da própria energia do
usuário, concedendo-a vários aspectos imbuídos na sua aura.
Aptidões de Controle e Leitura, que abordam o controle bruto da
energia, assim como a sua leitura e percepção.
Aptidões de Domínio, que utilizam das diferentes manifestações
de domínio.
Aptidões de Barreira, usando da energia para criar barreiras
protetivas.
Aptidões de Energia Reversa, que permitem curar e regenerar o
próprio corpo.
Aptidões Especiais, que possuem um funcionamento distinto
e único envolvendo a energia e as técnicas interagindo.
E por ultimo, os treinamentos que podem ser obtidos no livro na página 354 do livro!">🔮 Perfil Amaldiçoado</h2>

            <div class="card section-border-indigo">
                <h3>🎖️ Talentos</h3>
                <button class="btn-add" onclick="addTalent()">Adicionar Talento</button>
                <div id="talents-list" style="margin-top: 20px;">
                    <!-- Talentos adicionados dinamicamente -->
                </div>
            </div>

            <div class="card section-border-indigo">
                <h3>📊 Níveis de Aptidão</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label>Energia</label>
                        <input name="energy" id="energy" type="number" min="0" max="5" value="0" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Controle/Leitura</label>
                        <input name="control-reading" id="control-reading" type="number" min="0" max="5" value="0" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Barreira</label>
                        <input name="barrier" id="barrier" type="number" min="0" max="5" value="0" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Domínio</label>
                        <input name="domain" id="domain" type="number" min="0" max="5" value="0" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Energia Reversa</label>
                        <input name="reverse-energy" id="reverse-energy" type="number" min="0" max="5" value="0" class="form-control">
                    </div>
                </div>
            </div>

            <div class="card section-border-indigo">
                <h3>🏋️ Treinamentos</h3>
                <button class="btn-add" onclick="addTraining()">Adicionar Treinamento</button>
                <div id="trainings-list" style="margin-top: 20px;">
                    <!-- Treinamentos adicionados dinamicamente -->
                </div>
            </div>

            <div class="navigation">
                <button type="button" class="btn btn--secondary" onclick="previousPage()">← Anterior</button>
                <span class="page-info">Página 5 de 7</span>
                <button type="submit" class="btn btn--primary" onclick="nextPage()">Próxima →</button>
            </div>
        </div>

        <!-- ===== PÁGINA 6: TÉCNICA AMALDIÇOADA ===== -->
        <div id="page-6" class="page">
            <h2 class="section-header section-border-pink" data-help="Aqui você vai anotar, os aspectos da sua técnica amaldiçoada, que deve ser escolhida por você, no livro de técnicas!">🌀 Técnica Amaldiçoada</h2>

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
  <div class="tabs" id="technique-tabs">
    <button class="tab active" data-level="0">Nível 0</button>
    <button class="tab" data-level="1">Nível 1</button>
    <button class="tab" data-level="2">Nível 2</button>
    <button class="tab" data-level="3">Nível 3</button>
    <button class="tab" data-level="4">Nível 4</button>
    <button class="tab" data-level="5">Nível 5</button>
  </div>
  <button class="btn-add" id="btn-add-technique">Adicionar Habilidade de Técnica</button>
  <div id="technique-abilities" style="margin-top: 20px;">
    <!-- Habilidades de técnica criadas são exibidas aqui -->
  </div>
</div>

<script>
const abilitiesByLevel = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] };
let currentLevel = 0;

// Atualiza o container mostrando apenas habilidades do nível selecionado
function renderAbilities() {
  const container = document.getElementById('technique-abilities');
  container.innerHTML = '';
  abilitiesByLevel[currentLevel].forEach((ability, idx) => {
    // Exemplo simples: apenas título. Personalize se quiser.
    const div = document.createElement('div');
    div.textContent = ability;
    div.className = "technique-ability-card";
    // Adiciona botão de remover se desejar
    const removeBtn = document.createElement('button');
    removeBtn.textContent = "Remover";
    removeBtn.style.marginLeft = "12px";
    removeBtn.onclick = () => {
      abilitiesByLevel[currentLevel].splice(idx, 1);
      renderAbilities();
    };
    div.appendChild(removeBtn);
    container.appendChild(div);
  });
}

// Troca de aba
document.getElementById('technique-tabs').addEventListener('click', function(e) {
  if (!e.target.classList.contains('tab')) return;
  // Remove 'active' de todas e define atual
  [...this.children].forEach(btn => btn.classList.remove('active'));
  e.target.classList.add('active');
  currentLevel = e.target.getAttribute('data-level');
  renderAbilities();
});

// Adicionar habilidade
document.getElementById('btn-add-technique').addEventListener('click', function() {
  const name = prompt(`Nome da habilidade de técnica para Nível ${currentLevel}:`);
  if (name && name.trim()) {
    abilitiesByLevel[currentLevel].push(name.trim());
    renderAbilities();
  }
});
// Inicializa mostrando habilidades do nível 0
document.addEventListener('DOMContentLoaded', renderAbilities);
</script>

<style>
.technique-ability-card {
  padding: 8px 16px;
  border-radius: 6px;
  margin-bottom: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 4px rgba(255,150,200,.08);
}
.tabs .tab {
  border: none;
  border-radius: 7px 7px 0 0;
  margin-right: 4px;
  padding: 7px 25px;

  cursor: pointer;
  font-size: 15px;
  outline: none;
  font-weight: 600;
}
.tabs .tab.active {
  border-bottom: 2px solid #ffe5f8;
}
.btn-add {
  color: #fff;
  border: none;
  padding: 7px 20px;
  border-radius: 5px;
  margin-top:12px;
  font-size: 15px;
  cursor: pointer;
}
</style>


            <div class="navigation">
                <button type="button" class="btn btn--secondary" onclick="previousPage()">← Anterior</button>
                <span class="page-info">Página 6 de 7</span>
                <button type="button" class="btn btn--primary" onclick="nextPage()">Próxima →</button>
            </div>
        </div>

        <!-- ===== PÁGINA 7: INVOCAÇÕES ===== -->
        <div id="page-7" class="page">
            <h2 class="section-header section-border-cyan" data-help="Aqui você deve anotar, as invocações que você como Controlador ou como qualquer outra especialização, obter durante a campanha!">👹 Invocações / Shikigamis</h2>

            <div class="card section-border-cyan">
                <button class="btn-add" onclick="addInvocation()">Adicionar Invocação</button>
                <div id="invocations-list" style="margin-top: 20px;">
                    <!-- Invocações adicionadas dinamicamente -->
                </div>
            </div>

            <div class="navigation">
                <button class="btn btn--secondary" onclick="previousPage()">← Anterior</button>
                <span class="page-info">Página 7 de 7</span>
                <button class="btn btn--primary" onclick="nextPage()" disabled>Salvar</button>
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
    const habilidades = montarHabilidadesJSON();
    document.getElementById("pericias-json").value = JSON.stringify(pericias);
});

    </script>

    <script src="script_melhorado.js"></script>
</body>
</html>