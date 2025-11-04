(function() {
    'use strict';

    // Elementos do DOM
    const form = document.getElementById('formRecSenha');
    const btnEnviar = document.getElementById('btnEnviar');
    const btnVoltar = document.getElementById('btnVoltar');
    const emailInput = document.getElementById('email');
    const messageDiv = document.getElementById('message');

    // Função para mostrar mensagem
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type} show`;
        
        // Remove mensagem após 5 segundos
        setTimeout(() => {
            messageDiv.classList.remove('show');
        }, 5000);
    }

    // Função para validar email ou username
    function validateInput(value) {
        const trimmedValue = value.trim();
        
        if (!trimmedValue) {
            return { valid: false, message: 'Por favor, preencha o campo.' };
        }
        
        if (trimmedValue.length < 3) {
            return { valid: false, message: 'Digite pelo menos 3 caracteres.' };
        }
        
        return { valid: true };
    }

    // Handler do submit do formulário
    function handleSubmit(e) {
        e.preventDefault();
        
        const emailValue = emailInput.value;
        const validation = validateInput(emailValue);
        
        if (!validation.valid) {
            showMessage(validation.message, 'error');
            emailInput.focus();
            return;
        }

        // Estado de loading
        btnEnviar.textContent = 'Enviando...';
        btnEnviar.disabled = true;
        btnEnviar.classList.add('loading');

        // Simular envio (substituir por chamada real à API)
        setTimeout(() => {
            // Resetar botão
            btnEnviar.textContent = 'Enviar Código';
            btnEnviar.disabled = false;
            btnEnviar.classList.remove('loading');
            
            // Aqui você faria o envio real
            // form.submit();
            
            // Exemplo de feedback (remover após integração real)
            showMessage('Código enviado com sucesso! Verifique seu email.', 'success');
        }, 1500);
    }

    // Handler do botão voltar
    function handleVoltar() {
        window.location.href = '../Login/loginhtml.php';
    }

    // Limpar mensagem ao digitar
    function handleInput() {
        if (messageDiv.classList.contains('show')) {
            messageDiv.classList.remove('show');
        }
    }

    // Event Listeners
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }

    if (btnVoltar) {
        btnVoltar.addEventListener('click', handleVoltar);
    }

    if (emailInput) {
        emailInput.addEventListener('input', handleInput);
    }

    // Focus automático no campo de email ao carregar
    document.addEventListener('DOMContentLoaded', () => {
        if (emailInput) {
            emailInput.focus();
        }
    });

})();