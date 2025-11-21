
/* ==================== FORMULÁRIO DE EDITAR PERFIL ==================== */

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

    // Settings stored in localStorage (fallbacks provided)
    let settings = JSON.parse(localStorage.getItem('profileSettings') || 'null') || {
        enableWaves: true,
        theme: 'light',
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
            e.preventDefault();

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

        const themeInputs = document.querySelectorAll('input[name="theme"]');
        themeInputs.forEach(input => {
            if (input.value === settings.theme) {
                input.checked = true;
            }
        });
        document.documentElement.setAttribute('data-theme', settings.theme);
        if(canvas && ctx) {
            currentPalette = settings.theme === 'dark' ? baseColorPalette.dark : baseColorPalette.light;
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
        settings.theme = document.querySelector('input[name="theme"]:checked')?.value ?? 'light';
        settings.enableClickEffect = document.getElementById('enableClickEffect')?.checked ?? true;
        settings.enableHoldEffect = document.getElementById('enableHoldEffect')?.checked ?? true;
        settings.highContrast = document.getElementById('highContrast')?.checked ?? false;
        settings.largerText = document.getElementById('largerText')?.checked ?? false;

        localStorage.setItem('profileSettings', JSON.stringify(settings));
        applySettings();
    }

    document.querySelectorAll('.settings-option input').forEach(input => {
        input.addEventListener('change', saveSettings);
    });
});