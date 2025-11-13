/* ========== CRIAR PERFIL.JS ==========
   Controla formulário de CRIAR/EDITAR PERFIL do usuário
   - Seleção de avatar com modal
   - Preenchimento de dados do perfil
   - Waves com todas as melhorias (fogo, labaredas, boost)
*/

/* ==================== CANVAS WAVES CRIAR PERFIL ==================== */
const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

// Configurações padrão (declaradas antes de serem usadas)
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
    const saved = localStorage.getItem('criarPerfilPageSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
}

function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Posição do mouse com suavização (easing)
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let targetMouseX = window.innerWidth / 2;
let targetMouseY = window.innerHeight / 2;
const easeAmount = 0.08;

// Flag para controlar interatividade
let interactive = true;
let isFormFocused = false;
let isSettingsOpen = false;
let interactiveTransition = 1;
const transitionSpeed = 0.06;

// Controle de pressão do mouse
let isMousePressed = false;
let speedBoost = 0;
const maxSpeedBoost = 2.5;
const boostDecayRate = 0.95;
const boostBuildRate = 0.08;

// Controle de direção
let waveDirection = 1;
let targetWaveDirection = 1;
const directionEaseAmount = 0.1;

// Sistema de calor
let heatIntensity = 0;
const heatDecayRate = 0.96;

// Sistema de amplitude do clique
let clickAmplitude = 0;
const maxClickAmplitude = 1.5;
const clickAmplitudeDecayRate = 0.93;

// Sistema de altura do clique
let clickHeight = 0;
let targetClickHeight = 0;
const clickHeightEaseAmount = 0.12;

// Controle de timeout para esconder/mostrar canvas sem "sumir" ao alternar rápido
let waveHideTimeoutId = null;

// Paleta de cores base
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

// Detecta pressão do botão esquerdo
window.addEventListener('mousedown', (e) => {
    if (e.button === 0) {
        isMousePressed = true;
        
        // Só aplica o efeito de clique se estiver habilitado nas configurações
        const settings = loadSettings();
        if (!isFormFocused && interactive && settings.enableClickEffect) {
            heatIntensity = 1.0;
            clickAmplitude = maxClickAmplitude;
            targetClickHeight = -(window.innerHeight / 2 - e.clientY);
            console.log('[waves-criarPerfil] Clique nas ondas — efeito de labareda ativado');
        }
        
        // Log para o boost (efeito de segurar)
        if (settings.enableHoldEffect) {
            console.log('[waves-criarPerfil] Mouse pressionado — BOOST começando a aumentar');
        }
    }
});

// Detecta soltura do botão esquerdo
window.addEventListener('mouseup', (e) => {
    if (e.button === 0) {
        isMousePressed = false;
        console.log('[waves-criarPerfil] Mouse liberado — boost começará a decair');
    }
});

// Seleciona a caixa de criar perfil
const caixa = document.querySelector('.CaixaCriarPerfil');

if (caixa) {
    caixa.addEventListener('mouseenter', () => {
        interactive = false;
        console.log('[waves-criarPerfil] Mouse entrou na caixa — interactive OFF');
    });
    
    caixa.addEventListener('mouseleave', () => {
        if (!isFormFocused) {
            interactive = true;
            console.log('[waves-criarPerfil] Mouse saiu da caixa — interactive ON');
        }
    });

    caixa.addEventListener('focusin', (e) => {
        if (e.target.matches('input, textarea, button')) {
            isFormFocused = true;
            interactive = false;
            console.log('[waves-criarPerfil] Elemento focado — interactive OFF');
        }
    }, true);

    caixa.addEventListener('focusout', (e) => {
        if (e.target.matches('input, textarea, button')) {
            isFormFocused = false;
            if (!caixa.matches(':hover')) {
                interactive = true;
                console.log('[waves-criarPerfil] Elemento desfocado — interactive ON');
            }
        }
    }, true);

    caixa.addEventListener('touchstart', () => {
        interactive = false;
    }, { passive: true });

    caixa.addEventListener('touchend', () => {
        if (!isFormFocused) {
            interactive = true;
        }
    }, { passive: true });
}

// Variável para rastrear tempo do último frame
let lastFrameTime = Date.now();

// Função de desenho/loop
function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const currentTime = Date.now();
    const deltaTime = (currentTime - lastFrameTime) / 1000;
    lastFrameTime = currentTime;

    const W = window.innerWidth;
    const H = window.innerHeight;

    // Suavizar transição entre ativo/inativo - considera se o modal está aberto
    const targetTransition = (interactive && !isSettingsOpen) ? 1 : 0;
    interactiveTransition += (targetTransition - interactiveTransition) * transitionSpeed;

    // Suavizar movimento do mouse
    mouseX += (targetMouseX - mouseX) * easeAmount;
    mouseY += (targetMouseY - mouseY) * easeAmount;

    // Suavizar mudança de direção
    waveDirection += (targetWaveDirection - waveDirection) * directionEaseAmount;

    const smoothMouseY = H / 2 + (mouseY - H / 2) * interactiveTransition;

    // Atualizar boost - só se estiver habilitado
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

    // Atualizar intensidade de calor
    if (heatIntensity > 0) {
        heatIntensity *= heatDecayRate;
        if (heatIntensity < 0.01) heatIntensity = 0;
    }

    // Atualizar amplitude do clique
    if (clickAmplitude > 0) {
        clickAmplitude *= clickAmplitudeDecayRate;
        if (clickAmplitude < 0.01) clickAmplitude = 0;
    }

    // Atualizar altura do clique
    clickHeight += (targetClickHeight - clickHeight) * clickHeightEaseAmount;

    ondas.forEach((o, idx) => {
        let newTargetAmp;
        const influence = Math.abs(smoothMouseY - H / 2) * 0.03;
        const extraAmp = clickAmplitude * (60 + idx * 10);
        newTargetAmp = (45 + idx * 8) + influence * interactiveTransition + extraAmp;

        o.targetAmp = newTargetAmp;
        o.amp += (o.targetAmp - o.amp) * o.ampEase;

        const verticalInfluence = ((smoothMouseY - H / 2) * 0.04 * (idx + 1) * interactiveTransition) + clickHeight;

        o.corAtual = interpolarCor(o.corBase, o.corQuente, heatIntensity);

        // === ONDAS COM EFEITO DE LABAREDA ===
        ctx.beginPath();
        
        const freqMultiplier = 1 + clickAmplitude * 0.8;
        const adjustedFreq = o.freq * freqMultiplier;
        
        for (let x = 0; x <= W; x += 10) {
            const baseY = Math.sin(x * adjustedFreq + o.fase) * o.amp;
            const harmonic = Math.sin(x * adjustedFreq * 2.5 + o.fase) * (o.amp * clickAmplitude * 0.6);
            const y = baseY + harmonic + H / 2 + verticalInfluence;
            
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H);
        ctx.lineTo(0, H);
        ctx.closePath();

        // Gradiente com fogo
        const gradBottom = ctx.createLinearGradient(0, 0, 0, H);
        
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

    requestAnimationFrame(desenhar);
}

desenhar();

/* ==================== MODAL DE AVATARES ==================== */
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('avatarModal');
    const avatarButton = document.getElementById('chooseAvatar');
    const confirmButton = document.getElementById('confirmAvatar');
    const closeAvatarButton = document.getElementById('closeAvatar');
    const avatarOptions = document.querySelectorAll('.avatar-option');
    const fileInput = document.getElementById('FotoPerfil');
    const fileLabel = fileInput ? fileInput.parentElement : null;
    const originalAvatarButtonHTML = avatarButton ? avatarButton.innerHTML : '';
    let selectedAvatar = null;     // seleção temporária dentro do modal
    let appliedAvatarSrc = null;    // avatar efetivamente aplicado

    // Upload de arquivo - mostrar nome e prévia
    if (fileInput && fileLabel) {
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            
            if (file) {
                // Se já houver avatar aplicado, pedir confirmação
                if (appliedAvatarSrc) {
                    const proceed = await confirmSwap('Você selecionou uma foto de arquivo. Isso vai substituir o avatar escolhido anteriormente. Continuar?');
                    if (!proceed) {
                        fileInput.value = '';
                        return;
                    }
                }

                // Verifica se é uma imagem
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    
                    reader.onload = function(event) {
                        // Cria container para prévia
                        const container = document.createElement('div');
                        container.className = 'file-preview-content';
                        
                        const preview = document.createElement('img');
                        preview.src = event.target.result;
                        preview.className = 'file-preview-image';
                        
                        const fileName = document.createElement('span');
                        fileName.textContent = file.name.length > 20 ? file.name.substring(0, 17) + '...' : file.name;
                        fileName.className = 'file-name-text';
                        
                        container.appendChild(preview);
                        container.appendChild(fileName);
                        
                        fileLabel.innerHTML = '';
                        fileLabel.appendChild(fileInput);
                        fileLabel.appendChild(container);
                        
                        console.log('[CriarPerfil] Imagem carregada:', file.name);
                    };
                    
                    reader.readAsDataURL(file);
                } else {
                    // Se não for imagem, mostra apenas o nome
                    const container = document.createElement('div');
                    container.className = 'file-preview-content';
                    
                    const fileName = document.createElement('span');
                    fileName.textContent = file.name.length > 25 ? file.name.substring(0, 22) + '...' : file.name;
                    fileName.className = 'file-name-text';
                    
                    container.appendChild(fileName);
                    
                    fileLabel.innerHTML = '';
                    fileLabel.appendChild(fileInput);
                    fileLabel.appendChild(container);
                    
                    console.log('[CriarPerfil] Arquivo carregado:', file.name);
                }
                // Exclusividade: ao escolher arquivo, limpa avatar aplicado e seleção
                avatarOptions.forEach(opt => opt.classList.remove('selected'));
                selectedAvatar = null;
                appliedAvatarSrc = null;
                if (avatarButton) avatarButton.innerHTML = originalAvatarButtonHTML;
            } else {
                // Se usuário limpar o arquivo, volta ao estado padrão
                fileLabel.innerHTML = '';
                fileLabel.appendChild(fileInput);
                fileLabel.appendChild(document.createTextNode('Escolha um arquivo'));
            }
        });
    }

    // Abrir modal - desativa waves
    avatarButton.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'block';
        interactive = false;
        isFormFocused = true;
        console.log('[waves-criarPerfil] Modal aberto — interactive OFF');
    });

    // Fechar modal com botão X - reativa waves
    if (closeAvatarButton) {
        closeAvatarButton.addEventListener('click', () => {
            modal.style.display = 'none';
            interactive = true;
            isFormFocused = false;
            console.log('[waves-criarPerfil] Modal fechado (X) — interactive ON');
        });
    }

    // Fechar modal ao clicar fora - reativa waves
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            interactive = true;
            isFormFocused = false;
            console.log('[waves-criarPerfil] Modal fechado — interactive ON');
        }
    });

    // Selecionar avatar
    avatarOptions.forEach(option => {
        option.addEventListener('click', () => {
            avatarOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedAvatar = option.querySelector('img').src;
        });
    });

    // Confirmar seleção - reativa waves
    confirmButton.addEventListener('click', async () => {
        if (selectedAvatar) {
            // Se houver arquivo selecionado, pedir confirmação antes de substituir
            if (fileInput && fileInput.files && fileInput.files.length > 0) {
                const proceed = await confirmSwap('Você selecionou um avatar. Isso vai substituir a foto enviada por arquivo. Continuar?');
                if (!proceed) {
                    return;
                }
            }
            const container = document.createElement('div');
            container.className = 'avatar-button-content';
            
            const preview = document.createElement('img');
            preview.src = selectedAvatar;
            preview.className = 'avatar-preview';
            
            const text = document.createElement('span');
            text.textContent = 'Mudar Avatar';
            text.className = 'avatar-text';
            
            container.appendChild(preview);
            container.appendChild(text);
            
            avatarButton.innerHTML = '';
            avatarButton.appendChild(container);
            
            modal.style.display = 'none';
            interactive = true;
            isFormFocused = false;
            console.log('[waves-criarPerfil] Avatar confirmado — interactive ON');

            // Exclusividade: ao escolher avatar, limpa seleção de arquivo
            if (fileInput && fileLabel) {
                fileInput.value = '';
                fileLabel.innerHTML = '';
                fileLabel.appendChild(fileInput);
                fileLabel.appendChild(document.createTextNode('Escolha um arquivo'));
            }

            appliedAvatarSrc = selectedAvatar;
        }
    });

    // Fechar com ESC - reativa waves
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            interactive = true;
            isFormFocused = false;
            console.log('[waves-criarPerfil] Modal fechado com ESC — interactive ON');
        }
    });

    // ==================== BOTÃO DE VOLTAR ====================
    const btnVoltar = document.getElementById('btnVoltar');
    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            // Volta para a tela de cadastro
            window.location.href = '../Cadastro_E_Perfil/Cadastro.html';
        });
    }
});

/* ========== CONFIGURAÇÕES DA PÁGINA ========== */
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
// Botões de salvar/restaurar removidos — configurações são aplicadas automaticamente

// Botão de configurações - desativa interatividade das waves
if (settingsBtn) {
    settingsBtn.addEventListener('mouseenter', () => {
        interactive = false;
        console.log('[waves-criarPerfil] Mouse sobre botão config — interactive OFF');
    });
    
    settingsBtn.addEventListener('mouseleave', () => {
        if (!isFormFocused && !isSettingsOpen) {
            interactive = true;
            console.log('[waves-criarPerfil] Mouse saiu do botão config — interactive ON');
        }
    });
}

/* ==================== MODAL DE CONFIRMAÇÃO REUTILIZÁVEL ==================== */
function confirmSwap(message) {
    return new Promise((resolve) => {
        const overlay = document.getElementById('alertOverlay');
        const msg = document.getElementById('alertMessage');
        const ok = document.getElementById('alertOk');
        const cancel = document.getElementById('alertCancel');

        if (!overlay || !msg || !ok || !cancel) {
            // Se o modal não existir, segue em frente para não travar a UX
            resolve(true);
            return;
        }

        msg.textContent = message;
        overlay.style.display = 'flex';
        overlay.classList.add('active');
        interactive = false;
        isFormFocused = true;

        const cleanup = () => {
            overlay.classList.remove('active');
            overlay.style.display = 'none';
            ok.removeEventListener('click', onOk);
            cancel.removeEventListener('click', onCancel);
            document.removeEventListener('keydown', onKey);
            if (!isSettingsOpen) {
                interactive = true;
                isFormFocused = false;
            }
        };

        const onOk = () => { cleanup(); resolve(true); };
        const onCancel = () => { cleanup(); resolve(false); };
        const onKey = (e) => {
            if (e.key === 'Escape') { onCancel(); }
            else if (e.key === 'Enter') { onOk(); }
        };

        ok.addEventListener('click', onOk);
        cancel.addEventListener('click', onCancel);
        document.addEventListener('keydown', onKey);
    });
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
        console.warn('[Configurações-CriarPerfil] Elementos não encontrados');
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
    localStorage.setItem('criarPerfilPageSettings', JSON.stringify(settings));
    applySettings(settings);
    console.log('[Configurações-CriarPerfil] Salvas:', settings);
}

// Aplicar configurações
function applySettings(settings) {
    // Limpa classes anteriores
    document.body.classList.remove('light-theme', 'dark-theme', 'large-text', 'high-contrast', 'reduce-motion');
    document.documentElement.classList.remove('light-theme', 'dark-theme', 'large-text', 'high-contrast', 'reduce-motion');

    // Ondas
    if (canvas) {
        canvas.style.transition = 'opacity 1.5s ease-out';
        // Limpa timeouts pendentes sempre que a configuração muda
        if (waveHideTimeoutId) {
            clearTimeout(waveHideTimeoutId);
            waveHideTimeoutId = null;
        }

        if (settings.enableWaves) {
            // Garante que volte a exibir e depois anima a opacidade
            canvas.style.display = 'block';
            // Usa rAF para garantir que o browser aplique o display antes da opacidade
            requestAnimationFrame(() => {
                canvas.style.opacity = '1';
            });
        } else {
            // Faz fade-out e só esconde se ainda estiver desabilitado ao final
            canvas.style.opacity = '0';
            waveHideTimeoutId = setTimeout(() => {
                const latest = loadSettings();
                if (!latest.enableWaves) {
                    canvas.style.display = 'none';
                }
                waveHideTimeoutId = null;
            }, 1500);
        }
    }

    // Tema
    if (settings.theme === 'dark') {
        document.body.classList.add('dark-theme');
        document.documentElement.classList.add('dark-theme');
    } else if (settings.theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.body.classList.add('dark-theme');
            document.documentElement.classList.add('dark-theme');
        }
        
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (settings.theme === 'auto') {
                if (e.matches) {
                    document.body.classList.add('dark-theme');
                    document.documentElement.classList.add('dark-theme');
                } else {
                    document.body.classList.remove('dark-theme');
                    document.documentElement.classList.remove('dark-theme');
                }
                setWavePalettesFromCSS();
            }
        });
    }

    // Atualiza cores das waves
    setWavePalettesFromCSS();

    // Texto maior
    if (settings.largerText) {
        document.body.classList.add('large-text');
        document.documentElement.classList.add('large-text');
    }

    // Alto contraste
    if (settings.highContrast) {
        document.body.classList.add('high-contrast');
        document.documentElement.classList.add('high-contrast');
    }

    console.log('[Configurações-CriarPerfil] Efeito ao clicar:', settings.enableClickEffect ? 'ATIVADO' : 'DESATIVADO');
    console.log('[Configurações-CriarPerfil] Efeito ao segurar:', settings.enableHoldEffect ? 'ATIVADO' : 'DESATIVADO');
}

// Função para atualizar paletas de cores das waves
function setWavePalettesFromCSS() {
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

    const coresBase = [
        getCssVar('--wave1') || 'rgba(255,192,192,0.7)',
        getCssVar('--wave2') || 'rgba(255,170,150,0.6)',
        getCssVar('--wave3') || 'rgba(255,210,180,0.5)'
    ];
    const coresQuentes = [
        getCssVar('--waveHot1') || 'rgba(255,200,0,0.9)',
        getCssVar('--waveHot2') || 'rgba(255,140,0,0.85)',
        getCssVar('--waveHot3') || 'rgba(255,69,0,0.8)'
    ];

    ondas.forEach((o, i) => {
        o.corBase = coresBase[i % coresBase.length];
        o.corQuente = coresQuentes[i % coresQuentes.length];
    });
}

// Função de restaurar padrões removida — sem botão de reset; usuário pode ajustar opções manualmente

// Abrir modal
if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
        if (settingsModal) {
            settingsModal.classList.add('active');
            isSettingsOpen = true;
            interactive = false;
            console.log('[Configurações-CriarPerfil] Modal aberto — interactive OFF');
        }
    });
}

// Fechar modal com animação
function closeModalSettings() {
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
        
        if (!isFormFocused && !caixa.matches(':hover') && !settingsBtn.matches(':hover')) {
            interactive = true;
            console.log('[Configurações-CriarPerfil] Modal fechado — interactive ON');
        }
    }, 300);
}

if (closeSettings) {
    closeSettings.addEventListener('click', closeModalSettings);
}

// Botão "Salvar e Fechar" removido

// Fechar ao clicar fora
if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            closeModalSettings();
        }
    });
}

// Botão de restaurar padrões removido

// Salvar ao mudar qualquer opção
document.querySelectorAll('.settings-option input').forEach(input => {
    input.addEventListener('change', saveSettings);
});

// Permitir clicar na caixa toda para marcar/desmarcar
document.querySelectorAll('.settings-option').forEach(option => {
    option.addEventListener('click', (e) => {
        const input = option.querySelector('input');
        if (!input) return;

        // Se o clique foi diretamente no input, deixa o evento padrão agir
        if (e.target === input) return;

        // Evita duplo toggle quando houver <label> vinculado
        e.preventDefault();

        if (input.type === 'checkbox') {
            input.checked = !input.checked;
        } else if (input.type === 'radio') {
            input.checked = true;
        }
        // Dispara o change para acionar saveSettings
        input.dispatchEvent(new Event('change', { bubbles: true }));
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

/* ==================== EXCLUSIVIDADE NOME: TEXTO x SUGESTÕES ==================== */
(function exclusividadeNome() {
    const nomeInput = document.getElementById('NomePerfil');
    const nomesSelect = document.getElementById('NomesSugerido');
    if (!nomeInput || !nomesSelect) return;

    async function onNomeInput() {
        const hasText = nomeInput.value.trim().length > 0;
        if (hasText && nomesSelect.value) {
            const proceed = await confirmSwap('Você começou a digitar um nome. Isso vai desfazer o nome sugerido selecionado. Continuar?');
            if (proceed) {
                // Limpa a seleção do select, mas mantém habilitado para permitir troca de ideia
                nomesSelect.value = '';
            } else {
                // Reverte digitação
                nomeInput.value = '';
                return;
            }
        }
        // Não desabilita o select para permitir a troca com confirmação
    }

    async function onNomesChange() {
        const hasChoice = !!nomesSelect.value;
        if (hasChoice && nomeInput.value.trim().length > 0) {
            const proceed = await confirmSwap('Você selecionou um nome sugerido. Isso vai desfazer o nome que você digitou. Continuar?');
            if (proceed) {
                nomeInput.value = '';
            } else {
                // Reverte a seleção do select
                nomesSelect.value = '';
                return;
            }
        }
        // Não desabilita o input de texto para permitir a troca com confirmação
    }

    // Inicializa estado de acordo com o preenchido atual
    onNomeInput();
    onNomesChange();

    // Listeners
    nomeInput.addEventListener('input', onNomeInput);
    nomesSelect.addEventListener('change', onNomesChange);
})();