/* ========== CADASTRO.JS ==========
   Controla formulário de CADASTRO/REGISTRO de nova conta
   - Validação de email e senha
   - Confirmação de senha
   - Envio para Cadastrar.php
   - Waves com todas as melhorias (fogo, labaredas, boost)
*/

function MostrarSenha(){
    var inputSenha = document.getElementById('SenhaCadastro');  
    var btnMostrarSenha = document.getElementById('BtnVerSenha');

    if(inputSenha.type === 'password'){
        inputSenha.setAttribute('type', 'text');
        btnMostrarSenha.classList.replace('bi-eye-fill', 'bi-eye-slash-fill');
    } else {
        inputSenha.setAttribute('type','password');
        btnMostrarSenha.classList.replace('bi-eye-slash-fill','bi-eye-fill');
    }
}

function ConfirmMostrarSenha(){
    var inputSenha = document.getElementById('ConfirmSenhaCadastro');  
    var btnMostrarSenha = document.getElementById('BtnConfirmVerSenha');

    if(inputSenha.type === 'password'){
        inputSenha.setAttribute('type', 'text');
        btnMostrarSenha.classList.replace('bi-eye-fill', 'bi-eye-slash-fill');
    } else {
        inputSenha.setAttribute('type','password');
        btnMostrarSenha.classList.replace('bi-eye-slash-fill','bi-eye-fill');
    }
}

function mostrarAlerta(mensagem){
    const overlay = document.getElementById("overlay");
    const texto = overlay.querySelector("p");
    texto.textContent = mensagem;
    overlay.style.display = "flex"; 
}

function fecharModal(){
    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formCadastro");
    const overlay = document.getElementById("overlay");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch("Cadastrar.php", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            mostrarAlerta(data.message);

            if (data.status === "success") {
                overlay.onclick = () => {
                    fecharModal();
                    window.location.href = "../Login/loginhtml.php";
                };
            } else {
                overlay.onclick = () => {
                    fecharModal();
                };
            }

        } catch (err) {
            mostrarAlerta("Erro inesperado: " + err);
        }
    });
});

/* ==================== CANVAS WAVES CADASTRO ==================== */
const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

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
        
        if (!isFormFocused && interactive) {
            heatIntensity = 1.0;
            clickAmplitude = maxClickAmplitude;
            targetClickHeight = -(window.innerHeight / 2 - e.clientY);
            console.log('[waves-cadastro] Clique nas ondas — efeito de labareda ativado');
        }
        console.log('[waves-cadastro] Mouse pressionado — BOOST começando a aumentar');
    }
});

// Detecta soltura do botão esquerdo
window.addEventListener('mouseup', (e) => {
    if (e.button === 0) {
        isMousePressed = false;
        console.log('[waves-cadastro] Mouse liberado — boost começará a decair');
    }
});

// Seleciona a caixa de cadastro
const caixa = document.querySelector('.CaixaCadastro') || document.querySelector('.formulario');

if (caixa) {
    caixa.addEventListener('mouseenter', () => {
        interactive = false;
        console.log('[waves-cadastro] Mouse entrou na caixa — interactive OFF');
    });
    
    caixa.addEventListener('mouseleave', () => {
        if (!isFormFocused) {
            interactive = true;
            console.log('[waves-cadastro] Mouse saiu da caixa — interactive ON');
        }
    });

    caixa.addEventListener('focusin', (e) => {
        if (e.target.matches('input, textarea, button')) {
            isFormFocused = true;
            interactive = false;
            console.log('[waves-cadastro] Elemento focado — interactive OFF');
        }
    }, true);

    caixa.addEventListener('focusout', (e) => {
        if (e.target.matches('input, textarea, button')) {
            isFormFocused = false;
            if (!caixa.matches(':hover')) {
                interactive = true;
                console.log('[waves-cadastro] Elemento desfocado — interactive ON');
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

    // Suavizar transição entre ativo/inativo
    const targetTransition = interactive ? 1 : 0;
    interactiveTransition += (targetTransition - interactiveTransition) * transitionSpeed;

    // Suavizar movimento do mouse
    mouseX += (targetMouseX - mouseX) * easeAmount;
    mouseY += (targetMouseY - mouseY) * easeAmount;

    // Suavizar mudança de direção
    waveDirection += (targetWaveDirection - waveDirection) * directionEaseAmount;

    const smoothMouseY = H / 2 + (mouseY - H / 2) * interactiveTransition;

    // Atualizar boost
    if (isMousePressed && speedBoost < maxSpeedBoost) {
        speedBoost += boostBuildRate;
        if (speedBoost > maxSpeedBoost) speedBoost = maxSpeedBoost;
    } else if (!isMousePressed && speedBoost > 0) {
        speedBoost *= boostDecayRate;
        if (speedBoost < 0.01) speedBoost = 0;
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