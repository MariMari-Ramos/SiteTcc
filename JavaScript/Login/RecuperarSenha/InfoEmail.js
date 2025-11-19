// InfoEmail.js - Waves animation e configurações para página de confirmação
(function(){
    'use strict';

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
            const stored = localStorage.getItem('recPageSettings');
            return stored ? {...defaultSettings, ...JSON.parse(stored)} : defaultSettings;
        } catch(e){ return defaultSettings; }
    }

    function saveSettings(){
        try {
            localStorage.setItem('recPageSettings', JSON.stringify(settings));
        } catch(e){ console.error('Erro salvando configurações:', e); }
    }

    function applySettings(s){
        // Tema
        document.body.classList.remove('dark-theme', 'light-theme');
        document.documentElement.classList.remove('dark-theme', 'light-theme');
        if(s.theme === 'dark'){
            document.body.classList.add('dark-theme');
            document.documentElement.classList.add('dark-theme');
        } else if(s.theme === 'light'){
            document.body.classList.add('light-theme');
            document.documentElement.classList.add('light-theme');
        } else if(s.theme === 'auto'){
            const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const themeClass = isDark ? 'dark-theme' : 'light-theme';
            document.body.classList.add(themeClass);
            document.documentElement.classList.add(themeClass);
        }

        // Waves
        wavesEnabled = s.enableWaves;

        // Acessibilidade
        document.body.classList.toggle('high-contrast', s.highContrast);
        document.body.classList.toggle('larger-text', s.largerText);

        // Efeitos (click/hold)
        clickEffectEnabled = s.enableClickEffect;
        holdEffectEnabled = s.enableHoldEffect;
    }

    let settings = loadSettings();
    let wavesEnabled = settings.enableWaves !== false;
    let clickEffectEnabled = settings.enableClickEffect !== false;
    let holdEffectEnabled = settings.enableHoldEffect !== false;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    const ease = 0.08;

    let waveDir = 1;
    let targetWaveDir = 1;

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

    window.addEventListener('mousemove', (e) => {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
        const centerX = window.innerWidth / 2;
        targetWaveDir = (e.clientX < centerX) ? 1 : -1;
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
            o.amp = (45 + idx * 8) + influence;

            const verticalInfluence = (smoothMouseY - canvas.height / 2) * 0.04 * (idx + 1);

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
            settings.enableWaves = enableWavesCheck.checked;
            wavesEnabled = settings.enableWaves;
            saveSettings();
            applySettings(settings);
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
