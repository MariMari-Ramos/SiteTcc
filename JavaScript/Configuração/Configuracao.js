class SettingsManager {
    constructor() {
        this.savedSettings = this.loadSettings();
        this.unsavedChanges = false;
        this.originalAlert = window.alert;
        this.originalConfirm = window.confirm;
        this.originalConsoleWarn = console.warn;
        this.originalConsoleError = console.error;
        // Web Speech API state
        this.speech = {
            supported: 'speechSynthesis' in window,
            utterance: null,
            speaking: false,
            voice: null,
            rate: 1,
            pitch: 1,
            lang: (navigator.language || 'pt-BR')
        };
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
            autoRead: false,
            speechRate: '1',
            speechPitch: '1'
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
                    // Salva no localStorage para refletir globalmente
                    try {
                        localStorage.setItem('theme', this.savedSettings.theme);
                        localStorage.setItem('language', this.savedSettings.language);
                        localStorage.setItem('carouselHoverEnabled', this.savedSettings.carousel ? 'true' : 'false');
                        localStorage.setItem('guideEnabled', this.savedSettings.guide ? 'true' : 'false');
                        localStorage.setItem('alertsEnabled', this.savedSettings.alerts ? 'true' : 'false');
                        localStorage.setItem('fontSize', this.savedSettings.fontSize);
                        localStorage.setItem('fontType', this.savedSettings.fontType);
                        localStorage.setItem('lineSpacing', this.savedSettings.lineSpacing);
                        localStorage.setItem('highContrast', this.savedSettings.highContrast ? 'true' : 'false');
                        localStorage.setItem('autoRead', this.savedSettings.autoRead ? 'true' : 'false');
                        localStorage.setItem('speechRate', String(this.savedSettings.speechRate || '1'));
                        localStorage.setItem('speechPitch', String(this.savedSettings.speechPitch || '1'));
                    } catch (e) {}
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
        this.initSpeechVoices();
        this.setupWordClickRead();
        this.setupSelectionRead();
        this._selectionDebounceTimer = null;
        this._speechQueue = [];
    }

    // ==================== ANIMAÇÃO DE FECHAMENTO DE MODAL ====================
    animateModalClose(modal, after) {
        try {
            if (!modal) return;
            if (getComputedStyle(modal).display === 'none') { if (typeof after === 'function') after(); return; }
            const content = modal.querySelector('.modal-content');
            if (content) content.classList.add('closing');
            const onEnd = (e) => {
                if (content && e.target !== content) return; // garante evento da content
                if (content) content.removeEventListener('animationend', onEnd);
                modal.style.display = 'none';
                if (content) content.classList.remove('closing');
                // Remove classe modal-open se não existir outro modal aberto
                const anyOpen = Array.from(document.querySelectorAll('.modal')).some(m => m !== modal && getComputedStyle(m).display === 'block');
                if (!anyOpen) document.body.classList.remove('modal-open');
                if (typeof after === 'function') after();
            };
            if (content) {
                content.addEventListener('animationend', onEnd);
            } else {
                setTimeout(onEnd, 350);
            }
        } catch (e) {
            // Fallback silencioso
            try { modal.style.display = 'none'; } catch(_) {}
            const anyOpen = Array.from(document.querySelectorAll('.modal')).some(m => m !== modal && getComputedStyle(m).display === 'block');
            if (!anyOpen) document.body.classList.remove('modal-open');
            if (typeof after === 'function') after();
        }
    }

    // ==================== AUTO-READ (Web Speech API) ====================
    initSpeechVoices() {
        if (!this.speech.supported) return;
        const setVoice = () => {
            const voices = window.speechSynthesis.getVoices();
            // Prefer voice matching current language
            const lang = (this.savedSettings.language || this.speech.lang);
            const preferred = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(lang.toLowerCase()))
                || voices.find(v => v.lang && v.lang.toLowerCase().startsWith('pt'))
                || voices[0];
            this.speech.voice = preferred || null;
        };
        setVoice();
        if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
            window.speechSynthesis.onvoiceschanged = setVoice;
        }
    }

    speak(text) {
        if (!this.speech.supported || !this.savedSettings.autoRead || !text) return;
        try {
            this.stopSpeaking();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = (this.savedSettings.language || this.speech.lang);
            if (this.speech.voice) u.voice = this.speech.voice;
            // aplica rate/pitch das configurações
            this.speech.rate = Number(this.savedSettings.speechRate || this.speech.rate || 1);
            this.speech.pitch = Number(this.savedSettings.speechPitch || this.speech.pitch || 1);
            u.rate = this.speech.rate;
            u.pitch = this.speech.pitch;
            u.onstart = () => { this.speech.speaking = true; };
            u.onend = () => { this.speech.speaking = false; };
            this.speech.utterance = u;
            window.speechSynthesis.speak(u);
        } catch(e) {
            // Silencioso: alguns navegadores bloqueiam sem interação do usuário
        }
    }

    stopSpeaking() {
        try {
            if (this.speech.supported) {
                window.speechSynthesis.cancel();
            }
            this.speech.speaking = false;
            this.speech.utterance = null;
            this._speechQueue = [];
        } catch(e) {}
    }

    // Fala uma sequência de sentenças, enfileirando-as
    speakSequence(sentences) {
        if (!this.speech.supported || !this.savedSettings.autoRead) return;
        const items = (sentences || []).map(s => (s || '').trim()).filter(s => s.length);
        if (!items.length) return;
        this.stopSpeaking();
        this._speechQueue = items.slice();
        const next = () => {
            const txt = this._speechQueue.shift();
            if (!txt) return;
            try {
                const u = new SpeechSynthesisUtterance(txt);
                u.lang = (this.savedSettings.language || this.speech.lang);
                if (this.speech.voice) u.voice = this.speech.voice;
                this.speech.rate = Number(this.savedSettings.speechRate || this.speech.rate || 1);
                this.speech.pitch = Number(this.savedSettings.speechPitch || this.speech.pitch || 1);
                u.rate = this.speech.rate;
                u.pitch = this.speech.pitch;
                u.onend = () => {
                    this.speech.speaking = false;
                    if (this._speechQueue.length) {
                        next();
                    }
                };
                u.onstart = () => { this.speech.speaking = true; };
                this.speech.utterance = u;
                window.speechSynthesis.speak(u);
            } catch(e) {
                // se falhar, tenta próximo
                next();
            }
        };
        next();
    }

    // Lê a palavra clicada quando autoRead está ativo
    setupWordClickRead() {
        this._handleWordClick = (e) => this.handleWordClick(e);
        document.addEventListener('click', this._handleWordClick, true);
    }

    handleWordClick(e) {
        try {
            if (!this.savedSettings || !this.savedSettings.autoRead) return;
            if (e.button !== 0) return; // apenas clique principal

            const ignore = e.target.closest('button, a, input, textarea, select, [contenteditable], .toggle-button, .switch, .config-button, .action-button, .guide-option, .slider');
            if (ignore) return;

            // Evita falar ao fechar modais ou clicar no backdrop
            if (e.target.classList && (e.target.classList.contains('modal') || e.target.classList.contains('modal-backdrop'))) return;

            let node = null, offset = 0;
            const x = e.clientX, y = e.clientY;
            if (document.caretRangeFromPoint) {
                const range = document.caretRangeFromPoint(x, y);
                if (!range) return;
                node = range.startContainer;
                offset = range.startOffset;
            } else if (document.caretPositionFromPoint) {
                const pos = document.caretPositionFromPoint(x, y);
                if (!pos) return;
                node = pos.offsetNode;
                offset = pos.offset;
            } else {
                return;
            }

            if (!node || node.nodeType !== Node.TEXT_NODE) return;
            const text = node.textContent || '';
            if (!text.trim()) return;

            const word = this.extractWordAt(text, offset, this.savedSettings.language || 'pt-BR');
            if (word) {
                this.speak(word);
            }
        } catch(err) {
            // silencioso
        }
    }

    extractWordAt(text, offset, lang) {
        // Tenta usar Intl.Segmenter para melhor suporte a idiomas
        try {
            if (window.Intl && typeof Intl.Segmenter === 'function') {
                const seg = new Intl.Segmenter(lang || 'pt-BR', { granularity: 'word' });
                const iterator = seg.segment(text);
                for (const part of iterator) {
                    const start = part.index;
                    const end = start + part.segment.length;
                    if (offset >= start && offset <= end) {
                        if (part.isWordLike) {
                            return part.segment.trim();
                        } else {
                            // Se clicou em espaço/pontuação, procura próxima parte com palavra
                            // à esquerda e à direita
                            const ahead = this._nextWordSegment(text, end, seg);
                            if (ahead) return ahead;
                            const back = this._prevWordSegment(text, start, seg);
                            if (back) return back;
                            return '';
                        }
                    }
                }
            }
        } catch(_) {}

        // Fallback regex unicode
        const isWordChar = (ch) => /[\p{L}\p{N}'’_-]/u.test(ch);
        let i = Math.max(0, Math.min(offset, text.length));
        let start = i, end = i;
        while (start > 0 && isWordChar(text[start-1])) start--;
        while (end < text.length && isWordChar(text[end])) end++;
        const w = text.slice(start, end).trim();
        return w;
    }

    _nextWordSegment(text, fromIdx, seg) {
        const iter = seg.segment(text);
        for (const part of iter) {
            if (part.index >= fromIdx && part.isWordLike) {
                return part.segment.trim();
            }
        }
        return '';
    }

    _prevWordSegment(text, fromIdx, seg) {
        const parts = Array.from(seg.segment(text));
        for (let k = parts.length - 1; k >= 0; k--) {
            const part = parts[k];
            if (part.index + part.segment.length <= fromIdx && part.isWordLike) {
                return part.segment.trim();
            }
        }
        return '';
    }

    // ==================== LEITURA POR SELEÇÃO (FRASE INTEIRA) ====================
    setupSelectionRead() {
        // Lê a frase inteira quando o usuário seleciona texto com o mouse (com debounce)
        this._handleSelectionRead = (e) => this.handleSelectionRead(e);
        document.addEventListener('mouseup', this._handleSelectionRead, true);
        // Suporte básico a seleção por teclado (Shift+setas) com debounce
        this._handleSelectionKey = (e) => {
            if (!e) return;
            if (e.key === 'Shift' || (typeof e.key === 'string' && e.key.startsWith('Arrow'))) {
                this.handleSelectionRead(e);
            }
        };
        document.addEventListener('keyup', this._handleSelectionKey, true);
    }

    handleSelectionRead(e) {
        try {
            if (!this.speech.supported || !this.savedSettings || !this.savedSettings.autoRead) return;

            if (this._selectionDebounceTimer) {
                clearTimeout(this._selectionDebounceTimer);
                this._selectionDebounceTimer = null;
            }

            this._selectionDebounceTimer = setTimeout(() => {
                const sel = window.getSelection ? window.getSelection() : null;
                if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;

                const range = sel.getRangeAt(0);
                // Evitar inputs, botões, links, áreas editáveis e backdrop/modal
                const eventTarget = (e && e.target) ? e.target : null;
                const containerEl = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
                    ? range.commonAncestorContainer
                    : range.commonAncestorContainer.parentElement;
                const targetForCheck = eventTarget || containerEl;
                if (this._isInteractiveElement(targetForCheck)) return;

                const selectedText = sel.toString().trim();
                if (!selectedText) return;

                // Encontrar contêiner de bloco para obter contexto de sentença(s)
                const blockEl = this._closestBlockContainer(containerEl || document.body);
                if (!blockEl || !blockEl.textContent) {
                    // Sem contexto: lê o próprio texto selecionado
                    this.speak(selectedText);
                    return;
                }

                // Calcula offsets dentro do texto completo do bloco
                const rStart = document.createRange();
                rStart.setStart(blockEl, 0);
                rStart.setEnd(range.startContainer, range.startOffset);
                const startOffset = rStart.toString().length;

                const rEnd = document.createRange();
                rEnd.setStart(blockEl, 0);
                rEnd.setEnd(range.endContainer, range.endOffset);
                const endOffset = rEnd.toString().length;

                const fullText = blockEl.textContent;
                const lang = this.savedSettings.language || this.speech.lang || 'pt-BR';
                const sentences = this._extractSentencesInRange(fullText, startOffset, endOffset, lang);
                if (sentences && sentences.length > 1) {
                    this.speakSequence(sentences);
                } else {
                    const sentence = sentences[0] || selectedText;
                    if (sentence && sentence.trim()) this.speak(sentence.trim());
                }
            }, 250);
        } catch(err) {
            // silencioso
        }
    }

    _extractSentencesInRange(text, startOffset, endOffset, lang) {
        const out = [];
        if (!text) return out;
        // Intl.Segmenter por sentenças
        try {
            if (window.Intl && typeof Intl.Segmenter === 'function') {
                const seg = new Intl.Segmenter(lang || 'pt-BR', { granularity: 'sentence' });
                let capturing = false;
                for (const part of seg.segment(text)) {
                    const s = part.index;
                    const e = s + part.segment.length;
                    if (!capturing && startOffset >= s && startOffset < e) {
                        out.push(part.segment.trim());
                        capturing = endOffset > e;
                        if (!capturing) break;
                    } else if (capturing) {
                        out.push(part.segment.trim());
                        if (endOffset <= e) break;
                    }
                }
                if (out.length) return out;
            }
        } catch(_) {}

        // Fallback: cortar por pontuação comum e espaços
        const pieces = text.split(/([\.\!\?…]+)/);
        // Reconstituir mantendo pontuação
        const sentences = [];
        for (let i = 0; i < pieces.length; i += 2) {
            const body = (pieces[i] || '').trim();
            const punct = (pieces[i + 1] || '').trim();
            const s = (body + (punct ? (' ' + punct) : '')).trim();
            if (s) sentences.push(s);
        }
        // Mapear para offsets aproximados
        let pos = 0;
        const bounds = sentences.map(sn => {
            const start = pos;
            const end = pos + sn.length;
            pos = end + 1; // considera espaço
            return { start, end, text: sn };
        });
        const selected = [];
        for (const b of bounds) {
            if (startOffset < b.end && endOffset > b.start) {
                selected.push(b.text);
            }
        }
        return selected.length ? selected : [text.slice(startOffset, endOffset).trim()];
    }

    _isInteractiveElement(el) {
        try {
            const IGNORE_SEL = 'button, a, input, textarea, select, [contenteditable], .toggle-button, .switch, .config-button, .action-button, .guide-option, .slider, .modal, .modal-backdrop';
            let node = el;
            while (node && node !== document && node.nodeType === Node.ELEMENT_NODE) {
                if (node.matches && node.matches(IGNORE_SEL)) return true;
                node = node.parentElement;
            }
        } catch(_) {}
        return false;
    }

    _closestBlockContainer(node) {
        let el = node && (node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement);
        const isBlockTag = (tag) => /^(P|DIV|LI|SECTION|ARTICLE|MAIN|ASIDE|NAV|H1|H2|H3|H4|H5|H6)$/i.test(tag);
        while (el && el !== document.body) {
            if (isBlockTag(el.tagName)) return el;
            try {
                const cs = window.getComputedStyle(el);
                if (cs && (cs.display === 'block' || cs.display === 'list-item' || cs.display === 'table' || cs.display === 'table-row' || cs.display === 'table-cell')) {
                    return el;
                }
            } catch(_) {}
            el = el.parentElement;
        }
        return document.body;
    }

    _extractSentenceAt(text, startOffset, endOffset, lang) {
        if (!text) return '';
        // Usa Intl.Segmenter se disponível para segmentar por frases
        try {
            if (window.Intl && typeof Intl.Segmenter === 'function') {
                const seg = new Intl.Segmenter(lang || 'pt-BR', { granularity: 'sentence' });
                let collected = '';
                let capturing = false;
                for (const part of seg.segment(text)) {
                    const s = part.index;
                    const e = s + part.segment.length;
                    if (!capturing && startOffset >= s && startOffset < e) {
                        collected = part.segment;
                        // Se a seleção ultrapassa o fim desta sentença, inclui próximas até cobrir o fim
                        if (endOffset > e) {
                            capturing = true;
                        } else {
                            return collected;
                        }
                    } else if (capturing) {
                        collected += (collected && !/\s$/.test(collected) ? ' ' : '') + part.segment;
                        if (endOffset <= e) return collected;
                    }
                }
                if (collected) return collected;
            }
        } catch(_) {}

        // Fallback: encontra limites de frase por pontuação comum
        const len = text.length;
        let start = Math.max(0, Math.min(startOffset, len - 1));
        let end = Math.max(0, Math.min(endOffset, len));
        const isSentEnd = (ch) => /[\.\!\?…]/.test(ch);
        // recua até o início da frase
        while (start > 0 && !isSentEnd(text[start - 1])) start--;
        // avança até o fim da frase
        while (end < len && !isSentEnd(text[end - 1] || '')) end++;
        // expande para incluir aspas/fechamentos comuns
        while (end < len && /["'”’)\]\s]/.test(text[end])) end++;
        while (start > 0 && /[\s(“"'‘]/.test(text[start])) start--;
        const slice = text.slice(start, end).trim();
        // Se ainda estiver vazio, retorna seleção original aproximada
        return slice || text.slice(startOffset, endOffset).trim();
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
                document.body.classList.add('modal-open');
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
            this.animateModalClose(alertsModal, () => {
                this.applyAlertsSettings();
                this.showFinalAlertMessage('Alertas desativados! Você não receberá mais notificações do sistema.');
            });
        });

        cancelBtn.addEventListener('click', () => {
            alertsToggle.checked = true;
            this.animateModalClose(alertsModal);
        });

        window.addEventListener('click', (e) => {
            if (e.target === alertsModal) {
                alertsToggle.checked = true;
                this.animateModalClose(alertsModal);
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
            document.body.classList.add('modal-open');
            langOptions.forEach(opt => {
                opt.classList.toggle('selected', opt.dataset.lang === this.savedSettings.language);
            });
        });
        
        closeBtn.addEventListener('click', () => { this.animateModalClose(modal); });

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
                if (window.TranslationManager) {
                    const p = TranslationManager.setLocale(this.savedSettings.language);
                    if (p && typeof p.then === 'function') {
                        p.then(() => {
                            this.updatePageTexts();
                            this.initSpeechVoices();
                        });
                    } else {
                        // mesma localidade selecionada: apenas reaplica textos
                        this.updatePageTexts();
                        this.initSpeechVoices();
                    }
                } else {
                    this.updatePageTexts();
                }
                this.animateModalClose(modal);
                this.unsavedChanges = true;
            }
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) { this.animateModalClose(modal); }
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
        const speechRateInput = document.getElementById('speechRateInput');
        const speechPitchInput = document.getElementById('speechPitchInput');
        const warning = document.getElementById('accessibilityWarning');

        if (!modal || !openBtn || !closeBtn || !saveBtn) return;

        const loadAccessibilitySettings = () => {
            fontSizeSelect.value = this.savedSettings.fontSize;
            fontTypeSelect.value = this.savedSettings.fontType;
            lineSpacingSelect.value = this.savedSettings.lineSpacing;
            if (speechRateInput) speechRateInput.value = String(this.savedSettings.speechRate || '1');
            if (speechPitchInput) speechPitchInput.value = String(this.savedSettings.speechPitch || '1');
            
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
            document.body.classList.add('modal-open');
            loadAccessibilitySettings();
            this.checkContrastConflict();
        });

        closeBtn.addEventListener('click', () => {
            this.animateModalClose(modal, () => this.stopSpeaking());
        });

        fontSizeSelect.addEventListener('change', () => this.unsavedChanges = true);
        fontTypeSelect.addEventListener('change', () => this.unsavedChanges = true);
        lineSpacingSelect.addEventListener('change', () => this.unsavedChanges = true);
        if (speechRateInput) speechRateInput.addEventListener('input', () => this.unsavedChanges = true);
        if (speechPitchInput) speechPitchInput.addEventListener('input', () => this.unsavedChanges = true);

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
            // feedback por voz ao alternar usando i18n
            if (window.TranslationManager) {
                const key = autoReadToggle.classList.contains('active') ? 'speech.autoRead.on' : 'speech.autoRead.off';
                this.speak(TranslationManager.t(key));
            }
        });

        saveBtn.addEventListener('click', () => {
            this.savedSettings.fontSize = fontSizeSelect.value;
            this.savedSettings.fontType = fontTypeSelect.value;
            this.savedSettings.lineSpacing = lineSpacingSelect.value;
            this.savedSettings.highContrast = contrastToggle.classList.contains('active');
            this.savedSettings.autoRead = autoReadToggle.classList.contains('active');
            this.savedSettings.speechRate = speechRateInput ? speechRateInput.value : (this.savedSettings.speechRate || '1');
            this.savedSettings.speechPitch = speechPitchInput ? speechPitchInput.value : (this.savedSettings.speechPitch || '1');
            
            this.applyAccessibilitySettings();
            this.animateModalClose(modal);
            // anunciar mudança de acessibilidade principal via i18n
            if (this.savedSettings.autoRead && window.TranslationManager) {
                this.speak(TranslationManager.t('speech.accessibility.applied'));
            }
            this.unsavedChanges = true;
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) { this.animateModalClose(modal); }
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
        // feedback por voz ao alternar tema via i18n
        if (this.savedSettings.autoRead && window.TranslationManager) {
            const key = theme === 'dark' ? 'speech.theme.dark' : 'speech.theme.light';
            this.speak(TranslationManager.t(key));
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
            // ler título da página ao ativar usando i18n
            if (window.TranslationManager) {
                const h1 = document.querySelector('h1');
                const titleText = h1 ? h1.textContent.trim() : document.title;
                this.speak(TranslationManager.t('pageIntro', { page: titleText }));
            }
        } else {
            document.body.classList.remove('auto-read');
            this.stopSpeaking();
        }
    }

    updatePageTexts() {
        if (!window.TranslationManager) return;
        document.title = TranslationManager.t('title');
        // Aplica tradução via data-i18n
        TranslationManager.applyToDOM();
        const guideContent = document.getElementById('guideContent');
        if (guideContent) {
            guideContent.textContent = TranslationManager.t('guide_intro_config');
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
            autoRead: false,
            speechRate: '1',
            speechPitch: '1'
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
    if (document.body.classList.contains('modal-open')) return; // bloqueado durante modal
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
    if (document.body.classList.contains('modal-open')) return; // não alterna enquanto modal aberto
    
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
    console.log('[GUIDE] showGuideInfo chamado, topic:', topic);
    const el = document.getElementById('guideContent');
    if (!el) {
        console.error('[GUIDE] Elemento guideContent não encontrado!');
        return;
    }
    if (!window.TranslationManager) {
        console.error('[GUIDE] TranslationManager não disponível!');
        return;
    }
    
    console.log('[GUIDE] TranslationManager.loaded:', TranslationManager.loaded);
    
    const updateContent = () => {
        console.log('[GUIDE] updateContent executando para topic:', topic);
        const keyMap = {
            dark: 'guide.info.dark',
            carousel: 'guide.info.carousel',
            guide: 'guide.info.guide',
            alerts: 'guide.info.alerts',
            language: 'guide.info.language',
            accessibility: 'guide.info.accessibility',
            save: 'guide.info.save',
            restore: 'guide.info.restore',
            back: 'guide.info.back'
        };
        const key = keyMap[topic] || 'guide_intro_config';
        console.log('[GUIDE] Chave de tradução:', key);
        const txt = TranslationManager.t(key);
        console.log('[GUIDE] Texto traduzido:', txt);
        el.textContent = txt === key ? TranslationManager.t('guide_intro_config') : txt;
        console.log('[GUIDE] Conteúdo atualizado, abrindo guia...');
        openGuide();
        try {
            if (window.settingsManager && window.settingsManager.savedSettings && window.settingsManager.savedSettings.autoRead) {
                window.settingsManager.speak(el.textContent);
            }
        } catch(e) {
            console.error('[GUIDE] Erro ao falar:', e);
        }
    };
    
    // Se ainda não carregou, aguarda e depois atualiza
    if (!TranslationManager.loaded) {
        console.log('[GUIDE] Aguardando carregamento de i18n...');
        document.addEventListener('i18n:loaded', updateContent, { once: true });
        return;
    }
    
    // Já carregado: atualiza imediatamente
    console.log('[GUIDE] i18n já carregado, executando updateContent imediatamente');
    updateContent();
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('[CONFIG] DOMContentLoaded disparado');
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
    
    console.log('[CONFIG] Criando SettingsManager...');
    window.settingsManager = new SettingsManager();
    console.log('[CONFIG] SettingsManager criado e exposto:', window.settingsManager);

    // Texto introdutório conforme idioma via i18n (aguarda carregamento)
    const guideContent = document.getElementById('guideContent');
    if (guideContent && window.TranslationManager) {
        const applyIntro = () => { guideContent.textContent = TranslationManager.t('guide_intro_config'); };
        if (TranslationManager.loaded) {
            applyIntro();
        } else {
            document.addEventListener('i18n:loaded', applyIntro, { once: true });
        }
    }

    // Entrada animada do container principal e título
    const mainBox = document.querySelector('.CaixaConfig');
    const title = document.querySelector('h1');
    [mainBox, title].forEach(el => {
        if (!el) return;
        el.classList.add('pre-enter');
        // Próximo frame garante aplicação inicial antes da animação
        requestAnimationFrame(() => {
            el.classList.add('config-enter');
        });
    });
});

// Inline translation objects removed; using external locale JSON via TranslationManager.