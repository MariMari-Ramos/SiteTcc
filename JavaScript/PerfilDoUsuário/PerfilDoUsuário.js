(function() {
    'use strict';

    // Elementos
    const profilePhotoInput = document.getElementById('profilePhoto');
    const previewFoto = document.getElementById('previewFoto');
    const previewContainer = document.querySelector('.perfil-foto-preview');

    // Validações
    if (!profilePhotoInput || !previewFoto) {
        console.error('Elementos de foto de perfil não encontrados');
        console.error('profilePhotoInput:', profilePhotoInput);
        console.error('previewFoto:', previewFoto);
        return;
    }

    // Também permite clique no container para abrir o seletor (resiliente a sobreposições visuais)
    if (previewContainer) {
        previewContainer.addEventListener('click', function() {
            profilePhotoInput.click();
        });
        previewContainer.addEventListener('dblclick', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openAvatarModal();
        });
    }

    /**
     * Manipula a mudança de arquivo da foto de perfil
     */
    profilePhotoInput.addEventListener('change', function(event) {
        const file = event.target.files[0];

        // Validações
        if (!file) {
            console.warn('Nenhum arquivo selecionado');
            return;
        }

        // Verificar se é uma imagem
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione um arquivo de imagem válido.');
            profilePhotoInput.value = '';
            return;
        }

        // Verificar tamanho (máximo 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert('A imagem é muito grande. Máximo permitido: 5MB');
            profilePhotoInput.value = '';
            return;
        }

        // Criar URL temporária para preview
        const reader = new FileReader();

        reader.onload = function(e) {
            try {
                previewFoto.src = e.target.result;
                previewFoto.style.display = 'block';
                previewFoto.style.opacity = '1';
                console.log('Foto de perfil atualizada com sucesso');
            } catch (error) {
                console.error('Erro ao atualizar imagem:', error);
            }
        };

        reader.onerror = function(error) {
            console.error('Erro ao ler arquivo:', error);
            alert('Erro ao ler o arquivo. Por favor, tente novamente.');
            profilePhotoInput.value = '';
        };

        // Ler o arquivo como Data URL
        reader.readAsDataURL(file);
    });

    /**
     * Permite drag and drop para a área de preview
     */
    previewFoto.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        previewFoto.classList.add('dragging');
        previewFoto.style.opacity = '0.7';
    }, false);

    previewFoto.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        previewFoto.classList.remove('dragging');
        previewFoto.style.opacity = '1';
    }, false);

    previewFoto.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        previewFoto.classList.remove('dragging');
        previewFoto.style.opacity = '1';

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            // Criar um novo DataTransfer para atualizar o input
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(files[0]);
            profilePhotoInput.files = dataTransfer.files;
            
            // Disparar evento de change
            const changeEvent = new Event('change', { bubbles: true });
            profilePhotoInput.dispatchEvent(changeEvent);
        }
    }, false);

    /**
     * Clique único na foto abre o seletor de arquivo
     */
    previewFoto.addEventListener('click', function() {
        profilePhotoInput.click();
    });

    /**
     * Duplo clique abre o modal de avatares
     */
    previewFoto.addEventListener('dblclick', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openAvatarModal();
    });

    /**
     * Abre o modal de seleção de avatares
     */
    function openAvatarModal() {
        // Criar modal se não existir
        let modal = document.getElementById('avatarModalPerfil');
        
        if (!modal) {
            modal = createAvatarModal();
            document.body.appendChild(modal);
        }

        modal.style.display = 'block';
        setupAvatarModalListeners(modal);
    }

    /**
     * Cria o modal HTML
     */
    function createAvatarModal() {
        const modal = document.createElement('div');
        modal.id = 'avatarModalPerfil';
        modal.className = 'avatar-modal-perfil';
        
        // Array de avatares disponíveis (ajuste os caminhos conforme necessário)
        const avatares = [
            '../../assets/avatares/avatar-1.png',
            '../../assets/avatares/avatar-2.png',
            '../../assets/avatares/avatar-3.png',
            '../../assets/avatares/avatar-4.png',
            '../../assets/avatares/avatar-5.png',
            '../../assets/avatares/avatar-6.png',
            '../../assets/avatares/avatar-7.png',
            '../../assets/avatares/avatar-8.png',
            '../../assets/avatares/avatar-9.png',
        ];

        let avatarGrid = '<div class="avatar-grid-perfil">';
        avatares.forEach((avatar, index) => {
            avatarGrid += `
                <div class="avatar-option-perfil" data-avatar="${avatar}">
                    <img src="${avatar}" alt="Avatar ${index + 1}" />
                </div>
            `;
        });
        avatarGrid += '</div>';

        modal.innerHTML = `
            <div class="avatar-modal-content-perfil">
                <button class="avatar-modal-close" aria-label="Fechar">&times;</button>
                <h3>Escolha seu Avatar</h3>
                ${avatarGrid}
                <button class="confirm-button-perfil" id="confirmAvatarPerfil">Confirmar</button>
            </div>
        `;

        return modal;
    }

    /**
     * Configura os listeners do modal de avatares
     */
    function setupAvatarModalListeners(modal) {
        const avatarOptions = modal.querySelectorAll('.avatar-option-perfil');
        const confirmButton = modal.querySelector('.confirm-button-perfil');
        const closeButton = modal.querySelector('.avatar-modal-close');
        let selectedAvatar = null;

        // Selecionar avatar
        avatarOptions.forEach(option => {
            option.addEventListener('click', function() {
                avatarOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                selectedAvatar = this.querySelector('img').src;
            });
        });

        // Confirmar seleção
        if (confirmButton) {
            confirmButton.addEventListener('click', function() {
                if (selectedAvatar) {
                    previewFoto.src = selectedAvatar;
                    previewFoto.style.display = 'block';
                    modal.style.display = 'none';
                    console.log('Avatar selecionado:', selectedAvatar);
                } else {
                    alert('Por favor, selecione um avatar primeiro.');
                }
            });
        }

        // Fechar ao clicar no X
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        }

        // Fechar ao clicar fora do modal
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Fechar com ESC
        const handleEsc = (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }

    // Inicialização
    console.log('Script de perfil do usuário carregado com sucesso');
    console.log('previewFoto inicial src:', previewFoto.src);
})();