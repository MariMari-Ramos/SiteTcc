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
        e.preventDefault(); // não deixa recarregar a página

        const formData = new FormData(form);

        try {
            const response = await fetch("Cadastrar.php", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            mostrarAlerta(data.message);

            // Se sucesso, trocar comportamento do modal
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

// Cadastro.js - canvas waves com interatividade DESATIVADA enquanto o usuário estiver mexendo na caixa

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

// Configuração das ondas (amplitude mantida; se quiser mais fina, me diz que eu reduzo)
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
// pode ser .CaixaCadastro ou .formulario — damos suporte às duas.
const caixa = document.querySelector('.CaixaCadastro') || document.querySelector('.formulario');

if (caixa) {
    // mouse entra -> desativa interatividade
    caixa.addEventListener('mouseenter', () => { interactive = false; });

    // mouse sai -> ativa interatividade
    caixa.addEventListener('mouseleave', () => { interactive = true; });

    // focus via teclado (tab) -> desativa quando foco dentro do elemento
    caixa.addEventListener('focusin', () => { interactive = false; }, true);
    caixa.addEventListener('focusout', () => { interactive = true; }, true);

    // touch devices: desativa enquanto o usuário toca a caixa
    caixa.addEventListener('touchstart', () => { interactive = false; }, { passive: true });
    caixa.addEventListener('touchend', () => { interactive = true; }, { passive: true });
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

