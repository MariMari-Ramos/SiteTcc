/* ========== PERFIL DO USUÁRIO.JS ==========
   Controla formulário de EDITAR PERFIL do usuário
// Waves e configurações removidas nesta tela para simplificação.

        mouseX += (targetMouseX - mouseX) * easeAmount;
        mouseY += (targetMouseY - mouseY) * easeAmount;

        const targetInteractive = interactive ? 1 : 0;
        interactiveTransition += (targetInteractive - interactiveTransition) * transitionSpeed;

        waveDirection += (targetWaveDirection - waveDirection) * directionEaseAmount;

        heatIntensity *= heatDecayRate;
        clickAmplitude *= clickAmplitudeDecayRate;

        clickHeight += (targetClickHeight - clickHeight) * clickHeightEaseAmount;
        targetClickHeight *= 0.9;

        if (isMousePressed && settings.enableHoldEffect) {
            speedBoost = Math.min(speedBoost + boostBuildRate, maxSpeedBoost);
            heatIntensity = Math.min(heatIntensity + 0.03, 1);

            if (settings.enableClickEffect && Math.random() < 0.3 && flames.length < maxFlames) {
                flames.push(new Flame(mouseX, mouseY));
            }
        } else {
            speedBoost *= boostDecayRate;
        }

        const bgColor = currentPalette.bg;
        ctx.fillStyle = `rgb(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        time += (baseWaveSpeed + speedBoost * 0.02) * waveDirection * interactiveTransition;

/* ==================== FORMULÁRIO DE EDITAR PERFIL ==================== */

document.addEventListener('DOMContentLoaded', () => {
    const formPerfil = document.getElementById('formPerfil');
    const profilePhoto = document.getElementById('profilePhoto');
    const previewFoto = document.getElementById('previewFoto');
    const fotoPreviewContainer = document.getElementById('fotoPreviewContainer');
    const avatarModal = document.getElementById('avatarModal');
    const closeAvatar = document.getElementById('closeAvatar');
    const confirmAvatar = document.getElementById('confirmAvatar');
    const btnSair = document.getElementById('btnSair');
    const btnExcluirConta = document.getElementById('btnExcluirConta');
    const alertOverlay = document.getElementById('alertOverlay');
    const alertMessage = document.getElementById('alertMessage');
    const alertOk = document.getElementById('alertOk');
    const alertCancel = document.getElementById('alertCancel');

    let avatarSelecionado = null;

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

    // Clique simples - Upload
    if(fotoPreviewContainer) {
        fotoPreviewContainer.addEventListener('click', (e) => {
            if(e.detail === 1) {
                setTimeout(() => {
                    if(e.detail === 1) {
                        profilePhoto.click();
                    }
                }, 200);
            }
        });

        // Duplo clique - Modal de avatares
        fotoPreviewContainer.addEventListener('dblclick', () => {
            avatarModal.style.display = 'flex';
            isSettingsOpen = true;
        });

        // Botão direito - Remover foto
        fotoPreviewContainer.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            mostrarAlerta('Deseja remover a foto de perfil?', () => {
                document.getElementById('removerFoto').value = '1';
                document.getElementById('tipoFoto').value = '';
                document.getElementById('avatarSelecionado').value = '';
                
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
                    document.getElementById('removerFoto').value = '1';
                } else {
                    fotoPreviewContainer.innerHTML = `
                        <img id="previewFoto" 
                             src="${avatarSelecionado}" 
                             alt="Foto de perfil">
                    `;
                    document.getElementById('avatarSelecionado').value = avatarSelecionado;
                    document.getElementById('removerFoto').value = '0';
                }
                
                document.getElementById('tipoFoto').value = avatarSelecionado ? 'avatar' : '';
                profilePhoto.value = '';
                avatarModal.style.display = 'none';
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