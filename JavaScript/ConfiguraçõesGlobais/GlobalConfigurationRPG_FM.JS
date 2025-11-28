
// Aplica tema, fonte, contraste, etc. conforme configuração global do usuário para todas as telas F&M
document.addEventListener('DOMContentLoaded', function() {
	if (window.updateGlobalSettings) window.updateGlobalSettings();
});
