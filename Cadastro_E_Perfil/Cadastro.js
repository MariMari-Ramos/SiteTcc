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
