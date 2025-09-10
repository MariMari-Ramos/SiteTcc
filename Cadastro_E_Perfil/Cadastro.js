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
