console.log("JS DO PERFIL CARREGADO!");

/* ==================== FORMULÁRIO DE EDITAR PERFIL ==================== */

document.getElementById("formPerfil").addEventListener("submit", () => {
    console.log("FORM SUBMIT DISPAROU!");
});



document.addEventListener('DOMContentLoaded', () => {
    // ===== Local i18n (page-scoped, no global dependency) =====
    const LOCALES_BASE = "../../locales";
    const I18N = { dict: null, lang: 'pt-BR' };

    function normalizeLang(raw) {
        const s = String(raw || localStorage.getItem('language') || 'pt-BR').toLowerCase();
        if (s.startsWith('en')) return 'en-US';
        if (s.startsWith('es')) return 'es-ES';
        return 'pt-BR';
    }

    async function loadLocale(lang) {
        try {
            const res = await fetch(`${LOCALES_BASE}/${lang}.json`, { cache: 'no-cache' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (e) {
            if (lang !== 'pt-BR') {
                try {
                    const res = await fetch(`${LOCALES_BASE}/pt-BR.json`, { cache: 'no-cache' });
                    if (res.ok) return await res.json();
                } catch (_) {}
            }
            return null;
        }
    }

    function applyI18nToElement(el, dict) {
        if (!dict || !el) return;

        const textKey = el.getAttribute('data-i18n');
        const attrList = (el.getAttribute('data-i18n-attr') || '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);

        // Per-attribute keys
        const attrs = ['title','alt','placeholder','aria-label'];
        attrs.forEach(a => {
            const k = el.getAttribute(`data-i18n-${a}`);
            if (k && dict[k] != null) el.setAttribute(a, dict[k]);
        });

        // If there is a text key and a list of attributes, assign the same value to them
        if (textKey && attrList.length && dict[textKey] != null) {
            attrList.forEach(a => el.setAttribute(a, dict[textKey]));
        }

        // Apply text content (or document title) from textKey
        if (textKey && dict[textKey] != null) {
            const val = dict[textKey];
            if (el.tagName.toLowerCase() === 'title') {
                document.title = val;
            } else if (!attrList.length) {
                el.textContent = val;
            }
        }
    }

    function applyI18n(dict) {
        if (!dict) return;
        document.documentElement.lang = I18N.lang;
        const sel = [
            '[data-i18n]',
            '[data-i18n-attr]',
            '[data-i18n-title]',
            '[data-i18n-alt]',
            '[data-i18n-placeholder]',
            '[data-i18n-aria-label]'
        ].join(',');
        document.querySelectorAll(sel).forEach(el => applyI18nToElement(el, dict));
    }

    async function initI18n() {
        I18N.lang = normalizeLang(localStorage.getItem('language'));
        I18N.dict = await loadLocale(I18N.lang);
        applyI18n(I18N.dict);
    }

    // Initialize local i18n first
    initI18n();

    const t = (key, fallback="") => (I18N.dict && I18N.dict[key]) || fallback;

    const formPerfil = document.getElementById('formPerfil');
    const profilePhoto = document.getElementById('profilePhoto');
    const previewFoto = document.getElementById('previewFoto');
    const fotoPreviewContainer = document.getElementById('fotoPreviewContainer');
    const avatarModal = document.getElementById('avatarModal');
    const closeAvatar = document.getElementById('closeAvatar');
    const confirmAvatar = document.getElementById('confirmAvatar');
    const btnUploadPhoto = document.getElementById('btnUploadPhoto');
    const btnChooseAvatar = document.getElementById('btnChooseAvatar');
    const btnRemovePhoto = document.getElementById('btnRemovePhoto');
    const btnSair = document.getElementById('btnSair');
    const btnExcluirConta = document.getElementById('btnExcluirConta');
    const alertOverlay = document.getElementById('alertOverlay');
    const alertMessage = document.getElementById('alertMessage');
    const alertOk = document.getElementById('alertOk');
    const alertCancel = document.getElementById('alertCancel');

    let avatarSelecionado = null;
    // Estado local seguro (evita ReferenceErrors caso outras scripts não definam essas vars)
    let isSettingsOpen = false;
    let isFormFocused = false;
    let interactive = true;

    // Settings stored in localStorage (fallbacks provided).
    // NOTE: theme is intentionally NOT stored inside `profileSettings` anymore.
    // The site-wide/global theme is read from `localStorage['theme']` only.
    let settings = JSON.parse(localStorage.getItem('profileSettings') || 'null') || {
        enableWaves: true,
        enableClickEffect: true,
        enableHoldEffect: true,
        highContrast: false,
        largerText: false
    };

    // Canvas/waves palette placeholders (algumas páginas definem estes globalmente)
    let canvas = window.wavesCanvas || null;
    let ctx = window.wavesCtx || null;
    let baseColorPalette = window.baseColorPalette || { dark: {}, light: {} };
    let currentPalette = window.currentPalette || baseColorPalette.light;

    

    function mostrarAlerta(mensagem, callback = null, mostrarCancelar = false) {
        alertMessage.textContent = mensagem;
        alertOverlay.style.display = 'flex';
        
        if(mostrarCancelar) {
            alertCancel.style.display = 'inline-block';
            alertCancel.onclick = () => {
                alertOverlay.style.display = 'none';
            };
        } else {
            alertCancel.style.display = 'none';
        }
        
        alertOk.onclick = () => {
            alertOverlay.style.display = 'none';
            if(callback) callback();
        };
    }

    

    // Preview é somente visual — interações por botões abaixo
    if(fotoPreviewContainer) {
        // Remova handlers de clique/duplo/contextmenu no preview para torná-lo apenas visual

        // Botões explícitos
        if (btnUploadPhoto) {
            btnUploadPhoto.addEventListener('click', () => {
                if (profilePhoto) profilePhoto.click();
            });
        }

        if (btnChooseAvatar) {
            btnChooseAvatar.addEventListener('click', () => {
                if (avatarModal) {
                    avatarModal.style.display = 'flex';
                    isSettingsOpen = true;
                }
            });
        }

        // Helper: checa se há uma foto exibida atualmente
        function hasPhotoPresent(){
            const img = document.getElementById('previewFoto');
            const avatarVal = document.getElementById('avatarSelecionado')?.value || '';
            const tipo = document.getElementById('tipoFoto')?.value || '';
            // Se existe img no DOM ou algum avatar selecionado ou tipoFoto marcado, considera que tem foto
            return !!img || avatarVal !== '' || tipo === 'upload' || tipo === 'avatar';
        }

        // Observação: menu de contexto sobre o preview removido — preview é somente visual.

        // Remover foto via botão (verifica se há foto antes)
        if (btnRemovePhoto) {
            btnRemovePhoto.addEventListener('click', () => {
                if (!hasPhotoPresent()) {
                    mostrarAlerta(t('perfil_no_photo_to_remove','Não há foto para remover.'));
                    return;
                }
                mostrarAlerta(t('perfil_remove_photo_question','Deseja remover a foto de perfil?'), () => {
                    const removerInput = document.getElementById('removerFoto');
                    const tipoInput = document.getElementById('tipoFoto');
                    const avatarInput = document.getElementById('avatarSelecionado');
                    if (removerInput) removerInput.value = '1';
                    if (tipoInput) tipoInput.value = '';
                    if (avatarInput) avatarInput.value = '';

                    fotoPreviewContainer.innerHTML = `
                        <div class="no-photo" id="noPhotoPlaceholder">
                            <i class="bi bi-person-circle"></i>
                            <p>${t('perfil_sem_foto','Sem foto')}</p>
                        </div>
                    `;

                    mostrarAlerta(t('perfil_photo_removed_notice','Foto removida! Clique em \"Salvar alterações\" para confirmar.'));
                }, true);
            });
        }

    }

    // Preview de upload
    if(profilePhoto) {
        profilePhoto.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    fotoPreviewContainer.innerHTML = `
                        <img id="previewFoto" 
                             src="${event.target.result}" 
                             alt="${t('perfil_foto_alt','Foto de perfil')}">
                    `;
                    document.getElementById('tipoFoto').value = 'upload';
                    document.getElementById('avatarSelecionado').value = '';
                    document.getElementById('removerFoto').value = '0';

                    if (btnUploadPhoto && profilePhoto) {
        btnUploadPhoto.addEventListener("click", () => {
            console.log("Botão Upload clicado!");
            profilePhoto.click();
        });

        profilePhoto.addEventListener("change", () => {
            console.log("Foto selecionada:", profilePhoto.files);
            const file = profilePhoto.files[0];
            if (file) {
                const preview = document.getElementById("previewFoto");

                if (preview) {
                    preview.src = URL.createObjectURL(file);
                }

                // diz ao PHP que a foto é upload
                tipoFoto.value = "upload";
            }
        });
    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Modal de avatares
    if(closeAvatar) {
        closeAvatar.addEventListener('click', () => {
            avatarModal.style.display = 'none';
            isSettingsOpen = false;
        });
    }

    if(avatarModal) {
        avatarModal.addEventListener('click', (e) => {
            if(e.target === avatarModal) {
                avatarModal.style.display = 'none';
                isSettingsOpen = false;
            }
        });
    }

    // Avatar selection: permitir escolher via modal e confirmar
    const avatarOptions = document.querySelectorAll('.avatar-option');
    avatarOptions.forEach(option => {
        option.addEventListener('click', () => {
            avatarOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            avatarSelecionado = option.dataset.avatar;
        });
    });

    if(confirmAvatar) {
        confirmAvatar.addEventListener('click', () => {
            if(avatarSelecionado !== null) {
                if(avatarSelecionado === '') {
                    fotoPreviewContainer.innerHTML = `
                        <div class="no-photo" id="noPhotoPlaceholder">
                            <i class="bi bi-person-circle"></i>
                            <p>${t('perfil_sem_foto','Sem foto')}</p>
                        </div>
                    `;
                    const rem = document.getElementById('removerFoto'); if(rem) rem.value = '1';
                    const tipo = document.getElementById('tipoFoto'); if(tipo) tipo.value = '';
                    const avatarInput = document.getElementById('avatarSelecionado'); if(avatarInput) avatarInput.value = '';
                } else {
                    fotoPreviewContainer.innerHTML = `
                        <img id="previewFoto" 
                             src="${avatarSelecionado}" 
                             alt="${t('perfil_foto_alt','Foto de perfil')}">
                    `;
                    const avatarInput = document.getElementById('avatarSelecionado'); if(avatarInput) avatarInput.value = avatarSelecionado;
                    const rem = document.getElementById('removerFoto'); if(rem) rem.value = '0';
                    const tipo = document.getElementById('tipoFoto'); if(tipo) tipo.value = 'avatar';
                }
                if (profilePhoto) profilePhoto.value = '';
                if (avatarModal) avatarModal.style.display = 'none';
                isSettingsOpen = false;
                mostrarAlerta(t('perfil_avatar_selected_notice','Avatar selecionado! Clique em \"Salvar alterações\" para confirmar.'));
            } else {
                mostrarAlerta(t('perfil_select_avatar_prompt','Por favor, selecione um avatar'));
            }
        });
    }

    // Submit do formulário
    if(formPerfil) {
        formPerfil.addEventListener('submit', async (e) => {
            

            const formData = new FormData(formPerfil);

            try {
                const response = await fetch('AtualizarPerfil.php', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if(data.success) {
                    mostrarAlerta(data.message, () => {
                        location.reload();
                    });
                } else {
                    mostrarAlerta('Erro: ' + data.message);
                }

            } catch (err) {
                mostrarAlerta(t('perfil_update_error_prefix','Erro ao atualizar perfil: ') + err);
            }
        });
    }

    // Botão Sair
    if(btnSair) {
        btnSair.addEventListener('click', () => {
            mostrarAlerta(t('perfil_logout_confirm','Deseja realmente sair da conta?'), () => {
                window.location.href = 'Logout.php';
            }, true);
        });
    }

    // Botão Excluir Conta
    if(btnExcluirConta) {
        btnExcluirConta.addEventListener('click', () => {
            mostrarAlerta(t('perfil_delete_account_confirm','ATENÇÃO: Tem certeza que deseja excluir sua conta? Esta ação é IRREVERSÍVEL!'), async () => {
                try {
                    const response = await fetch('ExcluirConta.php', {
                        method: 'POST'
                    });

                    const data = await response.json();

                    if(data.success) {
                        mostrarAlerta(data.message, () => {
                            window.location.href = data.redirect;
                        });
                    } else {
                        mostrarAlerta('Erro: ' + data.message);
                    }

                } catch (err) {
                    mostrarAlerta('Erro ao excluir conta: ' + err);
                }
            }, true);
        });
    }

    // Detectar foco em inputs
    const inputs = document.querySelectorAll('input, select, textarea, button');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            isFormFocused = true;
            interactive = false;
        });
        input.addEventListener('blur', () => {
            isFormFocused = false;
            interactive = true;
        });
    });

    // Configurações
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');

    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.add('active');
            isSettingsOpen = true;
            interactive = false;
        });
    }

    if (closeSettings) {
        closeSettings.addEventListener('click', () => {
            settingsModal.classList.remove('active');
            isSettingsOpen = false;
            interactive = true;
        });
    }

    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.classList.remove('active');
                isSettingsOpen = false;
                interactive = true;
            }
        });
    }

    function applySettings() {
        const enableWavesCheckbox = document.getElementById('enableWaves');
        if (enableWavesCheckbox) {
            enableWavesCheckbox.checked = settings.enableWaves;
            if(canvas) canvas.style.display = settings.enableWaves ? 'block' : 'none';
        }

        // Use the global theme (stored in localStorage['theme']) — profile settings
        // no longer contain a theme value. This keeps the profile page consistent
        // with the rest of the site.
        const globalTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', globalTheme);
        if(canvas && ctx) {
            currentPalette = globalTheme === 'dark' ? baseColorPalette.dark : baseColorPalette.light;
        }

        const enableClickEffectCheckbox = document.getElementById('enableClickEffect');
        if (enableClickEffectCheckbox) {
            enableClickEffectCheckbox.checked = settings.enableClickEffect;
        }

        const enableHoldEffectCheckbox = document.getElementById('enableHoldEffect');
        if (enableHoldEffectCheckbox) {
            enableHoldEffectCheckbox.checked = settings.enableHoldEffect;
        }

        const highContrastCheckbox = document.getElementById('highContrast');
        if (highContrastCheckbox) {
            highContrastCheckbox.checked = settings.highContrast;
            document.body.classList.toggle('high-contrast', settings.highContrast);
        }

        const largerTextCheckbox = document.getElementById('largerText');
        if (largerTextCheckbox) {
            largerTextCheckbox.checked = settings.largerText;
            document.body.classList.toggle('larger-text', settings.largerText);
        }
    }

    applySettings();

    function saveSettings() {
        settings.enableWaves = document.getElementById('enableWaves')?.checked ?? true;
        settings.enableClickEffect = document.getElementById('enableClickEffect')?.checked ?? true;
        settings.enableHoldEffect = document.getElementById('enableHoldEffect')?.checked ?? true;
        settings.highContrast = document.getElementById('highContrast')?.checked ?? false;
        settings.largerText = document.getElementById('largerText')?.checked ?? false;

        // Persist profile-specific settings, but intentionally do NOT persist theme here.
        localStorage.setItem('profileSettings', JSON.stringify(settings));
        // Re-apply settings (theme will come from global localStorage['theme']).
        applySettings();
    }

    document.querySelectorAll('.settings-option input').forEach(input => {
        input.addEventListener('change', saveSettings);
    });

    /* ===== Guia local da página de Perfil (perguntas e respostas) ===== */
    const perfilGuideTrigger = document.getElementById('perfilGuideTrigger');
    const guideSpeech = document.getElementById('guideSpeech');
    const guideCloseBtn = document.getElementById('closeGuideBtn');
    const guideContentEl = document.getElementById('guideContent');
    const guideOptionsHost = document.getElementById('guideOptions');

    function openPerfilGuide() {
        if (!guideSpeech) return;
        guideSpeech.classList.add('active');
        guideSpeech.setAttribute('aria-hidden', 'false');
        // mark trigger as viewed if present
        perfilGuideTrigger && perfilGuideTrigger.classList.add('viewed');
    }

    function closePerfilGuide() {
        if (!guideSpeech) return;
        guideSpeech.classList.remove('active');
        guideSpeech.setAttribute('aria-hidden', 'true');
    }

    function showPerfilGuideTopic(topic) {
        // Prefer translations if available
        const lang = localStorage.getItem('language') || 'pt-BR';
        const T = (window.TRANSLATIONS && window.TRANSLATIONS[lang]) || null;

        const texts = {
            nome: T && T.perfil_guide_nome ? T.perfil_guide_nome : 'Nome do Perfil: Este campo define como outros usuários verão seu perfil. Você pode editar para mostrar um apelido ou seu nome de jogo.',
            foto: T && T.perfil_guide_foto ? T.perfil_guide_foto : 'Foto do Perfil: Use "Upload" para enviar uma imagem sua ou "Escolher Avatar" para selecionar uma das imagens prontas. Clique em "Salvar" para confirmar.' ,
            senha: T && T.perfil_guide_senha ? T.perfil_guide_senha : 'Alterar senha: Redireciona para a página de redefinição. Use quando quiser trocar sua senha por motivos de segurança.',
            acoes: T && T.perfil_guide_acoes ? T.perfil_guide_acoes : 'Ações da Conta: "Alterar Senha", "Sair" e "Excluir Conta". A exclusão é permanente — tenha cuidado.',
            salvar: T && T.perfil_guide_salvar ? T.perfil_guide_salvar : 'Salvar / Voltar: "Salvar alterações" grava suas mudanças (foto e nome) no servidor. "Voltar" retorna à tela principal sem salvar.'
        };

        const message = texts[topic] || (T && T.guide_intro) || 'Escolha um tópico para saber mais.';
        if (guideContentEl) guideContentEl.textContent = message;
        openPerfilGuide();
    }

    if (perfilGuideTrigger) {
        perfilGuideTrigger.addEventListener('click', () => {
            // toggle
            if (guideSpeech && guideSpeech.classList.contains('active')) closePerfilGuide();
            else openPerfilGuide();
        });
    }

    if (guideCloseBtn) guideCloseBtn.addEventListener('click', closePerfilGuide);

    if (guideOptionsHost) {
        guideOptionsHost.addEventListener('click', (e) => {
            const btn = e.target.closest('.guide-option');
            if (!btn) return;
            const topic = btn.dataset.topic;
            showPerfilGuideTopic(topic);
        });
    }

    /* ===== Auto Read (leitura automática) - idêntico às outras telas ===== */
    const AutoRead = (() => {
        let enabled = false;
        let currentUtterance = null;
        let sentenceQueue = [];
        let isSpeaking = false;
        let lastSelection = '';
        let selectionDebounceTimer = null;

        function init() {
            enabled = localStorage.getItem('autoRead') === 'true';
            if (!enabled || typeof speechSynthesis === 'undefined') return;

            document.body.classList.add('auto-read-enabled');
            setupClickRead();
            setupSelectionRead();
        }

        function getVoiceForLang(lang) {
            const voices = speechSynthesis.getVoices();
            if (!voices.length) return null;

            const langPrefix = lang.toLowerCase().split('-')[0];
            const exact = voices.find(v => v.lang.toLowerCase() === lang.toLowerCase());
            if (exact) return exact;

            const partial = voices.find(v => v.lang.toLowerCase().startsWith(langPrefix));
            if (partial) return partial;

            return voices[0];
        }

        function speak(text, lang = I18N.lang) {
            if (!text || !enabled) return;

            stop();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = parseFloat(localStorage.getItem('speechRate') || '1.0');
            utterance.pitch = parseFloat(localStorage.getItem('speechPitch') || '1.0');

            const voice = getVoiceForLang(lang);
            if (voice) utterance.voice = voice;

            currentUtterance = utterance;
            speechSynthesis.speak(utterance);
        }

        function stop() {
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
            }
            currentUtterance = null;
            sentenceQueue = [];
            isSpeaking = false;
        }

        function setupClickRead() {
            document.body.addEventListener('click', (e) => {
                if (!enabled) return;

                const target = e.target;
                if (target.matches('input, textarea, button, a, select, [contenteditable]')) return;
                if (target.closest('.guide-speech, .overlay, .avatar-modal, .modal')) return;

                let text = '';
                if (target.textContent && target.textContent.trim()) {
                    text = target.textContent.trim();
                } else if (target.getAttribute('aria-label')) {
                    text = target.getAttribute('aria-label');
                } else if (target.getAttribute('title')) {
                    text = target.getAttribute('title');
                }

                if (text && text.length > 0 && text.length < 500) {
                    speak(text);
                }
            });
        }

        function setupSelectionRead() {
            document.addEventListener('selectionchange', () => {
                if (!enabled) return;

                clearTimeout(selectionDebounceTimer);
                selectionDebounceTimer = setTimeout(() => {
                    const selection = window.getSelection();
                    const selectedText = selection.toString().trim();

                    if (selectedText && selectedText !== lastSelection && selectedText.length > 3) {
                        lastSelection = selectedText;
                        handleSelectionRead(selectedText, selection);
                    }
                }, 300);
            });
        }

        function handleSelectionRead(text, selection) {
            if (text.length > 500) {
                const sentences = extractSentencesInRange(selection);
                if (sentences.length > 0) {
                    sentenceQueue = sentences;
                    speakSequence();
                } else {
                    speak(text.substring(0, 500));
                }
            } else {
                speak(text);
            }
        }

        function extractSentencesInRange(selection) {
            const sentences = [];
            try {
                const range = selection.getRangeAt(0);
                const container = range.commonAncestorContainer;
                const containerEl = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;

                if (!containerEl) return sentences;

                const fullText = containerEl.textContent || '';
                const selectedText = selection.toString();

                const segmenter = typeof Intl !== 'undefined' && Intl.Segmenter
                    ? new Intl.Segmenter(I18N.lang, { granularity: 'sentence' })
                    : null;

                let parts = [];
                if (segmenter) {
                    const segments = segmenter.segment(fullText);
                    parts = Array.from(segments).map(s => s.segment.trim()).filter(Boolean);
                } else {
                    parts = fullText.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
                }

                for (const sentence of parts) {
                    if (selectedText.includes(sentence) || sentence.includes(selectedText.substring(0, 50))) {
                        sentences.push(sentence);
                    }
                }

                if (sentences.length === 0 && selectedText) {
                    const fallback = selectedText.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
                    sentences.push(...fallback);
                }

            } catch (err) {
                console.warn('[AutoRead] Sentence extraction failed:', err);
            }
            return sentences;
        }

        function speakSequence() {
            if (sentenceQueue.length === 0) {
                isSpeaking = false;
                return;
            }

            isSpeaking = true;
            const sentence = sentenceQueue.shift();

            const utterance = new SpeechSynthesisUtterance(sentence);
            utterance.lang = I18N.lang;
            utterance.rate = parseFloat(localStorage.getItem('speechRate') || '1.0');
            utterance.pitch = parseFloat(localStorage.getItem('speechPitch') || '1.0');

            const voice = getVoiceForLang(I18N.lang);
            if (voice) utterance.voice = voice;

            utterance.onend = () => {
                if (sentenceQueue.length > 0) {
                    setTimeout(() => speakSequence(), 200);
                } else {
                    isSpeaking = false;
                }
            };

            utterance.onerror = () => {
                isSpeaking = false;
                sentenceQueue = [];
            };

            currentUtterance = utterance;
            speechSynthesis.speak(utterance);
        }

        return { init, speak, stop };
    })();

    // Inicializa Auto Read
    if (typeof speechSynthesis !== 'undefined') {
        if (speechSynthesis.getVoices().length === 0) {
            speechSynthesis.addEventListener('voiceschanged', () => AutoRead.init(), { once: true });
        } else {
            AutoRead.init();
        }
    }
});