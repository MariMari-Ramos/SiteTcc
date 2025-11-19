
/* ================= CriarPerfil.js (simplificado) ================= */
/* Sistema de ondas removido. Mantido apenas lógica de criação de perfil
   e configurações de acessibilidade. */

const defaultSettings = { 
    enableWaves: true,
    theme: 'light', 
    enableClickEffect: true,
    enableHoldEffect: true,
    highContrast: false, 
    largerText: false 
};
function loadSettings(){
    const saved = localStorage.getItem('createProfileSettings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved)} : { ...defaultSettings };
}
let settings = loadSettings();

/* ==================== FORMULÁRIO DE CRIAR PERFIL ==================== */

document.addEventListener('DOMContentLoaded', () => {
    const formCriarPerfil = document.getElementById('formCriarPerfil');
    const backBtn = document.getElementById('backBtn');
    const nomePerfil = document.getElementById('NomePerfil');
    const nomesSugerido = document.getElementById('NomesSugerido');
    const chooseAvatar = document.getElementById('chooseAvatar');
    const avatarModal = document.getElementById('avatarModal');
    const closeAvatar = document.getElementById('closeAvatar');
    const confirmAvatar = document.getElementById('confirmAvatar');
    const fotoPerfil = document.getElementById('FotoPerfil');
    const alertOverlay = document.getElementById('alertOverlay');
    const alertMessage = document.getElementById('alertMessage');
    const alertOk = document.getElementById('alertOk');
    const alertCancel = document.getElementById('alertCancel');
    
    let avatarSelecionado = null;
    let nameSource = null; // 'typed' | 'suggested' | null
    let photoSource = null; // 'avatar' | 'upload' | null

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
            val = cs.getPropertyValue(name);
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
            o.corBase = coresBase[i];
            o.corQuente = coresQuentes[i];
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
        if (isMouseInsideForm) {
            targetMouseX = window.innerWidth / 2;
            targetMouseY = window.innerHeight / 2;
            return;
        }
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
        const centerX = window.innerWidth / 2;
        targetWaveDirection = (e.clientX < centerX) ? 1 : -1;
    });

    window.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        if (isMouseInsideForm || e.target.closest('[data-no-wave]')) return;
        isMousePressed = true;
        const currentSettings = loadSettings();
        if (currentSettings.enableClickEffect && wavesEnabled && interactive && !isSettingsOpen && !isFormFocused) {
            heatIntensity = 1;
            clickAmplitude = maxClickAmplitude;
            targetClickHeight = -(canvas.height / 2 - e.clientY);
        }
    });

    window.addEventListener('mouseup', (e) => {
        if (e.button === 0) {
            isMousePressed = false;
        }
    });

    const perfilBox = document.querySelector('.CaixaCriarPerfil');

    if (formCriarPerfil) {
        formCriarPerfil.addEventListener('focusin', (e) => {
            if (e.target.matches('input, select, textarea, button')) {
                isFormFocused = true;
                interactive = false;
            }
        }, true);

        formCriarPerfil.addEventListener('focusout', (e) => {
            if (e.target.matches('input, select, textarea, button')) {
                isFormFocused = false;
                if (!isMouseInsideForm && !isSettingsOpen) {
                    interactive = true;
                }
            }
        }, true);
    }

    if (perfilBox) {
        perfilBox.addEventListener('mouseenter', () => {
            isMouseInsideForm = true;
            interactive = false;
        });
        
        perfilBox.addEventListener('mouseleave', () => {
            isMouseInsideForm = false;
            if (!isFormFocused && !isSettingsOpen) {
                interactive = true;
            }
        });
    }

    if (perfilBox) {
        perfilBox.addEventListener('touchstart', () => {
            isMouseInsideForm = true;
        }, { passive: true });

        perfilBox.addEventListener('touchend', () => {
            isMouseInsideForm = false;
        }, { passive: true });
    }

    let lastFrameTime = Date.now();

    function desenhar() {
        if (!wavesEnabled && !wavesFadingOut) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
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
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }
        }

        const targetTransition = (interactive && !isSettingsOpen) ? 1 : 0;
        interactiveTransition += (targetTransition - interactiveTransition) * transitionSpeed;

        mouseX += (targetMouseX - mouseX) * easeAmount;
        mouseY += (targetMouseY - mouseY) * easeAmount;

        waveDirection += (targetWaveDirection - waveDirection) * directionEaseAmount * interactiveTransition;

        const smoothMouseY = window.innerHeight / 2 + (mouseY - window.innerHeight / 2) * interactiveTransition;

        const currentSettings = loadSettings();
        if (currentSettings.enableHoldEffect && !isFormFocused && interactive && !isSettingsOpen) {
            if (isMousePressed && speedBoost < maxSpeedBoost) {
                speedBoost += boostBuildRate;
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
        targetClickHeight *= 0.9;

        ondas.forEach((o, idx) => {
            o.fase += (o.vel + speedBoost * 0.0005) * waveDirection * interactiveTransition;
            
            o.amp += (o.targetAmp - o.amp) * o.ampEase;

            const colorTransition = Math.min(1, heatIntensity + clickAmplitude * 0.6);
            o.corAtual = interpolarCor(o.corBase, o.corQuente, colorTransition);

            ctx.beginPath();
            for (let x = 0; x <= canvas.width; x += 5) {
                const distanceFromMouse = Math.abs(x - mouseX);
                const mouseInfluence = Math.max(0, 1 - distanceFromMouse / 300) * interactiveTransition;
                
                const baseY = canvas.height / 2 + idx * 50;
                const waveY = Math.sin(x * o.freq + o.fase) * o.amp;
                const mouseDistortion = Math.sin(distanceFromMouse * 0.01 + o.fase * 2) * mouseInfluence * 50;
                const clickDistortion = clickAmplitude * Math.exp(-Math.pow(distanceFromMouse / 150, 2)) * 60;
                
                const y = baseY + waveY + mouseDistortion - clickHeight * mouseInfluence + clickDistortion;

                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();

            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            const currentColorWithOpacity = applyOpacityToCor(o.corAtual, waveFadeOpacity);
            gradient.addColorStop(0, currentColorWithOpacity);
            gradient.addColorStop(1, applyOpacityToCor(o.corAtual, waveFadeOpacity * 0.6));
            
            ctx.fillStyle = gradient;
            ctx.fill();
        });

        animationFrameId = requestAnimationFrame(desenhar);
    }

    desenhar();

    // Alerta simples + confirmação via callback (design original simplificado)
    function mostrarAlerta(mensagem, callback = null, confirmar = false){
        if(!alertOverlay || !alertMessage){
            if(confirmar){
                const ok = window.confirm(mensagem);
                if(ok && callback) callback();
            } else {
                alert(mensagem);
                if(callback) callback();
            }
            return;
        }
        alertMessage.textContent = mensagem;
        alertOverlay.style.display = 'flex';
        if(confirmar){
            alertCancel.style.display = 'inline-block';
            alertOk.onclick = () => { alertOverlay.style.display='none'; if(callback) callback(); };
            alertCancel.onclick = () => { alertOverlay.style.display='none'; };
        } else {
            alertCancel.style.display = 'none';
            alertOk.onclick = () => { alertOverlay.style.display='none'; if(callback) callback(); };
        }
    }

    // Modal de confirmação com callbacks distintos (não quebra mostrarAlerta existente)
    function mostrarConfirmacao(mensagem, onOk, onCancel){
        if(!alertOverlay || !alertMessage){
            const ok = window.confirm(mensagem);
            if(ok){ onOk && onOk(); } else { onCancel && onCancel(); }
            return;
        }
        alertMessage.textContent = mensagem;
        alertOverlay.style.display = 'flex';
        alertCancel.style.display = 'inline-block';
        alertOk.onclick = () => { alertOverlay.style.display='none'; onOk && onOk(); };
        alertCancel.onclick = () => { alertOverlay.style.display='none'; onCancel && onCancel(); };
    }

    // Botão Voltar (novo estilo fixo)
    if(backBtn) {
        backBtn.addEventListener('click', () => {
            mostrarAlerta('Deseja voltar para o cadastro? Alterações não salvas serão perdidas.', () => {
                window.location.href = '../Cadastro_E_Perfil/Cadastro.html';
            }, true);
        });
    }

    // Sincronizar nome sugerido com input
    if(nomesSugerido) {
        let previousSelectValue = nomesSugerido.value;
        nomesSugerido.addEventListener('change', (e) => {
            const val = e.target.value;
            if(val === ''){ if(nameSource === 'suggested') nameSource=null; previousSelectValue=''; return; }
            // Se já havia nome digitado e está trocando para sugerido
            if(nameSource === 'typed' && nomePerfil.value.trim() !== ''){
                mostrarConfirmacao('Ao escolher um nome sugerido, o nome digitado será desconsiderado. Continuar?', () => {
                    // Confirmado
                    nameSource='suggested';
                    nomePerfil.value=''; // Campo não deve exibir nome sugerido
                    previousSelectValue=val;
                }, () => {
                    // Cancelado: reverte seleção
                    e.target.value='';
                });
            } else {
                nameSource='suggested';
                nomePerfil.value=''; // Garantir que não exibe sugerido
                previousSelectValue=val;
            }
        });
    }

    // Detecção de digitação para conflito com nome sugerido
    if(nomePerfil){
        nomePerfil.addEventListener('input', () => {
            const val = nomePerfil.value.trim();
            if(val === ''){ if(nameSource === 'typed') nameSource=null; return; }
            if(nameSource === 'suggested'){
                mostrarConfirmacao('Ao digitar um nome próprio, o nome sugerido selecionado será desconsiderado. Continuar?', () => {
                    // Confirmado
                    nameSource='typed';
                    if(nomesSugerido) nomesSugerido.value='';
                }, () => {
                    // Cancelado: limpa o que foi digitado
                    nomePerfil.value='';
                });
            } else {
                nameSource='typed';
            }
        });
    }

    // Abrir modal de avatares
    if(chooseAvatar) {
        chooseAvatar.addEventListener('click', () => {
            if (avatarModal) avatarModal.style.display = 'flex';
        });
    }

    // Fechar modal de avatares
    if(closeAvatar) {
        closeAvatar.addEventListener('click', () => {
            if (avatarModal) avatarModal.style.display = 'none';
        });
    }

    // Fechar modal clicando fora
    if(avatarModal) {
        avatarModal.addEventListener('click', (e) => {
            if (e.target === avatarModal) avatarModal.style.display = 'none';
        });
    }

    // Selecionar avatar
    const avatarOptions = document.querySelectorAll('.avatar-option');
    avatarOptions.forEach(option => {
        option.addEventListener('click', () => {
            avatarOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            avatarSelecionado = option.dataset.avatar;
        });
    });

    // Confirmar avatar
    if(confirmAvatar) {
        confirmAvatar.addEventListener('click', () => {
            if(avatarSelecionado){
                const aplicarAvatar = () => {
                    document.getElementById('avatarSelecionado').value = avatarSelecionado;
                    document.getElementById('tipoFoto').value = 'avatar';
                    photoSource='avatar';
                    if(avatarModal){ avatarModal.style.display='none'; }
                    resetFileInline();
                    showAvatarInline(avatarSelecionado);
                    mostrarAlerta('Avatar selecionado com sucesso!');
                };
                if(photoSource === 'upload'){
                    mostrarConfirmacao('Ao escolher um avatar, a foto enviada será desconsiderada. Continuar?', aplicarAvatar, ()=>{/* mantém modal e upload */});
                } else {
                    aplicarAvatar();
                }
            } else {
                mostrarAlerta('Por favor, selecione um avatar');
            }
        });
    }

    // Quando seleciona arquivo, limpa avatar
    if(fotoPerfil) {
        fotoPerfil.addEventListener('change', () => {
            if(fotoPerfil.files.length > 0) {
                const file = fotoPerfil.files[0];
                const maxSizeMB = 3; // limite 3MB
                if(!file.type.startsWith('image/')){
                    mostrarAlerta('Arquivo inválido: selecione uma imagem.');
                    fotoPerfil.value='';
                    resetFileInline();
                    return;
                }
                if(file.size > maxSizeMB * 1024 * 1024){
                    mostrarAlerta('Imagem maior que '+maxSizeMB+'MB.');
                    fotoPerfil.value='';
                    resetFileInline();
                    return;
                }
                const aplicarUpload = () => {
                    document.getElementById('tipoFoto').value = 'upload';
                    document.getElementById('avatarSelecionado').value = '';
                    avatarSelecionado = null;
                    photoSource='upload';
                    const reader = new FileReader();
                    reader.onload = e => {
                        showFileInline(e.target.result, file.name);
                        resetAvatarInline();
                    };
                    reader.readAsDataURL(file);
                };
                if(photoSource === 'avatar'){
                    mostrarConfirmacao('Ao enviar uma foto, o avatar escolhido será desconsiderado. Continuar?', aplicarUpload, () => { fotoPerfil.value=''; });
                } else {
                    aplicarUpload();
                }
            } else {
                resetFileInline();
            }
        });
    }

    // Submit do formulário
    if(formCriarPerfil) {
        formCriarPerfil.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nomePerfilValue = nomePerfil.value.trim() || nomesSugerido.value;
            
            if(!nomePerfilValue) {
                mostrarAlerta('Por favor, digite ou selecione um nome para o perfil!');
                return;
            }

            const formData = new FormData(formCriarPerfil);
            
            // Garantir que o nome do perfil está no FormData
            if(!nomePerfil.value && nomesSugerido.value) {
                formData.set('NomePerfil', nomesSugerido.value);
            }

            try {
                const response = await fetch('CriarPerfil.php', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if(data.success){
                    mostrarAlerta(data.message, () => {
                        window.location.href = data.redirect ? data.redirect : '../A_TelaPrincipal/index.php';
                    });
                } else {
                    mostrarAlerta('Erro: ' + data.message);
                }

            } catch (err) {
                mostrarAlerta('Erro ao criar perfil: ' + err);
            }
        });
    }

    // (Interações avançadas removidas) Foco em inputs não altera mais animações.

    /* ==================== CONFIGURAÇÕES ==================== */
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');

    if (settingsBtn) {
        settingsBtn.addEventListener('mouseenter', () => {
            isSettingsOpen = true;
            interactive = false;
        });
        
        settingsBtn.addEventListener('mouseleave', () => {
            if (!settingsModal || !settingsModal.classList.contains('active')) {
                isSettingsOpen = false;
                if (!isFormFocused && !isMouseInsideForm) interactive = true;
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
            console.warn('[CriarPerfil] Algum elemento de configuração não encontrado');
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
        localStorage.setItem('createProfileSettings', JSON.stringify(settings));
        applySettings(settings);
        console.log('[Configurações-CriarPerfil] Salvas:', settings);
    }

    function applySettings(settings) {
        document.body.classList.remove('light-theme', 'dark-theme', 'large-text', 'high-contrast');
        document.documentElement.classList.remove('light-theme', 'dark-theme', 'large-text', 'high-contrast');

        const previousWavesState = wavesEnabled;
        wavesEnabled = settings.enableWaves;
        
        if (canvas) {
            if (!wavesEnabled && previousWavesState) {
                wavesFadingOut = true;
                waveFadeOpacity = 1;
            } else if (wavesEnabled && !previousWavesState) {
                wavesFadingOut = false;
                waveFadeOpacity = 1;
                if (!animationFrameId) {
                    desenhar();
                }
            }
        }

        if (settings.theme === 'dark') {
            document.body.classList.add('dark-theme');
            document.documentElement.setAttribute('data-theme', 'dark');
        } else if (settings.theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.body.classList.add('dark-theme');
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.body.classList.add('light-theme');
                document.documentElement.setAttribute('data-theme', 'light');
            }
        } else {
            document.body.classList.add('light-theme');
            document.documentElement.setAttribute('data-theme', 'light');
        }

        setWavePalettesFromCSS();

        if (settings.largerText) {
            document.body.classList.add('large-text');
            document.documentElement.classList.add('large-text');
        } else {
            document.body.classList.remove('large-text');
            document.documentElement.classList.remove('large-text');
        }

        if (settings.highContrast) {
            document.body.classList.add('high-contrast');
            document.documentElement.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
            document.documentElement.classList.remove('high-contrast');
        }

        console.log('[Configurações-CriarPerfil] Efeito ao clicar:', settings.enableClickEffect ? 'ATIVADO' : 'DESATIVADO');
        console.log('[Configurações-CriarPerfil] Efeito ao segurar:', settings.enableHoldEffect ? 'ATIVADO' : 'DESATIVADO');
    }

    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.add('active');
            isSettingsOpen = true;
            interactive = false;
            
            const currentSettings = loadSettings();
            document.getElementById('enableWaves').checked = currentSettings.enableWaves;
            document.getElementById('enableClickEffect').checked = currentSettings.enableClickEffect;
            document.getElementById('enableHoldEffect').checked = currentSettings.enableHoldEffect;
            document.getElementById('highContrast').checked = currentSettings.highContrast;
            document.getElementById('largerText').checked = currentSettings.largerText;
            document.querySelector(`input[value="${currentSettings.theme}"]`).checked = true;
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
            const input = option.querySelector('input');
            if (input && e.target !== input) {
                if (input.type === 'checkbox') {
                    input.checked = !input.checked;
                } else if (input.type === 'radio') {
                    input.checked = true;
                }
                input.dispatchEvent(new Event('change'));
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

    // ===== Pré-visualizações inline =====
    const fileLabel = fotoPerfil?.closest('label.CustomFile');
    const chooseAvatarOriginalText = chooseAvatar?.textContent || 'Escolher Avatar';

    // Envolver o texto "Escolha um arquivo" em um span para poder ocultar quando houver preview
    let placeholderSpan = null;
    function ensurePlaceholderSpan(){
        if(!fileLabel) return null;
        placeholderSpan = fileLabel.querySelector('.file-placeholder-text');
        if(placeholderSpan) return placeholderSpan;
        const textNode = Array.from(fileLabel.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0);
        if(textNode){
            const span = document.createElement('span');
            span.className = 'file-placeholder-text';
            span.textContent = textNode.textContent.trim();
            fileLabel.replaceChild(span, textNode);
            placeholderSpan = span;
            return span;
        }
        return null;
    }
    // Inicializa placeholder
    ensurePlaceholderSpan();

    function ensureFileInput(){
        if(!fileLabel) return null;
        let input = fileLabel.querySelector('input[type="file"]');
        if(!input){
            input = document.createElement('input');
            input.type='file';
            input.id='FotoPerfil';
            input.name='FotoPerfil';
            input.accept='image/*';
            fileLabel.insertBefore(input, fileLabel.firstChild);
            // Garantir placeholder presente
            ensurePlaceholderSpan();
            // Reanexar handler principal
            input.addEventListener('change', ()=>{
                if(input.files.length > 0){
                    const file = input.files[0];
                    const maxSizeMB=3;
                    if(!file.type.startsWith('image/')){ mostrarAlerta('Arquivo inválido: selecione uma imagem.'); input.value=''; resetFileInline(); return; }
                    if(file.size > maxSizeMB*1024*1024){ mostrarAlerta('Imagem maior que '+maxSizeMB+'MB.'); input.value=''; resetFileInline(); return; }
                    const aplicarUpload = () => {
                        document.getElementById('tipoFoto').value='upload';
                        document.getElementById('avatarSelecionado').value='';
                        avatarSelecionado=null;
                        photoSource='upload';
                        const reader=new FileReader();
                        reader.onload=e=>{ showFileInline(e.target.result, file.name); resetAvatarInline(); };
                        reader.readAsDataURL(file);
                    };
                    if(photoSource === 'avatar'){
                        mostrarConfirmacao('Ao enviar uma foto, o avatar escolhido será desconsiderado. Continuar?', aplicarUpload, ()=>{ input.value=''; });
                    } else {
                        aplicarUpload();
                    }
                } else {
                    resetFileInline();
                }
            });
        }
        return input;
    }

    function showFileInline(dataURL, fileName){
        if(!fileLabel) return;
        ensureFileInput();
        ensurePlaceholderSpan();
        let preview = fileLabel.querySelector('.inline-file-preview');
        if(!preview){
            preview = document.createElement('div');
            preview.className='inline-file-preview file-preview-content';
            fileLabel.appendChild(preview);
        }
        preview.innerHTML = `<img class="file-preview-image" src="${dataURL}" alt="Prévia do arquivo"><span class="file-name-text" title="${fileName}">${fileName}</span>`;
        if(placeholderSpan) placeholderSpan.style.display = 'none';
    }
    function resetFileInline(){
        if(!fileLabel) return;
        const preview = fileLabel.querySelector('.inline-file-preview');
        if(preview) preview.remove();
        ensurePlaceholderSpan();
        if(placeholderSpan) placeholderSpan.style.display = '';
    }
    function showAvatarInline(src){
        if(!chooseAvatar) return;
        chooseAvatar.innerHTML = `<div class="avatar-button-content"><img class="avatar-preview" src="${src}" alt="Avatar selecionado"><span class="avatar-text">Avatar escolhido</span></div>`;
    }
    function resetAvatarInline(){
        if(!chooseAvatar) return;
        chooseAvatar.textContent = chooseAvatarOriginalText;
    }
});