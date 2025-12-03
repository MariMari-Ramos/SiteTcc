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

// Simple i18n helper for JS-generated strings
function T(key) {
	try {
		return (window.I18N && I18N.dict && typeof I18N.dict[key] === 'string') ? I18N.dict[key] : key;
	} catch (_) {
		return key;
	}
}

// ========== Initialize ========== 
function init() {
	// Populate archetypes
	const select = document.getElementById('char-archetype');
	gameData.archetypes.forEach((arch, index) => {
		const option = document.createElement('option');
		option.value = arch;
		option.textContent = arch;
		option.setAttribute('data-translate', `3det_arch_${index}`);
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

	// Apply i18n after dynamic content is created
	if (window.applyI18n && window.I18N && I18N.dict) {
		applyI18n(I18N.dict);
	}
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

	// Announce the current page heading via AutoRead (if enabled)
	try {
		if (window.AutoRead && typeof window.AutoRead.speak === 'function') {
			const activePage = document.getElementById(`page-${pageNum}`);
			const h2 = activePage ? activePage.querySelector('.card h2') : null;
			if (h2 && h2.textContent) {
				window.AutoRead.speak(h2.textContent.trim());
			}
		}
	} catch(_) {}

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
				<strong data-translate="3det_sum_nome">Nome</strong>
				${character.name || '<span data-translate="3det_sum_nao_definido">Não definido</span>'}
			</div>
			<div class="summary-item">
				<strong data-translate="3det_sum_arquetipo">Arquétipo</strong>
				${character.archetype || '<span data-translate="3det_sum_nao_definido">Não definido</span>'}
			</div>
			<div class="summary-item">
				<strong data-translate="3det_sum_poder">Poder</strong>
				${character.poder} (PA: ${pa})
			</div>
			<div class="summary-item">
				<strong data-translate="3det_sum_habilidade">Habilidade</strong>
				${character.habilidade} (PM: ${pm})
			</div>
			<div class="summary-item">
				<strong data-translate="3det_sum_resistencia">Resistência</strong>
				${character.resistencia} (PV: ${pv})
			</div>
		</div>
        
		<h3 data-translate="3det_sum_pericias_sel">Perícias Selecionadas</h3>
		<p>${character.skills.length > 0 ? character.skills.join(', ') : '<span data-translate="3det_sum_nenhuma_pericia">Nenhuma perícia selecionada</span>'}</p>
        
		<h3 data-translate="3det_sum_vant_ofensivas">Vantagens Ofensivas</h3>
		<p>${character.offensiveAdvantages.length > 0 ? character.offensiveAdvantages.join(', ') : '<span data-translate="3det_sum_nenhuma_vant_ofensiva">Nenhuma vantagem ofensiva selecionada</span>'}</p>
        
		<h3 data-translate="3det_sum_vant_defensivas">Vantagens Defensivas</h3>
		<p>${character.defensiveAdvantages.length > 0 ? character.defensiveAdvantages.join(', ') : '<span data-translate="3det_sum_nenhuma_vant_defensiva">Nenhuma vantagem defensiva selecionada</span>'}</p>
        
		<h3 data-translate="3det_sum_desvantagens">Desvantagens</h3>
		<p>${character.disadvantages.length > 0 ? character.disadvantages.join(', ') : '<span data-translate="3det_sum_nenhuma_desvantagem">Nenhuma desvantagem selecionada</span>'}</p>
        
		<h3 data-translate="3det_sum_truques">Truques</h3>
		<p>${character.tricks.length > 0 ? character.tricks.join(', ') : '<span data-translate="3det_sum_nenhum_truque">Nenhum truque selecionado</span>'}</p>
	`;

	// Translate the newly injected summary content
	if (window.applyI18n && window.I18N && I18N.dict) {
		applyI18n(I18N.dict);
	}
}

function rollD20() {
	const result = Math.floor(Math.random() * 20) + 1;
	let message = `${T('3det_d20_resultado')} ${result}`;
	let color = '#2196f3'; // blue for normal
	if (result === 20) {
		message += T('3det_d20_critico');
		color = '#43ea4a'; // green for critical
	} else if (result === 1) {
		message += T('3det_d20_falha_critica');
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

	// Speak the toast message if auto-read is enabled
	try {
		if (window.AutoRead && typeof window.AutoRead.speak === 'function') {
			window.AutoRead.speak(String(message || ''));
		}
	} catch (_) {}

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

// ==================== AUTO READ (SPEECH SYNTHESIS) ====================
// Replica da funcionalidade usada nas outras telas (PrincipalTela)
// Lê palavras ao clicar e sentenças ao selecionar texto; respeita localStorage 'autoRead'
(function(global){
	if (global.AutoRead) {
		// Já existe (carregado por outra tela); apenas inicializa aqui
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
			} catch(e) {
				// silencioso
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
			} catch(err) {
				// silencioso
			}
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
	try {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => AutoRead.init());
		} else {
			AutoRead.init();
		}
	} catch(_) {}
})(window);
