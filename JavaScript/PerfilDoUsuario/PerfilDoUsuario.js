console.log("JS DO PERFIL CARREGADO!");

/* ==================== FORMULÁRIO DE EDITAR PERFIL ==================== */

document.getElementById("formPerfil").addEventListener("submit", () => {
    console.log("FORM SUBMIT DISPAROU!");
});



document.addEventListener('DOMContentLoaded', () => {
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
                    mostrarAlerta('Não há foto para remover.');
                    return;
                }
                mostrarAlerta('Deseja remover a foto de perfil?', () => {
                    const removerInput = document.getElementById('removerFoto');
                    const tipoInput = document.getElementById('tipoFoto');
                    const avatarInput = document.getElementById('avatarSelecionado');
                    if (removerInput) removerInput.value = '1';
                    if (tipoInput) tipoInput.value = '';
                    if (avatarInput) avatarInput.value = '';

                    fotoPreviewContainer.innerHTML = `
                        <div class="no-photo" id="noPhotoPlaceholder">
                            <i class="bi bi-person-circle"></i>
                            <p>Sem foto</p>
                        </div>
                    `;

                    mostrarAlerta('Foto removida! Clique em "Salvar alterações" para confirmar.');
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
                             alt="Foto de perfil">
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
                            <p>Sem foto</p>
                        </div>
                    `;
                    const rem = document.getElementById('removerFoto'); if(rem) rem.value = '1';
                    const tipo = document.getElementById('tipoFoto'); if(tipo) tipo.value = '';
                    const avatarInput = document.getElementById('avatarSelecionado'); if(avatarInput) avatarInput.value = '';
                } else {
                    fotoPreviewContainer.innerHTML = `
                        <img id="previewFoto" 
                             src="${avatarSelecionado}" 
                             alt="Foto de perfil">
                    `;
                    const avatarInput = document.getElementById('avatarSelecionado'); if(avatarInput) avatarInput.value = avatarSelecionado;
                    const rem = document.getElementById('removerFoto'); if(rem) rem.value = '0';
                    const tipo = document.getElementById('tipoFoto'); if(tipo) tipo.value = 'avatar';
                }
                if (profilePhoto) profilePhoto.value = '';
                if (avatarModal) avatarModal.style.display = 'none';
                isSettingsOpen = false;
                mostrarAlerta('Avatar selecionado! Clique em "Salvar alterações" para confirmar.');
            } else {
                mostrarAlerta('Por favor, selecione um avatar');
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
                mostrarAlerta('Erro ao atualizar perfil: ' + err);
            }
        });
    }

    // Botão Sair
    if(btnSair) {
        btnSair.addEventListener('click', () => {
            mostrarAlerta('Deseja realmente sair da conta?', () => {
                window.location.href = 'Logout.php';
            }, true);
        });
    }

    // Botão Excluir Conta
    if(btnExcluirConta) {
        btnExcluirConta.addEventListener('click', () => {
            mostrarAlerta('ATENÇÃO: Tem certeza que deseja excluir sua conta? Esta ação é IRREVERSÍVEL!', async () => {
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
});