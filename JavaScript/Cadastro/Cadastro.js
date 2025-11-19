document.addEventListener('DOMContentLoaded', () => {
    console.log('[cadastro.js] DOM pronto — iniciando scripts v3');

    /* ========== REFERÊNCIAS DOM - CADASTRO ========== */
    const overlay = document.getElementById("overlay");
    const textoModal = overlay ? overlay.querySelector("p") : null;
    const btnCriar = document.getElementById("ButtonCriarCadastro");
    const btnVoltar = document.getElementById("btnVoltar");
    const btnVerSenha = document.getElementById("BtnVerSenha");
    const btnConfirmVerSenha = document.getElementById("BtnConfirmVerSenha");
    const btnFecharModal = overlay ? overlay.querySelector("button") : null;
    const formCadastro = document.getElementById("formCadastro");

    if (!overlay || !textoModal || !btnCriar || !formCadastro) {
        console.warn('[cadastro.js] Elementos essenciais não encontrados.');
    }

    /* ========== CONFIGURAÇÕES - DEFINIÇÕES ========== */
    const defaultSettings = {
        enableWaves: true,
        enableGif: true,
        theme: 'light',
        enableClickEffect: true,
        enableHoldEffect: true,
        highContrast: false,
        largerText: false
    };

    function loadSettings() {
        try {
            const raw = localStorage.getItem('cadastroSettings');
            if (!raw) return defaultSettings;
            const parsed = JSON.parse(raw);
            return { ...defaultSettings, ...parsed };
        } catch {
            return defaultSettings;
        }
    }

    function mostrarAlerta(mensagem) {
        if (!overlay || !textoModal) return;
        textoModal.textContent = mensagem;
        overlay.style.display = 'flex';
    }

    function fecharModal() {
        if (!overlay) return;
        overlay.style.display = 'none';
    }
    // Expor global (caso HTML antigo tenha onclick)
    window.fecharModal = fecharModal;

    if (btnFecharModal) {
        btnFecharModal.addEventListener('click', (e) => {
            e.stopPropagation();
            fecharModal();
        });
    }

    // Mostrar/Ocultar Senha
    function MostrarSenha() {
        const senhaInput = document.getElementById('password');
        if (!senhaInput) return;
        senhaInput.type = senhaInput.type === 'password' ? 'text' : 'password';
    }

    function ConfirmMostrarSenha() {
        const senhaInput = document.getElementById('confirm-password');
        if (!senhaInput) return;
        senhaInput.type = senhaInput.type === 'password' ? 'text' : 'password';
    }

    if (btnVerSenha) btnVerSenha.addEventListener('click', MostrarSenha);
    if (btnConfirmVerSenha) btnConfirmVerSenha.addEventListener('click', ConfirmMostrarSenha);

    // Botão Voltar
    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            window.location.href = '../Login/loginhtml.php';
        });
    }

    // Submit do formulário
    if (formCadastro) {
        formCadastro.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(formCadastro);

            try {
                const responseText = await fetch("Cadastrar.php", {
                    method: "POST",
                    body: formData
                }).then(r => r.text());

                if (responseText.trim().startsWith('<')) {
                    console.error('[cadastro.js] Resposta parece HTML (erro PHP):', responseText);
                    mostrarAlerta('Erro no servidor. Tente novamente mais tarde.');
                    return;
                }

                let data;
                try {
                    data = JSON.parse(responseText);
                } catch (parseErr) {
                    console.error('[cadastro.js] Falha JSON:', parseErr, 'Bruto:', responseText);
                    mostrarAlerta('Resposta inválida do servidor.');
                    return;
                }

                mostrarAlerta(data.message || 'Sem mensagem.');

                if (data.status === "success") {
                    overlay.onclick = () => {
                        fecharModal();
                        if (data.redirect) {
                            window.location.href = data.redirect;
                        } else {
                            window.location.href = "CPerfilhtml.php";
                        }
                    };
                    setTimeout(() => {
                        if (data.redirect) {
                            window.location.href = data.redirect;
                        } else {
                            window.location.href = "CPerfilhtml.php";
                        }
                    }, 2000);
                } else {
                    overlay.onclick = () => {
                        fecharModal();
                    };
                }

            } catch (err) {
                console.error('[cadastro.js] fetch erro:', err);
                mostrarAlerta("Erro inesperado: " + err);
            }
        });
    }

    /* ========== CANVAS WAVES CADASTRO ==================== */
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

    window.addEventListener('mousemove', e => {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;

        if (!isMouseInsideForm) {
            const centerX = window.innerWidth / 2;
            if (e.clientX < centerX) {
                targetWaveDirection = 1;
            } else if (e.clientX > centerX) {
                targetWaveDirection = -1;
            }
        }
    });

    window.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
            isMousePressed = true;
            
            const settings = loadSettings();
            if (!isFormFocused && interactive && wavesEnabled && !isSettingsOpen && settings.enableClickEffect) {
                heatIntensity = 1.0;
                clickAmplitude = maxClickAmplitude;
                targetClickHeight = -(canvas.height / 2 - e.clientY);
                console.log('[waves-cadastro] Clique nas ondas — efeito de labareda ativado');
            }
            
            if (settings.enableHoldEffect) {
                console.log('[waves-cadastro] Mouse pressionado — BOOST começando a aumentar');
            }
        }
    });

    window.addEventListener('mouseup', (e) => {
        if (e.button === 0) {
            isMousePressed = false;
            console.log('[waves-cadastro] Mouse liberado — boost começará a decair');
        }
    });

    const cadastroBox = document.querySelector('.CaixaCadastro') || document.querySelector('.formulario');

    if (formCadastro) {
        formCadastro.addEventListener('focusin', (e) => {
            if (e.target.matches('input, textarea, button')) {
                isFormFocused = true;
                interactive = false;
                console.log('[waves-cadastro] Elemento focado — interactive OFF');
            }
        }, true);

        formCadastro.addEventListener('focusout', (e) => {
            if (e.target.matches('input, textarea, button')) {
                isFormFocused = false;
                if (cadastroBox && !cadastroBox.matches(':hover') && !isSettingsOpen) {
                    interactive = true;
                    console.log('[waves-cadastro] Elemento desfocado — interactive ON');
                }
            }
        }, true);
    }

    if (cadastroBox) {
        cadastroBox.addEventListener('mouseenter', () => {
            interactive = false;
            isMouseInsideForm = true;
            console.log('[waves-cadastro] Mouse entrou na caixa — interactive OFF, direção bloqueada');
        });
        
        cadastroBox.addEventListener('mouseleave', () => {
            isMouseInsideForm = false;
            if (!isFormFocused && !isSettingsOpen) {
                interactive = true;
                console.log('[waves-cadastro] Mouse saiu da caixa — interactive ON, direção desbloqueada');
            }
        });
    }

    if (cadastroBox) {
        cadastroBox.addEventListener('touchstart', () => {
            interactive = false;
            isMouseInsideForm = true;
        }, { passive: true });

        cadastroBox.addEventListener('touchend', () => {
            isMouseInsideForm = false;
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
                console.log('[waves-cadastro] Fade-out completo — ondas desativadas');
                animationFrameId = requestAnimationFrame(desenhar);
                return;
            }
        }

        const targetTransition = (interactive && !isSettingsOpen) ? 1 : 0;
        interactiveTransition += (targetTransition - interactiveTransition) * transitionSpeed;

        mouseX += (targetMouseX - mouseX) * easeAmount;
        mouseY += (targetMouseY - mouseY) * easeAmount;

        waveDirection += (targetWaveDirection - waveDirection) * directionEaseAmount * interactiveTransition;

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

    /* ========== CONTROLE DO GIF ========== */
    const gifContainer = document.querySelector('.imagem');
    const gifImage = gifContainer ? gifContainer.querySelector('img') : null;
    let gifEnabled = true;

    function toggleGif(enabled) {
        if (!gifContainer) return;
        
        gifEnabled = enabled;
        
        if (enabled) {
            gifContainer.style.opacity = '0';
            gifContainer.style.transform = 'scale(0.95)';
            gifContainer.style.display = '';
            
            gifContainer.offsetHeight;
            
            requestAnimationFrame(() => {
                gifContainer.style.opacity = '1';
                gifContainer.style.transform = 'scale(1)';
            });
            
            console.log('[GIF-Cadastro] GIF exibido com transição suave');
        } else {
            gifContainer.style.opacity = '0';
            gifContainer.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                gifContainer.style.display = 'none';
                console.log('[GIF-Cadastro] GIF ocultado com transição suave');
            }, 400);
        }
    }

    /* ========== CONFIGURAÇÕES DA PÁGINA ========== */
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');

    if (settingsBtn) {
        settingsBtn.addEventListener('mouseenter', () => {
            interactive = false;
            console.log('[waves-cadastro] Mouse entrou no botão de configurações — interactive OFF');
        });
        
        settingsBtn.addEventListener('mouseleave', () => {
            if (!isFormFocused && !isSettingsOpen) {
                interactive = true;
                console.log('[waves-cadastro] Mouse saiu do botão de configurações — interactive ON');
            }
        });
    }

    function saveSettings() {
        const enableWavesEl = document.getElementById('enableWaves');
        const enableGifEl = document.getElementById('enableGif');
        const themeEl = document.querySelector('input[name="theme"]:checked');
        const enableClickEffectEl = document.getElementById('enableClickEffect');
        const enableHoldEffectEl = document.getElementById('enableHoldEffect');
        const highContrastEl = document.getElementById('highContrast');
        const largerTextEl = document.getElementById('largerText');

        if (!enableWavesEl || !enableGifEl || !themeEl || !enableClickEffectEl || !enableHoldEffectEl || !highContrastEl || !largerTextEl) {
            console.error('[cadastro.js] Alguns elementos de configuração não foram encontrados');
            return;
        }

        const settings = {
            enableWaves: enableWavesEl.checked,
            enableGif: enableGifEl.checked,
            theme: themeEl.value,
            enableClickEffect: enableClickEffectEl.checked,
            enableHoldEffect: enableHoldEffectEl.checked,
            highContrast: highContrastEl.checked,
            largerText: largerTextEl.checked
        };
        localStorage.setItem('cadastroPageSettings', JSON.stringify(settings));
        applySettings(settings);
        console.log('[Configurações-Cadastro] Salvas:', settings);
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
                            console.log('[Configurações-Cadastro] Ondas ATIVADAS com fade-in');
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
                    console.log('[Configurações-Cadastro] Ondas DESATIVADAS com fade-out');
                }
            }
        }

        toggleGif(settings.enableGif);

        if (settings.theme === 'dark') {
            document.body.classList.add('dark-theme');
            document.documentElement.classList.add('dark-theme');
            console.log('[Configurações-Cadastro] Tema ESCURO ativado');
        } else if (settings.theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.body.classList.add('dark-theme');
                document.documentElement.classList.add('dark-theme');
                console.log('[Configurações-Cadastro] Tema AUTOMÁTICO — ESCURO');
            } else {
                document.body.classList.add('light-theme');
                document.documentElement.classList.add('light-theme');
                console.log('[Configurações-Cadastro] Tema AUTOMÁTICO — CLARO');
            }
        } else {
            document.body.classList.add('light-theme');
            document.documentElement.classList.add('light-theme');
            console.log('[Configurações-Cadastro] Tema CLARO ativado');
        }

        setWavePalettesFromCSS();

        if (settings.largerText) {
            document.body.classList.add('large-text');
            document.documentElement.classList.add('large-text');
            console.log('[Configurações-Cadastro] Texto AUMENTADO');
        } else {
            console.log('[Configurações-Cadastro] Texto NORMAL');
        }

        if (settings.highContrast) {
            document.body.classList.add('high-contrast');
            document.documentElement.classList.add('high-contrast');
            console.log('[Configurações-Cadastro] Alto contraste ATIVADO');
        } else {
            console.log('[Configurações-Cadastro] Alto contraste DESATIVADO');
        }

        console.log('[Configurações-Cadastro] Efeito ao clicar:', settings.enableClickEffect ? 'ATIVADO' : 'DESATIVADO');
        console.log('[Configurações-Cadastro] Efeito ao segurar:', settings.enableHoldEffect ? 'ATIVADO' : 'DESATIVADO');
        console.log('[Configurações-Cadastro] GIF:', settings.enableGif ? 'ATIVADO' : 'DESATIVADO');
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
            console.log('[Configurações-Cadastro] Modal aberto — interatividade das waves DESATIVADA');
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
            if (!isFormFocused) {
                const cadastroBox = document.querySelector('.CaixaCadastro') || document.querySelector('.formulario');
                if (!(cadastroBox && cadastroBox.matches(':hover'))) {
                    interactive = true;
                }
            }
            console.log('[Configurações-Cadastro] Modal fechado — interatividade das waves conforme contexto');
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
    const enableGifEl = document.getElementById('enableGif');
    const enableClickEffectEl = document.getElementById('enableClickEffect');
    const enableHoldEffectEl = document.getElementById('enableHoldEffect');
    const highContrastEl = document.getElementById('highContrast');
    const largerTextEl = document.getElementById('largerText');
    const themeEl = document.querySelector(`input[value="${currentSettings.theme}"]`);

    if (enableWavesEl) enableWavesEl.checked = currentSettings.enableWaves;
    if (enableGifEl) enableGifEl.checked = currentSettings.enableGif !== undefined ? currentSettings.enableGif : true;
    if (enableClickEffectEl) enableClickEffectEl.checked = currentSettings.enableClickEffect;
    if (enableHoldEffectEl) enableHoldEffectEl.checked = currentSettings.enableHoldEffect;
    if (highContrastEl) highContrastEl.checked = currentSettings.highContrast;
    if (largerTextEl) largerTextEl.checked = currentSettings.largerText;
    if (themeEl) themeEl.checked = true;

    applySettings(currentSettings);

});