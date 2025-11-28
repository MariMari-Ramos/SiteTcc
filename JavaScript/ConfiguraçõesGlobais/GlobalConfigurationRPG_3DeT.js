(function() {
  // Aplica configurações globais de tema, fonte, contraste e idioma para 3DeT
  document.addEventListener('DOMContentLoaded', function() {
    if (window.updateGlobalSettings) window.updateGlobalSettings();
    if (window.applyTranslationsNow) window.applyTranslationsNow();
  });

  // Dicionário de traduções para 3DeT
  window.TRANSLATIONS = window.TRANSLATIONS || {};
  window.TRANSLATIONS['pt-BR'] = Object.assign({}, window.TRANSLATIONS['pt-BR'] || {}, {
    '3det_titulo': 'Ficha 3DeT — Estilo D&D',
    '3det_info_basica': '📋 Informações Básicas',
    '3det_nome': 'Nome do Personagem',
    '3det_arquetipo': 'Arquétipo',
    '3det_selecione_arquetipo': 'Selecione um arquétipo...',
    '3det_atributos': '💪 Atributos',
    '3det_poder': 'Poder',
    '3det_habilidade': 'Habilidade',
    '3det_resistencia': 'Resistência',
    '3det_pericias': '🎯 Perícias',
    '3det_selecione_pericias': 'Selecione as perícias do seu personagem:',
    '3det_vantagens_ofensivas': '⚔️ Vantagens Ofensivas',
    '3det_selecione_vantagens_ofensivas': 'Selecione as vantagens ofensivas do seu personagem:',
    '3det_vantagens_defensivas': '🛡️ Vantagens Defensivas',
    '3det_selecione_vantagens_defensivas': 'Selecione as vantagens defensivas do seu personagem:',
    '3det_desvantagens': '⚠️ Desvantagens',
    '3det_selecione_desvantagens': 'Selecione as desvantagens do seu personagem:',
    '3det_truques': '✨ Truques e Técnicas',
    '3det_selecione_truques': 'Selecione os truques do seu personagem:',
    '3det_resumo': '📊 Resumo do Personagem',
    'voltar': '← Anterior',
    'proxima': 'Próxima →',
    'finalizar': 'Finalizar'
  });
  window.TRANSLATIONS['en-US'] = Object.assign({}, window.TRANSLATIONS['en-US'] || {}, {
    '3det_titulo': '3DeT Sheet — D&D Style',
    '3det_info_basica': '📋 Basic Information',
    '3det_nome': 'Character Name',
    '3det_arquetipo': 'Archetype',
    '3det_selecione_arquetipo': 'Select an archetype...',
    '3det_atributos': '💪 Attributes',
    '3det_poder': 'Power',
    '3det_habilidade': 'Skill',
    '3det_resistencia': 'Resistance',
    '3det_pericias': '🎯 Skills',
    '3det_selecione_pericias': 'Select your character\'s skills:',
    '3det_vantagens_ofensivas': '⚔️ Offensive Advantages',
    '3det_selecione_vantagens_ofensivas': 'Select your character\'s offensive advantages:',
    '3det_vantagens_defensivas': '🛡️ Defensive Advantages',
    '3det_selecione_vantagens_defensivas': 'Select your character\'s defensive advantages:',
    '3det_desvantagens': '⚠️ Disadvantages',
    '3det_selecione_desvantagens': 'Select your character\'s disadvantages:',
    '3det_truques': '✨ Tricks & Techniques',
    '3det_selecione_truques': 'Select your character\'s tricks:',
    '3det_resumo': '📊 Character Summary',
    'voltar': '← Back',
    'proxima': 'Next →',
    'finalizar': 'Finish'
  });
  window.TRANSLATIONS['es-ES'] = Object.assign({}, window.TRANSLATIONS['es-ES'] || {}, {
    '3det_titulo': 'Ficha 3DeT — Estilo D&D',
    '3det_info_basica': '📋 Información Básica',
    '3det_nome': 'Nombre del Personaje',
    '3det_arquetipo': 'Arquetipo',
    '3det_selecione_arquetipo': 'Seleccione un arquetipo...',
    '3det_atributos': '💪 Atributos',
    '3det_poder': 'Poder',
    '3det_habilidade': 'Habilidad',
    '3det_resistencia': 'Resistencia',
    '3det_pericias': '🎯 Pericias',
    '3det_selecione_pericias': 'Seleccione las pericias de su personaje:',
    '3det_vantagens_ofensivas': '⚔️ Ventajas Ofensivas',
    '3det_selecione_vantagens_ofensivas': 'Seleccione las ventajas ofensivas de su personaje:',
    '3det_vantagens_defensivas': '🛡️ Ventajas Defensivas',
    '3det_selecione_vantagens_defensivas': 'Seleccione las ventajas defensivas de su personaje:',
    '3det_desvantagens': '⚠️ Desventajas',
    '3det_selecione_desvantagens': 'Seleccione las desventajas de su personaje:',
    '3det_truques': '✨ Trucos y Técnicas',
    '3det_selecione_truques': 'Seleccione los trucos de su personaje:',
    '3det_resumo': '📊 Resumen del Personaje',
    'voltar': '← Anterior',
    'proxima': 'Siguiente →',
    'finalizar': 'Finalizar'
  });
})();