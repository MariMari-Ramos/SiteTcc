
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
    // ...existing code...

// Dicionário de traduções da Home (mesmo padrão da tela de Configuração)
const TRANSLATIONS = {
  'pt-BR': {
    title: 'SystemForge - Início',
    perfil: 'Perfil',
    configuracoes: 'Configurações',
    guia: 'Guia',
    sistemas: 'Sistemas',
    minhasFichas: 'Minhas Fichas',
    minhasFichasRandomicas: 'Minhas Fichas Randômicas',
    linksRapidos: 'Links Rápidos:',
    patrocinadores: 'Patrocinadores:',
    contatoSuporte: 'Contato & Suporte:',
    email: 'Email',
    whatsapp: 'Whatsapp',
    direitosReservados: 'Todos os direitos reservados',
    politicasPrivacidade: 'Políticas de Privacidade',
    termosUso: 'Termos de Uso',
    termosCookies: 'Termos de Cookies',
    acessibilidade: 'Acessibilidade',

    guide_title: 'Hefelio, o Guia',
    close: 'Fechar',
    guide_intro: 'Olá, aventureiro! 👋 Sou seu guia nesta interface. Estou aqui para ajudá-lo a navegar e entender todos os elementos e funcionalidades disponíveis. Por onde iremos começar?',
    guide_option_systems: '📋 O que são os sistemas?',
    guide_option_my_sheets: '📝 O que são as minhas fichas? E onde estão elas?',
    guide_option_random: '🧪 O que são as fichas randômicas? E onde estão elas?',
    guide_option_tips: '💡 Dicas para iniciantes',

    modal_create_title: 'Criar Ficha',
    modal_create_desc: 'Criar nova ficha de personagem',
    modal_summary_title: 'Resumo do Sistema',
    modal_summary_desc: 'Guia completo do sistema',
    modal_center_title: 'Sistema',
    modal_icon_alt: 'Ícone do Sistema',
    modal_random_title: 'Fichas Randômicas',
    modal_random_desc: 'Gerador aleatório',
    modal_resources_title: 'Recursos Presentes',
    modal_resources_desc: 'Materiais disponíveis',
    voltar: '← Voltar'
  },

  'en-US': {
    title: 'SystemForge - Home',
    perfil: 'Profile',
    configuracoes: 'Settings',
    guia: 'Guide',
    sistemas: 'Systems',
    minhasFichas: 'My Sheets',
    minhasFichasRandomicas: 'Random Sheets',
    linksRapidos: 'Quick Links:',
    patrocinadores: 'Sponsors:',
    contatoSuporte: 'Contact & Support:',
    email: 'Email',
    whatsapp: 'WhatsApp',
    direitosReservados: 'All rights reserved',
    politicasPrivacidade: 'Privacy Policy',
    termosUso: 'Terms of Use',
    termosCookies: 'Cookie Policy',
    acessibilidade: 'Accessibility',

    guide_title: 'Hefelio, the Guide',
    close: 'Close',
    guide_intro: "Hello, adventurer! 👋 I'm your guide in this interface. I'm here to help you navigate and understand all elements and features. Where shall we start?",
    guide_option_systems: '📋 What are the systems?',
    guide_option_my_sheets: '📝 What are my sheets? And where are they?',
    guide_option_random: '🧪 What are random sheets? And where are they?',
    guide_option_tips: '💡 Tips for beginners',

    modal_create_title: 'Create Sheet',
    modal_create_desc: 'Create a new character sheet',
    modal_summary_title: 'System Summary',
    modal_summary_desc: 'Complete system guide',
    modal_center_title: 'System',
    modal_icon_alt: 'System Icon',
    modal_random_title: 'Random Sheets',
    modal_random_desc: 'Random generator',
    modal_resources_title: 'Available Resources',
    modal_resources_desc: 'Available materials',
    voltar: '← Back'
  },

  'es-ES': {
    title: 'SystemForge - Inicio',
    perfil: 'Perfil',
    configuracoes: 'Configuraciones',
    guia: 'Guía',
    sistemas: 'Sistemas',
    minhasFichas: 'Mis Fichas',
    minhasFichasRandomicas: 'Fichas Aleatorias',
    linksRapidos: 'Enlaces Rápidos:',
    patrocinadores: 'Patrocinadores:',
    contatoSuporte: 'Contacto y Soporte:',
    email: 'Correo',
    whatsapp: 'WhatsApp',
    direitosReservados: 'Todos los derechos reservados',
    politicasPrivacidade: 'Política de Privacidad',
    termosUso: 'Términos de Uso',
    termosCookies: 'Política de Cookies',
    acessibilidade: 'Accesibilidad',

    guide_title: 'Hefelio, el Guía',
    close: 'Cerrar',
    guide_intro: '¡Hola, aventurero! 👋 Soy tu guía en esta interfaz. Estoy aquí para ayudarte a navegar y entender todas las funciones. ¿Por dónde empezamos?',
    guide_option_systems: '📋 ¿Qué son los sistemas?',
    guide_option_my_sheets: '📝 ¿Qué son mis fichas? ¿Y dónde están?',
    guide_option_random: '🧪 ¿Qué son las fichas aleatorias? ¿Y dónde están?',
    guide_option_tips: '💡 Consejos para principiantes',

    modal_create_title: 'Crear Ficha',
    modal_create_desc: 'Crear una nueva ficha de personaje',
    modal_summary_title: 'Resumen del Sistema',
    modal_summary_desc: 'Guía completa del sistema',
    modal_center_title: 'Sistema',
    modal_icon_alt: 'Ícono del Sistema',
    modal_random_title: 'Fichas Aleatorias',
    modal_random_desc: 'Generador aleatorio',
    modal_resources_title: 'Recursos Disponibles',
    modal_resources_desc: 'Materiales disponibles',
    voltar: '← Volver'
  }
};

// Disponibiliza para o Global e aplica assim que possível
document.addEventListener('DOMContentLoaded', () => {
  window.TRANSLATIONS = TRANSLATIONS;

  // Aplica imediatamente (igual ao comportamento da tela de Configuração)
  if (window.applyTranslationsNow) {
    window.applyTranslationsNow();
  } else if (window.updateGlobalSettings) {
    window.updateGlobalSettings();
  }
});

})();