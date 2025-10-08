class SettingsManager {
    constructor() {
        this.savedSettings = this.loadSettings();
        this.init();
    }

    loadSettings() {
        return {
            theme: localStorage.getItem('theme') || 'light',
            language: localStorage.getItem('language') || 'pt-BR',
            carousel: localStorage.getItem('carousel') === 'true',
            guide: localStorage.getItem('guide') === 'true',
            alerts: localStorage.getItem('alerts') === 'true',
            accessibility: localStorage.getItem('accessibility') === 'true'
        };
    }

    saveSettings() {
        Object.entries(this.savedSettings).forEach(([key, value]) => {
            localStorage.setItem(key, value.toString());
        });
        this.showMessage('Configurações salvas com sucesso!');
    }

    init() {
        this.setupToggles();
        this.setupDarkMode();
        this.setupLanguage();
        this.setupButtons();
        this.applyAllSettings();
    }

    setupToggles() {
        const toggles = {
            carouselToggle: 'carousel',
            guideToggle: 'guide',
            alertsToggle: 'alerts',
            accessibilityToggle: 'accessibility'
        };

        Object.entries(toggles).forEach(([toggleId, settingKey]) => {
            const toggle = document.getElementById(toggleId);
            if (toggle) {
                toggle.checked = this.savedSettings[settingKey];
                toggle.addEventListener('change', () => {
                    this.savedSettings[settingKey] = toggle.checked;
                });
            }
        });
    }

    setupDarkMode() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (!darkModeToggle) return;

        darkModeToggle.checked = this.savedSettings.theme === 'dark';
        this.applyTheme(this.savedSettings.theme);

        darkModeToggle.addEventListener('change', () => {
            const theme = darkModeToggle.checked ? 'dark' : 'light';
            this.savedSettings.theme = theme;
            this.applyTheme(theme);
        });
    }

    setupLanguage() {
        const modal = document.getElementById('languageModal');
        const openBtn = document.getElementById('openLanguageModal');
        const closeBtn = document.getElementById('closeModal');
        const saveBtn = document.getElementById('saveLanguage');
        const langOptions = document.querySelectorAll('.lang-option');
        const currentLangSpan = document.getElementById('currentLanguage');

        if (!modal || !openBtn || !closeBtn || !saveBtn || !currentLangSpan) {
            console.error('Elementos de idioma não encontrados');
            return;
        }

        openBtn.addEventListener('click', () => {
            modal.style.display = 'block';
            langOptions.forEach(opt => {
                opt.classList.toggle('selected', opt.dataset.lang === this.savedSettings.language);
            });
        });

        closeBtn.addEventListener('click', () => modal.style.display = 'none');

        langOptions.forEach(option => {
            option.addEventListener('click', () => {
                langOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        saveBtn.addEventListener('click', () => {
            const selectedOption = document.querySelector('.lang-option.selected');
            if (selectedOption) {
                this.savedSettings.language = selectedOption.dataset.lang;
                currentLangSpan.textContent = selectedOption.textContent;
                this.updatePageTexts();
                modal.style.display = 'none';
            }
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) modal.style.display = 'none';
        });

        // Inicializa o texto do idioma atual
        const initialOption = document.querySelector(`[data-lang="${this.savedSettings.language}"]`);
        if (initialOption) {
            currentLangSpan.textContent = initialOption.textContent;
        }
    }

    setupButtons() {
        const saveChanges = document.getElementById('saveChanges');
        const restoreChanges = document.getElementById('restoreChanges');
        const backToMain = document.getElementById('backToMain');

        if (saveChanges) {
            saveChanges.addEventListener('click', () => this.saveSettings());
        }

        if (restoreChanges) {
            restoreChanges.addEventListener('click', () => {
                if (confirm('Deseja restaurar as configurações anteriores?')) {
                    this.restoreDefaultSettings();
                }
            });
        }

        if (backToMain) {
            backToMain.addEventListener('click', () => {
                window.location.href = '../index.html';
            });
        }
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    updatePageTexts() {
        const translations = CONFIG.translations[this.savedSettings.language] || CONFIG.translations['pt-BR'];
        document.title = translations.title;
        
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });
    }

    restoreDefaultSettings() {
        this.savedSettings = {
            theme: 'light',
            language: 'pt-BR',
            carousel: true,
            guide: true,
            alerts: true,
            accessibility: false
        };
        
        this.applyAllSettings();
        this.saveSettings();
        this.showMessage('Configurações restauradas com sucesso!');
    }

    applyAllSettings() {
        this.applyTheme(this.savedSettings.theme);
        this.updatePageTexts();
        
        // Atualiza todos os toggles
        Object.entries({
            darkModeToggle: this.savedSettings.theme === 'dark',
            carouselToggle: this.savedSettings.carousel,
            guideToggle: this.savedSettings.guide,
            alertsToggle: this.savedSettings.alerts,
            accessibilityToggle: this.savedSettings.accessibility
        }).forEach(([toggleId, value]) => {
            const toggle = document.getElementById(toggleId);
            if (toggle) toggle.checked = value;
        });
    }

    showMessage(message) {
        const modal = document.createElement('div');
        modal.className = 'message-modal';
        modal.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
                <button onclick="this.parentElement.parentElement.remove()">OK</button>
            </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => modal.remove(), 3000);
    }
}

// Configurações globais
const CONFIG = {
    translations: {
        'pt-BR': {
            title: 'Configurações',
            darkMode: 'Modo escuro',
            carousel: 'Animação do carrossel',
            guide: 'Guia',
            alerts: 'Alertas',
            language: 'Idioma',
            accessibility: 'Fonte e acessibilidade',
            saveChanges: 'Salvar alterações',
            restoreChanges: 'Voltar para como estava antes',
            backToMain: 'Voltar para a tela principal',
            selectLanguage: 'Selecione o idioma',
            save: 'Salvar',
            cancel: 'Cancelar'
        },
        'en-US': {
            title: 'Settings',
            darkMode: 'Dark mode',
            carousel: 'Carousel animation',
            guide: 'Guide',
            alerts: 'Alerts',
            language: 'Language',
            accessibility: 'Font and accessibility',
            saveChanges: 'Save changes',
            restoreChanges: 'Restore previous settings',
            backToMain: 'Back to main screen',
            selectLanguage: 'Select language',
            save: 'Save',
            cancel: 'Cancel'
        },

        'es-ES':{
title:'Ajustes',
darkMode:'Modo oscuro',
carousel:'Animación carrusel',
guide:'Guía',
alerts:'Alertas',
language:'Idioma',

        },
    }
    
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    new SettingsManager();
});