    let email = document.getElementById("email").value.trim();
    let senha = document.getElementById("senha").value.trim();

    // Verifica se algum campo está vazio
    if(email === "" || senha === ""){
        mostrarAlerta("Preencha todos os campos!");
        return; // Sai da função
    }

    // Verifica se os dados estão corretos
    if (email === "teste@exemplo.com" && senha === "12345"){
        window.location.href = "../A_TelaPrincipal/index.html";
    } else {
        mostrarAlerta("Email ou senha incorretos!");
    }


// Função para mostrar o modal com mensagem personalizada
function mostrarAlerta(mensagem){
    const overlay = document.getElementById("overlay");
    const texto = overlay.querySelector("p");
    texto.textContent = mensagem;
    overlay.style.display = "flex";
}

// Função para fechar o modal
function fecharModal() {
    document.getElementById("overlay").style.display = "none";
}


  function MostrarSenha(){
var inputSenha = document.getElementById('senha');  
var btnMostrarSenha = document.getElementById('BtnVerSenha');

if(inputSenha.type === 'password'){
inputSenha.setAttribute('type', 'text');
btnMostrarSenha.classList.replace('bi-eye-fill', 'bi-eye-slash-fill');
}else{
inputSenha.setAttribute('type','password')
btnMostrarSenha.classList.replace('bi-eye-slash-fill','bi-eye-fill');
}
}

async function fazerLogin() {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if(email === "" || senha === ""){
        mostrarAlerta("Preencha todos os campos!");
        return;
    }

    let formData = new FormData();
    formData.append("email", email);
    formData.append("senha", senha);

    try {
        const response = await fetch("login.php", {
            method: "POST",
            body: formData
        });

        const result = await response.json(); // login.php precisa retornar JSON

        if(result.status === "success"){
            mostrarAlerta(result.message);
            setTimeout(()=>{ window.location.href="../A_TelaPrincipal/index.html"; },1500);
        } else {
            mostrarAlerta(result.message);
        }

    } catch (error) {
        mostrarAlerta("Erro inesperado: " + error);
    }
}

const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

let mouseX = w / 2;
let mouseY = h / 2;

window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
});

window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Paleta de tons rosa/salmão
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
    ctx.clearRect(0, 0, w, h);

    ondas.forEach((o, idx) => {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 10) {
            const y = Math.sin(x * o.freq + o.fase) * o.amp
                + h / 2
                + (mouseY - h / 2) * 0.05 * (idx + 1);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, o.cor);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fill();

        o.fase += o.vel * (mouseX / w * 4);
    });

    requestAnimationFrame(desenhar);
}

desenhar();
