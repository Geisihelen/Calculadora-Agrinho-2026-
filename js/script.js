/**
 * AquaAgro — Calculadora de Consumo de Água Rural
 * Concurso Agrinho 2026 · Subcategoria 3 · Ensino Médio
 * script.js
 *
 * Funcionalidades:
 *  - Navegação entre telas (Home → Calculadora → Resultado → Dicas)
 *  - Cálculo de consumo de água por categoria
 *  - Estimativa de economia com práticas sustentáveis
 *  - Classificação automática e sugestões personalizadas
 *  - Barra de progresso dinâmica
 *  - Dark mode com persistência em localStorage
 *  - Salvamento do último resultado em localStorage
 */

'use strict';

/* =====================================================
   CONSTANTES — COEFICIENTES DE CONSUMO
   Fontes: EMBRAPA / FAO / dados médios nacionais
   ===================================================== */

/** Litros por m² por dia conforme tipo de irrigação */
const COEF_IRRIGACAO = {
  gotejamento: 2,    // mais eficiente
  aspersao:    5,
  sulco:       8,    // menos eficiente
  nenhum:      0
};

/** Consumo médio de água por animal por dia (litros) */
const COEF_ANIMAIS = {
  bovino: 50,   // bezerros ~20 L, adultos ~50 L (média)
  suino:  10,
  ave:    0.3
};

/** Litros por pessoa por dia conforme padrão doméstico */
const COEF_DOMESTICO = {
  baixo:  80,
  medio: 150,
  alto:  220
};

/** Desconto percentual por prática sustentável (aplicado sobre total) */
const DESC_PRATICAS = {
  'reuso-agua':      0.08,  // 8% de redução
  'gotejamento-check': 0.10,
  'reuso-animal':    0.05,
  'biodigestor':     0.06
};

/* =====================================================
   DICAS EDUCATIVAS — renderizadas na Tela 4
   ===================================================== */
const DICAS = [
  {
    emoji: '💧',
    titulo: 'Irrigação por gotejamento',
    texto: 'O gotejamento entrega água diretamente à raiz, reduzindo o desperdício em até 50% comparado à aspersão e 75% em relação ao sulco. Ideal para hortaliças, frutas e café.',
    stat: '💡 Economia: até 50% de água na lavoura'
  },
  {
    emoji: '🌧️',
    titulo: 'Captação de água da chuva',
    texto: 'Cisternas e barragens de contenção captam a água das chuvas e a armazenam para períodos de seca. No Paraná, a média pluviométrica é de 1.400 mm/ano — potencial enorme.',
    stat: '💡 Uma cisterna de 15.000 L supre uma família por meses'
  },
  {
    emoji: '🐄',
    titulo: 'Reuso da água animal',
    texto: 'A água usada na limpeza de cochos e instalações pode ser tratada e reutilizada para irrigação de pastagens. Biodigestores transformam efluentes em biogás e biofertilizante.',
    stat: '💡 Reduz até 30% o consumo de água em confinamentos'
  },
  {
    emoji: '🌱',
    titulo: 'Cobertura do solo',
    texto: 'Manter o solo coberto com palha ou plantio direto reduz a evaporação em até 40%, diminuindo a necessidade de irrigação e protegendo a microbiota do solo.',
    stat: '💡 Temperatura do solo 5°C menor com cobertura'
  },
  {
    emoji: '📊',
    titulo: 'Monitoramento e sensores',
    texto: 'Sensores de umidade do solo (tensiômetros) indicam o momento exato de irrigar, evitando excesso e déficit hídrico. Tecnologia acessível a produtores de todos os portes.',
    stat: '💡 Redução de 20 a 40% no volume de irrigação'
  },
  {
    emoji: '🌲',
    titulo: 'Preservação de matas ciliares',
    texto: 'As matas ao redor de rios e nascentes retêm umidade, evitam erosão e garantem a qualidade da água. O Código Florestal exige sua preservação — e a natureza agradece.',
    stat: '💡 1 ha de mata ciliar filtra até 300 ton de sedimentos/ano'
  }
];

/* =====================================================
   SUGESTÕES AUTOMÁTICAS — mapeadas por situação
   ===================================================== */
const SUGESTOES = {
  irrigacaoAlta: {
    icon: '🌾',
    texto: 'Sua irrigação consome muito. Considere migrar para gotejamento ou aspersão de baixo volume para economizar até 60% de água.'
  },
  semReuso: {
    icon: '💧',
    texto: 'Você ainda não reutiliza água da chuva. Uma cisterna simples pode economizar milhares de litros por ano e garantir água na seca.'
  },
  semGotejamento: {
    icon: '🚿',
    texto: 'Implementar gotejamento ou micro-aspersão pode reduzir o consumo hídrico da lavoura em até 50%.'
  },
  animaisAlto: {
    icon: '🐄',
    texto: 'O consumo dos animais é elevado. Reutilize água de limpeza de instalações e instale bebedouros com boia para evitar desperdício.'
  },
  domAlto: {
    icon: '🏡',
    texto: 'O consumo doméstico está acima da média. Consertos de vazamentos e redutores de fluxo podem economizar até 30% da água doméstica.'
  },
  semBiodigestor: {
    icon: '♻️',
    texto: 'Um biodigestor transforma os efluentes dos animais em biogás (energia) e biofertilizante líquido, além de tratar a água residual.'
  }
};

/* =====================================================
   REFERÊNCIAS DO DOM
   ===================================================== */

// Telas
const telaHome        = document.getElementById('tela-home');
const telaCalc        = document.getElementById('tela-calculadora');
const telaResult      = document.getElementById('tela-resultado');
const telaDicas       = document.getElementById('tela-dicas');

// Navegação
const btnIniciar      = document.getElementById('btn-iniciar');
const btnCalcular     = document.getElementById('btn-calcular');
const btnLimpar       = document.getElementById('btn-limpar');
const btnRefazer      = document.getElementById('btn-refazer');
const btnVerDicas     = document.getElementById('btn-ver-dicas');
const btnVoltarResult = document.getElementById('btn-voltar-resultado');
const btnReiniciar    = document.getElementById('btn-reiniciar');

// Dark mode
const btnDark    = document.getElementById('btn-dark-mode');
const darkIcon   = document.getElementById('dark-icon');

// Progresso
const progressFill  = document.getElementById('progress-fill');
const progressLabel = document.getElementById('progress-label');

// Campos do formulário
const inputArea        = document.getElementById('area-irrigada');
const selectIrrigacao  = document.getElementById('tipo-irrigacao');
const inputBovinos     = document.getElementById('qtd-bovinos');
const inputSuinos      = document.getElementById('qtd-suinos');
const inputAves        = document.getElementById('qtd-aves');
const inputMoradores   = document.getElementById('moradores');
const selectConsumo    = document.getElementById('tipo-consumo');
const checkReusoAgua   = document.getElementById('reuso-agua');
const checkGotejamento = document.getElementById('gotejamento-check');
const checkReusoAnimal = document.getElementById('reuso-animal');
const checkBiodigestor = document.getElementById('biodigestor');

// Resultado
const gaugeValue       = document.getElementById('gauge-value');
const gaugeFill        = document.getElementById('gauge-fill');
const classBadge       = document.getElementById('classification-badge');
const classMsg         = document.getElementById('classification-msg');
const valIrrigacao     = document.getElementById('val-irrigacao');
const valAnimais       = document.getElementById('val-animais');
const valDomestico     = document.getElementById('val-domestico');
const valEconomia      = document.getElementById('val-economia');
const suggestionsList  = document.getElementById('suggestions-list');
const strengthsList    = document.getElementById('strengths-list');

// Dicas
const tipsGrid = document.getElementById('tips-grid');

/* =====================================================
   NAVEGAÇÃO ENTRE TELAS
   ===================================================== */

/**
 * Oculta todas as telas e exibe apenas a indicada.
 * Adiciona classe 'tela' para acionar a animação CSS.
 * @param {HTMLElement} telaAlvo - Elemento da tela a exibir
 */
function mostrarTela(telaAlvo) {
  const telas = [telaHome, telaCalc, telaResult, telaDicas];
  telas.forEach(t => {
    t.classList.add('hidden');
    t.classList.remove('tela');
  });
  telaAlvo.classList.remove('hidden');
  // Adiciona classe de animação no próximo tick
  requestAnimationFrame(() => telaAlvo.classList.add('tela'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Eventos de navegação
btnIniciar.addEventListener('click', () => {
  mostrarTela(telaCalc);
  atualizarProgresso();
});

btnRefazer.addEventListener('click', () => mostrarTela(telaCalc));

btnVerDicas.addEventListener('click', () => {
  renderizarDicas();
  mostrarTela(telaDicas);
});

btnVoltarResult.addEventListener('click', () => mostrarTela(telaResult));

btnReiniciar.addEventListener('click', () => {
  limparFormulario();
  mostrarTela(telaHome);
});

/* =====================================================
   DARK MODE
   ===================================================== */

/**
 * Aplica o tema (light/dark) ao <html> e salva no localStorage.
 * @param {string} tema - 'dark' ou 'light'
 */
function aplicarTema(tema) {
  document.documentElement.setAttribute('data-theme', tema);
  darkIcon.textContent = tema === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('aquaagro-tema', tema);
}

// Ao carregar a página, verifica preferência salva ou do sistema
(function iniciarTema() {
  const salvo = localStorage.getItem('aquaagro-tema');
  if (salvo) {
    aplicarTema(salvo);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    aplicarTema('dark');
  }
})();

btnDark.addEventListener('click', () => {
  const atual = document.documentElement.getAttribute('data-theme');
  aplicarTema(atual === 'dark' ? 'light' : 'dark');
});

/* =====================================================
   BARRA DE PROGRESSO
   ===================================================== */

/** Lista de campos rastreados para o progresso */
const camposRastreados = [
  inputArea, selectIrrigacao,
  inputBovinos, inputSuinos, inputAves,
  inputMoradores, selectConsumo
];

/**
 * Calcula quantos campos foram preenchidos e atualiza a barra.
 */
function atualizarProgresso() {
  const preenchidos = camposRastreados.filter(campo => {
    return campo.value !== '' && campo.value !== '0';
  }).length;

  const pct = Math.round((preenchidos / camposRastreados.length) * 100);
  progressFill.style.width = pct + '%';
  progressFill.closest('[role="progressbar"]').setAttribute('aria-valuenow', pct);
  progressLabel.textContent = pct + '% preenchido';
}

// Escuta mudanças em todos os campos rastreados
camposRastreados.forEach(campo => {
  campo.addEventListener('input', atualizarProgresso);
  campo.addEventListener('change', atualizarProgresso);
});

/* =====================================================
   FEEDBACK VISUAL NOS CAMPOS (classe 'filled')
   ===================================================== */

/**
 * Adiciona a classe 'filled' em campos com valor,
 * gerando feedback visual de cor verde.
 */
function monitorarPreenchimento() {
  const todosCampos = document.querySelectorAll('.field-input, .field-select');
  todosCampos.forEach(campo => {
    campo.addEventListener('input', () => {
      campo.classList.toggle('filled', campo.value.trim() !== '' && campo.value !== '0');
    });
    campo.addEventListener('change', () => {
      campo.classList.toggle('filled', campo.value.trim() !== '' && campo.value !== '0');
    });
  });
}
monitorarPreenchimento();

/* =====================================================
   CÁLCULO DE CONSUMO
   ===================================================== */

/**
 * Lê os dados do formulário e retorna um objeto com
 * os consumos parciais e totais em litros por dia.
 * @returns {Object} resultado com propriedades: irrigacao, animais, domestico, economia, total, bruto
 */
function calcularConsumo() {
  // --- Irrigação ---
  const area       = parseFloat(inputArea.value)  || 0;      // hectares
  const tipoIrrig  = selectIrrigacao.value;
  const coefIrrig  = COEF_IRRIGACAO[tipoIrrig] || 0;
  // 1 ha = 10.000 m²
  const litrosIrrig = area * 10000 * coefIrrig;

  // --- Animais ---
  const bovinos    = parseInt(inputBovinos.value) || 0;
  const suinos     = parseInt(inputSuinos.value)  || 0;
  const aves       = parseInt(inputAves.value)    || 0;
  const litrosAnim = (bovinos * COEF_ANIMAIS.bovino)
                   + (suinos  * COEF_ANIMAIS.suino)
                   + (aves    * COEF_ANIMAIS.ave);

  // --- Doméstico ---
  const moradores  = parseInt(inputMoradores.value) || 0;
  const tipoConsum = selectConsumo.value;
  const coefDom    = COEF_DOMESTICO[tipoConsum] || 0;
  const litrosDom  = moradores * coefDom;

  // --- Total bruto ---
  const bruto = litrosIrrig + litrosAnim + litrosDom;

  // --- Economia por práticas sustentáveis ---
  let percEconomia = 0;
  if (checkReusoAgua.checked)   percEconomia += DESC_PRATICAS['reuso-agua'];
  if (checkGotejamento.checked) percEconomia += DESC_PRATICAS['gotejamento-check'];
  if (checkReusoAnimal.checked) percEconomia += DESC_PRATICAS['reuso-animal'];
  if (checkBiodigestor.checked) percEconomia += DESC_PRATICAS['biodigestor'];

  // Limite máximo de desconto: 35%
  percEconomia = Math.min(percEconomia, 0.35);

  const economia = Math.round(bruto * percEconomia);
  const total    = Math.round(bruto - economia);

  return {
    irrigacao: Math.round(litrosIrrig),
    animais:   Math.round(litrosAnim),
    domestico: Math.round(litrosDom),
    economia,
    bruto:     Math.round(bruto),
    total
  };
}

/* =====================================================
   CLASSIFICAÇÃO
   ===================================================== */

/**
 * Classifica o consumo por litros/dia e retorna
 * badge CSS, rótulo e mensagem.
 * Referências: consumo médio por tipo de propriedade (EMBRAPA)
 * @param {number} total - consumo total em L/dia
 * @returns {Object} { classeCSS, rotulo, mensagem }
 */
function classificar(total) {
  if (total === 0) {
    return {
      classeCSS: 'otimo',
      rotulo: '✅ Sem dados suficientes',
      mensagem: 'Preencha os campos para obter sua classificação.'
    };
  }
  if (total <= 5000) {
    return {
      classeCSS: 'otimo',
      rotulo: '🏆 Consumo Exemplar',
      mensagem: 'Parabéns! Sua propriedade usa água com muita eficiência. Continue assim e inspire seus vizinhos!'
    };
  }
  if (total <= 20000) {
    return {
      classeCSS: 'bom',
      rotulo: '🌿 Consumo Eficiente',
      mensagem: 'Bom trabalho! O consumo está dentro de uma faixa razoável. Algumas práticas simples podem reduzir ainda mais o uso.'
    };
  }
  if (total <= 80000) {
    return {
      classeCSS: 'medio',
      rotulo: '⚠️ Consumo Moderado',
      mensagem: 'Há espaço para melhorias. Adotar irrigação mais eficiente e práticas de reuso pode reduzir significativamente o consumo.'
    };
  }
  return {
    classeCSS: 'alto',
    rotulo: '🔴 Consumo Elevado',
    mensagem: 'O consumo está acima do ideal. Revise seus sistemas de irrigação e considere práticas de economia hídrica urgentemente.'
  };
}

/* =====================================================
   SUGESTÕES AUTOMÁTICAS
   ===================================================== */

/**
 * Gera uma lista de sugestões com base nos dados inseridos.
 * @param {Object} dados - resultado de calcularConsumo()
 * @returns {Array<Object>} lista de sugestões { icon, texto }
 */
function gerarSugestoes(dados) {
  const sugs = [];

  if (dados.irrigacao > 20000 && selectIrrigacao.value !== 'gotejamento') {
    sugs.push(SUGESTOES.irrigacaoAlta);
  }
  if (!checkReusoAgua.checked) {
    sugs.push(SUGESTOES.semReuso);
  }
  if (!checkGotejamento.checked && dados.irrigacao > 5000) {
    sugs.push(SUGESTOES.semGotejamento);
  }
  if (dados.animais > 10000) {
    sugs.push(SUGESTOES.animaisAlto);
  }
  if (selectConsumo.value === 'alto') {
    sugs.push(SUGESTOES.domAlto);
  }
  if (!checkBiodigestor.checked && (parseInt(inputBovinos.value) || 0) > 10) {
    sugs.push(SUGESTOES.semBiodigestor);
  }

  // Mínimo 2 sugestões para não deixar vazio
  if (sugs.length === 0) {
    sugs.push({ icon: '⭐', texto: 'Excelente! Sua propriedade já adota boas práticas de uso hídrico. Compartilhe seu conhecimento com outros produtores.' });
    sugs.push({ icon: '📢', texto: 'Considere participar de programas de certificação em sustentabilidade, como o Produtor de Água (ANA) ou Senar Verde.' });
  }

  return sugs;
}

/**
 * Gera lista de pontos fortes com base nas práticas marcadas.
 * @returns {Array<string>} textos dos pontos fortes
 */
function gerarPontosFortes() {
  const fortes = [];
  if (checkReusoAgua.checked)   fortes.push('Você reutiliza água da chuva — prática essencial na agricultura sustentável.');
  if (checkGotejamento.checked) fortes.push('Gotejamento ou irrigação precisa: você economiza água com tecnologia.');
  if (checkReusoAnimal.checked) fortes.push('Reuso de água animal: fechando o ciclo hídrico na propriedade.');
  if (checkBiodigestor.checked) fortes.push('Biodigestor: tratamento de efluentes e geração de energia e adubo.');
  if (selectIrrigacao.value === 'gotejamento') fortes.push('Sistema de gotejamento: o mais eficiente dos sistemas de irrigação.');
  if (selectConsumo.value === 'baixo') fortes.push('Consumo doméstico consciente: hábito que faz diferença no total.');
  return fortes;
}

/* =====================================================
   ANIMAÇÃO DO GAUGE
   ===================================================== */

/**
 * Anima o arco SVG do medidor para refletir o consumo.
 * Escala: 0 → verde; >80.000 L → vermelho
 * @param {number} total - consumo total L/dia
 * @param {string} classeCSS - classe de classificação
 */
function animarGauge(total, classeCSS) {
  // Arco total do SVG ≈ 220 unidades
  const maxRef    = 100000;  // 100.000 L/dia como 100%
  const pct       = Math.min(total / maxRef, 1);
  const arcLen    = Math.round(pct * 220);

  gaugeFill.style.strokeDasharray = `${arcLen} 220`;

  const cores = {
    otimo:  '#1a7a5e',
    bom:    '#6db33f',
    medio:  '#e67e22',
    alto:   '#c0392b'
  };
  gaugeFill.style.stroke = cores[classeCSS] || '#1a7a5e';
}

/* =====================================================
   RENDERIZAR RESULTADO
   ===================================================== */

/**
 * Orquestra o cálculo, preenche o DOM e exibe a tela de resultado.
 */
function mostrarResultado() {
  const dados = calcularConsumo();
  const classif = classificar(dados.total);

  // Gauge e valor central
  gaugeValue.textContent = formatarNumero(dados.total);
  animarGauge(dados.total, classif.classeCSS);

  // Classificação
  classBadge.textContent = classif.rotulo;
  classBadge.className   = 'classification-badge ' + classif.classeCSS;
  classMsg.textContent   = classif.mensagem;

  // Cards de detalhe
  valIrrigacao.textContent = formatarNumero(dados.irrigacao) + ' L/dia';
  valAnimais.textContent   = formatarNumero(dados.animais)   + ' L/dia';
  valDomestico.textContent = formatarNumero(dados.domestico) + ' L/dia';
  valEconomia.textContent  = formatarNumero(dados.economia)  + ' L/dia';

  // Sugestões
  const sugs = gerarSugestoes(dados);
  suggestionsList.innerHTML = sugs.map(s =>
    `<li><span class="sug-icon" aria-hidden="true">${s.icon}</span>${s.texto}</li>`
  ).join('');

  // Pontos fortes
  const fortes = gerarPontosFortes();
  const strengthsBox = document.getElementById('strengths-box');
  if (fortes.length > 0) {
    strengthsBox.classList.remove('hidden');
    strengthsList.innerHTML = fortes.map(f =>
      `<li><span class="sug-icon" aria-hidden="true">✅</span>${f}</li>`
    ).join('');
  } else {
    strengthsBox.classList.add('hidden');
  }

  // Salvar no localStorage
  salvarResultado(dados, classif);

  mostrarTela(telaResult);
}

/* =====================================================
   RENDERIZAR DICAS
   ===================================================== */

/**
 * Gera os cards de dicas educativas no DOM.
 * Chamada apenas quando o usuário acessa a tela de dicas.
 */
function renderizarDicas() {
  if (tipsGrid.children.length > 0) return; // já renderizado

  tipsGrid.innerHTML = DICAS.map(d => `
    <article class="tip-card">
      <div class="tip-card__header">
        <span class="tip-card__emoji" aria-hidden="true">${d.emoji}</span>
        <h3 class="tip-card__title">${d.titulo}</h3>
      </div>
      <div class="tip-card__body">
        <p>${d.texto}</p>
        <p class="tip-card__stat">${d.stat}</p>
      </div>
    </article>
  `).join('');
}

/* =====================================================
   UTILITÁRIOS
   ===================================================== */

/**
 * Formata número com separador de milhar.
 * @param {number} n
 * @returns {string}
 */
function formatarNumero(n) {
  return n.toLocaleString('pt-BR');
}

/**
 * Limpa todos os campos do formulário e reseta a barra de progresso.
 */
function limparFormulario() {
  inputArea.value      = '';
  selectIrrigacao.value = '';
  inputBovinos.value   = '';
  inputSuinos.value    = '';
  inputAves.value      = '';
  inputMoradores.value = '';
  selectConsumo.value  = '';

  checkReusoAgua.checked   = false;
  checkGotejamento.checked = false;
  checkReusoAnimal.checked = false;
  checkBiodigestor.checked = false;

  // Remove classe 'filled' de todos os campos
  document.querySelectorAll('.field-input, .field-select').forEach(c => {
    c.classList.remove('filled');
  });

  progressFill.style.width = '0%';
  progressLabel.textContent = '0% preenchido';
}

btnLimpar.addEventListener('click', limparFormulario);

/* =====================================================
   VALIDAÇÃO BÁSICA
   ===================================================== */

/**
 * Verifica se ao menos um campo principal foi preenchido.
 * Exibe alerta amigável caso contrário.
 * @returns {boolean}
 */
function validarFormulario() {
  const temAlgumDado =
    (parseFloat(inputArea.value) > 0 && selectIrrigacao.value !== '') ||
    (parseInt(inputBovinos.value) > 0) ||
    (parseInt(inputSuinos.value)  > 0) ||
    (parseInt(inputAves.value)    > 0) ||
    (parseInt(inputMoradores.value) > 0 && selectConsumo.value !== '');

  if (!temAlgumDado) {
    alert('Preencha pelo menos um grupo de dados para calcular o consumo.');
    return false;
  }
  return true;
}

btnCalcular.addEventListener('click', () => {
  if (validarFormulario()) {
    mostrarResultado();
  }
});

/* =====================================================
   LOCAL STORAGE — salvar e restaurar resultado
   ===================================================== */

/**
 * Salva o resultado atual no localStorage para
 * possível exibição em visitas futuras.
 * @param {Object} dados
 * @param {Object} classif
 */
function salvarResultado(dados, classif) {
  const registro = {
    data: new Date().toLocaleDateString('pt-BR'),
    total: dados.total,
    economia: dados.economia,
    classificacao: classif.rotulo
  };
  localStorage.setItem('aquaagro-ultimo-resultado', JSON.stringify(registro));
}

/**
 * Recupera o último resultado salvo e exibe um aviso
 * sutil no banner da home (opcional / informativo).
 */
(function verificarResultadoSalvo() {
  const salvo = localStorage.getItem('aquaagro-ultimo-resultado');
  if (!salvo) return;

  try {
    const r = JSON.parse(salvo);
    const hero = document.querySelector('.hero__content');
    const aviso = document.createElement('p');
    aviso.style.cssText = 'font-size:.82rem;color:var(--color-text-3);margin-top:.5rem;';
    aviso.textContent = `Última análise em ${r.data}: ${formatarNumero(r.total)} L/dia · ${r.classificacao}`;
    hero.appendChild(aviso);
  } catch (_) {
    // Dado corrompido — ignora silenciosamente
    localStorage.removeItem('aquaagro-ultimo-resultado');
  }
})();

/* =====================================================
   INICIALIZAÇÃO
   ===================================================== */

// Garante que apenas a tela home é visível no início
mostrarTela(telaHome);
