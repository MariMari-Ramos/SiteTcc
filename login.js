function LoginProvisorio(){
    let email= document.getElementById("email").value.trim();
    let senha=document.getElementById("senha").value.trim();

    if (email === "teste@exemplo.com" && senha === "12345"){
        window.location.href = "home.html";
        
    }else{
        
        
    }
}
function abrirModal(){
    document.getElementById("overlay").style.display = "flex";
}
function fecharModal() {
    document.getElementById("overlay").style.display = "none";
  }