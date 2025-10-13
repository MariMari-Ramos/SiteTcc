function MostrarSenha(){


    var inputSenha = document.getElementById('NovaSenha');  
    var btnMostrarSenha = document.getElementById('BtnVerSenha');

    if(inputSenha.type === 'password'){
        inputSenha.setAttribute('type', 'text');
        btnMostrarSenha.classList.replace('bi-eye-fill', 'bi-eye-slash-fill');
    } else {
        inputSenha.setAttribute('type','password');
        btnMostrarSenha.classList.replace('bi-eye-slash-fill','bi-eye-fill');
        
    }
}

function ConfirmarMostrarSenha(){

    
    var inputSenha = document.getElementById('ConfirmarNovaSenha');  
    var BtnConfirmarVerSenha = document.getElementById('BtnConfirmarVerSenha');

    if(inputSenha.type === 'password'){
        inputSenha.setAttribute('type', 'text');
        BtnConfirmarVerSenha.classList.replace('bi-eye-fill', 'bi-eye-slash-fill');
    } else {
        inputSenha.setAttribute('type','password');
        BtnConfirmarVerSenha.classList.replace('bi-eye-slash-fill','bi-eye-fill');
        
    }
}

document.addEventListenner('DOMContentLoaded', function() {
const form = document.getElementById('resetPasswordForm');
const senha = Document.getElementById('NovaSenha');
const confirmarSenha = document.getElementById('ConfirmarNovaSenha');

form.addEventListenner('submit', function(e){

if(senha.value !== confirmarSenha.value){
alert('As senhas não coincidem. Por favor, tente novamente.');
return;

}

if(senha.value.leghth < 5){
alert('A senha deve ter pelo menos 5 caracteres.');
return;
}
consele.log('Senha redefinida com sucesso!');

alert('Senha redefinida com sucesso!');
form.submit();
});

});