document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.CaixaRecuperarSenha');
    const input = document.getElementById('CampoEmailOuUsuario');
    const btnEnviar = document.getElementById('btnEnviar');

    btnEnviar.addEventListener('click', function(e) {
        e.preventDefault();
        if (input.value.trim() === '') {
            alert('Por favor, preencha o campo com seu email ou nome de usuário.');
            return;
        }
        window.location.href = '../CodigoDeRecuperação/CodigoDoEmail.html';
    });
});