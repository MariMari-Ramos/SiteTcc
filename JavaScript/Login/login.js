/* login.js  — controla modal/login, waves e configurações.
   Inicializa só após DOMContentLoaded para garantir elementos disponíveis.
*/

document.addEventListener('DOMContentLoaded', () => {
    console.log('[login.js] DOM pronto — iniciando scripts');

    /* ========== REFERÊNCIAS DOM - LOGIN ========== */
    const overlay = document.getElementById("overlay");
    const textoModal = overlay ? overlay.querySelector("p") : null;
    const btnEntrar = document.getElementById("ButtonEntrar");
    const btnVerSenha = document.getElementById("BtnVerSenha");
    const btnFecharModal = document.getElementById("fecharModal");
    const formLogin = document.getElementById("formLogin");

    if(!overlay || !textoModal || !btnEntrar || !btnVerSenha || !formLogin) {
        console.warn('[login.js] Alguns elementos não foram encontrados no DOM. Verifique IDs.');
    } else {
        console.log('[login.js] Elementos do formulário encontrados');
    }

    function mostrarAlerta(mensagem){
        if(!overlay || !textoModal) return console.warn('overlay/textoModal ausentes');
        textoModal.textContent = mensagem;
        overlay.style.display = "flex";
    }

    function fecharModal(){
        if(!overlay) return;
        overlay.style.display = "none";
    }

    if(btnFecharModal) btnFecharModal.addEventListener('click', fecharModal);

    // Mostrar/ocultar senha
    btnVerSenha && btnVerSenha.addEventListener('click', () => {
        const input = document.getElementById('senha');
        if(!input) return;
        if(input.type === 'password'){
            input.type = 'text';
            btnVerSenha.classList.replace('bi-eye-fill', 'bi-eye-slash-fill');
        } else {
            input.type = 'password';
            btnVerSenha.classList.replace('bi-eye-slash-fill','bi-eye-fill');
        }
    });

    // Intercepta o clique do botão Entrar
    btnEntrar && btnEntrar.addEventListener('click', (ev) => {
        ev.preventDefault();
        fazerLogin();
    });

    // implementação de login (tenta fazer fetch para o action do form)
    async function fazerLogin(){
        const email = (document.getElementById("email") || {}).value || "";
        const senha = (document.getElementById("senha") || {}).value || "";

        if(email.trim() === "" || senha.trim() === ""){
            mostrarAlerta("Preencha todos os campos!");
            return;
        }

        // tenta enviar via fetch para o action do form (se o servidor responder JSON)
        try {
            const actionUrl = formLogin.getAttribute('action') || 'login.php';
            const formData = new FormData();
            formData.append('email', email.trim());
            formData.append('senha', senha.trim());

            const lembrar = (document.getElementById("CBXLembrarSenha") || {}).checked || false;
            formData.append('CBXLembrarSenha', lembrar ? '1' : '0');

            const res = await fetch(actionUrl, {
                method: 'POST',
                body: formData,
                credentials: 'same-origin'
            });

            // tenta ler JSON; se não for JSON, exibe texto
            const text = await res.text();
            try {
                const json = JSON.parse(text);
                if(json.status === 'success'){
                    mostrarAlerta(json.message || 'Login OK');
                    setTimeout(()=>location.href = json.redirect || '../A_TelaPrincipal/index.php', 1300);
                } else {
                    mostrarAlerta(json.message || 'Credenciais inválidas');
                }
            } catch(e){
                // não era JSON — usa resposta textual
                if(res.ok){
                    mostrarAlerta('Resposta do servidor recebida. Verifique rota.');
                    console.log('[login.js] resposta (texto):', text);
                } else {
                    mostrarAlerta('Erro no login: ' + res.status);
                    console.error('[login.js] erro fetch:', res.status, text);
                }
            }
        } catch (err) {
            mostrarAlerta("Erro inesperado: " + err);
            console.error('[login.js] fetch erro:', err);
        }
    }

    /* ========== CANVAS WAVES ==================== */
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');
    let wavesEnabled = true;
    let animationFrameId = null;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Posição do mouse com suavização (easing)
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetMouseX = window.innerWidth / 2;
    let targetMouseY = window.innerHeight / 2;
    const easeAmount = 0.08;

    // Flag para controlar se a interatividade com o mouse está habilitada
    let interactive = true;
    let isFormFocused = false;
    // Flag para indicar se o modal de configurações está aberto (bloqueia interatividade das waves)
    let isSettingsOpen = false;
    let interactiveTransition = 1;
    const transitionSpeed = 0.06;

    // Controle de pressão do mouse (mouse press boost)
    let isMousePressed = false;
    let speedBoost = 0;
    const maxSpeedBoost = 4.0;        // Aumentado de 2.5 para 4.0 (60% mais rápido)
    const boostDecayRate = 0.95;
    const boostBuildRate = 0.15;      // Aumentado de 0.08 para 0.15 (quase 2x mais rápido)

    // Controle de direção das ondas
    let waveDirection = 1;
    let targetWaveDirection = 1;
    const directionEaseAmount = 0.1;

    // Sistema de cores quentes ao clicar nas ondas
    let heatIntensity = 0;
    const heatDecayRate = 0.96;
    
    // Sistema de amplitude do clique (labaredas)
    let clickAmplitude = 0;
    const maxClickAmplitude = 1.5;
    const clickAmplitudeDecayRate = 0.93;
    
    // Sistema de altura das ondas ao clicar
    let clickHeight = 0;
    let targetClickHeight = 0;
    const clickHeightEaseAmount = 0.12;

    // Paletas de cores das waves lidas de variáveis CSS para seguir o tema
    let coresBase = [];
    let coresQuentes = [];

    function getCssVar(name) {
        // Importante: as variáveis do tema escuro estão definidas em body.dark-theme.
        // Ler do body garante que pegamos os valores atuais do tema.
        const sourceEl = document.body || document.documentElement;
        const cs = getComputedStyle(sourceEl);
        let val = cs.getPropertyValue(name).trim();
        if (!val) {
            // Fallback para :root caso alguma variável não esteja no body
            const rootVal = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
            return rootVal;
        }
        return val;
    }

    function setWavePalettesFromCSS() {
        coresBase = [
            getCssVar('--wave1') || 'rgba(173,216,230,0.7)',
            getCssVar('--wave2') || 'rgba(135,206,235,0.6)',
            getCssVar('--wave3') || 'rgba(30,144,255,0.5)'
        ];
        coresQuentes = [
            getCssVar('--waveHot1') || 'rgba(0,170,255,0.9)',
            getCssVar('--waveHot2') || 'rgba(0,140,255,0.85)',
            getCssVar('--waveHot3') || 'rgba(0,100,255,0.8)'
        ];
        // Atualiza cores nas ondas existentes
        ondas.forEach((o, i) => {
            o.corBase = coresBase[i % coresBase.length];
            o.corQuente = coresQuentes[i % coresQuentes.length];
        });
    }

    // Função para interpolar cores
    function interpolarCor(frio, quente, t) {
        const regexFrio = /rgba\((\d+),(\d+),(\d+),([\d.]+)\)/;
        const regexQuente = /rgba\((\d+),(\d+),(\d+),([\d.]+)\)/;
        
        const matchFrio = frio.match(regexFrio);
        const matchQuente = quente.match(regexQuente);
        
        if (!matchFrio || !matchQuente) return frio;
        
        const r1 = parseInt(matchFrio[1]);
        const g1 = parseInt(matchFrio[2]);
        const b1 = parseInt(matchFrio[3]);
        const a1 = parseFloat(matchFrio[4]);
        
        const r2 = parseInt(matchQuente[1]);
        const g2 = parseInt(matchQuente[2]);
        const b2 = parseInt(matchQuente[3]);
        const a2 = parseFloat(matchQuente[4]);
        
        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);
        const a = a1 + (a2 - a1) * t;
        
        return `rgba(${r},${g},${b},${a})`;
    }

    // Configuração das ondas
    const ondas = [];
    for (let i = 0; i < 3; i++) {
        ondas.push({
            amp: 45 + i * 8,
            freq: 0.0018 + i * 0.0008,
            vel: 0.0015 + i * 0.0012,
            fase: Math.random() * 1000,
            corBase: '#000000',
            corQuente: '#000000',
            corAtual: '#000000',
            targetAmp: 45 + i * 8,
            ampEase: 0.05
        });
    }

    // Inicializa as paletas com base nas variáveis CSS
    setWavePalettesFromCSS();
    ondas.forEach((o, i) => {
        o.corBase = coresBase[i];
        o.corQuente = coresQuentes[i];
        o.corAtual = o.corBase;
    });

    // Atualiza posição alvo do mouse
    window.addEventListener('mousemove', e => {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;

        const centerX = window.innerWidth / 2;
        if (e.clientX < centerX) {
            targetWaveDirection = 1;
        } else if (e.clientX > centerX) {
            targetWaveDirection = -1;
        }
    });

    // Detecta pressão do botão esquerdo do mouse
    window.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
            isMousePressed = true;
            
            // Só aplica o efeito de clique se estiver habilitado nas configurações
            const settings = loadSettings();
            if (!isFormFocused && interactive && wavesEnabled && settings.enableClickEffect) {
                heatIntensity = 1.0;
                clickAmplitude = maxClickAmplitude;
                targetClickHeight = -(canvas.height / 2 - e.clientY);
                console.log('[waves] Clique nas ondas — efeito de labareda ativado');
            }
            
            // Log para o boost (efeito de segurar)
            if (settings.enableHoldEffect) {
                console.log('[waves] Mouse pressionado — BOOST começando a aumentar');
            }
        }
    });

    // Detecta soltura do botão esquerdo do mouse
    window.addEventListener('mouseup', (e) => {
        if (e.button === 0) {
            isMousePressed = false;
            console.log('[waves] Mouse liberado — boost começará a decair');
        }
    });

    // Seleciona a caixa de login
    const loginBox = document.querySelector('.CaixaLogin') || document.querySelector('.login');

    if (formLogin) {
        formLogin.addEventListener('focusin', (e) => {
            if (e.target.matches('input, textarea, button')) {
                isFormFocused = true;
                interactive = false;
                console.log('[waves] Elemento focado — interactive OFF');
            }
        }, true);

        formLogin.addEventListener('focusout', (e) => {
            if (e.target.matches('input, textarea, button')) {
                isFormFocused = false;
                if (loginBox && !loginBox.matches(':hover')) {
                    interactive = true;
                    console.log('[waves] Elemento desfocado — interactive ON');
                }
            }
        }, true);
    }

    if (loginBox) {
        loginBox.addEventListener('mouseenter', () => {
            interactive = false;
            console.log('[waves] Mouse entrou na caixa — interactive OFF');
        });
        
        loginBox.addEventListener('mouseleave', () => {
            if (!isFormFocused) {
                interactive = true;
                console.log('[waves] Mouse saiu da caixa — interactive ON');
            }
        });
    }

    if (loginBox) {
        loginBox.addEventListener('touchstart', () => {
            interactive = false;
        }, { passive: true });

        loginBox.addEventListener('touchend', () => {
            if (!isFormFocused) {
                interactive = true;
            }
        }, { passive: true });
    }

    let lastFrameTime = Date.now();

    function desenhar() {
        if (!wavesEnabled) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            animationFrameId = requestAnimationFrame(desenhar);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const currentTime = Date.now();
        const deltaTime = (currentTime - lastFrameTime) / 1000;
        lastFrameTime = currentTime;

    // Quando o modal de configurações estiver aberto, força a transição para estado não interativo
    const targetTransition = (interactive && !isSettingsOpen) ? 1 : 0;
        interactiveTransition += (targetTransition - interactiveTransition) * transitionSpeed;

        mouseX += (targetMouseX - mouseX) * easeAmount;
        mouseY += (targetMouseY - mouseY) * easeAmount;

        waveDirection += (targetWaveDirection - waveDirection) * directionEaseAmount;

        const smoothMouseY = window.innerHeight / 2 + (mouseY - window.innerHeight / 2) * interactiveTransition;

        // Só aplica o boost (efeito de segurar) se estiver habilitado
        const settings = loadSettings();
        if (settings.enableHoldEffect) {
            if (isMousePressed && speedBoost < maxSpeedBoost) {
                speedBoost += boostBuildRate;
                if (speedBoost > maxSpeedBoost) speedBoost = maxSpeedBoost;
            } else if (!isMousePressed && speedBoost > 0) {
                speedBoost *= boostDecayRate;
                if (speedBoost < 0.01) speedBoost = 0;
            }
        } else {
            // Se desabilitado, mantém o boost em 0
            speedBoost = 0;
        }

        if (heatIntensity > 0) {
            heatIntensity *= heatDecayRate;
            if (heatIntensity < 0.01) heatIntensity = 0;
        }

        if (clickAmplitude > 0) {
            clickAmplitude *= clickAmplitudeDecayRate;
            if (clickAmplitude < 0.01) clickAmplitude = 0;
        }

        clickHeight += (targetClickHeight - clickHeight) * clickHeightEaseAmount;

        ondas.forEach((o, idx) => {
            let newTargetAmp;
            const influence = Math.abs(smoothMouseY - canvas.height / 2) * 0.03;
            const extraAmp = clickAmplitude * (60 + idx * 10);
            newTargetAmp = (45 + idx * 8) + influence * interactiveTransition + extraAmp;

            o.targetAmp = newTargetAmp;
            o.amp += (o.targetAmp - o.amp) * o.ampEase;

            const verticalInfluence = ((smoothMouseY - canvas.height / 2) * 0.04 * (idx + 1) * interactiveTransition) + clickHeight;

            o.corAtual = interpolarCor(o.corBase, o.corQuente, heatIntensity);

            ctx.beginPath();
            
            const freqMultiplier = 1 + clickAmplitude * 0.8;
            const adjustedFreq = o.freq * freqMultiplier;
            
            for (let x = 0; x <= canvas.width; x += 10) {
                const baseY = Math.sin(x * adjustedFreq + o.fase) * o.amp;
                const harmonic = Math.sin(x * adjustedFreq * 2.5 + o.fase) * (o.amp * clickAmplitude * 0.6);
                const y = baseY + harmonic + canvas.height / 2 + verticalInfluence;
                
                x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();

            const gradBottom = ctx.createLinearGradient(0, 0, 0, canvas.height);
            
            const corMeio = interpolarCor(o.corBase, coresQuentes[1] || o.corBase, heatIntensity);
            const corBorda = interpolarCor(o.corBase, coresQuentes[2] || o.corBase, heatIntensity);
            
            gradBottom.addColorStop(0, o.corBase);
            gradBottom.addColorStop(0.5, corMeio);
            gradBottom.addColorStop(1, corBorda);
            
            ctx.fillStyle = gradBottom;
            ctx.fill();

            const baseSpeed = 0.8;
            const speedBoostMultiplier = 1 + speedBoost;
            const speedMultiplier = baseSpeed * speedBoostMultiplier * (1 + Math.sin(Date.now() * 0.0005) * 0.1);
            
            o.fase += o.vel * speedMultiplier * waveDirection;
        });

        animationFrameId = requestAnimationFrame(desenhar);
    }

    desenhar();

    /* ========== CONFIGURAÇÕES DA PÁGINA ========== */
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');

    // Botão de configurações - desativa interatividade das waves ao passar o mouse
    if (settingsBtn) {
        settingsBtn.addEventListener('mouseenter', () => {
            interactive = false;
            console.log('[waves] Mouse entrou no botão de configurações — interactive OFF');
        });
        
        settingsBtn.addEventListener('mouseleave', () => {
            if (!isFormFocused && !isSettingsOpen) {
                interactive = true;
                console.log('[waves] Mouse saiu do botão de configurações — interactive ON');
            }
        });
    }

    // Configurações padrão
    const defaultSettings = {
        enableWaves: true,
        theme: 'light',
        enableClickEffect: true,
        enableHoldEffect: true,
        highContrast: false,
        largerText: false
    };

    // Carregar configurações do localStorage
    function loadSettings() {
        const saved = localStorage.getItem('loginPageSettings');
        return saved ? JSON.parse(saved) : defaultSettings;
    }

    // Salvar configurações no localStorage
    function saveSettings() {
        const enableWavesEl = document.getElementById('enableWaves');
        const themeEl = document.querySelector('input[name="theme"]:checked');
        const enableClickEffectEl = document.getElementById('enableClickEffect');
        const enableHoldEffectEl = document.getElementById('enableHoldEffect');
        const highContrastEl = document.getElementById('highContrast');
        const largerTextEl = document.getElementById('largerText');

        if (!enableWavesEl || !themeEl || !enableClickEffectEl || !enableHoldEffectEl || !highContrastEl || !largerTextEl) {
            console.error('[login.js] Alguns elementos de configuração não foram encontrados');
            return;
        }

        const settings = {
            enableWaves: enableWavesEl.checked,
            theme: themeEl.value,
            enableClickEffect: enableClickEffectEl.checked,
            enableHoldEffect: enableHoldEffectEl.checked,
            highContrast: highContrastEl.checked,
            largerText: largerTextEl.checked
        };
        localStorage.setItem('loginPageSettings', JSON.stringify(settings));
        applySettings(settings);
        console.log('[Configurações-Login] Salvas:', settings);
    }

    // Aplicar configurações
    function applySettings(settings) {
        // Limpa classes anteriores
        document.body.classList.remove('light-theme', 'dark-theme', 'large-text', 'high-contrast');
        document.documentElement.classList.remove('light-theme', 'dark-theme', 'large-text', 'high-contrast');

        // Ondas
        wavesEnabled = settings.enableWaves;
        if (canvas) {
            if (settings.enableWaves) {
                // Transição suave ao ativar (mesma duração que desativar)
                canvas.style.transition = 'opacity 1.5s ease-out';
                canvas.style.display = 'block';
                // Pequeno delay para garantir que display:block seja aplicado antes do fade
                setTimeout(() => {
                    canvas.style.opacity = '1';
                }, 10);
                console.log('[Configurações-Login] Ondas ATIVADAS');
            } else {
                // Transição suave ao desativar (mesma duração que ativar)
                canvas.style.transition = 'opacity 1.5s ease-out';
                canvas.style.opacity = '0';
                
                // Aguarda a transição terminar antes de esconder
                setTimeout(() => {
                    if (!wavesEnabled) {
                        canvas.style.display = 'none';
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        
                        // Reseta todos os efeitos para estado inicial
                        heatIntensity = 0;
                        clickAmplitude = 0;
                        clickHeight = 0;
                        targetClickHeight = 0;
                        speedBoost = 0;
                    }
                }, 1500); // 1.5 segundos = duração da transição
                console.log('[Configurações-Login] Ondas DESATIVADAS');
            }
        }

        // Tema
        if (settings.theme === 'dark') {
            document.body.classList.add('dark-theme');
            document.documentElement.classList.add('dark-theme');
            console.log('[Configurações-Login] Tema ESCURO ativado');
        } else if (settings.theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.body.classList.add('dark-theme');
                document.documentElement.classList.add('dark-theme');
                console.log('[Configurações-Login] Tema AUTOMÁTICO — ESCURO');
            } else {
                document.body.classList.add('light-theme');
                document.documentElement.classList.add('light-theme');
                console.log('[Configurações-Login] Tema AUTOMÁTICO — CLARO');
            }
        } else {
            document.body.classList.add('light-theme');
            document.documentElement.classList.add('light-theme');
            console.log('[Configurações-Login] Tema CLARO ativado');
        }

        // Sempre que o tema mudar, atualiza as cores das waves a partir das variáveis CSS
        setWavePalettesFromCSS();

        // Texto maior
        if (settings.largerText) {
            document.body.classList.add('large-text');
            document.documentElement.classList.add('large-text');
            console.log('[Configurações-Login] Texto AUMENTADO');
        } else {
            console.log('[Configurações-Login] Texto NORMAL');
        }

        // Alto contraste
        if (settings.highContrast) {
            document.body.classList.add('high-contrast');
            document.documentElement.classList.add('high-contrast');
            console.log('[Configurações-Login] Alto contraste ATIVADO');
        } else {
            console.log('[Configurações-Login] Alto contraste DESATIVADO');
        }

        // Efeitos de clique (controla se os efeitos visuais ao clicar estão ativos)
        // Essas flags são consultadas nos event listeners de mouse
        console.log('[Configurações-Login] Efeito ao clicar:', settings.enableClickEffect ? 'ATIVADO' : 'DESATIVADO');
        console.log('[Configurações-Login] Efeito ao segurar:', settings.enableHoldEffect ? 'ATIVADO' : 'DESATIVADO');
    }

    // Restaurar padrões
    function restoreDefaults() {
        if (confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
            localStorage.removeItem('loginPageSettings');
            
            const enableWavesEl = document.getElementById('enableWaves');
            const enableClickEffectEl = document.getElementById('enableClickEffect');
            const enableHoldEffectEl = document.getElementById('enableHoldEffect');
            const highContrastEl = document.getElementById('highContrast');
            const largerTextEl = document.getElementById('largerText');
            const themeLightEl = document.querySelector('input[value="light"]');

            if (enableWavesEl) enableWavesEl.checked = defaultSettings.enableWaves;
            if (enableClickEffectEl) enableClickEffectEl.checked = defaultSettings.enableClickEffect;
            if (enableHoldEffectEl) enableHoldEffectEl.checked = defaultSettings.enableHoldEffect;
            if (highContrastEl) highContrastEl.checked = defaultSettings.highContrast;
            if (largerTextEl) largerTextEl.checked = defaultSettings.largerText;
            if (themeLightEl) themeLightEl.checked = true;

            saveSettings();
            alert('Configurações restauradas!');
            console.log('[Configurações-Login] Padrões restaurados');
        }
    }

    // Abrir modal
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.add('active');
            // Bloqueia interatividade das waves enquanto o modal estiver aberto
            isSettingsOpen = true;
            interactive = false;
            // Zera efeitos transitórios das waves ao abrir o modal
            isMousePressed = false;
            speedBoost = 0;
            heatIntensity = 0;
            clickAmplitude = 0;
            targetClickHeight = 0;
            console.log('[Configurações-Login] Modal aberto — interatividade das waves DESATIVADA');
        });
    }

    // Fechar modal com animação
    function closeModal() {
        const settingsContent = settingsModal.querySelector('.settings-content');
        
        // Adiciona classes de fechamento para trigger das animações
        settingsModal.classList.add('closing');
        if (settingsContent) {
            settingsContent.classList.add('closing');
        }
        
        // Aguarda a animação terminar antes de remover completamente
        setTimeout(() => {
            settingsModal.classList.remove('active', 'closing');
            if (settingsContent) {
                settingsContent.classList.remove('closing');
            }
            
            isSettingsOpen = false;
            // Restaura a interatividade somente se o formulário não estiver focado
            // e o mouse não estiver sobre a caixa de login
            if (!isFormFocused) {
                const loginBox = document.querySelector('.CaixaLogin') || document.querySelector('.login');
                if (!(loginBox && loginBox.matches(':hover'))) {
                    interactive = true;
                }
            }
            console.log('[Configurações-Login] Modal fechado — interatividade das waves conforme contexto');
        }, 300); // 300ms = duração da animação
    }

    if (closeSettings) {
        closeSettings.addEventListener('click', closeModal);
    }

    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', () => {
            saveSettings();
            closeModal();
        });
    }

    // Fechar ao clicar fora
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                closeModal();
            }
        });
    }

    // Restaurar padrões
    if (resetSettings) {
        resetSettings.addEventListener('click', restoreDefaults);
    }

    // Salvar ao mudar qualquer opção
    document.querySelectorAll('.settings-option input').forEach(input => {
        input.addEventListener('change', saveSettings);
    });

    // Permitir clicar na caixa toda para marcar/desmarcar checkbox
    document.querySelectorAll('.settings-option').forEach(option => {
        option.addEventListener('click', (e) => {
            // Evita duplo clique se já clicou diretamente no input
            if (e.target.tagName === 'INPUT') return;
            
            const input = option.querySelector('input[type="checkbox"], input[type="radio"]');
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = !input.checked;
                    input.dispatchEvent(new Event('change'));
                } else if (input.type === 'radio') {
                    input.checked = true;
                    input.dispatchEvent(new Event('change'));
                }
            }
        });
    });

    // Carregar configurações ao iniciar
    const currentSettings = loadSettings();
    const enableWavesEl = document.getElementById('enableWaves');
    const enableClickEffectEl = document.getElementById('enableClickEffect');
    const enableHoldEffectEl = document.getElementById('enableHoldEffect');
    const highContrastEl = document.getElementById('highContrast');
    const largerTextEl = document.getElementById('largerText');
    const themeEl = document.querySelector(`input[value="${currentSettings.theme}"]`);

    if (enableWavesEl) enableWavesEl.checked = currentSettings.enableWaves;
    if (enableClickEffectEl) enableClickEffectEl.checked = currentSettings.enableClickEffect;
    if (enableHoldEffectEl) enableHoldEffectEl.checked = currentSettings.enableHoldEffect;
    if (highContrastEl) highContrastEl.checked = currentSettings.highContrast;
    if (largerTextEl) largerTextEl.checked = currentSettings.largerText;
    if (themeEl) themeEl.checked = true;

    applySettings(currentSettings);
});