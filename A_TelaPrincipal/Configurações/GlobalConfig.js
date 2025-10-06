const CONFIG = {
    translations: {
        'pt-BR': {
            title: 'SystemForge',
            guia: 'Guia',
            configuracoes: 'Configurações',
            perfil: 'Perfil',
            sistemas: 'Sistemas',
            minhasFichas: 'Minhas Fichas',
            minhasFichasRandomicas: 'Minhas Fichas Randomicas',
            inscreva: 'Inscreva-se',
            copyright: '© 2025 SystemForge. Todos os direitos reservados.',
            blog: 'BLOG',
            outraCoisa: 'Outra coisa',
            receberNovidades: 'Receba nossas novidades por email',
            emailPlaceholder: 'Digite seu email'
        },
        'en-US': {
            title: 'SystemForge',
            guia: 'Guide',
            configuracoes: 'Settings',
            perfil: 'Profile',
            sistemas: 'Systems',
            minhasFichas: 'My Cards',
            minhasFichasRandomicas: 'Random Cards',
            inscreva: 'Subscribe',
            copyright: '© 2025 SystemForge. All rights reserved.',
            blog: 'BLOG',
            outraCoisa: 'Other',
            receberNovidades: 'Get our news by email',
            emailPlaceholder: 'Enter your email'
        }
        // Adicione outros idiomas se quiser
    }
};

function applyTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
}

function applyLanguage() {
    const lang = localStorage.getItem('language') || 'pt-BR';
    const texts = CONFIG.translations[lang] || CONFIG.translations['pt-BR'];
    document.title = texts.title;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (texts[key]) el.textContent = texts[key];
        if (key === 'emailPlaceholder') el.setAttribute('placeholder', texts[key]);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    applyLanguage();
});