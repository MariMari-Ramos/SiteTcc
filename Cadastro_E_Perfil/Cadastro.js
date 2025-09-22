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
    overlay.style.display = "flex"; // 👈 precisa ser flex ou block
}

function CadastroProvisorio(){
    let email = document.getElementById("CadastroEmail").value.trim();
    let senha = document.getElementById("SenhaCadastro").value.trim();
    let confirmarSenha = document.getElementById("ConfirmSenhaCadastro").value.trim();

    // Verifica se os campos estão preenchidos
    if(email === "" || senha === "" || confirmarSenha === ""){
        mostrarAlerta("Preencha todos os campos!");
        return;
    }

    // Verifica se as senhas coincidem
    if(senha !== confirmarSenha){
        mostrarAlerta("As senhas não coincidem!");
        return;
    }

    // Se tudo certo, segue
    window.location.href = "CPerfil.html";
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
                    window.location.href = "../Login/login.html";
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

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
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
        amp: 60 + i * 20,
        freq: 0.002 + i * 0.001,
        vel: 0.002 + i * 0.0015,
        fase: Math.random() * 1000,
        cor: cores[i]
    });
}

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ondas.forEach((o, idx) => {
        // === ONDAS DE BAIXO ===
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 10) {
            const y = Math.sin(x * o.freq + o.fase) * o.amp
                + canvas.height / 2
                + (mouseY - canvas.height / 2) * 0.05 * (idx + 1);
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        const gradBottom = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradBottom.addColorStop(0, o.cor);
        gradBottom.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradBottom;
        ctx.fill();

        // === ONDAS DE CIMA === (espelhadas)
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 10) {
            const y = Math.sin(x * o.freq + o.fase) * o.amp
                + canvas.height / 2
                + (mouseY - canvas.height / 2) * 0.05 * (idx + 1);

            // espelha em relação ao meio da tela
            const yTop = canvas.height - y;
            x === 0 ? ctx.moveTo(x, yTop) : ctx.lineTo(x, yTop);
        }
        ctx.lineTo(canvas.width, 0);
        ctx.lineTo(0, 0);
        ctx.closePath();

        const gradTop = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradTop.addColorStop(0, o.cor);
        gradTop.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradTop;
        ctx.fill();

        // atualiza fase para animação
        o.fase += o.vel * (mouseX / canvas.width * 4);
    });

    requestAnimationFrame(desenhar);
}

desenhar();
