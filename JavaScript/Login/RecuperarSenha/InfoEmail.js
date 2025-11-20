// InfoEmail.js - Waves animation e configurações para página de confirmação
(function(){
    'use strict';
    console.log('[InfoEmail.js] carregado — iniciando configurações e ondas');

    const canvas = document.getElementById('waveCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');

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
            return stored ? {...defaultSettings, ...JSON.parse(stored)} : defaultSettings;
        } catch(e){ return defaultSettings; }
    }

    function saveSettings(){
        try { localStorage.setItem('loginPageSettings', JSON.stringify(settings)); }
        catch(e){ console.error('Erro salvando configurações:', e); }
    }

    function applySettings(s){
        document.body.classList.remove('light-theme','dark-theme','high-contrast','larger-text');
        document.documentElement.classList.remove('light-theme','dark-theme','high-contrast','larger-text');
        // Aplica tema
        if(s.theme === 'dark') {
            document.body.classList.add('dark-theme');
            document.documentElement.classList.add('dark-theme');
        } else if(s.theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if(prefersDark){
                document.body.classList.add('dark-theme');
                document.documentElement.classList.add('dark-theme');
            } else {
                document.body.classList.add('light-theme');
                document.documentElement.classList.add('light-theme');
            }
        } else {
            document.body.classList.add('light-theme');
            document.documentElement.classList.add('light-theme');
        }
        // Aplica acessibilidade
        if(s.highContrast){
            document.body.classList.add('high-contrast');
            document.documentElement.classList.add('high-contrast');
        }
        if(s.largerText){
            document.body.classList.add('larger-text');
            document.documentElement.classList.add('larger-text');
        }
            wavesEnabled = s.enableWaves;
            clickEffectEnabled = s.enableClickEffect;
            holdEffectEnabled = s.enableHoldEffect;
    }

    let settings = loadSettings();
    let wavesEnabled = settings.enableWaves !== false;
    let clickEffectEnabled = settings.enableClickEffect !== false;
    let holdEffectEnabled = settings.enableHoldEffect !== false;

    // Inicializa opacidade do canvas de acordo com a configuração (transição suave definida via CSS)
    try {
        // Usar transição igual ao login (fade mais lento): 1.5s
        canvas.style.transition = canvas.style.transition || 'opacity 1.5s ease-out';
        canvas.style.opacity = wavesEnabled ? '1' : '0';
    } catch(e) { /* ambiente pode bloquear estilos inline */ }
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    const ease = 0.08;

    let waveDir = 1;
    let targetWaveDir = 1;

    // Clique / Segurar - efeitos nas ondas
    let isMousePressed = false;
    let clickAmplitude = 0;
    const maxClickAmplitude = 3.0;
    const clickAmplitudeDecay = 0.92;
    let clickHeight = window.innerHeight / 2;
    let targetClickHeight = clickHeight;
    const clickHeightEase = 0.12;

    function cssVar(name){
        return getComputedStyle(document.body).getPropertyValue(name).trim();
    }

    const waves = [];
    for(let i=0; i<3; i++){
        waves.push({
            amp: 45 + i*8,
            freq: 0.0018 + i*0.0008,
            vel: 0.0015 + i*0.0012,
            fase: Math.random()*1000
        });
    }

    function parseRGBA(rgba){
        const m = rgba.match(/rgba\((\d+),(\d+),(\d+),([\d.]+)\)/);
        return m ? [+m[1], +m[2], +m[3], +m[4]] : [0,0,0,1];
    }

    const interactiveBox = document.querySelector('.CaixaLogin') || document.querySelector('.container-confirmacao') || document.querySelector('.login');

    window.addEventListener('mousemove', (e) => {
        // Só atualiza a direção/posição das ondas se o ponteiro estiver sobre a área de waves
        // e não estiver interagindo com formulários/controles/settings (data-no-wave).
        if (interactiveBox && interactiveBox.contains(e.target)) return;
        if (e.target.closest && e.target.closest('[data-no-wave]')) return;
        if (e.target.closest && e.target.closest('.settings-content, .settings-modal, #settingsModal')) return;

        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
        const centerX = window.innerWidth / 2;
        targetWaveDir = (e.clientX < centerX) ? 1 : -1;
    });

    // Efeitos de clique / segurar - ativam impulso nas ondas
    window.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        // bloqueia se clicar dentro da caixa de formulário ou em elementos marcados
        if (interactiveBox && interactiveBox.contains(e.target)) return;
        if (e.target.closest && e.target.closest('[data-no-wave]')) return;
        if (e.target.closest && e.target.closest('.settings-content, .settings-modal, #settingsModal')) return;
        isMousePressed = true;
        targetClickHeight = e.clientY;
        const cfg = loadSettings();
        if (!cfg) return;
        if (!cfg.enableClickEffect) return;
        // impulso instantâneo
        clickAmplitude = Math.min(maxClickAmplitude, clickAmplitude + 1.2);
        const centerX = window.innerWidth / 2;
        targetWaveDir = (e.clientX < centerX) ? 1 : -1;
    });

    window.addEventListener('mouseup', (e) => {
        if (e.button === 0) {
            isMousePressed = false;
        }
    });

    function draw(){
        if(!wavesEnabled){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            requestAnimationFrame(draw);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        mouseX += (targetMouseX - mouseX) * ease;
        mouseY += (targetMouseY - mouseY) * ease;
        waveDir += (targetWaveDir - waveDir) * 0.1;

        const smoothMouseY = window.innerHeight / 2 + (mouseY - window.innerHeight / 2) * 0.3;

        // Busca cores das variáveis CSS
        const wave1 = cssVar('--wave1') || 'rgba(255,192,192,0.5)';
        const wave2 = cssVar('--wave2') || 'rgba(255,170,150,0.45)';
        const wave3 = cssVar('--wave3') || 'rgba(255,210,180,0.4)';
        const cores = [wave1, wave2, wave3];

        waves.forEach((o, idx) => {
            const influence = Math.abs(smoothMouseY - canvas.height / 2) * 0.03;
            const baseAmp = (45 + idx * 8) + influence;

            const verticalInfluence = (smoothMouseY - canvas.height / 2) * 0.04 * (idx + 1);

            // efeito de clique/segurar: calcula distância vertical do ponto do clique e aplica boost com queda
            const clickDist = Math.abs((canvas.height / 2 + verticalInfluence) - clickHeight);
            const clickFalloff = Math.max(0, 1 - clickDist / (canvas.height * 0.6));
            const clickBoost = clickAmplitude * 30 * clickFalloff * (1 + idx * 0.25);

            o.amp = baseAmp + clickBoost;

            ctx.beginPath();
            for(let x = 0; x <= canvas.width; x += 10){
                const y = Math.sin(x * o.freq + o.fase) * o.amp + canvas.height / 2 + verticalInfluence;
                x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();

            const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
            grad.addColorStop(0, cores[idx]);
            grad.addColorStop(0.5, cores[idx]);
            grad.addColorStop(1, cores[idx]);
            ctx.fillStyle = grad;
            ctx.fill();

            o.fase += o.vel * 0.8 * waveDir;
        });

        // Se estiver segurando e o efeito estiver habilitado, aumenta suavemente a amplitude do impulso
        if(isMousePressed && holdEffectEnabled){
            clickAmplitude = Math.min(maxClickAmplitude, clickAmplitude + 0.06);
        }
        // decaimento do impulso ao longo do tempo
        clickAmplitude = Math.max(0, clickAmplitude * clickAmplitudeDecay);
        // suaviza posição vertical alvo do clique
        clickHeight += (targetClickHeight - clickHeight) * clickHeightEase;

        requestAnimationFrame(draw);
    }

    draw();

    // ===== MODAL DE CONFIGURAÇÕES =====
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');

    // Elementos de configuração
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
        settingsModal.classList.remove('closing');
        settingsModal.classList.add('active');
        const content = settingsModal.querySelector('.settings-content');
        if(content) content.classList.remove('closing');
    }

    function closeSettingsModal(){
        const content = settingsModal.querySelector('.settings-content');
        if(content){
            content.classList.add('closing');
            setTimeout(() => {
                settingsModal.classList.add('closing');
                setTimeout(() => {
                    settingsModal.classList.remove('active', 'closing');
                    if(content) content.classList.remove('closing');
                }, 300);
            }, 50);
        } else {
            settingsModal.classList.add('closing');
            setTimeout(() => {
                settingsModal.classList.remove('active', 'closing');
            }, 300);
        }
    }

    if(settingsBtn){
        settingsBtn.addEventListener('click', openSettingsModal);
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
            // Se for ativar, liga imediatamente e faz fade in
            if(enabled){
                wavesEnabled = true;
                try { canvas.style.opacity = '1'; } catch(e){}
                applySettings(settings);
            } else {
                // Faz fade out suave e só então desliga a animação (igual ao login: 1500ms)
                try { canvas.style.opacity = '0'; } catch(e){}
                // aguarda duração da transição antes de desativar loop de ondas
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
})();
