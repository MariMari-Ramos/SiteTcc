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