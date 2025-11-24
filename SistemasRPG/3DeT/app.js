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
            defensiveAdvantages: []
        };

        // ========== Initialize ==========
        function init() {
            console.log('Iniciando aplicação...');
            
            // Populate archetypes
            const select = document.getElementById('char-archetype');
            gameData.archetypes.forEach(arch => {
                const option = document.createElement('option');
                option.value = arch;
                option.textContent = arch;
                select.appendChild(option);
            });
            console.log('Arquétipos carregados');

            // Populate skills
            const skillsContainer = document.getElementById('skills-container');
            gameData.skills.forEach((skill, index) => {
                const item = document.createElement('div');
                item.className = 'skill-item';
                item.innerHTML = `
                    <input type="checkbox" id="skill-${index}" value="${skill.name}">
                    <div class="skill-content">
                        <div class="skill-name">${skill.name}</div>
                        <div class="skill-description">${skill.description}</div>
                    </div>
                `;
                skillsContainer.appendChild(item);
            });
            console.log('Perícias carregadas');

            // Populate offensive advantages
            const offensiveContainer = document.getElementById('offensive-container');
            gameData.offensiveAdvantages.forEach((adv, index) => {
                const item = document.createElement('div');
                item.className = 'advantage-item';
                item.innerHTML = `
                    <input type="checkbox" id="off-${index}" value="${adv.name}">
                    <div class="advantage-content">
                        <div class="advantage-name">${adv.name}</div>
                        <div class="advantage-description">${adv.description}</div>
                    </div>
                `;
                offensiveContainer.appendChild(item);
            });
            console.log('Vantagens ofensivas carregadas');

            // Populate defensive advantages
            const defensiveContainer = document.getElementById('defensive-container');
            gameData.defensiveAdvantages.forEach((adv, index) => {
                const item = document.createElement('div');
                item.className = 'advantage-item';
                item.innerHTML = `
                    <input type="checkbox" id="def-${index}" value="${adv.name}">
                    <div class="advantage-content">
                        <div class="advantage-name">${adv.name}</div>
                        <div class="advantage-description">${adv.description}</div>
                    </div>
                `;
                defensiveContainer.appendChild(item);
            });
            console.log('Vantagens defensivas carregadas');

            // Add event listeners for attributes
            const attrPoder = document.getElementById('attr-poder');
            const attrHabilidade = document.getElementById('attr-habilidade');
            const attrResistencia = document.getElementById('attr-resistencia');
            
            if (attrPoder) {
                attrPoder.addEventListener('input', updateCalculations);
                console.log('Listener de Poder adicionado');
            }
            if (attrHabilidade) {
                attrHabilidade.addEventListener('input', updateCalculations);
                console.log('Listener de Habilidade adicionado');
            }
            if (attrResistencia) {
                attrResistencia.addEventListener('input', updateCalculations);
                console.log('Listener de Resistência adicionado');
            }
            
            // Initialize calculations
            updateCalculations();

            // Navigation dots
            document.querySelectorAll('.nav-dot').forEach(dot => {
                dot.addEventListener('click', function() {
                    const page = parseInt(this.dataset.page);
                    console.log('Navegando para página:', page);
                    goToPage(page);
                });
            });
            console.log('Navegação por dots configurada');

            // D20 roller
            const d20Button = document.getElementById('d20-roller');
            if (d20Button) {
                d20Button.addEventListener('click', rollD20);
                console.log('Botão D20 configurado');
            }
            
            console.log('Inicialização completa!');
        }

        // ========== Functions ==========
        function updateCalculations() {
            const poder = parseInt(document.getElementById('attr-poder').value) || 0;
            const habilidade = parseInt(document.getElementById('attr-habilidade').value) || 0;
            const resistencia = parseInt(document.getElementById('attr-resistencia').value) || 0;

            const pa = poder * 1;
            const pm = habilidade * 5;
            const pv = resistencia * 5;

            document.getElementById('calc-pa').textContent = pa;
            document.getElementById('calc-pm').textContent = pm;
            document.getElementById('calc-pv').textContent = pv;

            character.poder = poder;
            character.habilidade = habilidade;
            character.resistencia = resistencia;
            
            console.log('Cálculos atualizados:', { pa, pm, pv });
        }

        function goToPage(pageNum) {
            console.log('Mudando para página:', pageNum);
            
            // Save current data
            saveCurrentData();

            // Update pages
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            const targetPage = document.getElementById(`page-${pageNum}`);
            if (targetPage) {
                targetPage.classList.add('active');
                console.log('Página ativada:', pageNum);
            } else {
                console.error('Página não encontrada:', pageNum);
            }

            // Update nav dots
            document.querySelectorAll('.nav-dot').forEach(dot => {
                dot.classList.remove('active');
                if (parseInt(dot.dataset.page) === pageNum) {
                    dot.classList.add('active');
                }
            });

            // If going to summary page, update it
            if (pageNum === 5) {
                updateSummary();
            }

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
            
            console.log('Dados salvos:', character);
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
            `;
        }

        function rollD20() {
            const result = Math.floor(Math.random() * 20) + 1;
            let message = `🎲 Resultado: ${result}`;
            
            if (result === 20) {
                message += ' - CRÍTICO! 🎉';
            } else if (result === 1) {
                message += ' - Falha Crítica! 💀';
            }
            
            showToast(message);
            console.log('D20 rolado:', result);
        }

        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // Initialize on load
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM carregado, iniciando...');
            init();
        });