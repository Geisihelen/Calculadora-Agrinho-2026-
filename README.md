# 💧 AquaAgro — Calculadora de Consumo de Água Rural

> Projeto desenvolvido para o **Concurso Agrinho 2026**  
> Subcategoria 3 — HTML, CSS e JavaScript · Ensino Médio

---

## 🎯 Objetivo do Projeto

O **AquaAgro** é uma calculadora interativa que permite ao usuário estimar o consumo de água diário de uma propriedade rural, considerando irrigação, criação animal e uso doméstico. Ao final, o sistema classifica o consumo, estima a economia possível com práticas sustentáveis e exibe recomendações personalizadas.

O projeto promove consciência hídrica no campo e está alinhado ao tema do Agrinho 2026: **campo e cidade conectados pelo desenvolvimento sustentável**.

---

## 🖥️ Telas do Site

| Tela | Descrição |
|------|-----------|
| **Home** | Apresentação do projeto e botão para iniciar |
| **Calculadora** | Formulário com 4 grupos de dados (irrigação, animais, doméstico, práticas) |
| **Resultado** | Consumo total, classificação, detalhamento por categoria e sugestões |
| **Dicas** | 6 cards educativos sobre economia de água no campo |

---

## ⚙️ Funcionalidades

- ✅ Cálculo de consumo por categoria (irrigação, animais, uso doméstico)
- ✅ Estimativa de economia com práticas sustentáveis
- ✅ Classificação automática: Exemplar / Eficiente / Moderado / Elevado
- ✅ Sugestões e pontos fortes personalizados
- ✅ Barra de progresso do preenchimento
- ✅ Dark mode com persistência via `localStorage`
- ✅ Último resultado salvo e exibido na home
- ✅ Animação SVG do medidor (gauge)
- ✅ Feedback visual nos campos preenchidos
- ✅ Layout responsivo (mobile e desktop)
- ✅ Transições CSS suaves entre telas

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|-----------|-----|
| **HTML5 semântico** | Estrutura das páginas (`<section>`, `<article>`, `<header>`, etc.) |
| **CSS3** | Estilização, variáveis CSS, animações, media queries, dark mode |
| **JavaScript puro (ES6+)** | Cálculo, manipulação DOM, eventos, localStorage |

> ⚠️ **Nenhum framework, biblioteca ou CDN externo foi utilizado.**

---

## 📁 Estrutura de Arquivos

```
calculadora-agua/
├── index.html          ← Estrutura semântica única (4 telas via JS)
├── css/
│   └── style.css       ← Todos os estilos, variáveis e responsividade
├── js/
│   └── script.js       ← Toda a lógica: cálculo, navegação, dark mode
├── img/                ← (pasta reservada para imagens futuras)
├── assets/             ← (pasta reservada para assets futuros)
└── README.md           ← Este arquivo
```

---

## 🚀 Como Usar

### Opção 1 — Abrir localmente
1. Faça o download ou clone este repositório
2. Abra o arquivo `index.html` em qualquer navegador moderno
3. Nenhuma instalação necessária

### Opção 2 — GitHub Pages
1. Suba os arquivos em um repositório público no GitHub
2. Acesse **Settings → Pages → Deploy from branch → main**
3. Aguarde alguns minutos e acesse o link gerado

---

## 🌱 Tema: Agro Forte, Futuro Sustentável

A água é o recurso mais crítico para a agricultura. O Brasil é o país com maior disponibilidade hídrica do mundo, mas a má gestão já causa escassez em regiões produtoras. Este projeto convida estudantes e produtores a:

- **Medir** o quanto consomem
- **Identificar** onde desperdiçam
- **Agir** com práticas simples e eficazes

O campo que cuida da água hoje garante produção para gerações futuras.

---

## 📊 Coeficientes Utilizados

| Categoria | Valor | Fonte |
|-----------|-------|-------|
| Gotejamento | 2 L/m²/dia | EMBRAPA |
| Aspersão | 5 L/m²/dia | EMBRAPA |
| Sulco/inundação | 8 L/m²/dia | FAO |
| Bovino | 50 L/cabeça/dia | EMBRAPA |
| Suíno | 10 L/cabeça/dia | EMBRAPA |
| Ave | 0,3 L/cabeça/dia | EMBRAPA |
| Consumo consciente | 80 L/pessoa/dia | SANEPAR/ANA |
| Consumo moderado | 150 L/pessoa/dia | IBGE |
| Consumo alto | 220 L/pessoa/dia | IBGE |

---

## ✍️ Autores

- **[Seu Nome]** — desenvolvimento, design e conteúdo
- Escola: **[Nome da Escola]**
- Município: **[Cidade/PR]**
- Turma: **[Série e turma]**
- Orientador(a): **[Nome do professor(a)]**

---

## 🤖 Prompts de IA Utilizados

Este projeto foi desenvolvido com auxílio do Claude (Anthropic). Os prompts principais utilizados foram:

1. *"Crie um projeto completo de site front-end para o Concurso Agrinho 2026 — Calculadora de Consumo de Água, usando apenas HTML, CSS e JavaScript puro..."*
2. Ajustes de design, coeficientes técnicos e estrutura de classificação foram refinados por prompts iterativos focados em:
   - Paleta de cores inspirada em campo e água
   - Cálculo realista de consumo hídrico rural
   - Feedback visual e acessibilidade

> 💡 A IA foi utilizada como ferramenta de apoio ao desenvolvimento. Todo o conteúdo foi revisado, adaptado e validado pelos autores.

---

## 📜 Créditos

- Dados técnicos: **EMBRAPA**, **FAO**, **ANA (Agência Nacional de Águas)**, **IBGE**
- Concurso: **[Agrinho 2026](https://www.agrinho.com.br)** — SENAR-PR
- Ícones: emojis padrão Unicode (sem dependências externas)

---

*Feito com 💚 para o campo e para o futuro.*
