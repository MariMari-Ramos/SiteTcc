// NovaSenha.js - Sincronização de tema, waves e configurações
(function(){
    'use strict';

    // ===== SINCRONIZAÇÃO DE TEMA (executado imediatamente) =====
    const savedSettings = localStorage.getItem('loginPageSettings') || localStorage.getItem('recPageSettings');
    if(savedSettings){
        try {
            const s = JSON.parse(savedSettings);
            if(s.theme === 'dark'){
                document.documentElement.classList.add('dark-theme');
                if(document.body) document.body.classList.add('dark-theme');
            }
        } catch(e){}
    }

    // Aguardar DOM estar pronto
    if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init(){
        console.log('[NovaSenha.js] init() iniciado');
        const canvas = document.getElementById('waveCanvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');

        // sincroniza transição do canvas com o comportamento do login
        try {
            canvas.style.transition = canvas.style.transition || 'opacity 1.5s ease-out';
        } catch(e){}

        function resizeCanvas(){
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // ===== CONFIGURAÇÕES =====
        const defaultSettings = {
            enableWaves: true,
            theme: 'light',
            enableClickEffect: true,
            enableHoldEffect: true,
            highContrast: false,
            largerText: false
        };

        function loadSettings(){
            try {
                const stored = localStorage.getItem('loginPageSettings');
                return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
            } catch(e){ return defaultSettings; }
        }

        function saveSettings(){
            try { localStorage.setItem('loginPageSettings', JSON.stringify(settings)); }
            catch(e){ console.error('Erro salvando configurações:', e); }
        }

        function applySettings(s){
            document.body.classList.remove('light-theme','dark-theme','high-contrast','larger-text');
            document.documentElement.classList.remove('light-theme','dark-theme','high-contrast','larger-text');
            if(s.theme === 'dark') {
                document.body.classList.add('dark-theme');
                document.documentElement.classList.add('dark-theme');
            } else if(s.theme === 'auto') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.body.classList.add(prefersDark ? 'dark-theme':'light-theme');
                document.documentElement.classList.add(prefersDark ? 'dark-theme':'light-theme');
            } else {
                document.body.classList.add('light-theme');
                document.documentElement.classList.add('light-theme');
            }
            wavesEnabled = s.enableWaves;
            document.body.classList.toggle('high-contrast', s.highContrast);
            document.body.classList.toggle('larger-text', s.largerText);
            clickEffectEnabled = s.enableClickEffect;
            holdEffectEnabled = s.enableHoldEffect;
        }

        let settings = loadSettings();
        let wavesEnabled = settings.enableWaves !== false;
        let clickEffectEnabled = settings.enableClickEffect !== false;
        let holdEffectEnabled = settings.enableHoldEffect !== false;

        /* ========== CANVAS WAVES (login.js identical implementation) ========== */
        let animationFrameId = null;
        let wavesFadingOut = false;
        let waveFadeOpacity = 1;

        // ensure we have a numeric ease amount (some pages use `ease` var)
        const easeAmount = (typeof ease !== 'undefined') ? ease : 0.08;

        let interactive = true;
        let isFormFocused = false;
        let isSettingsOpen = false;
        // controla se o mouse/entrada está dentro da área do formulário/caixa
        let isMouseInsideForm = false;
        // referência segura ao formulário/login (padrão null se não existir nesta página)
        const formLogin = document.querySelector('form') || null;
        let interactiveTransition = 1;
        const transitionSpeed = 0.06;

        // reuse existing isMousePressed, speedBoost, etc. if defined
        if (typeof isMousePressed === 'undefined') var isMousePressed = false;
        if (typeof speedBoost === 'undefined') var speedBoost = 0;
        if (typeof maxSpeedBoost === 'undefined') var maxSpeedBoost = 4.0;
        if (typeof boostDecayRate === 'undefined') var boostDecayRate = 0.95;
        if (typeof boostBuildRate === 'undefined') var boostBuildRate = 0.15;

        if (typeof waveDirection === 'undefined') var waveDirection = 1;
        if (typeof targetWaveDirection === 'undefined') var targetWaveDirection = 1;
        const directionEaseAmount = 0.1;

        if (typeof heatIntensity === 'undefined') var heatIntensity = 0;
        const localHeatDecayRate = (typeof heatDecayRate !== 'undefined') ? heatDecayRate : 0.96;

        if (typeof clickAmplitude === 'undefined') var clickAmplitude = 0;
        const localMaxClickAmplitude = (typeof maxClickAmplitude !== 'undefined') ? maxClickAmplitude : 1.5;
        const localClickAmplitudeDecay = (typeof clickAmplitudeDecayRate !== 'undefined') ? clickAmplitudeDecayRate : 0.93;

        if (typeof clickHeight === 'undefined') var clickHeight = 0;
        if (typeof targetClickHeight === 'undefined') var targetClickHeight = 0;
        const localClickHeightEase = (typeof clickHeightEase !== 'undefined') ? clickHeightEase : 0.12;

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let targetMouseX = window.innerWidth / 2;
        let targetMouseY = window.innerHeight / 2;

        // Threshold para considerar um pixel como "visível" na canvas
        const ALPHA_THRESHOLD = 12; // ~5% opacity

        // Retorna true se a posição do ponteiro (clientX, clientY) está sobre um pixel não transparente da canvas
        function isPointOnWave(clientX, clientY){
            try {
                const rect = canvas.getBoundingClientRect();
                const cx = Math.round(clientX - rect.left);
                const cy = Math.round(clientY - rect.top);
                if (cx < 0 || cy < 0 || cx >= canvas.width || cy >= canvas.height) return false;
                const pix = ctx.getImageData(cx, cy, 1, 1).data;
                return pix[3] >= ALPHA_THRESHOLD;
            } catch (err) {
                // se não for possível ler (ex: CORS, offscreen), permitir por fallback
                return true;
            }
        }

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

        // Movimento do mouse controla ondas somente quando o ponteiro está sobre a wave
        // e não estiver sobre elementos UI (forms, modal, botões, container de resultado)
        window.addEventListener('mousemove', e => {
            // Se o evento ocorreu dentro de algum elemento de UI, ignora interação
            const uiEl = e.target && e.target.closest && e.target.closest('.resultado-container, form, .settings-content, .settings-modal, .settings-btn, .btn-acao, [data-no-wave]');
            if (uiEl) {
                targetMouseX = window.innerWidth / 2;
                targetMouseY = window.innerHeight / 2;
                return;
            }

            // Só atualiza posição se o ponteiro estiver sobre um pixel visível da canvas
            if (!isPointOnWave(e.clientX, e.clientY)) return;

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
            // Ignora se clicou em UI ou elementos marcados para não interagir
            const clickedUi = e.target && e.target.closest && e.target.closest('.resultado-container, form, .settings-content, .settings-modal, .settings-btn, .btn-acao, [data-no-wave]');
            if (clickedUi) return;

            // Hit-test: somente considerar clique quando o pixel da canvas sob o cursor
            // tiver opacidade (alpha) suficiente — assim só clicando diretamente na wave ativa
            try {
                // usa a função centralizada de hit-test
                const rect = canvas.getBoundingClientRect();
                const cx = Math.round(e.clientX - rect.left);
                const cy = Math.round(e.clientY - rect.top);
                if (cx < 0 || cy < 0 || cx >= canvas.width || cy >= canvas.height) return;
                if (!isPointOnWave(e.clientX, e.clientY)) {
                    return;
                }
            } catch(err) {
                console.warn('[waves] Falha no hit-test da canvas, permitindo interação por fallback', err);
            }

            isMousePressed = true;
            const s = loadSettings();
            if (!isFormFocused && interactive && wavesEnabled && !isSettingsOpen && s.enableClickEffect) {
                heatIntensity = 1.0;
                clickAmplitude = localMaxClickAmplitude;
                targetClickHeight = -(canvas.height / 2 - e.clientY);
                console.log('[waves] Clique nas ondas — efeito de labareda ativado');
            }
            if (s.enableHoldEffect) {
                console.log('[waves] Mouse pressionado — BOOST começando a aumentar');
            }
        });

        // Touch handlers: aplicar o mesmo hit-test para toques
        window.addEventListener('touchstart', (e) => {
            const t = e.touches && e.touches[0];
            if (!t) return;
            const touchedUi = e.target && e.target.closest && e.target.closest('.resultado-container, form, .settings-content, .settings-modal, .settings-btn, .btn-acao, [data-no-wave]');
            if (touchedUi) return;
            try {
                if (!isPointOnWave(t.clientX, t.clientY)) return;
            } catch(err) { console.warn('[waves] touchstart hit-test fallback', err); }
            isMousePressed = true;
            const s = loadSettings();
            if (!isFormFocused && interactive && wavesEnabled && !isSettingsOpen && s.enableClickEffect) {
                heatIntensity = 1.0;
                clickAmplitude = localMaxClickAmplitude;
                targetClickHeight = -(canvas.height / 2 - t.clientY);
                console.log('[waves] Touch nas ondas — efeito de labareda ativado');
            }
            if (s.enableHoldEffect) {
                console.log('[waves] Touch pressionado — BOOST começando a aumentar');
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            const t = e.touches && e.touches[0];
            if (!t) return;
            const touchedUi = e.target && e.target.closest && e.target.closest('.resultado-container, form, .settings-content, .settings-modal, .settings-btn, .btn-acao, [data-no-wave]');
            if (touchedUi) {
                targetMouseX = window.innerWidth / 2;
                targetMouseY = window.innerHeight / 2;
                return;
            }
            try {
                if (!isPointOnWave(t.clientX, t.clientY)) return;
            } catch(err) { /* fallback*/ }
            targetMouseX = t.clientX;
            targetMouseY = t.clientY;
            const centerX = window.innerWidth / 2;
            if (t.clientX < centerX) {
                targetWaveDirection = 1;
            } else if (t.clientX > centerX) {
                targetWaveDirection = -1;
            }
        }, { passive: true });

        window.addEventListener('touchend', (e) => {
            isMousePressed = false;
            console.log('[waves] Touch liberado — boost começará a decair');
        });

        window.addEventListener('mouseup', (e) => {
            if (e.button === 0) {
                isMousePressed = false;
                console.log('[waves] Mouse liberado — boost começará a decair');
            }
        });

        const loginBox = document.querySelector('.CaixaLogin') || document.querySelector('.login');

        if (typeof formLogin !== 'undefined' && formLogin) {
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

            const settingsLocal = loadSettings();
            if (settingsLocal.enableHoldEffect && !isFormFocused && interactive && !isSettingsOpen) {
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
                heatIntensity *= localHeatDecayRate;
                if (heatIntensity < 0.01) heatIntensity = 0;
            }

            if (clickAmplitude > 0) {
                clickAmplitude *= localClickAmplitudeDecay;
                if (clickAmplitude < 0.01) clickAmplitude = 0;
            }

            clickHeight += (targetClickHeight - clickHeight) * localClickHeightEase;

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

        // Botão de voltar fixo removido nesta tela; somente link interno presente no container.

        // ===== MODAL DE CONFIGURAÇÕES =====
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsModal = document.getElementById('settingsModal');
        const closeSettings = document.getElementById('closeSettings');

        const enableWavesCheck = document.getElementById('enableWaves');
        const themeLight = document.getElementById('themeLight');
        const themeDark = document.getElementById('themeDark');
        const themeAuto = document.getElementById('themeAuto');
        const enableClickCheck = document.getElementById('enableClickEffect');
        const enableHoldCheck = document.getElementById('enableHoldEffect');
        const highContrastCheck = document.getElementById('highContrast');
        const largerTextCheck = document.getElementById('largerText');

        function syncUIWithSettings(){
            if(enableWavesCheck) enableWavesCheck.checked = settings.enableWaves;
            if(themeLight && settings.theme === 'light') themeLight.checked = true;
            if(themeDark && settings.theme === 'dark') themeDark.checked = true;
            if(themeAuto && settings.theme === 'auto') themeAuto.checked = true;
            if(enableClickCheck) enableClickCheck.checked = settings.enableClickEffect;
            if(enableHoldCheck) enableHoldCheck.checked = settings.enableHoldEffect;
            if(highContrastCheck) highContrastCheck.checked = settings.highContrast;
            if(largerTextCheck) largerTextCheck.checked = settings.largerText;
        }

        function openSettingsModal(){
                console.log('[NovaSenha.js] openSettingsModal()');
                try {
                    // garante visibilidade mesmo que alguma regra CSS esteja sobrescrevendo
                    settingsModal.style.display = 'flex';
                    // colocar modal sempre acima de botões e outros elementos
                    settingsModal.style.zIndex = '99999';
                } catch(e){}
                settingsModal.classList.remove('closing');
                settingsModal.classList.add('active');
                const content = settingsModal.querySelector('.settings-content');
            if(content){
                content.classList.remove('closing');
                try { content.style.zIndex = '100000'; } catch(e){}
            }
        }

        function closeSettingsModal(){
            const content = settingsModal.querySelector('.settings-content');
            if(content){
                content.classList.add('closing');
                setTimeout(() => {
                    settingsModal.classList.add('closing');
                    setTimeout(() => {
                        settingsModal.classList.remove('active', 'closing');
                        try { settingsModal.style.display = ''; settingsModal.style.zIndex = ''; } catch(e){}
                        if(content) { content.classList.remove('closing'); try{ content.style.zIndex=''; }catch(e){} }
                    }, 300);
                }, 50);
            } else {
                settingsModal.classList.add('closing');
                setTimeout(() => {
                    settingsModal.classList.remove('active', 'closing');
                    try { settingsModal.style.display = ''; settingsModal.style.zIndex = ''; } catch(e){}
                }, 300);
            }
        }

        if(settingsBtn){
            console.log('[NovaSenha.js] settingsBtn encontrado, vinculando evento');
            settingsBtn.addEventListener('click', (ev) => {
                ev.stopPropagation();
                openSettingsModal();
            });
        } else {
            console.warn('[NovaSenha.js] settingsBtn não encontrado');
        }

        if(closeSettings){
            closeSettings.addEventListener('click', closeSettingsModal);
        }

        if(settingsModal){
            settingsModal.addEventListener('click', (e) => {
                if(e.target === settingsModal) closeSettingsModal();
            });
        }

        // Handlers de mudança
        if(enableWavesCheck){
            enableWavesCheck.addEventListener('change', () => {
                const enabled = enableWavesCheck.checked;
                settings.enableWaves = enabled;
                saveSettings();

                // se ativar: liga imediatamente e faz fade-in
                if(enabled){
                    wavesEnabled = true;
                    try { canvas.style.opacity = '1'; } catch(e){}
                    applySettings(settings);
                } else {
                    // se desativar: faz fade-out e só então desliga o loop após 1500ms
                    try { canvas.style.opacity = '0'; } catch(e){}
                    setTimeout(() => {
                        wavesEnabled = false;
                        applySettings(settings);
                    }, 1500);
                }
            });
        }

        [themeLight, themeDark, themeAuto].forEach(radio => {
            if(radio){
                radio.addEventListener('change', () => {
                    if(radio.checked){
                        settings.theme = radio.value;
                        saveSettings();
                        applySettings(settings);
                    }
                });
            }
        });

        if(enableClickCheck){
            enableClickCheck.addEventListener('change', () => {
                settings.enableClickEffect = enableClickCheck.checked;
                clickEffectEnabled = settings.enableClickEffect;
                saveSettings();
            });
        }

        if(enableHoldCheck){
            enableHoldCheck.addEventListener('change', () => {
                settings.enableHoldEffect = enableHoldCheck.checked;
                holdEffectEnabled = settings.enableHoldEffect;
                saveSettings();
            });
        }

        if(highContrastCheck){
            highContrastCheck.addEventListener('change', () => {
                settings.highContrast = highContrastCheck.checked;
                saveSettings();
                applySettings(settings);
            });
        }

        if(largerTextCheck){
            largerTextCheck.addEventListener('change', () => {
                settings.largerText = largerTextCheck.checked;
                saveSettings();
                applySettings(settings);
            });
        }

        // Clique nas options aciona o checkbox/radio
        document.querySelectorAll('.settings-option').forEach(option => {
            option.addEventListener('click', (e) => {
                if(e.target.tagName !== 'INPUT'){
                    const input = option.querySelector('input');
                    if(input){
                        if(input.type === 'checkbox'){
                            input.checked = !input.checked;
                            input.dispatchEvent(new Event('change'));
                        } else if(input.type === 'radio'){
                            input.checked = true;
                            input.dispatchEvent(new Event('change'));
                        }
                    }
                }
            });
        });

        // Inicializar
        applySettings(settings);
        syncUIWithSettings();
    }
})();
