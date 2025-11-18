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
    const savedSettings = localStorage.getItem('createProfileSettings');
    return savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
}

let settings = loadSettings();

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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
const baseColorPalette = {
    light: {
        bg: [240, 248, 255],
        wave1: [100, 149, 237],
        wave2: [135, 206, 250],
        wave3: [173, 216, 230],
        glow: [70, 130, 180]
    },
    dark: {
        bg: [10, 15, 30],
        wave1: [25, 25, 112],
        wave2: [0, 0, 139],
        wave3: [72, 61, 139],
        glow: [138, 43, 226]
    }
};

let currentPalette = settings.theme === 'dark' ? baseColorPalette.dark : baseColorPalette.light;

// Paleta de cores de fogo
const fireColors = [
    [255, 69, 0],
    [255, 140, 0],
    [255, 215, 0],
    [255, 255, 255]
];

// Partículas de labaredas
const flames = [];
const maxFlames = 50;

class Flame {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = -Math.random() * 3 - 2;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.size = Math.random() * 8 + 4;
        this.colorIndex = Math.floor(Math.random() * (fireColors.length - 1));
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1;
        this.life -= this.decay;
        this.size *= 0.98;
    }

    draw() {
        if (this.life <= 0) return;

        const color1 = fireColors[this.colorIndex];
        const color2 = fireColors[Math.min(this.colorIndex + 1, fireColors.length - 1)];
        const blend = this.life;

        const r = color1[0] * blend + color2[0] * (1 - blend);
        const g = color1[1] * blend + color2[1] * (1 - blend);
        const b = color1[2] * blend + color2[2] * (1 - blend);

        ctx.save();
        ctx.globalAlpha = this.life * 0.8;
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Criar ondas
const waves = [];
const waveCount = 3;
const baseWaveSpeed = 0.02;

for (let i = 0; i < waveCount; i++) {
    waves.push({
        offset: (Math.PI * 2 / waveCount) * i,
        amplitude: 60 + i * 15,
        frequency: 0.005 - i * 0.0005,
        speed: baseWaveSpeed * (1 + i * 0.3),
        colorIndex: i
    });
}

function lerpColor(color1, color2, t) {
    return color1.map((c, i) => Math.round(c + (color2[i] - c) * t));
}

function getWaveColor(index, heatAmount) {
    const paletteKey = `wave${index + 1}`;
    const baseColor = currentPalette[paletteKey];
    const heatColor = fireColors[1];
    return lerpColor(baseColor, heatColor, Math.min(heatAmount, 0.7));
}

let time = 0;

function animate() {
    if (!settings.enableWaves) {
        requestAnimationFrame(animate);
        return;
    }

    // Atualizar suavização do mouse
    mouseX += (targetMouseX - mouseX) * easeAmount;
    mouseY += (targetMouseY - mouseY) * easeAmount;

    // Atualizar transição de interatividade
    const targetInteractive = interactive ? 1 : 0;
    interactiveTransition += (targetInteractive - interactiveTransition) * transitionSpeed;

    // Atualizar direção da onda
    waveDirection += (targetWaveDirection - waveDirection) * directionEaseAmount;

    // Decaimento de calor
    heatIntensity *= heatDecayRate;

    // Decaimento de amplitude de clique
    clickAmplitude *= clickAmplitudeDecayRate;

    // Suavização de altura de clique
    clickHeight += (targetClickHeight - clickHeight) * clickHeightEaseAmount;
    targetClickHeight *= 0.9;

    // Boost de velocidade
    if (isMousePressed && settings.enableHoldEffect) {
        speedBoost = Math.min(speedBoost + boostBuildRate, maxSpeedBoost);
        heatIntensity = Math.min(heatIntensity + 0.03, 1);

        if (settings.enableClickEffect && Math.random() < 0.3 && flames.length < maxFlames) {
            flames.push(new Flame(mouseX, mouseY));
        }
    } else {
        speedBoost *= boostDecayRate;
    }

    // Limpar canvas
    const bgColor = currentPalette.bg;
    ctx.fillStyle = `rgb(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Tempo ajustado pela velocidade e direção
    time += (baseWaveSpeed + speedBoost * 0.02) * waveDirection * interactiveTransition;

    // Desenhar ondas
    waves.forEach((wave, index) => {
        ctx.beginPath();

        const waveColor = getWaveColor(index, heatIntensity);
        const glowColor = currentPalette.glow;

        // Glow externo
        ctx.shadowBlur = 20 + heatIntensity * 30;
        ctx.shadowColor = `rgba(${glowColor[0]}, ${glowColor[1]}, ${glowColor[2]}, ${0.5 + heatIntensity * 0.5})`;

        for (let x = 0; x <= canvas.width; x += 5) {
            const distanceToMouse = Math.abs(x - mouseX);
            const mouseInfluence = Math.max(0, 1 - distanceToMouse / 300) * interactiveTransition;

            const baseY = canvas.height / 2 + index * 40;
            const waveY = Math.sin(x * wave.frequency + time + wave.offset) * wave.amplitude;
            const mouseDistortion = Math.sin(distanceToMouse * 0.01 + time * 2) * mouseInfluence * 50;
            const clickDistortion = clickAmplitude * Math.exp(-Math.pow(distanceToMouse / 150, 2)) * 60;

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
        gradient.addColorStop(0, `rgba(${waveColor[0]}, ${waveColor[1]}, ${waveColor[2]}, 0.3)`);
        gradient.addColorStop(1, `rgba(${waveColor[0]}, ${waveColor[1]}, ${waveColor[2]}, 0.8)`);

        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.shadowBlur = 0;
    });

    // Atualizar e desenhar labaredas
    if (settings.enableClickEffect) {
        for (let i = flames.length - 1; i >= 0; i--) {
            flames[i].update();
            flames[i].draw();
            if (flames[i].life <= 0) {
                flames.splice(i, 1);
            }
        }
    }

    requestAnimationFrame(animate);
}

animate();

// Event listeners de mouse
document.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
});

document.addEventListener('mousedown', (e) => {
    if (!isFormFocused && !isSettingsOpen && settings.enableHoldEffect) {
        isMousePressed = true;
        targetClickHeight = 100;
        if (settings.enableClickEffect) {
            clickAmplitude = maxClickAmplitude;
            for (let i = 0; i < 10; i++) {
                flames.push(new Flame(e.clientX, e.clientY));
            }
        }
    }
});

document.addEventListener('mouseup', () => {
    isMousePressed = false;
    targetClickHeight = 0;
});

// Alternar direção com clique direito
document.addEventListener('contextmenu', (e) => {
    if (!isFormFocused && !isSettingsOpen) {
        e.preventDefault();
        targetWaveDirection *= -1;
    }
});

/* ==================== FORMULÁRIO DE CRIAR PERFIL ==================== */

document.addEventListener('DOMContentLoaded', () => {
    const formCriarPerfil = document.getElementById('formCriarPerfil');
    const btnVoltar = document.getElementById('btnVoltar');
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

    function mostrarAlerta(mensagem, callback = null, mostrarCancelar = false) {
        if (alertOverlay && alertMessage) {
            alertMessage.textContent = mensagem;
            alertOverlay.style.display = 'flex';
            
            if (callback && mostrarCancelar) {
                alertCancel.style.display = 'inline-block';
                alertOk.onclick = () => {
                    alertOverlay.style.display = 'none';
                    callback();
                };
                alertCancel.onclick = () => {
                    alertOverlay.style.display = 'none';
                };
            } else {
                alertCancel.style.display = 'none';
                alertOk.onclick = () => {
                    alertOverlay.style.display = 'none';
                    if (callback) callback();
                };
            }
        } else {
            alert(mensagem);
            if (callback) callback();
        }
    }

    // Botão Voltar
    if(btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            mostrarAlerta('Deseja realmente sair? As alterações não salvas serão perdidas.', () => {
                window.location.href = '../Login/loginhtml.php';
            }, true);
        });
    }

    // Sincronizar nome sugerido com input
    if(nomesSugerido) {
        nomesSugerido.addEventListener('change', (e) => {
            if(e.target.value) {
                nomePerfil.value = e.target.value;
            }
        });
    }

    // Abrir modal de avatares
    if(chooseAvatar) {
        chooseAvatar.addEventListener('click', () => {
            if (avatarModal) {
                avatarModal.style.display = 'flex';
                isSettingsOpen = true;
            }
        });
    }

    // Fechar modal de avatares
    if(closeAvatar) {
        closeAvatar.addEventListener('click', () => {
            if (avatarModal) {
                avatarModal.style.display = 'none';
                isSettingsOpen = false;
            }
        });
    }

    // Fechar modal clicando fora
    if(avatarModal) {
        avatarModal.addEventListener('click', (e) => {
            if (e.target === avatarModal) {
                avatarModal.style.display = 'none';
                isSettingsOpen = false;
            }
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
            if(avatarSelecionado !== null) {
                document.getElementById('avatarSelecionado').value = avatarSelecionado;
                document.getElementById('tipoFoto').value = avatarSelecionado ? 'avatar' : '';
                if (avatarModal) {
                    avatarModal.style.display = 'none';
                    isSettingsOpen = false;
                }
                mostrarAlerta('Avatar selecionado com sucesso!');
            } else {
                mostrarAlerta('Por favor, selecione um avatar');
            }
        });
    }

    // Quando seleciona arquivo, limpa avatar
    if(fotoPerfil) {
        fotoPerfil.addEventListener('change', () => {
            if(fotoPerfil.files.length > 0) {
                document.getElementById('tipoFoto').value = 'upload';
                document.getElementById('avatarSelecionado').value = '';
                avatarSelecionado = null;
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

                if(data.success) {
                    mostrarAlerta(data.message, () => {
                        if(data.redirect) {
                            window.location.href = data.redirect;
                        } else {
                            window.location.href = '../Home/index.php';
                        }
                    });
                } else {
                    mostrarAlerta('Erro: ' + data.message);
                }

            } catch (err) {
                mostrarAlerta('Erro ao criar perfil: ' + err);
            }
        });
    }

    // Detectar foco em inputs
    const inputs = document.querySelectorAll('input, select, textarea, button');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            isFormFocused = true;
            interactive = false;
        });
        input.addEventListener('blur', () => {
            isFormFocused = false;
            interactive = true;
        });
    });

    /* ==================== CONFIGURAÇÕES ==================== */
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');

    // Abrir modal de configurações
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.add('active');
            isSettingsOpen = true;
            interactive = false;
        });
    }

    // Fechar modal de configurações
    if (closeSettings) {
        closeSettings.addEventListener('click', () => {
            settingsModal.classList.remove('active');
            isSettingsOpen = false;
            interactive = true;
        });
    }

    // Fechar ao clicar fora
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.classList.remove('active');
                isSettingsOpen = false;
                interactive = true;
            }
        });
    }

    // Aplicar configurações salvas
    function applySettings() {
        // Ondas
        const enableWavesCheckbox = document.getElementById('enableWaves');
        if (enableWavesCheckbox) {
            enableWavesCheckbox.checked = settings.enableWaves;
            canvas.style.display = settings.enableWaves ? 'block' : 'none';
        }

        // Tema
        const themeInputs = document.querySelectorAll('input[name="theme"]');
        themeInputs.forEach(input => {
            if (input.value === settings.theme) {
                input.checked = true;
            }
        });
        document.documentElement.setAttribute('data-theme', settings.theme);
        currentPalette = settings.theme === 'dark' ? baseColorPalette.dark : baseColorPalette.light;

        // Efeito de clique
        const enableClickEffectCheckbox = document.getElementById('enableClickEffect');
        if (enableClickEffectCheckbox) {
            enableClickEffectCheckbox.checked = settings.enableClickEffect;
        }

        // Efeito de segurar
        const enableHoldEffectCheckbox = document.getElementById('enableHoldEffect');
        if (enableHoldEffectCheckbox) {
            enableHoldEffectCheckbox.checked = settings.enableHoldEffect;
        }

        // Alto contraste
        const highContrastCheckbox = document.getElementById('highContrast');
        if (highContrastCheckbox) {
            highContrastCheckbox.checked = settings.highContrast;
            document.body.classList.toggle('high-contrast', settings.highContrast);
        }

        // Texto maior
        const largerTextCheckbox = document.getElementById('largerText');
        if (largerTextCheckbox) {
            largerTextCheckbox.checked = settings.largerText;
            document.body.classList.toggle('larger-text', settings.largerText);
        }
    }

    applySettings();

    // Salvar configurações
    function saveSettings() {
        settings.enableWaves = document.getElementById('enableWaves')?.checked ?? true;
        settings.theme = document.querySelector('input[name="theme"]:checked')?.value ?? 'light';
        settings.enableClickEffect = document.getElementById('enableClickEffect')?.checked ?? true;
        settings.enableHoldEffect = document.getElementById('enableHoldEffect')?.checked ?? true;
        settings.highContrast = document.getElementById('highContrast')?.checked ?? false;
        settings.largerText = document.getElementById('largerText')?.checked ?? false;

        localStorage.setItem('createProfileSettings', JSON.stringify(settings));
        applySettings();
    }

    // Event listeners para configurações
    document.querySelectorAll('.settings-option input').forEach(input => {
        input.addEventListener('change', saveSettings);
    });
});