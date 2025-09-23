/* login.js  — controla modal/login e as waves.
   Inicializa só após DOMContentLoaded para garantir elementos disponíveis.
*/

document.addEventListener('DOMContentLoaded', () => {
    console.log('[login.js] DOM pronto — iniciando scripts');

    /* ---------- Referências DOM ---------- */
    const overlay = document.getElementById("overlay");
    const textoModal = overlay ? overlay.querySelector("p") : null;
    const btnEntrar = document.getElementById("ButtonEntrar");
    const btnVerSenha = document.getElementById("BtnVerSenha");
    const btnFecharModal = document.getElementById("fecharModal");
    const formLogin = document.getElementById("formLogin");

    if(!overlay || !textoModal || !btnEntrar || !btnVerSenha || !formLogin) {
        console.warn('[login.js] Alguns elementos não foram encontrados no DOM. Verifique IDs.');
    } else {
        console.log('[login.js] Elementos do formulário encontrados');
    }

    function mostrarAlerta(mensagem){
        if(!overlay || !textoModal) return console.warn('overlay/textoModal ausentes');
        textoModal.textContent = mensagem;
        overlay.style.display = "flex";
    }

    function fecharModal(){
        if(!overlay) return;
        overlay.style.display = "none";
    }

    if(btnFecharModal) btnFecharModal.addEventListener('click', fecharModal);

    // Mostrar/ocultar senha
    btnVerSenha && btnVerSenha.addEventListener('click', () => {
        const input = document.getElementById('senha');
        if(!input) return;
        if(input.type === 'password'){
            input.type = 'text';
            btnVerSenha.classList.replace('bi-eye-fill', 'bi-eye-slash-fill');
        } else {
            input.type = 'password';
            btnVerSenha.classList.replace('bi-eye-slash-fill','bi-eye-fill');
        }
    });

    // Intercepta o clique do botão Entrar
    btnEntrar && btnEntrar.addEventListener('click', (ev) => {
        ev.preventDefault();
        fazerLogin();
    });

    // implementação de login (tenta fazer fetch para o action do form)
    async function fazerLogin(){
        const email = (document.getElementById("email") || {}).value || "";
        const senha = (document.getElementById("senha") || {}).value || "";

        if(email.trim() === "" || senha.trim() === ""){
            mostrarAlerta("Preencha todos os campos!");
            return;
        }

        // tenta enviar via fetch para o action do form (se o servidor responder JSON)
        try {
            const actionUrl = formLogin.getAttribute('action') || 'login.php';
            const formData = new FormData();
            formData.append('email', email.trim());
            formData.append('senha', senha.trim());

            const res = await fetch(actionUrl, {
                method: 'POST',
                body: formData,
                credentials: 'same-origin'
            });

            // tenta ler JSON; se não for JSON, exibe texto
            const text = await res.text();
            try {
                const json = JSON.parse(text);
                if(json.status === 'success'){
                    mostrarAlerta(json.message || 'Login OK');
                    setTimeout(()=>location.href = json.redirect || '../A_TelaPrincipal/index.html', 1300);
                } else {
                    mostrarAlerta(json.message || 'Credenciais inválidas');
                }
            } catch(e){
                // não era JSON — usa resposta textual
                if(res.ok){
                    mostrarAlerta('Resposta do servidor recebida. Verifique rota.');
                    console.log('[login.js] resposta (texto):', text);
                } else {
                    mostrarAlerta('Erro no login: ' + res.status);
                    console.error('[login.js] erro fetch:', res.status, text);
                }
            }
        } catch (err) {
            mostrarAlerta("Erro inesperado: " + err);
            console.error('[login.js] fetch erro:', err);
        }
    }

    
// login.js (substituir por este arquivo)

const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// posição do mouse (valores iniciais centrados)
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

// Escolhe a "caixa de login" onde queremos desativar a interatividade
const loginBox = document.querySelector('.CaixaLogin') || document.querySelector('.login');

if (loginBox) {
    // mouse entra na caixa -> desativa interatividade
    loginBox.addEventListener('mouseenter', () => {
        interactive = false;
    });
    // mouse sai da caixa -> ativa interatividade
    loginBox.addEventListener('mouseleave', () => {
        interactive = true;
    });

    // se o usuário tabular para dentro do formulário (teclado), também desativa (evita distração)
    loginBox.addEventListener('focusin', () => {
        interactive = false;
    }, true);
    loginBox.addEventListener('focusout', () => {
        interactive = true;
    }, true);

    // toque em dispositivos móveis: quando tocar na caixa, desativa interação; quando soltar, reativa
    loginBox.addEventListener('touchstart', () => {
        interactive = false;
    }, { passive: true });
    loginBox.addEventListener('touchend', () => {
        interactive = true;
    }, { passive: true });
}

// Função de desenho/loop
function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ondas.forEach((o, idx) => {
        // cálculo de deslocamento vertical: só aplica se interactive == true
        const verticalInfluence = interactive
            ? (mouseY - canvas.height / 2) * 0.05 * (idx + 1)
            : 0;

        // === ONDAS DE BAIXO ===
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 10) {
            const y = Math.sin(x * o.freq + o.fase) * o.amp
                + canvas.height / 2
                + verticalInfluence;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        const gradBottom = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradBottom.addColorStop(0, o.cor);
        gradBottom.addColorStop(1, 'rgba(197, 69, 10, 0.15)');
        ctx.fillStyle = gradBottom;
        ctx.fill();

      
      
        // atualiza fase para animação
        // quando interactive == false, usamos um multiplicador constante (1) para manter animação suave,
        // quando true, a velocidade é influenciada pelo mouseX (maior movimento -> variação maior)
        const speedMultiplier = interactive ? (mouseX / canvas.width * 2) : 1;
        o.fase += o.vel * speedMultiplier;
    });

    requestAnimationFrame(desenhar);
}

desenhar();

});