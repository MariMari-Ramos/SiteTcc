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
    let interactiveTransition = 1;
    const transitionSpeed = 0.06;

    // Controle de pressão do mouse (mouse press boost)
    let isMousePressed = false;
    let speedBoost = 0;
    const maxSpeedBoost = 2.5;
    const boostDecayRate = 0.95;
    const boostBuildRate = 0.08;

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

    // Paleta de cores base (frio)
    const coresBase = [
        'rgba(255,192,192,0.7)',
        'rgba(255,170,150,0.6)',
        'rgba(255,210,180,0.5)'
    ];

    // Paleta de cores quentes
    const coresQuentes = [
        'rgba(255,200,0,0.9)',
        'rgba(255,140,0,0.85)',
        'rgba(255,69,0,0.8)'
    ];

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
            corBase: coresBase[i],
            corQuente: coresQuentes[i],
            corAtual: coresBase[i],
            targetAmp: 45 + i * 8,
            ampEase: 0.05
        });
    }

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
            
            if (!isFormFocused && interactive && wavesEnabled) {
                heatIntensity = 1.0;
                clickAmplitude = maxClickAmplitude;
                targetClickHeight = -(canvas.height / 2 - e.clientY);
                console.log('[waves] Clique nas ondas — efeito de labareda ativado');
            }
            console.log('[waves] Mouse pressionado — BOOST começando a aumentar');
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

        const targetTransition = interactive ? 1 : 0;
        interactiveTransition += (targetTransition - interactiveTransition) * transitionSpeed;

        mouseX += (targetMouseX - mouseX) * easeAmount;
        mouseY += (targetMouseY - mouseY) * easeAmount;

        waveDirection += (targetWaveDirection - waveDirection) * directionEaseAmount;

        const smoothMouseY = window.innerHeight / 2 + (mouseY - window.innerHeight / 2) * interactiveTransition;

        if (isMousePressed && speedBoost < maxSpeedBoost) {
            speedBoost += boostBuildRate;
            if (speedBoost > maxSpeedBoost) speedBoost = maxSpeedBoost;
        } else if (!isMousePressed && speedBoost > 0) {
            speedBoost *= boostDecayRate;
            if (speedBoost < 0.01) speedBoost = 0;
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
            
            const corMeio = interpolarCor(o.corBase, 'rgba(255,140,0,0.85)', heatIntensity);
            const corBorda = interpolarCor(o.corBase, 'rgba(255,69,0,0.9)', heatIntensity);
            
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
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const resetSettings = document.getElementById('resetSettings');

    // Configurações padrão
    const defaultSettings = {
        enableWaves: true,
        theme: 'light',
        reduceMotion: false,
        enableAnimations: true,
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
        const settings = {
            enableWaves: document.getElementById('enableWaves').checked,
            theme: document.querySelector('input[name="theme"]:checked').value,
            reduceMotion: document.getElementById('reduceMotion').checked,
            enableAnimations: document.getElementById('enableAnimations').checked,
            highContrast: document.getElementById('highContrast').checked,
            largerText: document.getElementById('largerText').checked
        };
        localStorage.setItem('loginPageSettings', JSON.stringify(settings));
        applySettings(settings);
        console.log('[Configurações-Login] Salvas:', settings);
    }

    // Aplicar configurações
    function applySettings(settings) {
        // Ondas - Desaparece completamente
        wavesEnabled = settings.enableWaves;
        if (canvas) {
            if (settings.enableWaves) {
                canvas.style.opacity = '1';
                canvas.style.pointerEvents = 'none';
                canvas.style.display = 'block';
                console.log('[Configurações-Login] Ondas ATIVADAS');
            } else {
                canvas.style.opacity = '0';
                canvas.style.pointerEvents = 'none';
                canvas.style.display = 'none';
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                console.log('[Configurações-Login] Ondas DESATIVADAS');
            }
        }

        // Tema
        if (settings.theme === 'dark') {
            document.body.style.filter = 'invert(1)';
            document.documentElement.style.filter = 'invert(1)';
        } else if (settings.theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.body.style.filter = 'invert(1)';
                document.documentElement.style.filter = 'invert(1)';
            } else {
                document.body.style.filter = 'none';
                document.documentElement.style.filter = 'none';
            }
        } else {
            document.body.style.filter = 'none';
            document.documentElement.style.filter = 'none';
        }

        // Reduzir movimento
        if (settings.reduceMotion) {
            document.documentElement.style.setProperty('--animation-duration', '0s');
            document.body.style.animation = 'none';
        } else {
            document.documentElement.style.setProperty('--animation-duration', '0.3s');
        }

        // Texto maior
        if (settings.largerText) {
            document.body.style.fontSize = '18px';
        } else {
            document.body.style.fontSize = '16px';
        }

        // Alto contraste
        if (settings.highContrast && settings.theme === 'light') {
            document.body.style.filter = 'contrast(1.3)';
        }
    }

    // Restaurar padrões
    function restoreDefaults() {
        if (confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
            localStorage.removeItem('loginPageSettings');
            document.getElementById('enableWaves').checked = defaultSettings.enableWaves;
            document.getElementById('reduceMotion').checked = defaultSettings.reduceMotion;
            document.getElementById('enableAnimations').checked = defaultSettings.enableAnimations;
            document.getElementById('highContrast').checked = defaultSettings.highContrast;
            document.getElementById('largerText').checked = defaultSettings.largerText;
            document.querySelector(`input[value="${defaultSettings.theme}"]`).checked = true;
            saveSettings();
            alert('Configurações restauradas!');
            console.log('[Configurações-Login] Padrões restaurados');
        }
    }

    // Abrir modal
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.add('active');
            console.log('[Configurações-Login] Modal aberto');
        });
    }

    // Fechar modal
    function closeModal() {
        settingsModal.classList.remove('active');
        console.log('[Configurações-Login] Modal fechado');
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

    // Carregar configurações ao iniciar
    const currentSettings = loadSettings();
    document.getElementById('enableWaves').checked = currentSettings.enableWaves;
    document.getElementById('reduceMotion').checked = currentSettings.reduceMotion;
    document.getElementById('enableAnimations').checked = currentSettings.enableAnimations;
    document.getElementById('highContrast').checked = currentSettings.highContrast;
    document.getElementById('largerText').checked = currentSettings.largerText;
    document.querySelector(`input[value="${currentSettings.theme}"]`).checked = true;
    applySettings(currentSettings);
});