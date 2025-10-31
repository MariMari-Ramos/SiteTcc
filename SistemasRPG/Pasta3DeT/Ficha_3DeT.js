console.log("main.js carregado");

document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("calcular");

  btn.addEventListener("click", function () {
    // pega os valores digitados
    const nome = document.getElementById("Nome").value;
    const arquetipo = document.getElementById("Arquetipo").value;
    const arquetipoSelecionado = document.getElementById("Arquetipo").value;
    const poder = parseInt(document.getElementById("Poder").value) || 0;
    const habilidade = parseInt(document.getElementById("Habilidade").value) || 0;
    const resistencia = parseInt(document.getElementById("Resistencia").value) || 0;

    //Pericias
    const checkboxes = document.querySelectorAll('input[name="pericias"]:checked');
    const periciasSelecionadas = Array.from(checkboxes).map(cb => cb.value);
    const periciasTexto = periciasSelecionadas.length > 0 ? periciasSelecionadas.join(", ") : "Nenhuma";

    //Vantagens
    const checksVantagens = document.querySelectorAll('input[name="Van"]:checked');
    const vantagensSelecionadas = Array.from(checksVantagens).map(cb => cb.value);
    const vantagensTexto = vantagensSelecionadas.length > 0 ? vantagensSelecionadas.join(", ") : "Nenhuma";

    //Desvantagens
    const checksDesvantagens = document.querySelectorAll('input[name="Des"]:checked');
    const DesvantagensSelecionadas = Array.from(checksDesvantagens).map(cb => cb.value);
    const desvantagensTexto = DesvantagensSelecionadas.length > 0 ? DesvantagensSelecionadas.join(", ") : "Nenhuma";

    //Truques
    const checksTruques = document.querySelectorAll('input[name="Truques"]:checked');
    const TruquesSelecionadas = Array.from(checksTruques).map(cb => cb.value);
    const truquesTexto = TruquesSelecionadas.length > 0 ? TruquesSelecionadas.join(", ") : "Nenhuma";

    //Técnicas Comuns
    const checksTecnicasC = document.querySelectorAll('input[name="Técnicas Comuns"]:checked');
    const TruquesTecnicasC = Array.from(checksTecnicasC).map(cb => cb.value);
    const TecnicascTexto = TruquesTecnicasC.length > 0 ? TruquesTecnicasC.join(", ") : "Nenhuma";

    //Técnicas Lendárias
    const checksTecnicasL = document.querySelectorAll('input[name="Técnicas Lendárias"]:checked');
    const TruquesTecnicasL = Array.from(checksTecnicasL).map(cb => cb.value);
    const TecnicaslTexto = TruquesTecnicasL.length > 0 ? TruquesTecnicasL.join(", ") : "Nenhuma";
        
    // Constantes de arquetipos
    const ARQUETIPOS = {
      Humano: ["Mais Além"],
      Aberrante: ["Deformidade", "Teratismo", "Monstruoso"],
      Abissal: ["Ágil", "Desfavor", "Infame"],
      Alien: ["Talento", "Xenobiologia", "Inculto"],
      Anão: ["Abascanto", "A Ferro e Fogo", "Lento"],
      Anfíbio: ["Imune (Anfíbio)", "Vigoroso", "Ambiente"],
      Celestial: ["Carismático", "Arrebatar", "Código"],
      Centauro: ["Corpo Táurico", "Vigoroso", "Diferente"],
      Ciborgue: ["Construto Vivo", "Imune", "Diretriz"],
      Construto: ["Imune (Abiótico, Doenças, Resiliente, SemMente)", "Bateria", "Sem Vida"],
      Dahllan: ["Benção da Natureza", " Empatia Selvagem", "Código Dahllan"],
      Elfo: ["Impecável", "Natureza Mística", "Frágil"],
      Fada: ["Magia das Fadas", "Infame", "Delicada"],
      Fantasma: ["Espírito", "Paralisia", "Devoto"],
      Goblin: ["Espertalhão", "Subterrâneo", "Diferente"],
      Hynne: ["Atirador", "Encantador", "Diferente"], 
      Kallyanach: ["Baforada", "Poder Dracônico", "Código dos Dragões"], 
      Kemono: ["Percepção Apurada", "Talento", "Cacoete"], 
      Medusa: ["Carismático", "Olhar Atordoante", "Fracote"], 
      Minotauro: ["Atlético", "Sentido Labiríntico", "Transtorno (Fobia)"], 
      Ogro: ["Destruidor", "Intimidador", "Diferente"], 
      Osteon: ["Imune (Abiótico,Doenças,Resiliente)", "Memória Póstuma", "Sem Vida"], 
      Qareen: ["Desejos", "Carismático", "Código da Gratidão"], 
      Sauroide: ["Cascudo", "Camuflagem", "Fraqueza (Frio)"],
      Vampiro: ["Talento", "Imortal", "Fraqueza (luz do dia)", "Dependência"],
    };

    const poderes = ARQUETIPOS[arquetipoSelecionado] || ["Nenhum"];
    const poderesTexto = poderes.join(", ");

    if (ARQUETIPOS[arquetipo]) {
      ativo = ARQUETIPOS[arquetipo].ativo;
    }

    // cálculos de exemplo
    const poderFinal = poder * 1;
    const habilidadeFinal = habilidade * 5;
    const resistenciaFinal = resistencia * 5;

    // monta o resultado
    const resultadoHTML = `
      <p><b>Nome:</b> ${nome}</p>
      <p><b>Arquetipo:</b> ${arquetipo}</p>
      <p><b>Poder do Arquetipo:</b> ${poderesTexto}</p>
      <p><b>Perícias Escolhidas:</b> ${periciasTexto}</p>
      <p><b>Vantagens Escolhidas:</b> ${vantagensTexto}</p>
      <p><b>Desvantagens Escolhidas:</b> ${desvantagensTexto}</p>
      <p><b>Truques Escolhidos:</b> ${truquesTexto}</p>
      <p><b>Técnicas comuns Escolhidas:</b> ${TecnicascTexto}</p>
      <p><b>Técnicas lendárias Escolhidas:</b> ${TecnicaslTexto}</p>
      <p><b>Pontos de ação:</b> ${poderFinal}</p>
      <p><b>Pontos de mana:</b> ${habilidadeFinal}</p>
      <p><b>Pontos de vida:</b> ${resistenciaFinal}</p>
    `;

    document.getElementById("resultado").innerHTML = resultadoHTML;
  });
});