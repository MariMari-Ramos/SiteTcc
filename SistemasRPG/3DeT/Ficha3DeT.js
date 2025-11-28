// ========== Game Data ========== 
const gameData = {
	archetypes: [
		'Humano', 'Aberrante', 'Abissal', 'Alien', 'Anão', 'Anfíbio',
		'Celestial', 'Centauro', 'Ciborgue', 'Construto', 'Dallan', 'Elfo',
		'Fada', 'Fantasma', 'Goblin', 'Hynne', 'Kallyanach', 'Kemono',
		'Minotauro', 'Ogro', 'Osteon', 'Qareen', 'Sauroide', 'Vampiro'
	],
	skills: [
		{ name: 'Animais', description: 'Você sabe lidar com animais e monstros. Pode treinar, cuidar e montar neles.' },
		{ name: 'Arte', description: 'Você sabe fazer performances artísticas: Cantar, dançar, tocar, cozinhar, desenhar.' },
		{ name: 'Esporte', description: 'Você conhece esportes e suas regras. Sabe correr, nadar, escalar, saltar, fazer acrobacias.' },
		{ name: 'Influência', description: 'Você sabe convencer ou influenciar outras pessoas. Inclui diplomacia, liderança, intimidação.' },
		{ name: 'Luta', description: 'Você sabe atacar e se defender em combate, corpo a corpo ou à distância.' },
		{ name: 'Manha', description: 'Você sabe fazer truques e ações furtivas ou ilegais: Roubar, sabotar, arrombar.' },
		{ name: 'Máquinas', description: 'Você sabe operar, consertar e criar máquinas e veículos. Também lida com computadores.' },
		{ name: 'Medicina', description: 'Você sabe cuidar da saúde: primeiros socorros, diagnósticos, tratar doenças e venenos.' },
		{ name: 'Mística', description: 'Você entende magia e forças sobrenaturais. Serve para atacar, se defender e estudar criaturas.' },
		{ name: 'Percepção', description: 'Você sabe observar e ouvir melhor o que acontece ao redor. Ajuda a notar detalhes.' },
		{ name: 'Saber', description: 'Você sabe muitas coisas: ciências, idiomas, assuntos sobrenaturais e como pesquisar.' },
		{ name: 'Sobrevivência', description: 'Você sabe viver em condições difíceis: encontrar comida, construir abrigo, rastrear.' }
	],
	offensiveAdvantages: [
		{ name: 'Acumulador', description: 'Quanto mais você acerta ataques, mais forte eles ficam. Gasta 2PM por acerto para aumentar o poder.' },
		{ name: 'Alcance', description: 'Seus ataques e habilidades atingem mais longe. Pode atingir inimigos distantes sem penalidade.' },
		{ name: 'Ataque Especial', description: 'Você pode gastar PM para melhorar seus ataques com efeitos diferentes (Área, Choque, Distante).' },
		{ name: 'Brutal', description: 'Ao atacar inimigos, você recupera energia: Vida (1PV a cada 3 de dano) ou Mana (1PM a cada 3).' },
		{ name: 'Desgaste', description: 'Depois de atacar, o alvo sofre dano extra na próxima rodada. Gasta 2PM por ataque.' },
		{ name: 'Forte', description: 'Você é mais forte: +2 em testes físicos. Pode gastar 2PM para garantir crítico.' },
		{ name: 'Golpe Final', description: 'Você tem um ataque poderoso para inimigos quase derrotados. Gasta 3PM.' },
		{ name: 'Inimigo', description: 'Você é treinado contra um tipo específico de criatura. Em testes contra eles, você consegue crítico.' },
		{ name: 'Irresistível', description: 'Seus poderes são mais difíceis de resistir. Gasta 2PM ou mais para aumentar a dificuldade.' },
		{ name: 'Paralisia', description: 'Você pode impedir o alvo de agir. Gasta 2PM e vence a defesa do alvo para deixá-lo imobilizado.' }
	],
	defensiveAdvantages: [
		{ name: 'Anulação', description: 'Cancela temporariamente uma vantagem de um inimigo. Ele faz teste de Resistência para resistir.' },
		{ name: 'Base', description: 'Você tem um refúgio seguro. Lá, todos os testes têm Ganho e você recupera recursos.' },
		{ name: 'Clone', description: 'Cria cópias suas (2PM cada). Elas somem quando você é atingido.' },
		{ name: 'Confusão', description: 'Ataque que deixa o alvo confuso (escolhe alvos aleatoriamente). Custa 2PM.' },
		{ name: 'Cura', description: 'Cura 1D PV por 2PM ou permite repetir testes de Resistência contra efeitos.' },
		{ name: 'Regeneração', description: 'Recupera PV todo turno: 1PV ou 3PV dependendo do nível.' },
		{ name: 'Invisível', description: 'Gasta 3PM para ficar invisível. +Ganho em se esconder, inimigos têm Perda.' },
		{ name: '+Vida', description: 'Cada ponto dá +10 PV. Pode comprar várias vezes para aumentar mais.' },
		{ name: 'Vigoroso', description: 'Você é mais resistente. +2 em testes de saúde física. Pode gastar 2PM para garantir crítico.' }
	],
	disadvantages: [
		{ name: 'Ambiente', description: 'Só funciona bem em certo ambiente. Fora dele, pode ter Perda.' },
		{ name: 'Amnésia', description: 'Não lembra quem é. Mestre controla a ficha em segredo.' },
		{ name: 'Antipático', description: 'Perda em testes sociais. Sem críticos.' },
		{ name: 'Atrapalhado', description: 'Perda em testes de coordenação/agilidade. Sem críticos.' },
		{ name: 'Fracote', description: 'Fraco fisicamente. Perda em testes de esforço. Sem críticos.' },
		{ name: 'Frágil', description: 'Pouca resistência. Perda em saúde/doenças. Sem críticos.' },
		{ name: 'Fraqueza', description: 'Vulnerável a algo específico (incomum ou comum).' },
		{ name: 'Lento', description: 'Perda em iniciativa e gasta mais movimento.' },
		{ name: 'Monstruoso', description: 'Aparência grotesca. Perda em iniciativa e sociais.' }
	],
	tricks: [
		{ name: 'Barreira Mística', description: 'Defesa mágica (1PM). Pode usar Mística no lugar de Luta.' },
		{ name: 'Dobrar Elemento', description: 'Controla um elemento (fogo, água, ar, terra, luz, trevas).' },
		{ name: 'Golpes de Artes Marciais', description: 'Escolhe 2 golpes especiais como Derrubar, Finta, Atordoante.' },
		{ name: 'Raio Místico', description: 'Ataque mágico (1PM = ataque com Mística ou Luta).' },
		{ name: 'Super-Movimento', description: 'Andar em paredes/teto, pular muito longe, correr sobre água.' }
	]
};

// ========== Character State ========== 
const character = {
	name: '',
	archetype: '',
	poder: 0,
	habilidade: 0,
	resistencia: 0,
	skills: [],
	offensiveAdvantages: [],
	defensiveAdvantages: [],
	disadvantages: [],
	tricks: []
};

// ========== Initialize ========== 
function init() {
	// Populate archetypes
	const select = document.getElementById('char-archetype');
	gameData.archetypes.forEach(arch => {
		const option = document.createElement('option');
		option.value = arch;
		option.textContent = arch;
		select.appendChild(option);
	});


	// Populate skills
	const skillsContainer = document.getElementById('skills-container');
	gameData.skills.forEach((skill, index) => {
		const item = document.createElement('div');
		item.className = 'skill-item';
		item.innerHTML = `
			<input type="checkbox" id="skill-${index}" value="${skill.name}">
			<div class="skill-content">
				<div class="skill-name" data-translate="3det_skill_${index}">${skill.name}</div>
				<div class="skill-description" data-translate="3det_skilldesc_${index}">${skill.description}</div>
			</div>
		`;
		skillsContainer.appendChild(item);
	});


	// Populate offensive advantages
	const offensiveContainer = document.getElementById('offensive-container');
	gameData.offensiveAdvantages.forEach((adv, index) => {
		const item = document.createElement('div');
		item.className = 'advantage-item';
		item.innerHTML = `
			<input type="checkbox" id="off-${index}" value="${adv.name}">
			<div class="advantage-content">
				<div class="advantage-name" data-translate="3det_offadv_${index}">${adv.name}</div>
				<div class="advantage-description" data-translate="3det_offadvdesc_${index}">${adv.description}</div>
			</div>
		`;
		offensiveContainer.appendChild(item);
	});


	// Populate defensive advantages
	const defensiveContainer = document.getElementById('defensive-container');
	gameData.defensiveAdvantages.forEach((adv, index) => {
		const item = document.createElement('div');
		item.className = 'advantage-item';
		item.innerHTML = `
			<input type="checkbox" id="def-${index}" value="${adv.name}">
			<div class="advantage-content">
				<div class="advantage-name" data-translate="3det_defadv_${index}">${adv.name}</div>
				<div class="advantage-description" data-translate="3det_defadvdesc_${index}">${adv.description}</div>
			</div>
		`;
		defensiveContainer.appendChild(item);
	});


	// Populate disadvantages
	const disadvantageContainer = document.getElementById('disadvantage-container');
	gameData.disadvantages.forEach((dis, index) => {
		const item = document.createElement('div');
		item.className = 'advantage-item';
		item.innerHTML = `
			<input type="checkbox" id="dis-${index}" value="${dis.name}">
			<div class="advantage-content">
				<div class="advantage-name" data-translate="3det_disadv_${index}">${dis.name}</div>
				<div class="advantage-description" data-translate="3det_disadvdesc_${index}">${dis.description}</div>
			</div>
		`;
		disadvantageContainer.appendChild(item);
	});


	// Populate tricks
	const tricksContainer = document.getElementById('tricks-container');
	gameData.tricks.forEach((trick, index) => {
		const item = document.createElement('div');
		item.className = 'advantage-item';
		item.innerHTML = `
			<input type="checkbox" id="trick-${index}" value="${trick.name}">
			<div class="advantage-content">
				<div class="advantage-name" data-translate="3det_trick_${index}">${trick.name}</div>
				<div class="advantage-description" data-translate="3det_trickdesc_${index}">${trick.description}</div>
			</div>
		`;
		tricksContainer.appendChild(item);
	});

	// Add event listeners for attributes with immediate feedback
	const attrPoder = document.getElementById('attr-poder');
	const attrHabilidade = document.getElementById('attr-habilidade');
	const attrResistencia = document.getElementById('attr-resistencia');
    
	if (attrPoder) attrPoder.addEventListener('input', updateCalculations);
	if (attrHabilidade) attrHabilidade.addEventListener('input', updateCalculations);
	if (attrResistencia) attrResistencia.addEventListener('input', updateCalculations);
    
	// Initialize calculations on load
	updateCalculations();

	// Navigation dots
	document.querySelectorAll('.nav-dot').forEach(dot => {
		dot.addEventListener('click', function() {
			const page = parseInt(this.dataset.page);
			goToPage(page);
		});
	});

	// D20 roller
	document.getElementById('d20-roller').addEventListener('click', rollD20);
}

// ========== Functions ========== 
function updateCalculations() {
	const poder = parseInt(document.getElementById('attr-poder').value) || 0;
	const habilidade = parseInt(document.getElementById('attr-habilidade').value) || 0;
	const resistencia = parseInt(document.getElementById('attr-resistencia').value) || 0;

	document.getElementById('calc-pa').textContent = poder * 1;
	document.getElementById('calc-pm').textContent = habilidade * 5;
	document.getElementById('calc-pv').textContent = resistencia * 5;

	character.poder = poder;
	character.habilidade = habilidade;
	character.resistencia = resistencia;
    
	// Save to avoid losing data on navigation
	saveCurrentData();
}

function goToPage(pageNum) {
	// Save current data
	saveCurrentData();

	// Update pages
	document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
	document.getElementById(`page-${pageNum}`).classList.add('active');

	// Update nav dots
	document.querySelectorAll('.nav-dot').forEach(dot => {
		dot.classList.remove('active');
		if (parseInt(dot.dataset.page) === pageNum) {
			dot.classList.add('active');
		}
	});

	// If going to summary page, update it
	if (pageNum === 7) {
		updateSummary();
	}

	// Scroll to top
	window.scrollTo(0, 0);
}

function saveCurrentData() {
	character.name = document.getElementById('char-name').value;
	character.archetype = document.getElementById('char-archetype').value;

	// Save skills
	character.skills = [];
	document.querySelectorAll('#skills-container input[type="checkbox"]:checked').forEach(cb => {
		character.skills.push(cb.value);
	});

	// Save offensive advantages
	character.offensiveAdvantages = [];
	document.querySelectorAll('#offensive-container input[type="checkbox"]:checked').forEach(cb => {
		character.offensiveAdvantages.push(cb.value);
	});

	// Save defensive advantages
	character.defensiveAdvantages = [];
	document.querySelectorAll('#defensive-container input[type="checkbox"]:checked').forEach(cb => {
		character.defensiveAdvantages.push(cb.value);
	});

	// Save disadvantages
	character.disadvantages = [];
	document.querySelectorAll('#disadvantage-container input[type="checkbox"]:checked').forEach(cb => {
		character.disadvantages.push(cb.value);
	});

	// Save tricks
	character.tricks = [];
	document.querySelectorAll('#tricks-container input[type="checkbox"]:checked').forEach(cb => {
		character.tricks.push(cb.value);
	});
}

function updateSummary() {
	const container = document.getElementById('summary-container');
	const pa = character.poder * 1;
	const pm = character.habilidade * 5;
	const pv = character.resistencia * 5;

	container.innerHTML = `
		<div class="summary-grid">
			<div class="summary-item">
				<strong>Nome</strong>
				${character.name || 'Não definido'}
			</div>
			<div class="summary-item">
				<strong>Arquétipo</strong>
				${character.archetype || 'Não definido'}
			</div>
			<div class="summary-item">
				<strong>Poder</strong>
				${character.poder} (PA: ${pa})
			</div>
			<div class="summary-item">
				<strong>Habilidade</strong>
				${character.habilidade} (PM: ${pm})
			</div>
			<div class="summary-item">
				<strong>Resistência</strong>
				${character.resistencia} (PV: ${pv})
			</div>
		</div>
        
		<h3>Perícias Selecionadas (${character.skills.length})</h3>
		<p>${character.skills.length > 0 ? character.skills.join(', ') : 'Nenhuma perícia selecionada'}</p>
        
		<h3>Vantagens Ofensivas (${character.offensiveAdvantages.length})</h3>
		<p>${character.offensiveAdvantages.length > 0 ? character.offensiveAdvantages.join(', ') : 'Nenhuma vantagem ofensiva selecionada'}</p>
        
		<h3>Vantagens Defensivas (${character.defensiveAdvantages.length})</h3>
		<p>${character.defensiveAdvantages.length > 0 ? character.defensiveAdvantages.join(', ') : 'Nenhuma vantagem defensiva selecionada'}</p>
        
		<h3>Desvantagens (${character.disadvantages.length})</h3>
		<p>${character.disadvantages.length > 0 ? character.disadvantages.join(', ') : 'Nenhuma desvantagem selecionada'}</p>
        
		<h3>Truques (${character.tricks.length})</h3>
		<p>${character.tricks.length > 0 ? character.tricks.join(', ') : 'Nenhum truque selecionado'}</p>
	`;
}

function rollD20() {
	const result = Math.floor(Math.random() * 20) + 1;
	let message = `🎲 Resultado: ${result}`;
	let color = '#2196f3'; // blue for normal
	if (result === 20) {
		message += ' - CRÍTICO! 🎉';
		color = '#43ea4a'; // green for critical
	} else if (result === 1) {
		message += ' - Falha Crítica! 💀';
		color = '#ff2d2d'; // red for failure
	}
	showToast(message, color);
}

function showToast(message, color) {
	const toast = document.getElementById('toast');
	toast.textContent = message;
	if (color) {
		toast.style.background = color;
	} else {
		toast.style.background = '';
	}
	toast.classList.add('show');
	setTimeout(() => {
		toast.classList.remove('show');
		toast.style.background = '';
	}, 3000);
}

function toggleSkillsInfo() {
	const infoDiv = document.getElementById('skills-info');
	if (infoDiv.style.display === 'none') {
		infoDiv.style.display = 'block';
	} else {
		infoDiv.style.display = 'none';
	}
}

function toggleArchetypeInfo() {
	const infoDiv = document.getElementById('archetype-info');
	if (infoDiv.style.display === 'none') {
		infoDiv.style.display = 'block';
	} else {
		infoDiv.style.display = 'none';
	}
}

function toggleDisadvantagesInfo() {
	const infoDiv = document.getElementById('disadvantages-info');
	if (infoDiv.style.display === 'none') {
		infoDiv.style.display = 'block';
	} else {
		infoDiv.style.display = 'none';
	}
}

function toggleAdvantagesInfo() {
	const infoDiv = document.getElementById('advantages-info');
	if (infoDiv.style.display === 'none') {
		infoDiv.style.display = 'block';
	} else {
		infoDiv.style.display = 'none';
	}
}

function toggleTricksInfo() {
	const infoDiv = document.getElementById('tricks-info');
	if (infoDiv.style.display === 'none') {
		infoDiv.style.display = 'block';
	} else {
		infoDiv.style.display = 'none';
	}
}

function toggleDefensiveAdvantagesInfo() {
	const infoDiv = document.getElementById('defensive-advantages-info');
	if (infoDiv.style.display === 'none') {
		infoDiv.style.display = 'block';
	} else {
		infoDiv.style.display = 'none';
	}
}

function toggleAttributesInfo() {
	const infoDiv = document.getElementById('attributes-info');
	if (infoDiv.style.display === 'none') {
		infoDiv.style.display = 'block';
	} else {
		infoDiv.style.display = 'none';
	}
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
