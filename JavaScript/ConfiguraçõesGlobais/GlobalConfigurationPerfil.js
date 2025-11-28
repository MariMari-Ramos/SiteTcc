
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

		if (!dict) return;

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

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => new GlobalSettings());
	} else {
		new GlobalSettings();
	}

	window.applyTranslationsNow = function() {
		applyLanguageFromGlobal();
	};

	window.setLanguage = function(lang) {
		const l = String(lang || '').toLowerCase();
		const norm = l.startsWith('en') ? 'en-US' : l.startsWith('es') ? 'es-ES' : 'pt-BR';
		localStorage.setItem('language', norm);
		applyLanguageFromGlobal();
	};

	window.updateGlobalSettings = function() {
		new GlobalSettings();
	};

	// Dicionário de traduções da tela de Perfil (merge, não sobrescreve)
	(function addPerfilTranslations() {
		const perfilTranslations = {
			'pt-BR': {
				perfil_title: 'Ações e configurações de Perfil - SystemForge',
				perfil_abrir_guia: 'Abrir Guia',
				perfil_guia_title: 'Guia',
				guia: 'Guia',
				guide_title: 'Hefélio, o Guia',
				close: 'Fechar',
				guide_intro: 'Olá, aventureiro! 👋 Sou seu guia. Escolha um tópico abaixo para saber mais sobre esta página.',
				perfil_guide_nome: 'Nome do Perfil — O que é?',
				perfil_guide_foto: 'Foto do Perfil — Como alterar?',
				perfil_guide_senha: 'Alterar senha — Quando usar?',
				perfil_guide_acoes: 'Ações da Conta — O que fazem?',
				perfil_guide_salvar: 'Salvar / Voltar — Como finalizar',
				perfil_nome: 'Nome do Perfil:',
				perfil_nome_placeholder: 'Digite o nome do seu perfil',
				perfil_email: 'Email Vinculado:',
				perfil_email_placeholder: 'Seu email',
				perfil_foto: 'Foto do Perfil:',
				perfil_foto_preview_title: 'Foto de perfil — apenas visualização',
				perfil_foto_alt: 'Foto de perfil',
				perfil_sem_foto: 'Sem foto',
				perfil_sem_foto_label: 'Sem Foto',
				perfil_upload: 'Upload',
				perfil_escolher_avatar: 'Escolher Avatar',
				perfil_fechar_avatar_title: 'Fechar',
				perfil_avatar1_alt: 'Avatar 1',
				perfil_avatar2_alt: 'Avatar 2',
				perfil_avatar3_alt: 'Avatar 3',
				perfil_remover_foto: 'Remover Foto',
				perfil_confirmar: 'Confirmar',
				perfil_acoes_conta: 'Ações da Conta',
				perfil_alterar_senha: 'Alterar senha:',
				perfil_btn_alterar_senha: 'Alterar Senha',
				perfil_sair: 'Sair da conta:',
				perfil_btn_sair: 'Sair',
				perfil_excluir: 'Excluir conta:',
				perfil_btn_excluir: 'Excluir Conta',
				perfil_salvar: 'SALVAR ALTERAÇÕES',
				perfil_voltar: 'VOLTAR',
				perfil_ok: 'OK',
				perfil_cancelar: 'Cancelar'
			},
			'en-US': {
				perfil_title: 'Profile Actions and Settings - SystemForge',
				perfil_abrir_guia: 'Open Guide',
				perfil_guia_title: 'Guide',
				guia: 'Guide',
				guide_title: 'Hefelio, the Guide',
				close: 'Close',
				guide_intro: "Hello, adventurer! 👋 I'm your guide. Choose a topic below to learn more about this page.",
				perfil_guide_nome: 'Profile Name — What is it?',
				perfil_guide_foto: 'Profile Photo — How to change?',
				perfil_guide_senha: 'Change password — When to use?',
				perfil_guide_acoes: 'Account Actions — What do they do?',
				perfil_guide_salvar: 'Save / Back — How to finish',
				perfil_nome: 'Profile Name:',
				perfil_nome_placeholder: 'Enter your profile name',
				perfil_email: 'Linked Email:',
				perfil_email_placeholder: 'Your email',
				perfil_foto: 'Profile Photo:',
				perfil_foto_preview_title: 'Profile photo — view only',
				perfil_foto_alt: 'Profile photo',
				perfil_sem_foto: 'No photo',
				perfil_sem_foto_label: 'No Photo',
				perfil_upload: 'Upload',
				perfil_escolher_avatar: 'Choose Avatar',
				perfil_fechar_avatar_title: 'Close',
				perfil_avatar1_alt: 'Avatar 1',
				perfil_avatar2_alt: 'Avatar 2',
				perfil_avatar3_alt: 'Avatar 3',
				perfil_remover_foto: 'Remove Photo',
				perfil_confirmar: 'Confirm',
				perfil_acoes_conta: 'Account Actions',
				perfil_alterar_senha: 'Change password:',
				perfil_btn_alterar_senha: 'Change Password',
				perfil_sair: 'Logout:',
				perfil_btn_sair: 'Logout',
				perfil_excluir: 'Delete account:',
				perfil_btn_excluir: 'Delete Account',
				perfil_salvar: 'SAVE CHANGES',
				perfil_voltar: 'BACK',
				perfil_ok: 'OK',
				perfil_cancelar: 'Cancel'
			},
			'es-ES': {
				perfil_title: 'Acciones y configuración de Perfil - SystemForge',
				perfil_abrir_guia: 'Abrir Guía',
				perfil_guia_title: 'Guía',
				guia: 'Guía',
				guide_title: 'Hefelio, el Guía',
				close: 'Cerrar',
				guide_intro: '¡Hola, aventurero! 👋 Soy tu guía. Elige un tema abajo para saber más sobre esta página.',
				perfil_guide_nome: 'Nombre del Perfil — ¿Qué es?',
				perfil_guide_foto: 'Foto de Perfil — ¿Cómo cambiar?',
				perfil_guide_senha: 'Cambiar contraseña — ¿Cuándo usar?',
				perfil_guide_acoes: 'Acciones de la Cuenta — ¿Qué hacen?',
				perfil_guide_salvar: 'Guardar / Volver — Cómo finalizar',
				perfil_nome: 'Nombre del Perfil:',
				perfil_nome_placeholder: 'Introduce el nombre de tu perfil',
				perfil_email: 'Email Vinculado:',
				perfil_email_placeholder: 'Tu correo',
				perfil_foto: 'Foto de Perfil:',
				perfil_foto_preview_title: 'Foto de perfil — solo visualización',
				perfil_foto_alt: 'Foto de perfil',
				perfil_sem_foto: 'Sin foto',
				perfil_sem_foto_label: 'Sin Foto',
				perfil_upload: 'Subir',
				perfil_escolher_avatar: 'Elegir Avatar',
				perfil_fechar_avatar_title: 'Cerrar',
				perfil_avatar1_alt: 'Avatar 1',
				perfil_avatar2_alt: 'Avatar 2',
				perfil_avatar3_alt: 'Avatar 3',
				perfil_remover_foto: 'Eliminar Foto',
				perfil_confirmar: 'Confirmar',
				perfil_acoes_conta: 'Acciones de la Cuenta',
				perfil_alterar_senha: 'Cambiar contraseña:',
				perfil_btn_alterar_senha: 'Cambiar Contraseña',
				perfil_sair: 'Salir de la cuenta:',
				perfil_btn_sair: 'Salir',
				perfil_excluir: 'Eliminar cuenta:',
				perfil_btn_excluir: 'Eliminar Cuenta',
				perfil_salvar: 'GUARDAR CAMBIOS',
				perfil_voltar: 'VOLVER',
				perfil_ok: 'OK',
				perfil_cancelar: 'Cancelar'
			}
		};
		if (!window.TRANSLATIONS) window.TRANSLATIONS = {};
		for (const lang of Object.keys(perfilTranslations)) {
			if (!window.TRANSLATIONS[lang]) window.TRANSLATIONS[lang] = {};
			Object.assign(window.TRANSLATIONS[lang], perfilTranslations[lang]);
		}
		// Após adicionar as traduções, força reaplicar se já carregou o DOM
		if (document.readyState !== 'loading' && window.applyTranslationsNow) {
			window.applyTranslationsNow();
		} else {
			document.addEventListener('DOMContentLoaded', function() {
				if (window.applyTranslationsNow) window.applyTranslationsNow();
			});
		}
	})();

	// Quando trocar fonte, aplique em todos os textos
	function applyFontToAllText(fontFamily) {
		// Aplica a todos os elementos de texto visíveis
		const textTags = ['p','label','span','h1','h2','h3','h4','h5','h6','button','a','input','textarea','div'];
		textTags.forEach(tag => {
			document.querySelectorAll(tag).forEach(el => {
				// Não sobrescreve fontes customizadas de ícones
				if (!el.classList.contains('bi') && !el.closest('.bi')) {
					el.style.fontFamily = fontFamily + ', Arial, sans-serif';
				}
			});
		});
	}

	// Sobrescreve método para garantir fonte em todos os textos
	const _oldApplyAccessibility = GlobalSettings.prototype.applyAccessibility;
	GlobalSettings.prototype.applyAccessibility = function() {
		document.documentElement.style.fontSize = this.settings.fontSize + 'px';
		document.body.style.fontFamily = this.settings.fontType + ', Arial, sans-serif';
		document.body.style.lineHeight = this.settings.lineSpacing;

		// Aplica fonte em todos os textos
		applyFontToAllText(this.settings.fontType);

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
	};

	})();
