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

    /* ========== CONFIGURAÇÕES - DEFINIÇÕES ========== */
    const defaultSettings = {
        enableWaves: true,
        theme: 'light',
        enableClickEffect: true,
        enableHoldEffect: true,
        highContrast: false,
        largerText: false
    };

    function loadSettings() {
        const saved = localStorage.getItem('loginPageSettings');
        return saved ? JSON.parse(saved) : defaultSettings;
    }


    function mostrarAlerta(mensagem){
        if(!overlay || !textoModal) return console.warn('overlay/textoModal ausentes');
        textoModal.textContent = mensagem;
        overlay.style.display = "flex";
        document.body.classList.add('modal-open');
    }

    function fecharModal(){
        if(!overlay) return;
        overlay.style.display = "none";
        document.body.classList.remove('modal-open');
    }

    if(btnFecharModal) btnFecharModal.addEventListener('click', fecharModal);

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

    btnEntrar && btnEntrar.addEventListener('click', (ev) => {
        ev.preventDefault();
        fazerLogin();
    });

    async function fazerLogin(){
        const email = (document.getElementById("email") || {}).value || "";
        const senha = (document.getElementById("senha") || {}).value || "";

        if(email.trim() === "" || senha.trim() === ""){
            mostrarAlerta("Preencha todos os campos!");
            return;
        }

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
    let wavesFadingOut = false;
    let waveFadeOpacity = 1;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetMouseX = window.innerWidth / 2;
    let targetMouseY = window.innerHeight / 2;
    const easeAmount = 0.08;

    let interactive = true;
    let isFormFocused = false;
    let isSettingsOpen = false;
    let interactiveTransition = 1;
    const transitionSpeed = 0.06;

    let isMousePressed = false;
    let speedBoost = 0;
    const maxSpeedBoost = 4.0;
    const boostDecayRate = 0.95;
    const boostBuildRate = 0.15;

    let waveDirection = 1;
    let targetWaveDirection = 1;
    const directionEaseAmount = 0.1;
    // Flag para saber se o mouse está dentro da caixa de login
    let isMouseInsideForm = false;

    let heatIntensity = 0;
    const heatDecayRate = 0.96;
    
    let clickAmplitude = 0;
    const maxClickAmplitude = 1.5;
    const clickAmplitudeDecayRate = 0.93;
    
    let clickHeight = 0;
    let targetClickHeight = 0;
    const clickHeightEaseAmount = 0.12;

    let coresBase = [];
    let coresQuentes = [];

    function getCssVar(name) {
        const sourceEl = document.body || document.documentElement;
        const cs = getComputedStyle(sourceEl);
        let val = cs.getPropertyValue(name).trim();
        if (!val) {
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
        ondas.forEach((o, i) => {
            o.corBase = coresBase[i % coresBase.length];
            o.corQuente = coresQuentes[i % coresQuentes.length];
        });
    }

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

    function applyOpacityToCor(cor, opacity) {
        const regex = /rgba\((\d+),(\d+),(\d+),([\d.]+)\)/;
        const match = cor.match(regex);
        
        if (!match) return cor;
        
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        const a = parseFloat(match[4]) * opacity;
        
        return `rgba(${r},${g},${b},${a})`;
    }

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

    setWavePalettesFromCSS();
    ondas.forEach((o, i) => {
        o.corBase = coresBase[i];
        o.corQuente = coresQuentes[i];
        o.corAtual = o.corBase;
    });

    // Movimento do mouse controla ondas somente fora do formulário
    window.addEventListener('mousemove', e => {
        if (isMouseInsideForm) {
            // Enquanto dentro: fixa alvo no centro para ondas neutras
            targetMouseX = window.innerWidth / 2;
            targetMouseY = window.innerHeight / 2;
            return; // ignora qualquer lógica interativa
        }
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
        const centerX = window.innerWidth / 2;
        if (e.clientX < centerX) {
            targetWaveDirection = 1;
        } else if (e.clientX > centerX) {
            targetWaveDirection = -1;
        }
    });

    window.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        // Bloqueia efeitos de clique/segurar se o mouse estiver dentro do formulário ou em elementos sem interação de ondas
        if (isMouseInsideForm || e.target.closest('[data-no-wave]')) return;
        isMousePressed = true;
        const settings = loadSettings();
        if (!isFormFocused && interactive && wavesEnabled && !isSettingsOpen && settings.enableClickEffect) {
            heatIntensity = 1.0;
            clickAmplitude = maxClickAmplitude;
            targetClickHeight = -(canvas.height / 2 - e.clientY);
            console.log('[waves] Clique nas ondas — efeito de labareda ativado');
        }
        if (settings.enableHoldEffect) {
            console.log('[waves] Mouse pressionado — BOOST começando a aumentar');
        }
    });

    window.addEventListener('mouseup', (e) => {
        if (e.button === 0) {
            isMousePressed = false;
            console.log('[waves] Mouse liberado — boost começará a decair');
        }
    });

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
                if (!isMouseInsideForm && !isSettingsOpen) {
                    interactive = true;
                    console.log('[waves] Elemento desfocado — interactive ON');
                }
            }
        }, true);
    }

    if (loginBox) {
        loginBox.addEventListener('mouseenter', () => {
            isMouseInsideForm = true;
            interactive = false;
            console.log('[waves] Mouse entrou na caixa — interactive OFF');
        });
        
        loginBox.addEventListener('mouseleave', () => {
            isMouseInsideForm = false;
            if (!isFormFocused && !isSettingsOpen) {
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
            if (!isFormFocused && !isSettingsOpen) {
                interactive = true;
            }
        }, { passive: true });
    }

    let lastFrameTime = Date.now();

    function desenhar() {
        if (!wavesEnabled && !wavesFadingOut) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            animationFrameId = requestAnimationFrame(desenhar);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const currentTime = Date.now();
        const deltaTime = (currentTime - lastFrameTime) / 1000;
        lastFrameTime = currentTime;

        if (wavesFadingOut) {
            waveFadeOpacity -= 0.015;
            if (waveFadeOpacity <= 0) {
                waveFadeOpacity = 0;
                wavesFadingOut = false;
                console.log('[waves] Fade-out completo — ondas desativadas');
                animationFrameId = requestAnimationFrame(desenhar);
                return;
            }
        }

        const targetTransition = (interactive && !isSettingsOpen) ? 1 : 0;
        interactiveTransition += (targetTransition - interactiveTransition) * transitionSpeed;

        mouseX += (targetMouseX - mouseX) * easeAmount;
        mouseY += (targetMouseY - mouseY) * easeAmount;

        waveDirection += (targetWaveDirection - waveDirection) * directionEaseAmount;

        const smoothMouseY = window.innerHeight / 2 + (mouseY - window.innerHeight / 2) * interactiveTransition;

        const settings = loadSettings();
        if (settings.enableHoldEffect && !isFormFocused && interactive && !isSettingsOpen) {
            if (isMousePressed && speedBoost < maxSpeedBoost) {
                speedBoost += boostBuildRate;
                if (speedBoost > maxSpeedBoost) speedBoost = maxSpeedBoost;
            } else if (!isMousePressed && speedBoost > 0) {
                speedBoost *= boostDecayRate;
                if (speedBoost < 0.01) speedBoost = 0;
            }
        } else {
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
            
            const corBaseComOpacity = applyOpacityToCor(o.corBase, waveFadeOpacity);
            const corMeioComOpacity = applyOpacityToCor(corMeio, waveFadeOpacity);
            const corBordaComOpacity = applyOpacityToCor(corBorda, waveFadeOpacity);
            
            gradBottom.addColorStop(0, corBaseComOpacity);
            gradBottom.addColorStop(0.5, corMeioComOpacity);
            gradBottom.addColorStop(1, corBordaComOpacity);
            
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

    /* ========== BOTÃO VOLTAR ========== */
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
        // Efeito de reset das waves ao passar o mouse (igual ao settingsBtn)
        backBtn.addEventListener('mouseenter', () => {
            interactive = false;
            console.log('[waves] Mouse entrou no botão de voltar — interactive OFF');
        });
        backBtn.addEventListener('mouseleave', () => {
            if (!isFormFocused && !isSettingsOpen) {
                interactive = true;
                console.log('[waves] Mouse saiu do botão de voltar — interactive ON');
            }
        });
    }

    /* ========== CONFIGURAÇÕES DA PÁGINA ========== */
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');

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

    function applySettings(settings) {
        document.body.classList.remove('light-theme', 'dark-theme', 'large-text', 'high-contrast');
        document.documentElement.classList.remove('light-theme', 'dark-theme', 'large-text', 'high-contrast');

        const previousWavesState = wavesEnabled;
        wavesEnabled = settings.enableWaves;
        
        if (canvas) {
            if (settings.enableWaves) {
                if (!previousWavesState) {
                    wavesFadingOut = false;
                    waveFadeOpacity = 0;
                    canvas.style.display = 'block';
                    
                    const fadeInInterval = setInterval(() => {
                        waveFadeOpacity += 0.02;
                        if (waveFadeOpacity >= 1) {
                            waveFadeOpacity = 1;
                            clearInterval(fadeInInterval);
                            console.log('[Configurações-Login] Ondas ATIVADAS com fade-in');
                        }
                    }, 16);
                }
            } else {
                if (previousWavesState) {
                    wavesFadingOut = true;
                    
                    setTimeout(() => {
                        if (!wavesEnabled && !wavesFadingOut) {
                            canvas.style.display = 'none';
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            
                            heatIntensity = 0;
                            clickAmplitude = 0;
                            clickHeight = 0;
                            targetClickHeight = 0;
                            speedBoost = 0;
                        }
                    }, 1500);
                    console.log('[Configurações-Login] Ondas DESATIVADAS com fade-out');
                }
            }
        }

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

        setWavePalettesFromCSS();

        if (settings.largerText) {
            document.body.classList.add('large-text');
            document.documentElement.classList.add('large-text');
            console.log('[Configurações-Login] Texto AUMENTADO');
        } else {
            console.log('[Configurações-Login] Texto NORMAL');
        }

        if (settings.highContrast) {
            document.body.classList.add('high-contrast');
            document.documentElement.classList.add('high-contrast');
            console.log('[Configurações-Login] Alto contraste ATIVADO');
        } else {
            console.log('[Configurações-Login] Alto contraste DESATIVADO');
        }

        console.log('[Configurações-Login] Efeito ao clicar:', settings.enableClickEffect ? 'ATIVADO' : 'DESATIVADO');
        console.log('[Configurações-Login] Efeito ao segurar:', settings.enableHoldEffect ? 'ATIVADO' : 'DESATIVADO');
    }

    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.add('active');
            isSettingsOpen = true;
            interactive = false;
            isMousePressed = false;
            speedBoost = 0;
            heatIntensity = 0;
            clickAmplitude = 0;
            targetClickHeight = 0;
            console.log('[Configurações-Login] Modal aberto — interatividade das waves DESATIVADA');
        });
    }

    function closeModal() {
        const settingsContent = settingsModal.querySelector('.settings-content');
        
        settingsModal.classList.add('closing');
        if (settingsContent) {
            settingsContent.classList.add('closing');
        }
        
        setTimeout(() => {
            settingsModal.classList.remove('active', 'closing');
            if (settingsContent) {
                settingsContent.classList.remove('closing');
            }
            
            isSettingsOpen = false;
            if (!isFormFocused && !isMouseInsideForm) {
                interactive = true;
            }
            console.log('[Configurações-Login] Modal fechado — interatividade das waves conforme contexto');
        }, 300);
    }

    if (closeSettings) {
        closeSettings.addEventListener('click', closeModal);
    }

    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                closeModal();
            }
        });
    }

    document.querySelectorAll('.settings-option input').forEach(input => {
        input.addEventListener('change', saveSettings);
    });

    document.querySelectorAll('.settings-option').forEach(option => {
        option.addEventListener('click', (e) => {
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