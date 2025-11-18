document.addEventListener('DOMContentLoaded', function() {
    // Sistema de Abas
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Remove active de todos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Adiciona active
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');

            // Scroll suave para o topo das abas
            document.querySelector('.tabs-container').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        });
    });

    // Botões de navegação
    const btnLogin = document.getElementById('ButtonGoToLogin');
    const btnCadastrar = document.getElementById('ButtonGoToCadastrar');

    if (btnLogin) {
        btnLogin.addEventListener('click', function() {
            window.location.href = 'Login/loginhtml.php';
        });
    }

    if (btnCadastrar) {
        btnCadastrar.addEventListener('click', function() {
            window.location.href = 'Cadastro_E_Perfil/Cadastro.html';
        });
    }
});