function MostrarSenha(){
var inputSenha = document.getElementById('SenhaCadastro');  
var btnMostrarSenha = document.getElementById('BtnVerSenha');

if(inputSenha.type === 'password'){
inputSenha.setAttribute('type', 'text');
btnMostrarSenha.classList.replace('bi-eye-fill', 'bi-eye-slash-fill');
}else{
inputSenha.setAttribute('type','password')
btnMostrarSenha.classList.replace('bi-eye-slash-fill','bi-eye-fill');
}
}

function ConfirmMostrarSenha(){
var inputSenha = document.getElementById('ConfirmSenhaCadastro');  
var btnMostrarSenha = document.getElementById('BtnConfirmVerSenha');

if(inputSenha.type === 'password'){
inputSenha.setAttribute('type', 'text');
btnMostrarSenha.classList.replace('bi-eye-fill', 'bi-eye-slash-fill');
}else{
inputSenha.setAttribute('type','password')
btnMostrarSenha.classList.replace('bi-eye-slash-fill','bi-eye-fill');
}
}