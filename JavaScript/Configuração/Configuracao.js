class SettingsManager {
    constructor() {
        this.savedSettings = this.loadSettings();
        this.unsavedChanges = false;
        this.originalAlert = window.alert;
        this.originalConfirm = window.confirm;
        this.originalConsoleWarn = console.warn;
        this.originalConsoleError = console.error;
        this.init();
    }

    loadSettings() {
        // Busca configurações do servidor via AJAX (síncrono para inicialização)
        let settings = {
            theme: 'light',
            language: 'pt-BR',
            carousel: true,
            guide: true,
            alerts: true,
            fontSize: '16',
            fontType: 'OpenDyslexic',
            lineSpacing: '1.5',
            highContrast: false,
            autoRead: false
        };
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/SiteTcc/A_TelaPrincipal/Configurações/getConfig.php', false); // síncrono para garantir carregamento
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    Object.assign(settings, data);
                } catch (e) {
                    // fallback para padrão
                }
            }
        };
        try { xhr.send(); } catch (e) {}
        return settings;
    }

    saveSettings() {
        // Salva configurações no servidor via AJAX
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/SiteTcc/A_TelaPrincipal/Configurações/saveConfig.php', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    this.unsavedChanges = false;
                    if (window.updateGlobalSettings) {
                        window.updateGlobalSettings();
                    }
                    this.showMessage('Configurações salvas com sucesso!');
                } else {
                    this.showMessage('Erro ao salvar configurações.');
                }
            }
        };
        xhr.send(JSON.stringify(this.savedSettings));
    }

    init() {
        this.setupToggles();
        this.setupDarkMode();
        this.setupLanguage();
        this.setupAccessibility();
        this.setupButtons();
        this.setupAlertsWarning();
        this.applyAllSettings();
        this.setupGuideBubble();
    }

    setupToggles() {
        const carouselToggle = document.getElementById('carouselToggle');
        if (carouselToggle) {
            carouselToggle.checked = this.savedSettings.carousel;
            carouselToggle.addEventListener('change', () => {
                this.savedSettings.carousel = carouselToggle.checked;
                this.unsavedChanges = true;
                this.applyCarouselSettings();
            });
        }

        const guideToggle = document.getElementById('guideToggle');
        if (guideToggle) {
            guideToggle.checked = this.savedSettings.guide;
            guideToggle.addEventListener('change', () => {
                this.savedSettings.guide = guideToggle.checked;
                this.unsavedChanges = true;
                this.applyGuideSettings();
            });
        }
    }

    applyCarouselSettings() {
        if (this.savedSettings.carousel) {
            document.body.classList.remove('carousel-hover-disabled');
            this.showMessage('Animação do carrossel ativada!');
        } else {
            document.body.classList.add('carousel-hover-disabled');
            this.showMessage('Animação do carrossel desativada!');
        }
    }

    applyGuideSettings() {
        const trigger = document.querySelector('.guide-trigger');
        
        if (this.savedSettings.guide) {
            document.body.classList.remove('guide-disabled');
            
            if (trigger) {
                // Remove classe de hiding se existir
                trigger.classList.remove('hiding');
                trigger.style.display = 'flex';
                
                // Force reflow para garantir que a animação aconteça
                void trigger.offsetWidth;
                
                // Adiciona animação de entrada
                trigger.classList.add('showing');
                
                // Remove a classe de animação após completar
                setTimeout(() => {
                    trigger.classList.remove('showing');
                }, 500);
            }
            
            this.showMessage('Guia ativado!');
        } else {
            document.body.classList.add('guide-disabled');
            
            if (trigger) {
                // Force reflow para garantir que a animação aconteça
                void trigger.offsetWidth;
                
                // Adiciona animação de saída
                trigger.classList.add('hiding');
                
                // Esconde completamente após a animação
                setTimeout(() => {
                    if (trigger.classList.contains('hiding')) {
                        trigger.style.display = 'none';
                        trigger.classList.remove('hiding');
                    }
                }, 300);
            }
            
            this.showMessage('Guia desativado!');
            if (typeof closeGuide === 'function') closeGuide();
        }
    }

    setupAlertsWarning() {
        const alertsToggle = document.getElementById('alertsToggle');
        const alertsModal = document.getElementById('alertsWarningModal');
        const confirmBtn = document.getElementById('confirmDisableAlerts');
        const cancelBtn = document.getElementById('cancelDisableAlerts');

        if (!alertsToggle || !alertsModal || !confirmBtn || !cancelBtn) return;

        alertsToggle.checked = this.savedSettings.alerts;

        alertsToggle.addEventListener('change', (e) => {
            if (!e.target.checked && this.savedSettings.alerts) {
                e.target.checked = true;
                alertsModal.style.display = 'block';
            } else if (e.target.checked && !this.savedSettings.alerts) {
                this.savedSettings.alerts = true;
                this.unsavedChanges = true;
                this.applyAlertsSettings();
                this.showMessage('Alertas reativados!');
            }
        });

        confirmBtn.addEventListener('click', () => {
            this.savedSettings.alerts = false;
            alertsToggle.checked = false;
            this.unsavedChanges = true;
            alertsModal.style.display = 'none';
            this.applyAlertsSettings();
            this.showFinalAlertMessage('Alertas desativados! Você não receberá mais notificações do sistema.');
        });

        cancelBtn.addEventListener('click', () => {
            alertsToggle.checked = true;
            alertsModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === alertsModal) {
                alertsToggle.checked = true;
                alertsModal.style.display = 'none';
            }
        });
    }

    applyAlertsSettings() {
        const alertsEnabled = this.savedSettings.alerts;
        window.SITE_ALERTS_ENABLED = alertsEnabled;
        
        if (!alertsEnabled) {
            window.alert = function() {
                console.log('[ALERT BLOQUEADO]:', arguments[0]);
            };
            window.confirm = function() { 
                console.log('[CONFIRM BLOQUEADO]:', arguments[0]);
                return true; 
            };
            console.warn = function() {};
            console.error = function() {};
            document.body.classList.add('alerts-disabled');
            
            if ('Notification' in window) {
                Notification.requestPermission = function() {
                    return Promise.resolve('denied');
                };
            }
        } else {
            window.alert = this.originalAlert;
            window.confirm = this.originalConfirm;
            console.warn = this.originalConsoleWarn;
            console.error = this.originalConsoleError;
            document.body.classList.remove('alerts-disabled');
        }
    }

    showFinalAlertMessage(message) {
        const modal = document.createElement('div');
        modal.className = 'message-modal final-alert';
        modal.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
                <button onclick="this.parentElement.parentElement.remove()">OK</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
        }, 4000);
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
            this.unsavedChanges = true;
        });
    }

    setupLanguage() {
        const modal = document.getElementById('languageModal');
        const openBtn = document.getElementById('openLanguageModal');
        const closeBtn = document.getElementById('closeModal');
        const saveBtn = document.getElementById('saveLanguage');
        const langOptions = document.querySelectorAll('.lang-option');
        const currentLangSpan = document.getElementById('currentLanguage');

        if (!modal || !openBtn || !closeBtn || !saveBtn || !currentLangSpan) return;

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
                this.unsavedChanges = true;
            });
        });

        saveBtn.addEventListener('click', () => {
            const selectedOption = document.querySelector('.lang-option.selected');
            if (selectedOption) {
                this.savedSettings.language = selectedOption.dataset.lang;
                currentLangSpan.textContent = selectedOption.textContent;
                this.updatePageTexts();
                modal.style.display = 'none';
                this.unsavedChanges = true;
            }
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) modal.style.display = 'none';
        });

        const initialOption = document.querySelector(`[data-lang="${this.savedSettings.language}"]`);
        if (initialOption) {
            currentLangSpan.textContent = initialOption.textContent;
        }
    }

    setupAccessibility() {
        const modal = document.getElementById('accessibilityModal');
        const openBtn = document.getElementById('openAccessibilityModal');
        const closeBtn = document.getElementById('closeAccessibilityModal');
        const saveBtn = document.getElementById('saveAccessibility');
        const fontSizeSelect = document.getElementById('fontSizeSelect');
        const fontTypeSelect = document.getElementById('fontTypeSelect');
        const lineSpacingSelect = document.getElementById('lineSpacingSelect');
        const contrastToggle = document.getElementById('toggleContrast');
        const autoReadToggle = document.getElementById('toggleAutoRead');
        const warning = document.getElementById('accessibilityWarning');

        if (!modal || !openBtn || !closeBtn || !saveBtn) return;

        const loadAccessibilitySettings = () => {
            fontSizeSelect.value = this.savedSettings.fontSize;
            fontTypeSelect.value = this.savedSettings.fontType;
            lineSpacingSelect.value = this.savedSettings.lineSpacing;
            
            if (this.savedSettings.highContrast) {
                contrastToggle.classList.add('active');
                contrastToggle.textContent = 'Desativar';
            } else {
                contrastToggle.classList.remove('active');
                contrastToggle.textContent = 'Ativar';
            }
            
            if (this.savedSettings.autoRead) {
                autoReadToggle.classList.add('active');
                autoReadToggle.textContent = 'Desativar';
            } else {
                autoReadToggle.classList.remove('active');
                autoReadToggle.textContent = 'Ativar';
            }
        };

        openBtn.addEventListener('click', () => {
            modal.style.display = 'block';
            loadAccessibilitySettings();
            this.checkContrastConflict();
        });

        closeBtn.addEventListener('click', () => modal.style.display = 'none');

        fontSizeSelect.addEventListener('change', () => this.unsavedChanges = true);
        fontTypeSelect.addEventListener('change', () => this.unsavedChanges = true);
        lineSpacingSelect.addEventListener('change', () => this.unsavedChanges = true);

        contrastToggle.addEventListener('click', () => {
            contrastToggle.classList.toggle('active');
            contrastToggle.textContent = contrastToggle.classList.contains('active') ? 'Desativar' : 'Ativar';
            this.unsavedChanges = true;
            this.checkContrastConflict();
        });

        autoReadToggle.addEventListener('click', () => {
            autoReadToggle.classList.toggle('active');
            autoReadToggle.textContent = autoReadToggle.classList.contains('active') ? 'Desativar' : 'Ativar';
            this.unsavedChanges = true;
        });

        saveBtn.addEventListener('click', () => {
            this.savedSettings.fontSize = fontSizeSelect.value;
            this.savedSettings.fontType = fontTypeSelect.value;
            this.savedSettings.lineSpacing = lineSpacingSelect.value;
            this.savedSettings.highContrast = contrastToggle.classList.contains('active');
            this.savedSettings.autoRead = autoReadToggle.classList.contains('active');
            
            this.applyAccessibilitySettings();
            modal.style.display = 'none';
            this.unsavedChanges = true;
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) modal.style.display = 'none';
        });

        this.checkContrastConflict = () => {
            const isContrast = contrastToggle.classList.contains('active');
            const isDark = this.savedSettings.theme === 'dark';
            
            if (isContrast && isDark && warning) {
                warning.style.display = 'block';
                warning.textContent = 'Atenção: Modo escuro e alto contraste juntos podem causar conflito visual. Não é recomendado usar ambos ao mesmo tempo.';
            } else if (warning) {
                warning.style.display = 'none';
            }
        };
    }

    setupButtons() {
        const saveChanges = document.getElementById('saveChanges');
        const restoreChanges = document.getElementById('restoreChanges');
        const backToMain = document.getElementById('backToMain');

        if (saveChanges) {
            saveChanges.addEventListener('click', () => {
                this.saveSettings();
            });
        }

        if (restoreChanges) {
            restoreChanges.addEventListener('click', () => {
                if (this.unsavedChanges) {
                    this.showMessage('Você não salvou as configurações! Elas voltarão para o padrão inicial.');
                }
                setTimeout(() => this.restoreDefaultSettings(), 1000);
            });
        }

        if (backToMain) {
            backToMain.addEventListener('click', () => {
                if (this.unsavedChanges) {
                    this.showMessage('Você não salvou as configurações! Deseja sair mesmo assim?');
                    return;
                }
                window.location.href = '../index.php';
            });
        }
    }

    setupGuideBubble() {
        const guideEnabled = this.savedSettings.guide;
        const seenKey = 'configGuideSeen';
        
        // Aplica visibilidade do botão guia
        const trigger = document.querySelector('.guide-trigger');
        if (trigger) {
            trigger.style.display = guideEnabled ? 'flex' : 'none';
        }
        
        // Abre automaticamente na primeira visita
        if (guideEnabled && localStorage.getItem(seenKey) !== 'true') {
            setTimeout(() => {
                if (typeof openGuide === 'function') openGuide();
                localStorage.setItem(seenKey, 'true');
            }, 600);
        }
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (this.checkContrastConflict) {
            this.checkContrastConflict();
        }
    }

    applyAccessibilitySettings() {
        document.documentElement.style.fontSize = this.savedSettings.fontSize + 'px';
        document.body.style.fontFamily = this.savedSettings.fontType + ', Arial, sans-serif';
        document.body.style.lineHeight = this.savedSettings.lineSpacing;
        
        if (this.savedSettings.highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
        
        if (this.savedSettings.autoRead) {
            document.body.classList.add('auto-read');
        } else {
            document.body.classList.remove('auto-read');
        }
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
        
        // Atualiza textos do guia
        const guideContent = document.getElementById('guideContent');
        if (guideContent) {
            const lang = this.savedSettings.language;
            const texts = GUIDE_TEXTS[lang] || GUIDE_TEXTS['pt-BR'];
            guideContent.textContent = texts.intro;
        }
    }

    restoreDefaultSettings() {
        this.savedSettings = {
            theme: 'light',
            language: 'pt-BR',
            carousel: true,
            guide: true,
            alerts: true,
            fontSize: '16',
            fontType: 'OpenDyslexic',
            lineSpacing: '1.5',
            highContrast: false,
            autoRead: false
        };
        
        this.applyAllSettings();
        this.saveSettings();
    }

    applyAllSettings() {
        this.applyTheme(this.savedSettings.theme);
        this.applyAccessibilitySettings();
        this.applyAlertsSettings();
        this.applyCarouselSettings();
        this.applyGuideSettings();
        this.updatePageTexts();
        
        const darkToggle = document.getElementById('darkModeToggle');
        const carouselToggle = document.getElementById('carouselToggle');
        const guideToggle = document.getElementById('guideToggle');
        const alertsToggle = document.getElementById('alertsToggle');
        
        if (darkToggle) darkToggle.checked = this.savedSettings.theme === 'dark';
        if (carouselToggle) carouselToggle.checked = this.savedSettings.carousel;
        if (guideToggle) guideToggle.checked = this.savedSettings.guide;
        if (alertsToggle) alertsToggle.checked = this.savedSettings.alerts;
    }

    showMessage(message) {
        if (!this.savedSettings.alerts && !document.querySelector('.final-alert')) {
            console.log('[MENSAGEM BLOQUEADA]:', message);
            return;
        }
        
        document.querySelectorAll('.message-modal:not(.final-alert)').forEach(modal => modal.remove());
        
        const modal = document.createElement('div');
        modal.className = 'message-modal';
        modal.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
                <button onclick="this.parentElement.parentElement.remove()">OK</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
        }, 5000);
    }
}

// ==================== FUNÇÕES GLOBAIS ====================

window.showAlert = function(message) {
    // Usa variável global, não localStorage
    if (window.SITE_ALERTS_ENABLED !== false) {
        alert(message);
    } else {
        console.log('[ALERT GLOBAL BLOQUEADO]:', message);
    }
};


window.showConfirm = function(message) {
    if (window.SITE_ALERTS_ENABLED !== false) {
        return confirm(message);
    } else {
        console.log('[CONFIRM GLOBAL BLOQUEADO]:', message);
        return true;
    }
};

// ==================== SISTEMA DE GUIA (ESTILO INDEX.PHP) ====================
function openGuide() {
    // Usa settings carregado, não localStorage
    if (window.settingsManager && window.settingsManager.savedSettings && window.settingsManager.savedSettings.guide === false) return;
    
    const el = document.getElementById('guideSpeech');
    if (!el) return;
    
    el.classList.add('active');
    document.body.classList.add('guide-visible');
    
    // Marca o link como visualizado
    const trigger = document.querySelector('.guide-trigger');
    if (trigger) {
        trigger.classList.add('viewed');
    }
}

function closeGuide() {
    const el = document.getElementById('guideSpeech');
    if (!el) return;
    
    el.classList.remove('active');
    document.body.classList.remove('guide-visible');
}

function toggleGuide() {
    const el = document.getElementById('guideSpeech');
    if (!el) return;
    
    if (el.classList.contains('active')) {
        closeGuide();
    } else {
        openGuide();
    }
}

// Conteúdo do guia por idioma
const GUIDE_TEXTS = {
    'pt-BR': {
        intro: 'Olá! 👋 Aqui você pode configurar tema, alertas, idioma e acessibilidade. Escolha um tópico abaixo para entender cada opção.',
        dark: '🌓 Modo escuro: alterna o tema entre claro e escuro. Dica: ative para reduzir cansaço visual em ambientes com pouca luz. Persistente entre sessões.',
        carousel: '🎠 Animação do carrossel: controla animações/hover na tela principal. Ao desativar, reduz movimento automático.',
        guide: '🎓 Guia: ativa/desativa tutoriais e explicações pelo site (inclusive este balão). Recomendado manter ativado na primeira vez.',
        alerts: '🔔 Alertas: mostra mensagens importantes (erros, confirmações, avisos). Desativar pode ocultar confirmações críticas.',
        language: '🌐 Idioma: abre um modal para escolher o idioma (PT/EN/ES). Textos da interface mudam imediatamente.',
        accessibility: '♿ Acessibilidade: ajuste tamanho e tipo de fonte (OpenDyslexic recomendado), espaçamento, alto contraste e leitura automática.',
        save: '💾 Salvar alterações: grava todas as preferências e aplica globalmente. Use após configurar.',
        restore: '♻️ Restaurar padrões: volta tudo ao estado inicial recomendado. Útil se algo ficar estranho.',
        back: '🏠 Retornar para o lobby: volta à página inicial. Lembre-se de salvar alterações antes de sair.'
    },
    'en-US': {
        intro: 'Hi! 👋 Configure theme, alerts, language and accessibility. Pick a topic below to learn more.',
        dark: '🌓 Dark mode: toggles between light and dark themes. Tip: use it to reduce eye strain in low light.',
        carousel: '🎠 Carousel animation: controls hover/auto animations on the home page. Disabling reduces motion.',
        guide: '🎓 Guide: enables/disables help tutorials across the site (including this bubble).',
        alerts: '🔔 Alerts: shows important messages (errors, confirmations, warnings). Disabling may hide critical confirmations.',
        language: '🌐 Language: opens a modal to choose the language (PT/EN/ES). Interface updates immediately.',
        accessibility: '♿ Accessibility: adjust font size, font type (OpenDyslexic recommended), line spacing, high contrast and auto reading.',
        save: '💾 Save changes: stores preferences and applies them globally.',
        restore: '♻️ Restore defaults: revert everything to initial recommended values.',
        back: '🏠 Return to lobby: go back to the home page. Remember to save first.'
    },
    'es-ES': {
        intro: '¡Hola! 👋 Configura tema, alertas, idioma y accesibilidad. Elige un tema abajo para saber más.',
        dark: '🌓 Modo oscuro: alterna entre temas claro y oscuro. Útil para reducir la fatiga visual.',
        carousel: '🎠 Animación del carrusel: controla animaciones/hover en la página principal. Al desactivar, reduce movimiento.',
        guide: '🎓 Guía: activa/desactiva tutoriales en el sitio (incluida esta burbuja).',
        alerts: '🔔 Alertas: muestra mensajes importantes (errores, confirmaciones, avisos). Desactivar puede ocultar confirmaciones críticas.',
        language: '🌐 Idioma: abre un modal para elegir (PT/EN/ES). La interfaz se actualiza inmediatamente.',
        accessibility: '♿ Accesibilidad: ajusta tamaño y tipo de fuente (OpenDyslexic recomendado), interlineado, alto contraste y lectura automática.',
        save: '💾 Guardar cambios: almacena preferencias y las aplica globalmente.',
        restore: '♻️ Restaurar valores: revierte todo a los valores iniciales.',
        back: '🏠 Volver al lobby: regresa a la página principal. Recuerda guardar primero.'
    }
};

function showGuideInfo(topic) {
    let lang = 'pt-BR';
    if (window.settingsManager && window.settingsManager.savedSettings && window.settingsManager.savedSettings.language) {
        lang = window.settingsManager.savedSettings.language;
    }
    const texts = GUIDE_TEXTS[lang] || GUIDE_TEXTS['pt-BR'];
    const el = document.getElementById('guideContent');
    if (!el) return;
    
    const map = {
        dark: texts.dark,
        carousel: texts.carousel,
        guide: texts.guide,
        alerts: texts.alerts,
        language: texts.language,
        accessibility: texts.accessibility,
        save: texts.save,
        restore: texts.restore,
        back: texts.back
    };
    
    el.textContent = map[topic] || texts.intro;
    openGuide();
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    const alertsEnabled = localStorage.getItem('alertsEnabled') !== 'false';
    window.SITE_ALERTS_ENABLED = alertsEnabled;
    
    if (!alertsEnabled) {
        window.alert = function() {
            console.log('[ALERT BLOQUEADO NO LOAD]:', arguments[0]);
        };
        window.confirm = function() {
            console.log('[CONFIRM BLOQUEADO NO LOAD]:', arguments[0]);
            return true;
        };
        console.warn = function() {};
        console.error = function() {};
        document.body.classList.add('alerts-disabled');
    }
    
    new SettingsManager();

    // Texto introdutório conforme idioma
    const guideContent = document.getElementById('guideContent');
    if (guideContent) {
        const lang = localStorage.getItem('language') || 'pt-BR';
        const texts = GUIDE_TEXTS[lang] || GUIDE_TEXTS['pt-BR'];
        guideContent.textContent = texts.intro;
    }
});

// ==================== TRADUÇÕES ====================
const CONFIG = {
    translations: {
        'pt-BR': {
            title: 'Configurações',
            darkMode: 'Modo escuro',
            carousel: 'Animação do carrossel',
            guide: 'Guia',
            guia: 'Guia',
            alerts: 'Alertas',
            language: 'Idioma',
            accessibility: 'Fonte e Acessibilidade',
            saveChanges: 'Salvar alterações',
            restoreChanges: 'Voltar para os padrões iniciais',
            backToMain: 'Retornar para o lobby',
            selectLanguage: 'Selecione o idioma',
            save: 'Salvar',
            cancel: 'Cancelar',
            fontAccessibilityTitle: 'Fonte e Acessibilidade',
            fontSize: 'Tamanho da fonte:',
            fontType: 'Tipo da fonte:',
            lineSpacing: 'Espaçamento entre linhas:',
            highContrast: 'Modo alto contraste:',
            autoRead: 'Modo de leitura automática:',
            alertsWarningTitle: '⚠️ Aviso Importante',
            alertsWarningMessage: 'Ao desativar os alertas, você não receberá mais notificações importantes do sistema, incluindo:',
            alertsWarningItem1: 'Avisos de segurança',
            alertsWarningItem2: 'Notificações de erro',
            alertsWarningItem3: 'Confirmações de ações importantes',
            alertsWarningItem4: 'Mensagens de validação',
            alertsWarningQuestion: 'Isso pode ser prejudicial para sua experiência no site. Tem certeza que deseja continuar?',
            confirmDisable: 'Sim, desativar alertas',
            guide_title: 'Hefélio, o Guia',
            guide_intro_config: 'Olá! 👋 Aqui você pode configurar o tema, alertas, idioma e acessibilidade. Escolha um tópico abaixo para entender cada opção.',
            guide_opt_dark: '🌓 Modo escuro',
            guide_opt_carousel: '🎠 Carrossel',
            guide_opt_guide: '🎓 Guia',
            guide_opt_alerts: '🔔 Alertas',
            guide_opt_language: '🌐 Idioma',
            guide_opt_accessibility: '♿ Acessibilidade',
            guide_opt_save: '💾 Salvar',
            guide_opt_restore: '♻️ Restaurar',
            guide_opt_back: '🏠 Voltar'
        },
        'en-US': {
            title: 'Settings',
            darkMode: 'Dark mode',
            carousel: 'Carousel animation',
            guide: 'Guide',
            guia: 'Guide',
            alerts: 'Alerts',
            language: 'Language',
            accessibility: 'Font and Accessibility',
            saveChanges: 'Save changes',
            restoreChanges: 'Restore to defaults',
            backToMain: 'Return to lobby',
            selectLanguage: 'Select language',
            save: 'Save',
            cancel: 'Cancel',
            fontAccessibilityTitle: 'Font and Accessibility',
            fontSize: 'Font size:',
            fontType: 'Font type:',
            lineSpacing: 'Line spacing:',
            highContrast: 'High contrast mode:',
            autoRead: 'Auto reading mode:',
            alertsWarningTitle: '⚠️ Important Warning',
            alertsWarningMessage: 'By disabling alerts, you will no longer receive important system notifications, including:',
            alertsWarningItem1: 'Security warnings',
            alertsWarningItem2: 'Error notifications',
            alertsWarningItem3: 'Important action confirmations',
            alertsWarningItem4: 'Validation messages',
            alertsWarningQuestion: 'This can be harmful to your site experience. Are you sure you want to continue?',
            confirmDisable: 'Yes, disable alerts',
            guide_title: 'Hephélio, the Guide',
            guide_intro_config: 'Hi! 👋 Configure theme, alerts, language and accessibility. Pick a topic below to learn more.',
            guide_opt_dark: '🌓 Dark mode',
            guide_opt_carousel: '🎠 Carousel',
            guide_opt_guide: '🎓 Guide',
            guide_opt_alerts: '🔔 Alerts',
            guide_opt_language: '🌐 Language',
            guide_opt_accessibility: '♿ Accessibility',
            guide_opt_save: '💾 Save',
            guide_opt_restore: '♻️ Restore',
            guide_opt_back: '🏠 Back'
        },
        'es-ES': {
            title: 'Ajustes',
            darkMode: 'Modo oscuro',
            carousel: 'Animación carrusel',
            guide: 'Guía',
            guia: 'Guía',
            alerts: 'Alertas',
            language: 'Idioma',
            accessibility: 'Fuente y Accesibilidad',
            saveChanges: 'Guardar cambios',
            restoreChanges: 'Restaurar valores predeterminados',
            backToMain: 'Volver al lobby',
            selectLanguage: 'Selecciona el idioma',
            save: 'Guardar',
            cancel: 'Cancelar',
            fontAccessibilityTitle: 'Fuente y Accesibilidad',
            fontSize: 'Tamaño de fuente:',
            fontType: 'Tipo de fuente:',
            lineSpacing: 'Espaciado entre líneas:',
            highContrast: 'Modo alto contraste:',
            autoRead: 'Modo de lectura automática:',
            alertsWarningTitle: '⚠️ Advertencia Importante',
            alertsWarningMessage: 'Al desactivar las alertas, ya no recibirás notificaciones importantes del sistema, incluyendo:',
            alertsWarningItem1: 'Advertencias de seguridad',
            alertsWarningItem2: 'Notificaciones de error',
            alertsWarningItem3: 'Confirmaciones de acciones importantes',
            alertsWarningItem4: 'Mensajes de validación',
            alertsWarningQuestion: 'Esto puede ser perjudicial para tu experiencia en el sitio. ¿Estás seguro de que quieres continuar?',
            confirmDisable: 'Sí, desactivar alertas',
            guide_title: 'Hefelio, el Guía',
            guide_intro_config: '¡Hola! 👋 Configura tema, alertas, idioma y accesibilidad. Elige un tema abajo para saber más.',
            guide_opt_dark: '🌓 Modo oscuro',
            guide_opt_carousel: '🎠 Carrusel',
            guide_opt_guide: '🎓 Guía',
            guide_opt_alerts: '🔔 Alertas',
            guide_opt_language: '🌐 Idioma',
            guide_opt_accessibility: '♿ Accesibilidad',
            guide_opt_save: '💾 Guardar',
            guide_opt_restore: '♻️ Restaurar',
            guide_opt_back: '🏠 Volver'
        }
    }
};