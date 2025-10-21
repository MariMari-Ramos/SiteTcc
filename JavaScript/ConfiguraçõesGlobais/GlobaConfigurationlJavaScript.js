/**
 * Sistema Global de Configurações
 * Carrega e aplica as configurações salvas em todas as páginas do site
 */
(function() {
    'use strict';

    class GlobalSettings {
        constructor() {
            this.settings = this.loadSettings();
            this.init();
        }

        loadSettings() {
            return {
                theme: localStorage.getItem('theme') || 'light',
                language: localStorage.getItem('language') || 'pt-BR',
                carousel: localStorage.getItem('carouselHoverEnabled') !== 'false',
                guide: localStorage.getItem('guideEnabled') !== 'false',
                alerts: localStorage.getItem('alertsEnabled') !== 'false',
                fontSize: localStorage.getItem('fontSize') || '16',
                fontType: localStorage.getItem('fontType') || 'OpenDyslexic',
                lineSpacing: localStorage.getItem('lineSpacing') || '1.5',
                highContrast: localStorage.getItem('highContrast') === 'true',
                autoRead: localStorage.getItem('autoRead') === 'true'
            };
        }

        init() {
            this.applyTheme();
            this.applyAccessibility();
            this.applyCarousel();
            this.applyGuide();
            this.applyAlerts();
            this.applyLanguage();
        }

        applyTheme() {
            document.documentElement.setAttribute('data-theme', this.settings.theme);
        }

        applyAccessibility() {
            // Aplica tamanho da fonte
            document.documentElement.style.fontSize = this.settings.fontSize + 'px';
            
            // Aplica tipo de fonte
            document.body.style.fontFamily = this.settings.fontType + ', Arial, sans-serif';
            
            // Aplica espaçamento de linha
            document.body.style.lineHeight = this.settings.lineSpacing;
            
            // Aplica alto contraste
            if (this.settings.highContrast) {
                document.body.classList.add('high-contrast');
            } else {
                document.body.classList.remove('high-contrast');
            }

            // Aplica leitura automática (futuro)
            if (this.settings.autoRead) {
                document.body.classList.add('auto-read');
            } else {
                document.body.classList.remove('auto-read');
            }
        }

        applyCarousel() {
            if (!this.settings.carousel) {
                document.body.classList.add('carousel-hover-disabled');
            } else {
                document.body.classList.remove('carousel-hover-disabled');
            }
        }

        applyGuide() {
            if (!this.settings.guide) {
                document.body.classList.add('guide-disabled');
            } else {
                document.body.classList.remove('guide-disabled');
            }
        }

        applyAlerts() {
            window.SITE_ALERTS_ENABLED = this.settings.alerts;
            
            if (!this.settings.alerts) {
                // Bloqueia alertas
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
            } else {
                document.body.classList.remove('alerts-disabled');
            }
        }

        applyLanguage() {
            // Carrega traduções (se houver elementos com data-translate)
            const elements = document.querySelectorAll('[data-translate]');
            if (elements.length > 0 && window.TRANSLATIONS) {
                const translations = window.TRANSLATIONS[this.settings.language] || window.TRANSLATIONS['pt-BR'];
                elements.forEach(el => {
                    const key = el.getAttribute('data-translate');
                    if (translations[key]) {
                        el.textContent = translations[key];
                    }
                });
            }
        }
    }

    // Inicializa as configurações assim que o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new GlobalSettings());
    } else {
        new GlobalSettings();
    }

    // Permite atualizar configurações de outras páginas
    window.updateGlobalSettings = function() {
        new GlobalSettings();
    };

})();