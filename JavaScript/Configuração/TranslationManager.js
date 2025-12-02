(function(global){
  const DEFAULT_LOCALE = 'pt-BR';
  const SUPPORTED_LOCALES = ['pt-BR','en-US','es-ES'];
  // Usa caminho absoluto para evitar problemas de diretório relativo em páginas internas
  const LOCALE_PATH = '/SiteTcc/locales';

  class TranslationManager {
    constructor(){
      this.locale = this._detectInitialLocale();
      this.translations = {};
      this.loaded = false;
      this.loadingPromise = null;
    }

    _detectInitialLocale(){
      try {
        const stored = localStorage.getItem('app_locale');
        if(stored && SUPPORTED_LOCALES.includes(stored)) return stored;
        const nav = (navigator.language || navigator.userLanguage || '').trim();
        const match = SUPPORTED_LOCALES.find(l => l.toLowerCase() === nav.toLowerCase());
        return match || DEFAULT_LOCALE;
      } catch(e){
        return DEFAULT_LOCALE;
      }
    }

    setLocale(newLocale){
      if(!SUPPORTED_LOCALES.includes(newLocale)) {
        console.warn('[i18n] Unsupported locale:', newLocale);
        return;
      }
      if(this.locale === newLocale) return;
      this.locale = newLocale;
      try { localStorage.setItem('app_locale', newLocale); } catch(e){}
      this.loaded = false;
      this.translations = {};
      return this.load();
    }

    async load(){
      if(this.loaded) return;
      if(this.loadingPromise) return this.loadingPromise;
      const url = `${LOCALE_PATH}/${this.locale}.json`;
      this.loadingPromise = fetch(url, {cache:'no-store'})
        .then(r => {
          if(!r.ok) throw new Error('Failed to load locale '+this.locale);
          return r.json();
        })
        .then(json => {
          this.translations = json || {};
          this.loaded = true;
          this.loadingPromise = null;
        })
        .catch(err => {
          console.error('[i18n] Load error', err);
          this.loadingPromise = null;
        });
      return this.loadingPromise;
    }

    t(key, vars){
      // Silencia aviso se não carregado ainda - fallback para a chave
      let raw = this._resolveKey(key);
      if(vars && raw){
        Object.keys(vars).forEach(k => {
          raw = raw.replace(new RegExp(`{{${k}}}`,'g'), vars[k]);
        });
      }
      return raw != null ? raw : key;
    }

    _resolveKey(key){
      if(!key) return null;
      // Primeiro tenta acesso direto (chaves com pontos como "guide.info.dark")
      if(Object.prototype.hasOwnProperty.call(this.translations, key)){
        const val = this.translations[key];
        return typeof val === 'string' ? val : null;
      }
      // Fallback: tenta navegação aninhada (guide -> info -> dark)
      const parts = key.split('.');
      let cur = this.translations;
      for(const p of parts){
        if(cur && Object.prototype.hasOwnProperty.call(cur, p)){
          cur = cur[p];
        } else {
          return null;
        }
      }
      return typeof cur === 'string' ? cur : null;
    }

    applyToDOM(root=document){
      const elements = root.querySelectorAll('[data-i18n]');
      elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(!key) return;
        const text = this.t(key);
        if(text && text !== key){
          el.textContent = text;
        }
      });
    }
  }

  const manager = new TranslationManager();
  console.log('[i18n] TranslationManager criado, locale:', manager.locale);
  manager.load().then(()=>{
    console.log('[i18n] Tradução carregada com sucesso!', Object.keys(manager.translations).length, 'chaves');
    manager.applyToDOM();
    document.dispatchEvent(new CustomEvent('i18n:loaded',{detail:{locale:manager.locale}}));
  }).catch(err => {
    console.error('[i18n] Erro ao carregar:', err);
  });

  global.TranslationManager = manager;
  console.log('[i18n] TranslationManager exposto em window.TranslationManager');
})(window);
