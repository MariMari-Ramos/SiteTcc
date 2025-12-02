
(function() {
    'use strict';

    function getCurrentLang() {
        const saved = localStorage.getItem('language') || 'pt-BR';
        const s = String(saved).toLowerCase();
        if (s.startsWith('en')) return 'en-US';
        if (s.startsWith('es')) return 'es-ES';
        return 'pt-BR';
    }

    function translateElement(el, dict) {
        const key = el.getAttribute('data-translate');
        if (!key) return;

        const val = dict && dict[key];
        if (val == null) return;

        const attrs = (el.getAttribute('data-translate-attr') || '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);

        if (el.tagName.toLowerCase() === 'title') {
            document.title = val;
        } else if (attrs.length) {
            attrs.forEach(a => el.setAttribute(a, val));
        } else {
            el.textContent = val;
        }
    }

    function applyLanguageFromGlobal() {
        const lang = getCurrentLang();
        const dict = (window.TRANSLATIONS && (window.TRANSLATIONS[lang] || window.TRANSLATIONS['pt-BR'])) || null;

        if (!dict) return; // a página ainda não registrou TRANSLATIONS

        document.documentElement.lang = lang;
        document.querySelectorAll('[data-translate]').forEach(el => translateElement(el, dict));
    }

    class GlobalSettings {
        constructor() {
            this.settings = this.loadSettings();
            this.init();
        }

        loadSettings() {
            return {
                theme: localStorage.getItem('theme') || 'light',
                language: getCurrentLang(),
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
            document.documentElement.style.fontSize = this.settings.fontSize + 'px';
            document.body.style.fontFamily = this.settings.fontType + ', Arial, sans-serif';
            document.body.style.setProperty('--global-font-family', this.settings.fontType + ', Arial, sans-serif');
            document.body.style.lineHeight = this.settings.lineSpacing;

            if (this.settings.highContrast) {
                document.body.classList.add('high-contrast');
            } else {
                document.body.classList.remove('high-contrast');
            }

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
                window.alert = function() { console.log('[ALERT BLOQUEADO]:', arguments[0]); };
                window.confirm = function() { console.log('[CONFIRM BLOQUEADO]:', arguments[0]); return true; };
                console.warn = function() {};
                console.error = function() {};
                document.body.classList.add('alerts-disabled');
            } else {
                document.body.classList.remove('alerts-disabled');
            }
        }

        applyLanguage() {
            applyLanguageFromGlobal();
        }
    }

    // Inicializa uma vez
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new GlobalSettings());
    } else {
        new GlobalSettings();
    }

    // Reaplicar quando a página registrar TRANSLATIONS
    window.applyTranslationsNow = function() {
        applyLanguageFromGlobal();
    };

    // Trocar idioma em tempo real (salva e aplica)
    window.setLanguage = function(lang) {
        const l = String(lang || '').toLowerCase();
        const norm = l.startsWith('en') ? 'en-US' : l.startsWith('es') ? 'es-ES' : 'pt-BR';
        localStorage.setItem('language', norm);
        applyLanguageFromGlobal();
    };

    // Reaplicar tudo (tema, acessibilidade, idioma…)
    window.updateGlobalSettings = function() {
        new GlobalSettings();
    };

})();