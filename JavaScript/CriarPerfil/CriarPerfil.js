const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

// Resize com devicePixelRatio para evitar blur/espessura indesejada
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // desenhar em CSS pixels
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// posição do mouse (inicial centrada)
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// flag para controlar se a interatividade com o mouse está habilitada
let interactive = true;

// Atualiza mouse apenas quando interactive == true
window.addEventListener('mousemove', e => {
    if (interactive) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
});

// Paleta de cores
const cores = [
    'rgba(255,192,192,0.6)',
    'rgba(255,170,150,0.5)',
    'rgba(255,210,180,0.4)'
];

// Configuração das ondas
const ondas = [];
for (let i = 0; i < 3; i++) {
    ondas.push({
        amp: 60 + i * 0.5,
        freq: 0.002 + i * 0.001,
        vel: 0.002 + i * 0.0015,
        fase: Math.random() * 1000,
        cor: cores[i]
    });
}

// Seleciona a "caixa" onde a gente quer que a interatividade seja desativada
const caixa = document.querySelector('.CaixaCriarPerfil');

if (caixa) {
    // mouse entra -> desativa interatividade
    caixa.addEventListener('mouseenter', () => { 
        interactive = false; 
    });

    // mouse sai -> ativa interatividade
    caixa.addEventListener('mouseleave', () => { 
        interactive = true; 
    });

    // focus via teclado (tab) -> desativa quando foco dentro do elemento
    caixa.addEventListener('focusin', () => { 
        interactive = false; 
    }, true);
    
    caixa.addEventListener('focusout', () => { 
        interactive = true; 
    }, true);

    // touch devices: desativa enquanto o usuário toca a caixa
    caixa.addEventListener('touchstart', () => { 
        interactive = false; 
    }, { passive: true });
    
    caixa.addEventListener('touchend', () => { 
        interactive = true; 
    }, { passive: true });
}

// Função de desenho/loop
function desenhar() {
    // Limpa usando as dimensões em CSS pixels (window.inner)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Para desenhar usando coordenadas CSS (convertidas pelo setTransform), usamos window.innerWidth/Height
    const W = window.innerWidth;
    const H = window.innerHeight;

    ondas.forEach((o, idx) => {
        // cálculo de deslocamento vertical: só aplica se interactive == true
        const verticalInfluence = interactive
            ? (mouseY - H / 2) * 0.05 * (idx + 1)
            : 0;

        // === ONDAS DE BAIXO ===
        ctx.beginPath();
        for (let x = 0; x <= W; x += 10) {
            const y = Math.sin(x * o.freq + o.fase) * o.amp
                + H / 2
                + verticalInfluence;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H);
        ctx.lineTo(0, H);
        ctx.closePath();

        const gradBottom = ctx.createLinearGradient(0, 0, 0, H);
        gradBottom.addColorStop(0, o.cor);
        gradBottom.addColorStop(1, 'rgba(197, 69, 10, 0.15)');
        ctx.fillStyle = gradBottom;
        ctx.fill();

        // atualiza fase para animação
        const speedMultiplier = interactive ? (mouseX / W * 4) : 1;
        o.fase += o.vel * speedMultiplier;
    });

    requestAnimationFrame(desenhar);
}

desenhar();

// Modal de avatares
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('avatarModal');
    const avatarButton = document.getElementById('chooseAvatar');
    const confirmButton = document.getElementById('confirmAvatar');
    const avatarOptions = document.querySelectorAll('.avatar-option');
    let selectedAvatar = null;

    // Abrir modal - também desativa waves
    avatarButton.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'block';
        interactive = false;
    });

    // Fechar modal ao clicar fora - reativa waves
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            interactive = true;
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
    confirmButton.addEventListener('click', () => {
        if (selectedAvatar) {
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
        }
    });

    // Fechar com ESC - reativa waves
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            interactive = true;
        }
    });
});