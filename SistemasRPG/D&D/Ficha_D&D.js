function _(id){ return document.getElementById(id); }

/* dados de subclasse por classe */
const subclasses = {
    barbaro: ["Trilha da Árvore do Mundo", "Trilha do Berserker", "Trilha do Coração Selvagem","Trilha do Fanático"],
    bardo: ["Colégio da Bravura", "Colégio da Dança", "Colégio do Conhecimento", "Colégio do Glamour"],
    bruxo: ["Patrono Arquifada", "Patrono Celestial", "Patrono Grande Antigo", "Patrono Ínfero"],
    clerigo: ["Domínio da Guerra", "Domínio da Luz", "Domínio da Trapaça", "Domínio da Vida"],
    druida: ["Círculo da Terra", "Círculo da Lua", "Círculo das Estrelas", "Círculo do Mar"],
    feiticeiro: ["Feitiçaria Aberrante", "Feitiçaria Dracônica", "Feitiçaria Mecânica", "Feitiçaria Selvagem"],
    guardiao: ["Andarilho Feérico", "Caçador", "Senhor das Feras", "Vigilante das Sombras"],
    guerreiro: ["Campeão", "Cavaleiro Místico", "Combatente Psíquico", "Mestre da Batalha"],
    ladino: ["Adaga Espiritual", "Assassino", "Ladrão", "Trapaceiro Arcano"],
    mago: ["Abjurador", "Adivinhador", "Evocador", "Ilusionista"],
    monge: ["Combatente da Mão Espalmada", "Combatente da Misericórdia", "Combatente das Sombras", "Combatente dos Elementos"],
    paladino: ["Juramento da Devoção", "Juramento da Glória", "Juramento de Vingança", "Juramento dos Anciões"]
    
};

const subclassesDescricao = {
    "Trilha da Árvore do Mundo": "Entrelace as Raízes e Ramos do Multiverso",
    "Trilha do Berserker": "Canalize sua Fúria em um Frenesi Violento",
    "Trilha do Coração Selvagem": "Ande em Comunhão com o Mundo Animal",
    "Trilha do Fanático": "Fúria em Êxtase com um Deus",
    
    "Colégio da Bravura": "Cante os Feitos dos Heróis Antigos",
    "Colégio da Dança": "Mova-se em Harmonia com o Cosmos",
    "Colégio do Conhecimento": "Explore as Profundezas do Conhecimento Mágico",
    "Colégio do Glamour": "Teça Magia Feérica Fascinante",

    "Patrono Arquifada": "Faça Acordos com Feéricos Excêntricos",
    "Patrono Celestial": "Invoque o Poder dos Céus",
    "Patrono Grande Antigo": "Descubra o Conhecimento Proibido de Seres Inefáveis",
    "Patrono Ínfero": "Realize um Pacto com os Planos Inferiores",

    "Domínio da Guerra": "Inspire Bravura e Derrote Inimigos",
    "Domínio da Luz": "Traga a Luz para Banir a Escuridão",
    "Domínio da Trapaça": "Pregue Peças e Desafie as Autoridades",
    "Domínio da Vida": "Alivie as Feridas do Mundo",

    "Círculo da Lua": "Assuma Formas Animais para Proteger a Vida Selvagem",
    "Círculo da Terra": "Celebre a Conexão com o Mundo Natural",
    "Círculo das Estrelas": "Domine os Segredos Ocultos nas Constelações",
    "Círculo do Mar": "Torne-se Um com as Marés e Tempestades",

    "Feitiçaria Aberrante": "Exerça o Sobrenatural Poder Psiônico",
    "Feitiçaria Dracônica": "Respire a Magia dos Dragões",
    "Feitiçaria Mecânica": "Canalize as Forças Cósmicas da Ordem",
    "Feitiçaria Selvagem": "Liberte a Magia Caótica",

    "Andarilho Feérico": "Empunhe o Deleite e a Fúria Feérica",
    "Caçador": "Proteja a Natureza e as Pessoas da Destruição",
    "Senhor das Feras": "Vincule-se a uma Fera Primal",
    "Vigilante das Sombras": "Aproveite a Magia das Sombras para Lutar contra Seus Inimigos",

    "Campeão": "Busque a Excelência Física em Combate",
    "Cavaleiro Místico": "Fortaleça suas Habilidades de Combate com Magia Arcana",
    "Combatente Psíquico": "Aprimore o Poder Físico com Poder Psiônico",
    "Mestre da Batalha": "Domine Manobras de Batalha Sofisticadas",

    "Adaga Espiritual": "Ataque Inimigos com Lâminas Psiônicas",
    "Assassino": "Pratique a Arte Sombria da Morte",
    "Ladrão": "Cace Tesouros como um Clássico Aventureiro",
    "Trapaceiro Arcano": "Aprimore a Furtividade com Magias Arcanas",

    "Abjurador": "Proteja seus Companheiros e Bana Inimigos",
    "Adivinhador": "Conheça os Segredos do Multiverso",
    "Evocador": "Crie Efeitos Elementais Explosivos",
    "Ilusionista": "Teça Magias Sutis de Enganação",

    "Combatente da Mão Espalmada": "Domine as Técnicas de Combate Desarmado",
    "Combatente da Misericórdia": "Manipule as Forças de Vida e da Morte",
    "Combatente das Sombras": "Utilize o Poder das Sombras para Furtividade e Fuga",
    "Combatente dos Elementos": "Manipule Golpes e Explosões de Poder Elemental",

    "Juramento da Devoção": "Defenda os Ideais da Justiça e da Ordem",
    "Juramento da Glória": "Aspire às Alturas do Heroísmo",
    "Juramento de Vingança": "Puna os Malfeitores a Qualquer Custo",
    "Juramento dos Anciões": "Preserve a Vida e a Luz no Mundo",
};

/* elementos */
const nivelInput = _("nivel");
const classeCardsContainer = _("classe-cards");
const classeCardLabels = classeCardsContainer.querySelectorAll(".card");
const antecedenteCards = _("antecedente-cards").querySelectorAll(".card");
const subclasseArea = _("subclasse-area");
const subclasseCardsContainer = _("subclasse-cards");

const btnParaParte2 = _("btnParaParte2");
const btnVoltar1 = _("btnVoltar1");
const btnMostrarTudo = _("btnMostrarTudo");
const btnVoltar2 = _("btnVoltar2");
const btnEnviar = _("btnEnviar");

/* função: seleciona visualmente os cards de classe e seta o input radio */
classeCardLabels.forEach(label => {
  label.addEventListener("click", (e) => {
    // marca visual
    classeCardLabels.forEach(l => l.classList.remove("selected"));
    label.classList.add("selected");

    // marca o radio dentro do label
    const radio = label.querySelector('input[type="radio"]');
    if(radio) radio.checked = true;

    // gerar as subclasses correspondentes (se existirem)
    const classeValor = radio.value;
    gerarCardsSubclasse(subclasses[classeValor] || []);
    // se nível >= 3 mostra area automaticamente
    if (Number(nivelInput.value) >= 3) subclasseArea.style.display = "block";
  });
});

/* quando o nível mudar, controla visibilidade de subclasse */
nivelInput.addEventListener("input", () => {
  const n = Number(nivelInput.value);
  if (n >= 3) {
    // só mostra se já existe uma classe selecionada e tem subclasses geradas
    const checkedClasse = document.querySelector('input[name="classe"]:checked');
    if (checkedClasse && subclasseCardsContainer.children.length) {
      subclasseArea.style.display = "block";
    } else {
      // se não tiver subclasss geradas mas classe estiver selecionada, geramos
      if (checkedClasse) gerarCardsSubclasse(subclasses[checkedClasse.value] || []);
      subclasseArea.style.display = checkedClasse ? "block" : "none";
    }
  } else {
    subclasseArea.style.display = "none";
    // opcional: limpa seleção de subclasse quando nível cai abaixo de 3
    const checkedSub = document.querySelector('input[name="subclasse"]:checked');
    if (checkedSub) checkedSub.checked = false;
    subclasseCardsContainer.querySelectorAll('.card').forEach(c=>c.classList.remove('selected'));
  }
});

/* cria os cards de subclasse dinamicamente */
function gerarCardsSubclasse(lista){
  subclasseCardsContainer.innerHTML = ""; // limpa
  if(!lista || lista.length === 0) return;
  lista.forEach(sub => {
    const label = document.createElement('label');
    label.className = 'card';
    label.innerHTML = `<input type="radio" name="subclasse" value="${sub}">
                       <h3>${sub}</h3>
                       <p>${subclassesDescricao[sub]}</p>`;
    label.addEventListener('click', () => {
      // marca visualmente apenas este
      subclasseCardsContainer.querySelectorAll('.card').forEach(c=>c.classList.remove('selected'));
      label.classList.add('selected');
      // marca o radio
      const r = label.querySelector('input[type="radio"]');
      if(r) r.checked = true;
    });
    subclasseCardsContainer.appendChild(label);
  });
}

/* Botões de navegação e validação */
btnParaParte2.addEventListener('click', () => {
  const nivel = Number(nivelInput.value);
  const classeSelecionada = document.querySelector('input[name="classe"]:checked');

  if (!nivelInput.value) { alert('Informe o nível.'); return; }
  if (!classeSelecionada) { alert('Selecione uma classe.'); return; }

  // se nível >= 3 exigir subclasse selecionada
  if (nivel >= 3) {
    const subSelecionada = document.querySelector('input[name="subclasse"]:checked');
    if (!subSelecionada) {
      alert('Como seu nível é 3 ou mais, escolha também uma subclasse.'); 
      // garante que a área de subclasse esteja visível para seleção:
      subclasseArea.style.display = 'block';
      return;
    }
  }

  _("Parte1").style.display = 'none';
  _("Parte2").style.display = 'block';
});

btnVoltar1.addEventListener('click', () => {
  _("Parte2").style.display = 'none';
  _("Parte1").style.display = 'block';
});


// ADICIONAR EVENTO DE CLIQUE
antecedenteCards.forEach(card => {
    card.addEventListener("click", () => {

        // remover seleção de todos
        antecedenteCards.forEach(c => c.classList.remove("selected"));

        // adicionar no clicado
        card.classList.add("selected");

        // marcar radio
        const radio = card.querySelector('input[type="radio"]');
        radio.checked = true;
    });
});


btnMostrarTudo.addEventListener('click', () => {
  // coletar dados
  const nome = _("nomePersonagem").value || '';
  const nivel = _("nivel").value || '';
  const classe = (document.querySelector('input[name="classe"]:checked') || {}).value || '';
  const subclasse = (document.querySelector('input[name="subclasse"]:checked') || {}).value || '';
  const antecedente = (document.querySelector('input[name="antecedente"]:checked') || {}).value || '';

  // preencher resumo
  _("display_nome").textContent = nome;
  _("display_nivel").textContent = nivel;
  _("display_classe").textContent = classe;
  _("display_subclasse").textContent = subclasse;
  _("display_antecedente").textContent = antecedente;

  _("Parte2").style.display = 'none';
  _("Tudo").style.display = 'block';
});

btnVoltar2.addEventListener('click', () => {
  _("Tudo").style.display = 'none';
  _("Parte2").style.display = 'block';
});

/* Envio final (exemplo: envia ao servidor) */
btnEnviar.addEventListener('click', () => {
  // validações finais opcionais...
  // aqui definimos a action e submetemos
  const form = _("formDD");
  form.method = "post";
  form.action = "FichaD&D.php"; // ajuste conforme seu backend
  form.submit();});
