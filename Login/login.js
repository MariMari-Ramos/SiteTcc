function LoginProvisorio(){
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