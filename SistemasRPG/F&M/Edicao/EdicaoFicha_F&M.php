<?php
session_start();
if (!isset($_SESSION['usuario_id'])) {
    header("Location: /SiteTcc/Login/login.php");
    exit;
}

include("../../../conexao.php");

if (!isset($_GET["id"])) {
    die("ID da ficha não informado.");
}

$id_ficha = intval($_GET["id"]);
$id_usuario = intval($_SESSION["usuario_id"]);

$sql = "SELECT * FROM ficha_per WHERE id_ficha = ? AND id_usuario = ? LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $id_ficha, $id_usuario);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    die("Ficha não encontrada.");
}

$ficha = $res->fetch_assoc();
$dados = json_decode($ficha["dados_json"], true);
$info = $dados["info_basicas"];
$combate = $dados["combate"];
$pericias = $dados["pericias"];
$habilidades = $dados['habilidades'] ?? [];
$perfil_amaldicoado = $dados['perfil_amaldicoado'] ?? [];
$tecnica_amaldicoada = $dados['tecnica_amaldicoada'] ?? [];
$invocations = $dados['invocations'] ?? [];

?>


<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ficha F&M - Feiticeiros e Maldições</title>
    <link rel="stylesheet" href="EdicaoFicha_F&M.css">
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

            <div class="header-actions">
                <button id="btn-editar" onclick="habilitarEdicao()" class="btn btn--sm btn--secondary">💾 Editar</button>
                <button id="btn-salvar" onclick="salvarEdicao()" class="btn btn--sm btn--secondary" style="display:none;">💾 Salvar</button>
                <button  type="button" id="export-btn" class="btn btn--sm btn--secondary" title="Exportar/Imprimir">📄 Exportar</button>
            </div>
        </div>
    </header>
    <form id="character-form" action="Ficha_F&M.php" method="POST">
        <input type="hidden" id="json_ficha" name="dados_json">
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
                        <input type="text" id="char-name" class="form-control" placeholder="Digite o nome..." name="char-name" value="<?php echo htmlspecialchars($info['nome'] ?? ''); ?>" disabled>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="level">Nível</label>
                        <input type="number" id="level" min="1" max="20" class="form-control" name="level" value="<?php echo htmlspecialchars($info['level'] ?? '1'); ?>" disabled>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="proficiency-bonus">Bônus de Maestria</label>
                        <input type="text" id="proficiency-bonus" readonly class="form-control" name="proficiency-bonus">
                    </div>
                </div>

                <script>
                    const fichaOrigin = "<?= htmlspecialchars($info['origin']) ?>";
                    const fichaSpec = "<?= htmlspecialchars($info['specialization']) ?>";
                </script>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="origin">Origem</label>
                        <select id="origin" name="origin" class="form-control styled-select" disabled>
                            <option value="">Selecione...</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="specialization">Especialização</label>
                        <select id="specialization" name="specialization" class="form-control styled-select" disabled>
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
                    <input type="number" id="str" min="0" max="30" class="form-control attribute-value" name="str" value="<?php echo htmlspecialchars($info['str'] ?? '10'); ?>" disabled>
                    <div class="attribute-modifier">Modificador: <span id="str-mod" class="mod">+0</span></div>
                </div>

                <div class="attribute-box">
                    <div class="attribute-name">Destreza</div>
                    <input type="number" id="dex" min="0" max="30" class="form-control attribute-value" name="dex" value="<?php echo htmlspecialchars($info['dex'] ?? '10'); ?>" disabled>
                    <div class="attribute-modifier">Modificador: <span id="dex-mod" class="mod">+0</span></div>
                </div>

                <div class="attribute-box">
                    <div class="attribute-name">Constituição</div>
                    <input type="number" id="con" min="0" max="30" class="form-control attribute-value" name="con" value="<?php echo htmlspecialchars($info['con'] ?? '10'); ?>" disabled>
                    <div class="attribute-modifier">Modificador: <span id="con-mod" class="mod">+0</span></div>
                </div>

                <div class="attribute-box">
                    <div class="attribute-name">Sabedoria</div>
                    <input type="number" id="wis" min="0" max="30" class="form-control attribute-value" name="wis" value="<?php echo htmlspecialchars($info['wis'] ?? '10'); ?>" disabled>
                    <div class="attribute-modifier">Modificador: <span id="wis-mod" class="mod">+0</span></div>
                </div>

                <div class="attribute-box">
                    <div class="attribute-name">Inteligência</div>
                    <input type="number" id="int" min="0" max="30" class="form-control attribute-value" name="int" value="<?php echo htmlspecialchars($info['int'] ?? '10'); ?>" disabled>
                    <div class="attribute-modifier">Modificador: <span id="int-mod" class="mod">+0</span></div>
                </div>

                <div class="attribute-box">
                    <div class="attribute-name">Carisma</div>
                    <input type="number" id="cha" min="0" max="30" class="form-control attribute-value" name="cha" value="<?php echo htmlspecialchars($info['cha'] ?? '10'); ?>" disabled>
                    <div class="attribute-modifier">Modificador: <span id="cha-mod" class="mod">+0</span></div>
                </div>
            </div>

            <h2 class="section-header" data-help="A Classe de Armadura, possui um valor base é igual a 10 + modificador de
destreza. Representa o quão difícil é acertar seu personagem.">🛡️ Classe de Armadura</h2>

            <div class="card section-border-teal">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="ac-natural">Natural</label>
                        <input type="number" id="ac-natural" class="form-control" name="ac-natural" value="<?php echo htmlspecialchars($info['ac_natural'] ?? '10'); ?>" disabled>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="ac-armor">Uniforme</label>
                        <input type="number" id="ac-armor" class="form-control" name="ac-armor" value="<?php echo htmlspecialchars($info['ac_armor'] ?? '0'); ?>">
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="ac-shield">Escudo</label>
                        <input type="number" id="ac-shield" class="form-control" name="ac-shield" value="<?php echo htmlspecialchars($info['ac_shield'] ?? '0'); ?>">
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="ac-dex">Destreza</label>
                        <input type="number" id="ac-dex" readonly class="form-control" name="ac-dex" value="<?php echo htmlspecialchars($info['ac_dex'] ?? '0'); ?>">
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="ac-other">Outros</label>
                        <input type="number" id="ac-other"  class="form-control" name="ac-other" value="<?php echo htmlspecialchars($info['ac_other'] ?? '0'); ?>" disabled>
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
const fichaPericias = <?= json_encode($pericias ?? []) ?>;


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
    function aplicarPericiasSalvas() {
    if (!fichaPericias) return;

    function aplicar(lista, colunaIndex) {
        lista.forEach((p, idx) => {
            const nome = p.nome;
            if (!fichaPericias[nome]) return;

            const prof = fichaPericias[nome].proficient;
            const espec = fichaPericias[nome].specialized;

            const profId = `prof_${colunaIndex}_${idx}`;
            const especId = `espec_${colunaIndex}_${idx}`;

            const profChk = document.getElementById(profId);
            const especChk = document.getElementById(especId);

            if (profChk) profChk.checked = !!prof;
            if (especChk) especChk.checked = !!espec;
        });

        updateTotals(lista, colunaIndex);
    }

    aplicar(pericias, 1);   // Coluna da esquerda
    aplicar(pericias2, 2);  // Coluna da direita
}


  renderPericias(pericias, 'coluna1', 1);
  renderPericias(pericias2, 'coluna2', 2);
  updateTotals(pericias, 1);
  updateTotals(pericias2, 2);
  setupListeners();
  aplicarPericiasSalvas();
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
                        <input name="hp-max" type="number" id="hp-max"  class="form-control" onchange="updateProgressBar('hp')" value="<?php echo htmlspecialchars($combate['hp_max'] ?? '100'); ?>">
                    </div>
                    <div class="form-group">
                        <label>Atuais</label>
                        <input name="hp-current" type="number" id="hp-current" value="<?php echo htmlspecialchars($combate['hp_current'] ?? '100'); ?>" class="form-control" onchange="updateProgressBar('hp')">
                    </div>
                    <div class="form-group">
                        <label>Temporários</label>
                        <input name="hp-temp" type="number" id="hp-temp" value="<?php echo htmlspecialchars($combate['hp_temp'] ?? '0'); ?>" class="form-control">
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
                        <input name="pe-max" type="number" id="pe-max" value="<?php echo htmlspecialchars($combate['pe_max'] ?? '50'); ?>" class="form-control" onchange="updateProgressBar('pe')">
                    </div>
                    <div class="form-group">
                        <label>Atuais</label>
                        <input name="pe-current" type="number" id="pe-current" value="<?php echo htmlspecialchars($combate['pe_current'] ?? '5'); ?>" class="form-control" onchange="updateProgressBar('pe')">
                    </div>
                    <div class="form-group">
                        <label>Temporários</label>
                        <input name="pe-temp" type="number" id="pe-temp" value="<?php echo htmlspecialchars($combate['pe_temp'] ?? '0'); ?>" class="form-control">
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
                        <input name="integrity-max" type="number" id="integrity-max" value="<?php echo htmlspecialchars($combate['integrity_max'] ?? '100'); ?>" class="form-control" onchange="updateProgressBar('integrity')">
                    </div>
                    <div class="form-group">
                        <label>Atuais</label>
                        <input name="integrity-current" type="number" id="integrity-current" value="<?php echo htmlspecialchars($combate['integrity_current'] ?? '100'); ?>" class="form-control" onchange="updateProgressBar('integrity')">
                    </div>
                    <div class="form-group">
                        <label>Temporários</label>
                        <input name="integrity-temp" type="number" id="integrity-temp" value="<?php echo htmlspecialchars($combate['integrity_temp'] ?? '0'); ?>" class="form-control">
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
                        <input name="movement" type="number" id="movement" value="<?php echo htmlspecialchars($combate['movement'] ?? ''); ?>" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Iniciativa</label>
                        <input name="initiative" type="number" id="initiative" value="<?php echo htmlspecialchars($combate['initiative'] ?? ''); ?>" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Atenção</label>
                        <input name="attention" type="number" id="attention" value="<?php echo htmlspecialchars($combate['attention'] ?? ''); ?>" class="form-control">
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
                        <input name="energy" id="energy" type="number" min="0" max="5" value="<?php echo htmlspecialchars($perfil_amaldicoado['energy'] ?? '0'); ?>" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Controle/Leitura</label>
                        <input name="control-reading" id="control-reading" type="number" min="0" max="5" value="<?php echo htmlspecialchars($perfil_amaldicoado['control_reading'] ?? '0'); ?>" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Barreira</label>
                        <input name="barrier" id="barrier" type="number" min="0" max="5" value="<?php echo htmlspecialchars($perfil_amaldicoado['barrier'] ?? '0'); ?>" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Domínio</label>
                        <input name="domain" id="domain" type="number" min="0" max="5" value="<?php echo htmlspecialchars($perfil_amaldicoado['domain'] ?? '0'); ?>" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Energia Reversa</label>
                        <input name="reverse-energy" id="reverse-energy" type="number" min="0" max="5" value="<?php echo htmlspecialchars($perfil_amaldicoado['reverse_energy'] ?? '0'); ?>" class="form-control">
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
            <h2 class="section-header section-border-pink" data-help="Aqui você vai anotar, os aspectos da sua técnica amaldiçoada, que deve ser escolhida por você, no livro de técnicas!">🌀 Técnica Amaldiçoada</h2>

            <div class="card section-border-pink">
                <div class="form-group">
                    <label class="form-label">Nome da Técnica</label>
                    <input type="text" id="technique-name" class="form-control" placeholder="Ex: Limitless, Ten Shadows, etc." value="<?php echo htmlspecialchars($tecnica_amaldicoada['nome'] ?? ''); ?>">
                </div>

                <div class="form-group">
                    <label class="form-label">Funcionamento Básico</label>
                    <textarea id="technique-description" class="form-control" rows="5" placeholder="Descreva o funcionamento básico da sua técnica amaldiçoada..."><?php echo htmlspecialchars($tecnica_amaldicoada['descricao'] ?? ''); ?></textarea>
                </div>
            </div>

            <div class="card section-border-pink">
  <h3>✨ Habilidades de Técnica</h3>
  <div class="tabs" id="technique-tabs">
    <button type="button" class="tab active" data-level="0">Nível 0</button>
    <button type="button" class="tab" data-level="1">Nível 1</button>
    <button type="button" class="tab" data-level="2">Nível 2</button>
    <button type="button" class="tab" data-level="3">Nível 3</button>
    <button type="button" class="tab" data-level="4">Nível 4</button>
    <button type="button" class="tab" data-level="5">Nível 5</button>
  </div>
  <button type="button" class="btn-add" id="btn-add-technique">Adicionar Habilidade de Técnica</button>
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
    const div = document.createElement('div');
    div.textContent = `${idx + 1}. ${ability}`;
    div.className = "technique-ability-card";

    const removeBtn = document.createElement('button');
    removeBtn.textContent = "Remover";
    removeBtn.style.marginLeft = "12px";
    removeBtn.onclick = () => {
      abilitiesByLevel[currentLevel].splice(idx, 1);
      renderAbilities();
    };

    div.appendChild(removeBtn);
    container.appendChild(div);
    saveCharacter();
  });
}

// Torna global
window.renderAbilities = renderAbilities;


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
    saveCharacter();
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
                <button type="button" class="btn-add" onclick="addInvocation()">Adicionar Invocação</button>
                <div id="invocations-list" style="margin-top: 20px;">
                    <!-- Invocações adicionadas dinamicamente -->
                </div>
            </div>

            <div class="navigation">
                <button type="button" class="btn btn--secondary" onclick="previousPage()">← Anterior</button>
                <span class="page-info">Página 7 de 7</span>
                <button type="submit" class="btn btn--primary" onclick="nextPage()" >Salvar</button>
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
    const id_Ficha = <?= $id_ficha ?>;
    const dados = <?= json_encode($dados, JSON_UNESCAPED_UNICODE); ?>;
    
    const fichaAbilities = <?= json_encode($habilidades ?? []) ?>;
    carregarHabilidades(fichaAbilities, 'abilities-list');
    let modoEdicao = false;

    document.addEventListener('DOMContentLoaded', () => {
    carregarHabilidades(fichaAbilities, 'abilities-list');
    carregarTalentos(dados.perfil_amaldicoado.talentos, 'talents-list');
    carregarTreinamentos(dados.perfil_amaldicoado.treinamentos, 'trainings-list');
    carregarInvocations(dados.invocations, 'invocations-list');
    desabilitarEdicao();  // começa em modo visualização
});


        

function habilitarEdicao() {
    document.querySelectorAll("input, select, textarea, button").forEach(el => {
        if (!el.classList.contains("bloquear")) {
            el.disabled = false;
            modoEdicao = true;
            // mostra o botão Salvar
    document.getElementById("btn-salvar").style.display = "inline-block";

    // esconde o botão Editar
    document.getElementById("btn-editar").style.display = "none";

    // Habilita botão de adicionar habilidade
    document.querySelectorAll('.btn-add').forEach(b => b.disabled = false);

    // Habilita botões de remover habilidade
    document.querySelectorAll('.btn-remove').forEach(b => b.style.display = 'block');


        }
    });
}
    function salvarEdicao() {
    const fd = new FormData();

    fd.append("id_ficha", id_Ficha); // variável global do PHP

    // ==== INFO BÁSICAS ====
    const camposBasicos = [
        ["char-name", "nome"],
        ["level", "level"],
        ["proficiency-bonus", "proficiency_bonus"],
        ["origin", "origin"],
        ["specialization", "specialization"],
        ["str", "str"],
        ["dex", "dex"],
        ["con", "con"],
        ["wis", "wis"],
        ["int", "int"],
        ["cha", "cha"],
        ["ac-natural", "ac_natural"],
        ["ac-armor", "ac_armor"],
        ["ac-shield", "ac_shield"],
        ["ac-dex", "ac_dex"],
        ["ac-other", "ac_other"],
        ["ac-total", "ac_total"],
        ["hp-max", "hp_max"],
        ["hp-current", "hp_current"],
        ["hp-temp", "hp_temp"],
        ["pe-max", "pe_max"],
        ["pe-current", "pe_current"],
        ["pe-temp", "pe_temp"],
        ["integrity-max", "integrity_max"],
        ["integrity-current", "integrity_current"],
        ["integrity-temp", "integrity_temp"],
        ["movement", "movement"],
        ["initiative", "initiative"],
        ["attention", "attention"],
        ["energy", "energy"],
        ["control-reading", "control_reading"],
        ["barrier", "barrier"],
        ["domain", "domain"],
        ["reverse-energy", "reverse_energy"]
    ];

    camposBasicos.forEach(([id, name]) => {
        const el = document.getElementById(id);
        fd.append(name, el ? el.value : "");
    });

    // ==== JSONS IMPORTANTES ====
    fd.append("pericias_json", JSON.stringify(carregarPericiasParaSalvar()));
    fd.append("habilidades_json", JSON.stringify(carregarHabilidadesParaSalvar()));
    fd.append("talentos_json", JSON.stringify(carregarTalentosParaSalvar()));
    fd.append("treinamentos_json", JSON.stringify(carregarTreinamentosParaSalvar()));
    fd.append("tecnica_json", JSON.stringify(abilitiesByLevel));
    fd.append("invocations_json", JSON.stringify(carregarInvocationsParaSalvar()));

    // ==== Envia ====
    fetch("phpFichaF&M.php", { method: "POST", body: fd })
        .then(r => r.text())
        .then(resp => {
            if (resp === "OK") {
                alert("Ficha salva!");
                location.reload();
            } else {
                alert("Erro: " + resp);
            }
        });
}

// --- Funções auxiliares para gerar JSONs de habilidades, talentos, treinamentos e invocações ---

function carregarPericiasParaSalvar() {
    const cards = document.querySelectorAll('#pericias-list .pericia-card');
    return Array.from(cards).map(card => ({
        nome: card.querySelector('.pericia-name')?.value || "",
        valor: Number(card.querySelector('.pericia-value')?.value || 0),
        proficiencia: card.querySelector('.pericia-prof')?.checked || false
    }));
}


function carregarHabilidadesParaSalvar() {
    const cards = document.querySelectorAll('#abilities-list .ability-card');
    return Array.from(cards).map(card => ({
        nome: card.querySelector('.ability-name')?.value || "",
        custo: Number(card.querySelector('input[type="number"]')?.value || 0),
        tipo: card.querySelector('select')?.value || "Ação Comum",
        descricao: card.querySelector('textarea')?.value || ""
    }));
}

function carregarTalentosParaSalvar() {
    const cards = document.querySelectorAll('#talents-list .talent-card');
    return Array.from(cards).map(card => ({
        nome: card.querySelector('input')?.value || "",
        descricao: card.querySelector('textarea')?.value || ""
    }));
}

function carregarTreinamentosParaSalvar() {
    const cards = document.querySelectorAll('#trainings-list .training-card');
    return Array.from(cards).map(card => ({
        nome: card.querySelector('input')?.value || "",
        descricao: card.querySelector('textarea')?.value || ""
    }));
}

function carregarInvocationsParaSalvar() {
    const cards = document.querySelectorAll('#invocations-list .invocation-card');
    return Array.from(cards).map(card => ({
        name: card.querySelector('.invocation-name')?.value || "",
        grade: card.querySelector('.invocation-grade')?.value || "4º Grau",
        cost: Number(card.querySelector('.invocation-cost')?.value || 0),
        pv: Number(card.querySelector('.invocation-pv')?.value || 0),
        ca: Number(card.querySelector('.invocation-ca')?.value || 0),
        description: card.querySelector('.invocation-description')?.value || ""
    }));
}

        
       function desabilitarEdicao() {
    modoEdicao = false;

    document.querySelectorAll('.form-control, textarea, select, input').forEach(el => {
        el.disabled = true;
    });

    document.querySelectorAll('.btn-add').forEach(b => b.disabled = true);

    document.querySelectorAll('.btn-remove').forEach(b => b.style.display = 'none');
}

// util: corrige alguns mojibakes comuns e normaliza a string
function fixAndNormalize(s) {
    if (s === null || s === undefined) return "";
    let t = String(s);

    // substituir sequências comuns de mojibake por seus chars corretos
    t = t.replace(/Ã§/g, "ç")
         .replace(/Ã£/g, "ã")
         .replace(/Ã©/g, "é")
         .replace(/Ã¡/g, "á")
         .replace(/Ã³/g, "ó")
         .replace(/Ãª/g, "ê")
         .replace(/Ãº/g, "ú")
         .replace(/Ã‰/g, "É")
         .replace(/Ã/g, "à"); // fallback simples (pode ser irrelevante em alguns casos)

    // agora remove diacríticos e deixa em minúsculas pra comparação segura
    try {
        t = t.normalize('NFD').replace(/\p{Diacritic}/gu, "");
    } catch (e) {
        // se o ambiente não suportar \p{Diacritic}
        t = t.replace(/[\u0300-\u036f]/g, "");
    }

    return t.toLowerCase().trim();
}

function carregarHabilidades(lista, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // limpa antes de popular
    container.innerHTML = "";

    if (!Array.isArray(lista) || lista.length === 0) {
        // opcional: mostrar uma mensagem quando não há habilidades
        const empty = document.createElement('div');
        empty.className = "muted";
        empty.textContent = "Nenhuma habilidade cadastrada.";
        container.appendChild(empty);
        return;
    }

    // tipos possíveis (exibidos no select)
    const tipos = ['Ação Comum', 'Ação Bônus', 'Ação Livre', 'Reação', 'Passiva'];

    lista.forEach(h => {
        // lida com o formato em pt-br do JSON
        const nome = (h.nome ?? "").toString();
        const cost = Number(h.custo ?? 0) || 0;
        const tipoRaw = (h.tipo ?? "").toString();
        const desc = (h.descricao ?? "").toString();

        // normaliza para comparação (corrige mojibake e remove acentos)
        const tipoNorm = fixAndNormalize(tipoRaw);

        // monta options do select marcando selected se bate
        const optionsHtml = tipos.map(t => {
            const selected = (fixAndNormalize(t) === tipoNorm) ? " selected" : "";
            return `<option value="${t}"${selected}>${t}</option>`;
        }).join("");

        const abilityCard = document.createElement('div');
        abilityCard.className = 'ability-card';

        abilityCard.innerHTML = `
            <div class="card-header">
                <input type="text" class="form-control ability-name" value="${escapeHtml(nome)}" disabled>
                <button class="btn-remove" onclick="this.parentElement.parentElement.remove();" style="display:none;">×</button>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Custo (PE)</label>
                    <input type="number" class="form-control" min="0" value="${cost}" disabled>
                </div>

                <div class="form-group">
                    <label class="form-label">Tipo</label>
                    <select class="form-control styled-select" disabled>
                        ${optionsHtml}
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Descrição</label>
                <textarea class="form-control" rows="3" disabled>${escapeHtml(desc)}</textarea>
            </div>
        `;

        container.appendChild(abilityCard);
    });
}

// pequena função para escapar HTML antes de injetar nos inputs/textarea
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function carregarTalentos(lista, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    if (!Array.isArray(lista) || lista.length === 0) {
        const empty = document.createElement("div");
        empty.className = "muted";
        empty.textContent = "Nenhum talento cadastrado.";
        container.appendChild(empty);
        return;
    }

    lista.forEach(t => {
        const nome = t.nome ?? "";
        const desc = t.descricao ?? "";

        const card = document.createElement("div");
        card.className = "talent-card";

        card.innerHTML = `
            <div class="card-header">
                <input type="text" class="form-control" value="${escapeHtml(nome)}" disabled>
                <button class="btn-remove" onclick="this.parentElement.parentElement.remove();" style="display:none;">×</button>
            </div>

            <textarea class="form-control" rows="2" disabled>${escapeHtml(desc)}</textarea>
        `;

        container.appendChild(card);
    });
}

function carregarTreinamentos(lista, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    if (!Array.isArray(lista) || lista.length === 0) {
        const empty = document.createElement("div");
        empty.className = "muted";
        empty.textContent = "Nenhum treinamento cadastrado.";
        container.appendChild(empty);
        return;
    }

    lista.forEach(t => {
        const nome = t.nome ?? "";
        const desc = t.descricao ?? "";

        const card = document.createElement("div");
        card.className = "training-card";

        card.innerHTML = `
            <div class="card-header">
                <input type="text" class="form-control" value="${escapeHtml(nome)}" disabled>
                <button class="btn-remove" onclick="this.parentElement.parentElement.remove();" style="display:none;">×</button>
            </div>

            <textarea class="form-control" rows="2" disabled>${escapeHtml(desc)}</textarea>
        `;

        container.appendChild(card);
    });
}

function carregarInvocations(listaInvocations) {
    const container = document.getElementById('invocations-list');
    container.innerHTML = ""; // limpa antes

    if (!listaInvocations || !Array.isArray(listaInvocations)) return;
    listaInvocations.forEach(inv => {
        const card = document.createElement('div');
        card.className = 'invocation-card';
        card.innerHTML = `
            <div class="card-header">
                <input type="text" placeholder="Nome da Invocação" class="form-control invocation-name" value="${inv.name || ''}">
                <button class="btn-remove" onclick="this.parentElement.parentElement.remove(); saveCharacter();">×</button>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Grau</label>
                    <select class="form-control styled-select invocation-grade">
                        <option ${inv.grade === "4º Grau" ? "selected" : ""}>4º Grau</option>
                        <option ${inv.grade === "3º Grau" ? "selected" : ""}>3º Grau</option>
                        <option ${inv.grade === "2º Grau" ? "selected" : ""}>2º Grau</option>
                        <option ${inv.grade === "1º Grau" ? "selected" : ""}>1º Grau</option>
                        <option ${inv.grade === "Grau Especial" ? "selected" : ""}>Grau Especial</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Custo (PE)</label>
                    <input type="number" class="form-control invocation-cost" min="0" value="${inv.cost ?? ''}">
                </div>

                <div class="form-group">
                    <label class="form-label">PV</label>
                    <input type="number" class="form-control invocation-pv" value="${inv.pv ?? ''}">
                </div>

                <div class="form-group">
                    <label class="form-label">CA</label>
                    <input type="number" class="form-control invocation-ca" value="${inv.ca ?? ''}">
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Características</label>
                <textarea class="form-control invocation-description" rows="3">${inv.description || ''}</textarea>
            </div>
        `;

        container.appendChild(card);
    });
}



    </script>
    <script src="EdicaoFicha_F&M.js"></script>