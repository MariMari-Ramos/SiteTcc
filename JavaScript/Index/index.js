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

    // Modal de Configurações
    const btnOpenConfig = document.getElementById('ButtonOpenConfig');
    const modalOverlay = document.getElementById('configModalOverlay');
    const modal = document.getElementById('configModal');
    const modalBody = document.getElementById('configModalBody');
    const closeModalBtn = document.getElementById('closeConfigModal');
    const modalTitleEl = document.getElementById('configModalTitle');
    const defaultModalTitle = modalTitleEl ? modalTitleEl.textContent : 'Configurações';

    // Configurações locais da página inicial
    const defaultSettings = {
        theme: 'auto', // 'light' | 'dark' | 'auto'
        highContrast: false,
        largerText: false,
        smallerText: false
    };

    function loadSettings() {
        try {
            const raw = localStorage.getItem('indexPageSettings');
            return raw ? { ...defaultSettings, ...JSON.parse(raw) } : { ...defaultSettings };
        } catch {
            return { ...defaultSettings };
        }
    }

    function saveSettings(settings) {
        localStorage.setItem('indexPageSettings', JSON.stringify(settings));
    }

    function applySettings(settings) {
        // Limpa estados
        document.body.classList.remove('dark-theme');
        // Alto contraste e texto maior/menor
        document.body.classList.toggle('high-contrast', !!settings.highContrast);
        document.body.classList.toggle('larger-text', !!settings.largerText);
        // Se texto maior estiver ativo, força desativar menor para evitar conflito
        const enableSmaller = !!settings.smallerText && !settings.largerText;
        document.body.classList.toggle('smaller-text', enableSmaller);

        // Tema + logo (sem quebrar quando não há versão clara)
        const logoImg = document.querySelector('.logo-container img');
        if (logoImg && !logoImg.dataset.originalSrc) {
            logoImg.dataset.originalSrc = logoImg.getAttribute('src') || '';
        }

        const useDark = settings.theme === 'dark' ||
            (settings.theme === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

        if (useDark) {
            document.body.classList.add('dark-theme');
            // Somente troca se houver um src alternativo explícito
            if (logoImg && logoImg.dataset.lightSrc) {
                const candidate = logoImg.dataset.lightSrc;
                const tester = new Image();
                tester.onload = () => { logoImg.setAttribute('src', candidate); };
                tester.onerror = () => { /* mantém original */ };
                tester.src = candidate;
            }
        } else {
            // tema claro ou auto-claro: restaura original se houver
            if (logoImg && logoImg.dataset.originalSrc) {
                logoImg.setAttribute('src', logoImg.dataset.originalSrc);
            }
        }
    }

    // Mantém tema automático atualizado se usuário usa sistema
    const mql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    if (mql) {
        mql.addEventListener('change', () => {
            const current = loadSettings();
            if (current.theme === 'auto') applySettings(current);
        });
    }

    function openConfigModal() {
        console.log('[index.js] Abrindo modal de Configurações (inline)...');
        const current = loadSettings();
        // UI inline das configurações solicitadas
        modalBody.innerHTML = `
            <div class="settings-content">
                <div class="settings-group">
                    <label for="themeOptions"><strong>Tema</strong></label>
                    <div id="themeOptions" class="settings-option">
                        <label><input type="radio" name="theme" value="light" ${current.theme==='light'?'checked':''}> Claro</label>
                    </div>
                    <div class="settings-option">
                        <label><input type="radio" name="theme" value="dark" ${current.theme==='dark'?'checked':''}> Escuro</label>
                    </div>
                    <div class="settings-option">
                        <label><input type="radio" name="theme" value="auto" ${current.theme==='auto'?'checked':''}> Automático</label>
                    </div>
                </div>
                <hr class="settings-divider" />
                <div class="settings-group">
                    <label><strong>Acessibilidade</strong></label>
                    <div class="settings-option">
                        <label><input type="checkbox" id="optLargerText" ${current.largerText?'checked':''}> Texto maior</label>
                    </div>
                    <div class="settings-option">
                        <label><input type="checkbox" id="optSmallerText" ${current.smallerText && !current.largerText?'checked':''}> Texto menor</label>
                    </div>
                    <div class="settings-option">
                        <label><input type="checkbox" id="optHighContrast" ${current.highContrast?'checked':''}> Alto contraste</label>
                    </div>
                </div>
                <div style="margin-top:16px; display:flex; gap:12px; justify-content:flex-end;">
                    <button id="saveIndexSettings" class="settings-btn">Salvar</button>
                </div>
            </div>
        `;

        // Exibe modal com animação
        modalOverlay.hidden = false;
        modal.hidden = false;
        requestAnimationFrame(() => {
            modalOverlay.classList.add('show');
            modal.classList.add('show');
        });
        modal.focus();

        // Eventos
        const saveBtn = document.getElementById('saveIndexSettings');
        saveBtn && saveBtn.addEventListener('click', () => {
            const selectedTheme = (modalBody.querySelector('input[name="theme"]:checked') || {}).value || 'auto';
            const largerText = !!document.getElementById('optLargerText')?.checked;
            const smallerText = !!document.getElementById('optSmallerText')?.checked;
            const highContrast = !!document.getElementById('optHighContrast')?.checked;
            // Se ambos forem marcados, prioriza Texto maior
            const finalSettings = { theme: selectedTheme, largerText, smallerText: largerText ? false : smallerText, highContrast };
            saveSettings(finalSettings);
            applySettings(finalSettings);
            closeConfigModal();
        });
    }

    function closeConfigModal() {
        // Remove classes de animação
        modalOverlay.classList.remove('show');
        modal.classList.remove('show');
        // Aguarda animação antes de ocultar
        setTimeout(() => {
            modalOverlay.hidden = true;
            modal.hidden = true;
            modalBody.innerHTML = '';
            if (modalTitleEl) modalTitleEl.textContent = defaultModalTitle; // restaura título
        }, 300);
    }

    if (btnOpenConfig) {
        btnOpenConfig.addEventListener('click', () => {
            console.log('[index.js] Botão Configurações clicado');
            openConfigModal();
        });
    }
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeConfigModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeConfigModal);

    // Fecha com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.hidden) {
            closeConfigModal();
        }
    });

    // Aplica configurações salvas ao carregar a página
    applySettings(loadSettings());

    // Efeito de surgimento em todos os elementos da tela
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const revealTargets = document.querySelectorAll(
        'header * , main.container * , .tabs-container * , footer *'
    );
    revealTargets.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
});