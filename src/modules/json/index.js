/**
 * Módulo 3: Arquivos JSON — Preservação Integral do Objeto de Aprendizagem Homologado
 * Fonte: conteudo/objeto_de_aprendizagem_interativo_desvendando_o_json (4).html
 */
import { escapeHtmlText, showToast, copyTextToClipboard } from '../../core/sanitizer.js';
import { playTone } from '../../core/audio.js';
import { getIsDarkMode } from '../../core/theme.js';

export const JSON_MODULE_ID = 'json';

let currentStepIndex = 0;
let typingTimeout = null;

export const stepsData = [
  {
    stepNumber: 1,
    title: 'O Objeto Vazio e o Escopo { }',
    category: 'Escopo e Delimitação',
    icon: 'fa-solid fa-cube',
    description:
      'Todo arquivo JSON que descreve uma entidade única inicia e termina com chaves `{ }`. Elas delimitam o contexto onde atributos e propriedades serão inseridos.',
    rule: 'As chaves marcam o nascimento e o fechamento do objeto. Nada pode ficar solto do lado de fora.',
    tokens: [
      {
        label: 'Abre Chave {',
        lightColor: 'text-amber-800 font-bold',
        darkColor: 'text-[#fab387]',
        desc: 'Início do objeto',
      },
      {
        label: 'Fecha Chave }',
        lightColor: 'text-amber-800 font-bold',
        darkColor: 'text-[#fab387]',
        desc: 'Término do objeto',
      },
    ],
    rawJson: '{\n}',
    highlightLines: [1, 2],
    treeData: { type: 'object', name: 'Raiz (Objeto Vazio)', badge: '{ }', children: [] },
  },
  {
    stepNumber: 2,
    title: 'O Primeiro Par Chave-Valor (String)',
    category: 'Propriedades Textuais',
    icon: 'fa-solid fa-font',
    description:
      'Adicionamos nosso primeiro dado: o nome da estudante. No JSON, a chave deve obrigatoriamente estar entre aspas duplas, seguida de dois-pontos `:` e do valor textual.',
    rule: 'Aspas duplas " são obrigatórias tanto na chave quanto em valores textuais (strings). Aspas simples não são válidas no padrão JSON!',
    tokens: [
      {
        label: 'Chave "nome"',
        lightColor: 'text-blue-800 font-bold',
        darkColor: 'text-[#f9e2af]',
        desc: 'Identificador entre aspas',
      },
      {
        label: 'Separador :',
        lightColor: 'text-slate-700 font-bold',
        darkColor: 'text-[#9399b2]',
        desc: 'Dois-pontos de atribuição',
      },
      {
        label: 'Valor "Ana Silva"',
        lightColor: 'text-emerald-800 font-bold',
        darkColor: 'text-[#a6e3a1]',
        desc: 'Texto delimitado',
      },
    ],
    rawJson: '{\n  "nome": "Ana Silva"\n}',
    highlightLines: [2],
    treeData: {
      type: 'object',
      name: 'Estudante',
      badge: '{ }',
      children: [{ key: 'nome', value: '"Ana Silva"', type: 'string' }],
    },
  },
  {
    stepNumber: 3,
    title: 'Tipos Primitivos: Números e Booleanos',
    category: 'Tipagem de Dados',
    icon: 'fa-solid fa-hashtag',
    description:
      'Números (inteiros ou decimais) e valores lógicos (`true`/`false`) são literais nativos da linguagem: eles NÃO recebem aspas.',
    rule: 'Atenção à vírgula `,` separadora no final de cada linha intermediária. O último elemento do objeto não deve ter vírgula.',
    tokens: [
      {
        label: 'Número 2026101',
        lightColor: 'text-sky-800 font-bold',
        darkColor: 'text-[#89b4fa]',
        desc: 'Sem aspas (numérico)',
      },
      {
        label: 'Booleano true',
        lightColor: 'text-amber-700 font-bold',
        darkColor: 'text-[#cba6f7]',
        desc: 'Verdadeiro/Falso literal',
      },
      {
        label: 'Vírgula ,',
        lightColor: 'text-slate-800 font-bold',
        darkColor: 'text-[#9399b2]',
        desc: 'Separador entre atributos',
      },
    ],
    rawJson: '{\n  "nome": "Ana Silva",\n  "matricula": 2026101,\n  "ativo": true\n}',
    highlightLines: [3, 4],
    treeData: {
      type: 'object',
      name: 'Estudante',
      badge: '{ }',
      children: [
        { key: 'nome', value: '"Ana Silva"', type: 'string' },
        { key: 'matricula', value: '2026101', type: 'number' },
        { key: 'ativo', value: 'true', type: 'boolean' },
      ],
    },
  },
  {
    stepNumber: 4,
    title: 'O Array / Vetor com Colchetes [ ]',
    category: 'Coleções Ordenadas',
    icon: 'fa-solid fa-list-ol',
    description:
      'Quando um atributo precisa guardar uma lista ou sequência ordenada de elementos (como disciplinas cursadas), utilizamos colchetes `[ ]`.',
    rule: 'Chaves { } guardam campos nomeados (chave : valor); Colchetes [ ] guardam itens sequenciais acessados por índice (0, 1, 2...).',
    tokens: [
      {
        label: 'Chave "materias"',
        lightColor: 'text-blue-800 font-bold',
        darkColor: 'text-[#f9e2af]',
        desc: 'Nome da lista',
      },
      {
        label: 'Colchetes [ ]',
        lightColor: 'text-rose-700 font-bold',
        darkColor: 'text-[#f38ba8]',
        desc: 'Delimitadores de lista',
      },
      {
        label: 'Itens da Lista',
        lightColor: 'text-emerald-800 font-bold',
        darkColor: 'text-[#a6e3a1]',
        desc: 'Strings separadas por vírgula',
      },
    ],
    rawJson:
      '{\n  "nome": "Ana Silva",\n  "matricula": 2026101,\n  "ativo": true,\n  "materias": [\n    "Algoritmos",\n    "Banco de Dados"\n  ]\n}',
    highlightLines: [5, 6, 7, 8],
    treeData: {
      type: 'object',
      name: 'Estudante',
      badge: '{ }',
      children: [
        { key: 'nome', value: '"Ana Silva"', type: 'string' },
        { key: 'matricula', value: '2026101', type: 'number' },
        { key: 'ativo', value: 'true', type: 'boolean' },
        {
          key: 'materias',
          type: 'array',
          badge: '[ 2 itens ]',
          children: [
            { key: '[0]', value: '"Algoritmos"', type: 'string' },
            { key: '[1]', value: '"Banco de Dados"', type: 'string' },
          ],
        },
      ],
    },
  },
  {
    stepNumber: 5,
    title: 'Objeto Aninhado (Hierarquia em Árvore)',
    category: 'Composição de Objetos',
    icon: 'fa-solid fa-folder-tree',
    description:
      'O valor de uma propriedade pode ser outro Objeto `{ }` completo, gerando uma estrutura hierárquica e modularizada.',
    rule: 'O aninhamento permite agrupar dados correlacionados (como endereço) de forma limpa, sem espalhar campos soltos na raiz.',
    tokens: [
      {
        label: 'Chave "endereco"',
        lightColor: 'text-blue-800 font-bold',
        darkColor: 'text-[#f9e2af]',
        desc: 'Objeto-filho',
      },
      {
        label: 'Sub-bloco { }',
        lightColor: 'text-amber-800 font-bold',
        darkColor: 'text-[#fab387]',
        desc: 'Chaves internas',
      },
      {
        label: 'Propriedades',
        lightColor: 'text-slate-800 font-bold',
        darkColor: 'text-[#a6adc8]',
        desc: 'cidade e uf subordinadas',
      },
    ],
    rawJson:
      '{\n  "nome": "Ana Silva",\n  "matricula": 2026101,\n  "ativo": true,\n  "materias": [\n    "Algoritmos",\n    "Banco de Dados"\n  ],\n  "endereco": {\n    "cidade": "Muriaé",\n    "uf": "MG"\n  }\n}',
    highlightLines: [9, 10, 11, 12],
    treeData: {
      type: 'object',
      name: 'Estudante',
      badge: '{ }',
      children: [
        { key: 'nome', value: '"Ana Silva"', type: 'string' },
        { key: 'matricula', value: '2026101', type: 'number' },
        { key: 'ativo', value: 'true', type: 'boolean' },
        {
          key: 'materias',
          type: 'array',
          badge: '[ 2 itens ]',
          children: [
            { key: '[0]', value: '"Algoritmos"', type: 'string' },
            { key: '[1]', value: '"Banco de Dados"', type: 'string' },
          ],
        },
        {
          key: 'endereco',
          type: 'object',
          badge: '{ }',
          children: [
            { key: 'cidade', value: '"Muriaé"', type: 'string' },
            { key: 'uf', value: '"MG"', type: 'string' },
          ],
        },
      ],
    },
  },
  {
    stepNumber: 6,
    title: 'O JSON Completo e Regras de Validação',
    category: 'Consolidação e Padrão RFC',
    icon: 'fa-solid fa-circle-check',
    description:
      'Excelente! Nosso arquivo está 100% em conformidade com o padrão RFC 8259, pronto para ser consumido por APIs e sistemas modernos.',
    rule: 'Lembre-se sempre: sem comentários no arquivo, aspas somente duplas e nada de vírgula após o último elemento.',
    tokens: [
      {
        label: 'Strings',
        lightColor: 'text-emerald-800 font-bold',
        darkColor: 'text-[#a6e3a1]',
        desc: 'Textos com aspas duplas',
      },
      {
        label: 'Números',
        lightColor: 'text-sky-800 font-bold',
        darkColor: 'text-[#89b4fa]',
        desc: 'Literais numéricos',
      },
      {
        label: 'Booleanos',
        lightColor: 'text-amber-700 font-bold',
        darkColor: 'text-[#cba6f7]',
        desc: 'true / false',
      },
      {
        label: 'Chaves',
        lightColor: 'text-blue-800 font-bold',
        darkColor: 'text-[#f9e2af]',
        desc: 'Identificadores das chaves',
      },
    ],
    rawJson:
      '{\n  "nome": "Ana Silva",\n  "matricula": 2026101,\n  "ativo": true,\n  "materias": [\n    "Algoritmos",\n    "Banco de Dados"\n  ],\n  "endereco": {\n    "cidade": "Muriaé",\n    "uf": "MG"\n  }\n}',
    highlightLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    treeData: {
      type: 'object',
      name: 'Estudante (Raiz Validada)',
      badge: '{ }',
      children: [
        { key: 'nome', value: '"Ana Silva"', type: 'string' },
        { key: 'matricula', value: '2026101', type: 'number' },
        { key: 'ativo', value: 'true', type: 'boolean' },
        {
          key: 'materias',
          type: 'array',
          badge: '[ 2 ]',
          children: [
            { key: '[0]', value: '"Algoritmos"', type: 'string' },
            { key: '[1]', value: '"Banco de Dados"', type: 'string' },
          ],
        },
        {
          key: 'endereco',
          type: 'object',
          badge: '{ }',
          children: [
            { key: 'cidade', value: '"Muriaé"', type: 'string' },
            { key: 'uf', value: '"MG"', type: 'string' },
          ],
        },
      ],
    },
  },
];

export const traps = {
  no_quotes: {
    title: 'Erro: Chave sem Aspas Duplas',
    rawCode: `{\n  nome: "Ana Silva",\n  "matricula": 2026101\n}`,
    highlightLine: 2,
    errorDesc: 'JSON.parse: Expected double-quoted property name at line 2 col 3',
    fix: 'No JSON, aspas duplas nas chaves são rigorosamente obrigatórias: `"nome": "Ana Silva"`.',
  },
  single_quotes: {
    title: 'Erro: Aspas Simples Usadas em Vez de Duplas',
    rawCode: `{\n  'nome': 'Ana Silva',\n  'matricula': 2026101\n}`,
    highlightLine: 2,
    errorDesc:
      "JSON.parse: Unexpected token ''' at line 2 col 3. Aspas simples NÃO existem no JSON.",
    fix: 'Substitua todas as aspas simples \' \' por aspas duplas " ".',
  },
  trailing_comma: {
    title: 'Erro: Vírgula no Último Item (Trailing Comma)',
    rawCode: `{\n  "nome": "Ana Silva",\n  "matricula": 2026101,\n}`,
    highlightLine: 3,
    errorDesc: "JSON.parse: Unexpected token '}' after trailing comma at line 3 col 25",
    fix: 'Remova a vírgula do último elemento antes de fechar a chave `}` ou colchete `]`.',
  },
  bracket_confusion: {
    title: 'Erro: Confusão entre [ ] (Array) e { } (Objeto)',
    rawCode: `[\n  "nome": "Ana Silva",\n  "matricula": 2026101\n]`,
    highlightLine: 2,
    errorDesc:
      "JSON.parse: Unexpected token ':'. Arrays guardam itens sequenciais, não pares chave-valor!",
    fix: 'Para entidades com pares chave : valor utilize chaves `{ }`. Use colchetes `[ ]` apenas para listas.',
  },
};

export const validatorPresets = {
  valid: `{\n  "instituicao": "Academia Tech",\n  "unidade": "Central",\n  "curso": "Desenvolvimento de Software",\n  "ano": 2026,\n  "ativo": true,\n  "disciplinas": [\n    "Algoritmos e Estruturas de Dados",\n    "Modelagem de Banco de Dados",\n    "Engenharia de Software"\n  ],\n  "coordenacao": {\n    "nome": "Prof. Dr. Ricardo",\n    "sala": "B-104",\n    "email": "ricardo@academiatech.edu.br"\n  }\n}`,
  err_comma: `{\n  "turma": "SI-2026",\n  "alunos": [\n    "Carlos",\n    "Beatriz",\n    "Lucas",\n  ],\n  "periodo": 3\n}`,
  err_quote: `{\n  'titulo': 'Relatório Final',\n  'concluido': true,\n  'nota': 9.5\n}`,
};

export function stopJsonTyping() {
  if (typingTimeout) {
    clearTimeout(typingTimeout);
    typingTimeout = null;
  }
}

export function switchMainTab(tabId) {
  const builderTab = document.getElementById('view-builder');
  const validatorTab = document.getElementById('view-validator');
  const btnBuilder = document.getElementById('tab-btn-builder');
  const btnValidator = document.getElementById('tab-btn-validator');
  if (!builderTab || !validatorTab) return;

  if (tabId === 'builder') {
    builderTab.classList.remove('hidden');
    validatorTab.classList.add('hidden');
    btnBuilder.className =
      'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm bg-white text-indigo-700 dark:bg-[#313244] dark:text-white border border-slate-200 dark:border-transparent';
    btnValidator.className =
      'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-[#a6adc8] hover:text-slate-900 dark:hover:text-white transition';
    playTone('C5');
  } else {
    stopJsonTyping();
    builderTab.classList.add('hidden');
    validatorTab.classList.remove('hidden');
    btnValidator.className =
      'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm bg-white text-emerald-700 dark:bg-[#313244] dark:text-white border border-slate-200 dark:border-transparent';
    btnBuilder.className =
      'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-[#a6adc8] hover:text-slate-900 dark:hover:text-white transition';
    playTone('G5');
    runValidation();
  }
}

export function renderStepper() {
  const container = document.getElementById('stepper-container');
  if (!container) return;
  container.innerHTML = stepsData
    .map((step, idx) => {
      const isCurrent = idx === currentStepIndex;
      const isCompleted = idx < currentStepIndex;
      let statusClass =
        'bg-white text-slate-600 border-slate-200 hover:border-slate-300 dark:bg-[#313244] dark:text-[#a6adc8] dark:border-transparent';
      if (isCurrent) {
        statusClass =
          'bg-indigo-600 text-white font-bold ring-2 ring-indigo-400/50 shadow-md shadow-indigo-600/30 border-transparent';
      } else if (isCompleted) {
        statusClass =
          'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold dark:bg-emerald-600/20 dark:text-emerald-400 dark:border-emerald-500/30';
      }

      return `
        <button onclick="goToStep(${idx})" class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all border shrink-0 ${statusClass}">
          <span class="w-5 h-5 rounded-full flex items-center justify-center font-mono text-[11px] font-bold ${isCurrent ? 'bg-white text-indigo-900' : isCompleted ? 'bg-emerald-600 text-white dark:bg-emerald-500/30 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-black/30 dark:text-slate-300'}">
            ${isCompleted ? '<i class="fa-solid fa-check text-[10px]"></i>' : idx + 1}
          </span>
          <span class="font-medium whitespace-nowrap">${step.title.split(' ')[0]} ${step.title.split(' ')[1] || ''}</span>
        </button>
      `;
    })
    .join('');
}

export function renderLesson() {
  const step = stepsData[currentStepIndex];
  const badgeEl = document.getElementById('badge-step-number');
  if (!badgeEl) return;

  const isDarkMode = getIsDarkMode();
  badgeEl.innerText = `PASSO ${step.stepNumber} DE ${stepsData.length}`;
  document.getElementById('step-category').innerText = step.category;
  document.getElementById('step-icon-container').innerHTML = `<i class="${step.icon}"></i>`;
  document.getElementById('step-title').innerText = step.title;
  document.getElementById('step-description').innerText = step.description;
  document.getElementById('step-rule-text').innerText = step.rule;

  const tokenContainer = document.getElementById('step-tokens-container');
  tokenContainer.innerHTML = step.tokens
    .map((token) => {
      const colorClass = isDarkMode ? token.darkColor : token.lightColor;
      return `
        <div class="bg-slate-50 dark:bg-[#181825] p-2.5 rounded-xl border border-slate-200 dark:border-[#313244] flex flex-col">
          <span class="font-mono text-xs ${colorClass}">${token.label}</span>
          <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] font-medium mt-0.5">${token.desc}</span>
        </div>
      `;
    })
    .join('');

  document.getElementById('btn-prev').disabled = currentStepIndex === 0;
  const nextBtn = document.getElementById('btn-next');
  nextBtn.innerHTML =
    currentStepIndex === stepsData.length - 1
      ? `<span>Finalizar</span> <i class="fa-solid fa-check"></i>`
      : `<span>Avançar</span> <i class="fa-solid fa-arrow-right"></i>`;
  document.getElementById('trap-feedback-box').classList.add('hidden');
  updateSyntaxBadge(true);
}

export function colorizeJsonLine(lineText) {
  if (!lineText) return '';

  const tokenRegex =
    /(\s+|"(?:\\.|[^"\\])*"(?:\s*:)?|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null|[{}[\]:,]|'[^']*'|[a-zA-Z0-9_]+(?:\s*:)?|[^\s"'{}[\]:,]+)/g;

  let html = '';
  let match;
  while ((match = tokenRegex.exec(lineText)) !== null) {
    const token = match[0];
    const trimmed = token.trim();

    if (!trimmed) {
      html += escapeHtmlText(token);
      continue;
    }

    if (/^[{}[\]:,]$/.test(token)) {
      html += `<span class="token-punct">${escapeHtmlText(token)}</span>`;
      continue;
    }

    if (token.endsWith(':')) {
      const colonIdx = token.lastIndexOf(':');
      const keyPart = token.slice(0, colonIdx);
      html += `<span class="token-key">${escapeHtmlText(keyPart)}</span><span class="token-punct">:</span>`;
      continue;
    }

    if (token.startsWith('"') && token.endsWith('"') && token.length >= 2) {
      html += `<span class="token-string">${escapeHtmlText(token)}</span>`;
      continue;
    }

    if (/^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(token)) {
      html += `<span class="token-number">${escapeHtmlText(token)}</span>`;
      continue;
    }

    if (token === 'true' || token === 'false') {
      html += `<span class="token-bool">${escapeHtmlText(token)}</span>`;
      continue;
    }

    if (token === 'null') {
      html += `<span class="token-null">${escapeHtmlText(token)}</span>`;
      continue;
    }

    html += `<span class="token-plain">${escapeHtmlText(token)}</span>`;
  }

  return html || '&nbsp;';
}

export function renderCodeEditor(animated = true) {
  const step = stepsData[currentStepIndex];
  const codeCanvas = document.getElementById('code-canvas');
  if (!codeCanvas) return;

  const lines = step.rawJson.split('\n');
  stopJsonTyping();
  const isDarkMode = getIsDarkMode();
  const gutterClass = isDarkMode
    ? 'text-[#585b70] border-r border-[#313244]'
    : 'text-slate-400 border-r border-slate-300 font-semibold';

  if (!animated) {
    codeCanvas.innerHTML = lines
      .map((line, i) => {
        const lineNum = i + 1;
        const isActive = step.highlightLines.includes(lineNum);
        return `
          <div class="${gutterClass} select-none text-right font-mono pr-2.5 text-xs leading-6">${lineNum}</div>
          <div class="pl-2 font-mono text-xs leading-6 ${isActive ? 'highlight-active-row rounded font-medium' : ''}">
            ${colorizeJsonLine(line) || '&nbsp;'}
          </div>
        `;
      })
      .join('');
    document.getElementById('char-count').innerText = `Tamanho: ${step.rawJson.length} caracteres`;
    return;
  }

  codeCanvas.innerHTML = '';
  let currentLineIndex = 0;
  let currentCharIndex = 0;

  function typeChar() {
    if (currentLineIndex >= lines.length) {
      renderCodeEditor(false);
      playTone('G5');
      return;
    }

    const targetLine = lines[currentLineIndex];
    if (currentCharIndex < targetLine.length) {
      currentCharIndex++;
      if (currentCharIndex % 3 === 0) playTone('A4');
    } else {
      currentLineIndex++;
      currentCharIndex = 0;
    }

    let htmlBuffer = '';
    for (let i = 0; i <= currentLineIndex && i < lines.length; i++) {
      const lineNum = i + 1;
      const isActive = step.highlightLines.includes(lineNum);
      const isCurrentActiveLine = i === currentLineIndex;

      let lineContent = '';
      if (i < currentLineIndex) {
        lineContent = colorizeJsonLine(lines[i]) || '&nbsp;';
      } else {
        const partialRaw = targetLine.substring(0, currentCharIndex);
        lineContent = escapeHtmlText(partialRaw) || '&nbsp;';
        if (isCurrentActiveLine) {
          lineContent += '<span class="typing-cursor"></span>';
        }
      }

      htmlBuffer += `
        <div class="${gutterClass} select-none text-right font-mono pr-2.5 text-xs leading-6">${lineNum}</div>
        <div class="pl-2 font-mono text-xs leading-6 ${isActive ? 'highlight-active-row rounded' : ''}">
          ${lineContent}
        </div>
      `;
    }

    codeCanvas.innerHTML = htmlBuffer;
    const totalCharsTyped = lines.slice(0, currentLineIndex).join('\n').length + currentCharIndex;
    document.getElementById('char-count').innerText = `Construindo: ${totalCharsTyped} caracteres`;
    typingTimeout = setTimeout(typeChar, 16);
  }
  typeChar();
}

export function renderTree() {
  const step = stepsData[currentStepIndex];
  const treeCanvas = document.getElementById('tree-canvas');
  if (!treeCanvas) return;

  const isDarkMode = getIsDarkMode();

  function buildTreeNode(node, depth = 0) {
    const indentClass =
      depth === 0
        ? ''
        : depth === 1
          ? 'ml-4 sm:ml-5 pl-3 border-l-2 border-indigo-400 dark:border-indigo-500/30'
          : 'ml-6 sm:ml-8 pl-3 border-l-2 border-pink-400 dark:border-pink-500/30';

    if (node.type === 'object' && depth === 0) {
      let inner = `
        <div class="bg-slate-100 dark:bg-[#181825] border border-slate-200 dark:border-[#313244] p-2.5 rounded-xl flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white shadow-sm">
          <span class="flex items-center gap-2">
            <i class="fa-solid fa-cube text-indigo-600 dark:text-amber-400"></i> ${node.name}
          </span>
          <span class="text-[10px] font-mono bg-white dark:bg-[#313244] border border-slate-200 dark:border-transparent px-2 py-0.5 rounded text-indigo-700 dark:text-amber-300 font-bold">${node.badge}</span>
        </div>
      `;
      if (node.children && node.children.length > 0) {
        inner +=
          `<div class="mt-2 space-y-2">` +
          node.children.map((child) => buildTreeNode(child, depth + 1)).join('') +
          `</div>`;
      } else {
        inner += `<div class="mt-2 text-[11px] text-slate-400 dark:text-[#6c7086] italic pl-2">Objeto vazio aguardando propriedades...</div>`;
      }
      return inner;
    }

    if (node.type === 'array') {
      return `
        <div class="${indentClass} tree-node-item">
          <div class="bg-slate-100 dark:bg-[#181825] p-2 rounded-lg border border-slate-200 dark:border-[#313244] flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-blue-800 dark:text-amber-300 font-bold">"${node.key}":</span>
              <span class="text-rose-700 dark:text-pink-400 font-mono font-semibold">Array [ ]</span>
            </div>
            <span class="text-[10px] bg-rose-100 text-rose-800 dark:bg-pink-500/20 dark:text-pink-300 px-2 py-0.5 rounded font-mono font-bold">${node.badge}</span>
          </div>
          <div class="mt-1 space-y-1">${node.children.map((c) => buildTreeNode(c, depth + 1)).join('')}</div>
        </div>
      `;
    }

    if (node.type === 'object' && depth > 0) {
      return `
        <div class="${indentClass} tree-node-item">
          <div class="bg-slate-100 dark:bg-[#181825] p-2 rounded-lg border border-slate-200 dark:border-[#313244] flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-blue-800 dark:text-amber-300 font-bold">"${node.key}":</span>
              <span class="text-amber-700 dark:text-amber-400 font-mono font-semibold">Objeto { }</span>
            </div>
            <span class="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 px-2 py-0.5 rounded font-mono font-bold">${node.badge}</span>
          </div>
          <div class="mt-1 space-y-1">${node.children.map((c) => buildTreeNode(c, depth + 1)).join('')}</div>
        </div>
      `;
    }

    let valColor = isDarkMode ? 'text-[#a6e3a1]' : 'text-[#116329]';
    if (node.type === 'number') valColor = isDarkMode ? 'text-[#89b4fa]' : 'text-[#0969da]';
    if (node.type === 'boolean') valColor = isDarkMode ? 'text-[#cba6f7]' : 'text-[#b35900]';

    return `
      <div class="${indentClass} tree-node-item bg-slate-50 hover:bg-slate-100 dark:bg-[#181825]/60 dark:hover:bg-[#181825] p-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-[#313244] flex items-center justify-between text-xs gap-2">
        <span class="font-mono text-slate-800 dark:text-amber-200 font-bold">${node.key}:</span>
        <div class="flex items-center gap-2">
          <span class="font-mono font-bold ${valColor}">${node.value}</span>
          <span class="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#313244] text-slate-700 dark:text-[#a6adc8] font-bold">${node.type}</span>
        </div>
      </div>
    `;
  }

  treeCanvas.innerHTML = buildTreeNode(step.treeData, 0);
  document.getElementById('tree-depth').innerText =
    currentStepIndex >= 4 ? '3' : currentStepIndex >= 3 ? '2' : '1';
}

export function updateAllViews(animated = true) {
  renderStepper();
  renderLesson();
  renderCodeEditor(animated);
  renderTree();
}

export function nextStep() {
  if (currentStepIndex < stepsData.length - 1) {
    currentStepIndex++;
    playTone('C5');
    updateAllViews(true);
  } else {
    showToast('Você concluiu todas as etapas guiadas de JSON!');
    playTone('C6');
  }
}

export function prevStep() {
  if (currentStepIndex > 0) {
    currentStepIndex--;
    playTone('G4');
    updateAllViews(false);
  }
}

export function goToStep(idx) {
  if (idx !== currentStepIndex && idx >= 0 && idx < stepsData.length) {
    currentStepIndex = idx;
    playTone('D5');
    updateAllViews(true);
  }
}

export function replayTyping() {
  playTone('F5');
  renderCodeEditor(true);
}

export function triggerTrap(trapKey) {
  stopJsonTyping();
  const trap = traps[trapKey];
  if (!trap) return;

  playTone('C3');
  const box = document.getElementById('trap-feedback-box');
  box.classList.remove('hidden');
  document.getElementById('trap-error-title').innerText = trap.title;
  document.getElementById('trap-error-desc').innerText = trap.errorDesc;
  document.getElementById('trap-fix-text').innerText = trap.fix;
  updateSyntaxBadge(false);

  const lines = trap.rawCode.split('\n');
  const codeCanvas = document.getElementById('code-canvas');
  const isDarkMode = getIsDarkMode();
  const gutterClass = isDarkMode
    ? 'text-[#585b70] border-r border-[#313244]'
    : 'text-slate-400 border-r border-slate-300';

  codeCanvas.innerHTML = lines
    .map((line, i) => {
      const lineNum = i + 1;
      const isErrorLine = lineNum === trap.highlightLine;
      const errBg = isDarkMode
        ? 'bg-red-500/20 border-l-4 border-red-500 text-red-200'
        : 'bg-rose-100 border-l-4 border-rose-600 text-rose-900 font-semibold';
      return `
        <div class="${gutterClass} select-none text-right font-mono pr-2.5 text-xs leading-6">${lineNum}</div>
        <div class="pl-2 font-mono text-xs leading-6 ${isErrorLine ? errBg : ''}">${colorizeJsonLine(line)}</div>
      `;
    })
    .join('');

  document.getElementById('char-count').innerText = 'Status: SINTAXE INVÁLIDA';
  showToast('Sintaxe corrompida para estudo didático!');
}

export function restoreCleanCode() {
  playTone('E5');
  document.getElementById('trap-feedback-box').classList.add('hidden');
  updateSyntaxBadge(true);
  renderCodeEditor(false);
  showToast('JSON original restaurado com sucesso!');
}

export function updateSyntaxBadge(isValid) {
  const badge = document.getElementById('syntax-status-badge');
  if (!badge) return;
  const isDarkMode = getIsDarkMode();
  if (isValid) {
    badge.className = isDarkMode
      ? 'text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 font-bold'
      : 'text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 font-bold';
    badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Sintaxe Válida`;
  } else {
    badge.className = isDarkMode
      ? 'text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5 font-bold'
      : 'text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1.5 font-bold';
    badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span> Sintaxe Inválida`;
  }
}

export function copyCurrentCode() {
  const step = stepsData[currentStepIndex];
  copyTextToClipboard(step.rawJson, 'JSON copiado para a área de transferência!');
  playTone('A5');
}

export function loadValidatorPreset(key) {
  const text = validatorPresets[key];
  if (text) {
    document.getElementById('validator-input').value = text;
    document.getElementById('validator-file-name').innerText = `exemplo_${key}.json`;
    runValidation();
    playTone('D5');
  }
}

export function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('drop-zone').classList.add('drop-active');
}

export function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('drop-zone').classList.remove('drop-active');
}

export function handleFileDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('drop-zone').classList.remove('drop-active');
  const files = e.dataTransfer.files;
  if (files && files.length > 0) {
    processUploadedFile(files[0]);
  }
}

export function handleFileSelect(e) {
  const files = e.target.files;
  if (files && files.length > 0) {
    processUploadedFile(files[0]);
  }
}

export function processUploadedFile(file) {
  if (!file.name.endsWith('.json') && !file.type.includes('json') && !file.type.includes('text')) {
    showToast('Aviso: selecione preferencialmente arquivos com extensão .json');
  }
  document.getElementById('validator-file-name').innerText = file.name;
  const reader = new FileReader();
  reader.onload = function (evt) {
    const content = evt.target.result;
    document.getElementById('validator-input').value = content;
    runValidation();
    showToast(`Arquivo "${file.name}" carregado com sucesso!`);
    playTone('F5');
  };
  reader.readAsText(file, 'UTF-8');
}

export function clearValidatorEditor() {
  document.getElementById('validator-input').value = '';
  document.getElementById('validator-file-name').innerText = 'Editor em branco';
  runValidation();
  playTone('C4');
}

export function formatValidatorJSON() {
  const raw = document.getElementById('validator-input').value;
  if (!raw.trim()) return;
  try {
    const parsed = JSON.parse(raw);
    document.getElementById('validator-input').value = JSON.stringify(parsed, null, 2);
    runValidation();
    showToast('JSON formatado e indentado com sucesso!');
    playTone('A5');
  } catch {
    showToast('Não é possível formatar enquanto houver erros sintáticos!');
    playTone('C3');
  }
}

export function copyCurrentValidatorText() {
  const val = document.getElementById('validator-input').value;
  copyTextToClipboard(val, 'JSON copiado para a área de transferência!');
  playTone('A5');
}

export function analyzeJsonError(rawErr, text) {
  const errMsg = rawErr.message || '';
  const lines = text.split('\n');

  let targetLine = 1;
  let targetCol = 1;
  let category = 'SyntaxError';
  let headline = 'Falha Sintática no JSON';
  let explanation = '';
  let fixSuggestion = '';

  const lineMatch = errMsg.match(/line (\d+) column (\d+)/i);
  const posMatch = errMsg.match(/position (\d+)/i);

  if (lineMatch) {
    targetLine = parseInt(lineMatch[1], 10);
    targetCol = parseInt(lineMatch[2], 10);
  } else if (posMatch) {
    const pos = parseInt(posMatch[1], 10);
    let charAcc = 0;
    for (let i = 0; i < lines.length; i++) {
      if (charAcc + lines[i].length + 1 >= pos) {
        targetLine = i + 1;
        targetCol = Math.max(1, pos - charAcc);
        break;
      }
      charAcc += lines[i].length + 1;
    }
  }

  const currentLineText = lines[targetLine - 1] || '';
  const prevLineText = targetLine > 1 ? lines[targetLine - 2] : '';

  if (
    errMsg.includes("Unexpected token '}'") ||
    errMsg.includes("Unexpected token ']'") ||
    (/,\s*$/.test(prevLineText) && /^\s*[}\]]/.test(currentLineText))
  ) {
    headline = 'Vírgula Proibida no Final (Trailing Comma)';
    category = 'RFC 8259: Trailing Comma';
    explanation = `O <strong>padrão rigoroso JSON (RFC 8259) proíbe categoricamente vírgulas residuais</strong> antes de um fechamento <code>}</code> ou <code>]</code>.`;
    fixSuggestion = `Apague a vírgula <code>,</code> localizada no final da linha anterior ao fechamento do bloco.`;
  } else if (
    currentLineText.includes("'") ||
    errMsg.includes("Unexpected token '''") ||
    text.includes("'")
  ) {
    const sqIdx = lines.findIndex((l) => l.includes("'"));
    if (sqIdx !== -1) {
      targetLine = sqIdx + 1;
      targetCol = lines[sqIdx].indexOf("'") + 1;
    }
    headline = "Uso Inválido de Aspas Simples ' '";
    category = 'RFC 8259: Quotes Rule';
    explanation = `O padrão oficial JSON exige exclusivamente <strong>aspas duplas</strong> (<code>"</code>) para encapsular chaves e textos. O uso de aspas simples (<code>'</code>) quebra a leitura de qualquer interpretador padronizado.`;
    fixSuggestion = `Substitua todas as ocorrências de aspas simples <code>'texto'</code> por aspas duplas <code>"texto"</code>.`;
  } else if (
    errMsg.includes('Expected double-quoted property name') ||
    (/[a-zA-Z0-9_]+\s*:/.test(currentLineText) && !/"[a-zA-Z0-9_]+"\s*:/.test(currentLineText))
  ) {
    headline = 'Chave de Objeto sem Aspas Duplas';
    category = 'RFC 8259: Object Keys';
    explanation = `No JSON <strong>todas as chaves devem ser obrigatoriamente strings com aspas duplas</strong>.`;
    fixSuggestion = `Coloque aspas duplas na chave: mude de <code>chave:</code> para <code>"chave":</code>.`;
  } else if (
    errMsg.includes("Expected ':'") ||
    (/"\s+"/.test(currentLineText) && !currentLineText.includes(':'))
  ) {
    headline = 'Dois-pontos Separador Ausente';
    category = 'RFC 8259: Key-Value Separator';
    explanation = `Um par em um objeto JSON é sempre formado por <code>"chave" : valor</code>. O analisador encontrou a chave mas não achou os dois-pontos.`;
    fixSuggestion = `Adicione o caractere de dois-pontos <code>:</code> entre a chave e o valor correspondente.`;
  } else if (errMsg.includes('Unexpected end of JSON input')) {
    headline = 'Arquivo Incompleto ou Bloco Não Fechado';
    category = 'RFC 8259: Unclosed Scope';
    explanation = `O arquivo terminou inesperadamente antes que todas as chaves <code>{ }</code> ou colchetes <code>[ ]</code> abertos fossem devidamente fechados.`;
    fixSuggestion = `Verifique se o final do arquivo contém a chave <code>}</code> ou colchete <code>]</code> de encerramento da estrutura raiz.`;
  } else {
    headline = 'Erro de Sintaxe no Arquivo';
    explanation = `O interpretador encontrou um caractere inesperado segundo a especificação formal: <em>"${escapeHtmlText(errMsg)}"</em>.`;
    fixSuggestion = `Revise os caracteres ao redor do cursor indicado abaixo, conferindo se todos os pares possuem aspas duplas, vírgulas corretas e delimitadores balanceados.`;
  }

  const displayLine = lines[targetLine - 1] || currentLineText || '';
  const safeLine = escapeHtmlText(displayLine);
  const pointerSpaces = ' '.repeat(Math.max(0, targetCol - 1));

  const previewHtml = `
    <div class="text-slate-400 select-none">// Linha ${targetLine}:</div>
    <div class="text-white">${safeLine || '&nbsp;'}</div>
    <div class="text-rose-400 font-bold">${pointerSpaces}^ [Caractere causador por volta da coluna ${targetCol}]</div>
  `;

  return {
    line: targetLine,
    col: targetCol,
    category,
    headline,
    explanation,
    fixSuggestion,
    previewHtml,
  };
}

export function computeMetrics(obj) {
  let keyCount = 0;
  let maxDepth = 0;
  let strings = 0;
  let numbers = 0;
  let booleans = 0;
  let nulls = 0;

  function traverse(val, depth) {
    if (depth > maxDepth) maxDepth = depth;
    if (val === null) {
      nulls++;
    } else if (typeof val === 'string') {
      strings++;
    } else if (typeof val === 'number') {
      numbers++;
    } else if (typeof val === 'boolean') {
      booleans++;
    } else if (Array.isArray(val)) {
      val.forEach((item) => traverse(item, depth + 1));
    } else if (typeof val === 'object') {
      const keys = Object.keys(val);
      keyCount += keys.length;
      keys.forEach((k) => traverse(val[k], depth + 1));
    }
  }

  traverse(obj, 1);

  const rootLabel = Array.isArray(obj)
    ? `Array [ ${obj.length} ]`
    : obj && typeof obj === 'object'
      ? `Object { ${Object.keys(obj).length} }`
      : typeof obj;

  const elKeys = document.getElementById('metric-keys');
  if (elKeys) {
    elKeys.innerText = keyCount;
    document.getElementById('metric-depth').innerText = maxDepth;
    document.getElementById('metric-root').innerText = rootLabel;
    document.getElementById('metric-strings').innerText = strings;
    document.getElementById('metric-numbers').innerText = numbers;
    document.getElementById('metric-bools').innerText = `${booleans} (${nulls} nulls)`;
  }

  return { keyCount, maxDepth, rootLabel, strings, numbers, booleans, nulls };
}

export function renderValidatorTreePreview(obj) {
  const container = document.getElementById('validator-tree-preview');
  if (!container) return;

  function buildSummary(val, indent = '') {
    if (val === null) return `<span class="text-purple-600 dark:text-purple-400">null</span>`;
    if (typeof val === 'string')
      return `<span class="text-emerald-700 dark:text-emerald-400 font-semibold">"${escapeHtmlText(val.length > 28 ? val.substring(0, 28) + '...' : val)}"</span>`;
    if (typeof val === 'number')
      return `<span class="text-sky-700 dark:text-sky-400 font-bold">${val}</span>`;
    if (typeof val === 'boolean')
      return `<span class="text-amber-700 dark:text-amber-400 font-bold">${val}</span>`;

    if (Array.isArray(val)) {
      if (val.length === 0)
        return `<span class="text-rose-600 dark:text-pink-400 font-bold">[ ]</span>`;
      let out = `<span class="text-rose-600 dark:text-pink-400 font-bold">[</span>\n`;
      val.slice(0, 4).forEach((item, idx) => {
        out += `${indent}  <span class="text-slate-400">[${idx}]</span> ${buildSummary(item, indent + '  ')}\n`;
      });
      if (val.length > 4)
        out += `${indent}  <span class="text-slate-400">... (+${val.length - 4} itens)</span>\n`;
      out += `${indent}<span class="text-rose-600 dark:text-pink-400 font-bold">]</span>`;
      return out;
    }

    if (typeof val === 'object') {
      const keys = Object.keys(val);
      if (keys.length === 0)
        return `<span class="text-amber-600 dark:text-amber-400 font-bold">{ }</span>`;
      let out = `<span class="text-amber-600 dark:text-amber-400 font-bold">{</span>\n`;
      keys.slice(0, 6).forEach((k) => {
        out += `${indent}  <span class="text-blue-700 dark:text-yellow-300 font-bold">"${escapeHtmlText(k)}"</span>: ${buildSummary(val[k], indent + '  ')}\n`;
      });
      if (keys.length > 6)
        out += `${indent}  <span class="text-slate-400">... (+${keys.length - 6} chaves)</span>\n`;
      out += `${indent}<span class="text-amber-600 dark:text-amber-400 font-bold">}</span>`;
      return out;
    }
    return escapeHtmlText(String(val));
  }

  container.innerHTML = `<pre class="whitespace-pre">${buildSummary(obj)}</pre>`;
}

export function runValidation() {
  const inputEl = document.getElementById('validator-input');
  if (!inputEl) return;
  const text = inputEl.value;
  const statsText = document.getElementById('validator-stats-text');
  const linesCount = text ? text.split('\n').length : 0;
  const bytesCount = new Blob([text]).size;
  statsText.innerText = `${linesCount} linhas • ${bytesCount} bytes`;

  const statusTitle = document.getElementById('validator-status-title');
  const statusSubtitle = document.getElementById('validator-status-subtitle');
  const badgeIcon = document.getElementById('validator-badge-icon');
  const errSection = document.getElementById('validator-error-section');
  const succSection = document.getElementById('validator-success-section');

  if (!text.trim()) {
    statusTitle.innerText = 'Aguardando conteúdo para validação';
    statusSubtitle.innerText = 'Insira um código ou envie um arquivo para iniciar a auditoria';
    badgeIcon.className =
      'w-10 h-10 rounded-xl bg-slate-200 text-slate-600 dark:bg-[#313244] dark:text-[#a6adc8] flex items-center justify-center text-lg';
    badgeIcon.innerHTML = `<i class="fa-solid fa-circle-question"></i>`;
    errSection.classList.add('hidden');
    succSection.classList.add('hidden');
    return;
  }

  try {
    const parsed = JSON.parse(text);
    statusTitle.innerText = 'JSON Válido e Aprovado na Auditoria';
    statusSubtitle.innerText = 'A sintaxe está perfeitamente alinhada com as normas RFC 8259';
    badgeIcon.className =
      'w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 flex items-center justify-center text-lg';
    badgeIcon.innerHTML = `<i class="fa-solid fa-circle-check"></i>`;

    errSection.classList.add('hidden');
    succSection.classList.remove('hidden');

    computeMetrics(parsed);
    renderValidatorTreePreview(parsed);
  } catch (err) {
    const diagnostic = analyzeJsonError(err, text);

    statusTitle.innerText = diagnostic.headline;
    statusSubtitle.innerText = 'Detectada violação de sintaxe segundo o padrão RFC 8259';
    badgeIcon.className =
      'w-10 h-10 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 flex items-center justify-center text-lg';
    badgeIcon.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i>`;

    succSection.classList.add('hidden');
    errSection.classList.remove('hidden');

    document.getElementById('error-loc-line').innerText = diagnostic.line;
    document.getElementById('error-loc-col').innerText = diagnostic.col;
    document.getElementById('error-category-badge').innerText = diagnostic.category;
    document.getElementById('error-code-preview').innerHTML = diagnostic.previewHtml;
    document.getElementById('error-didactic-why').innerHTML = diagnostic.explanation;
    document.getElementById('error-didactic-fix').innerHTML = diagnostic.fixSuggestion;

    playTone('C3');
  }
}

export function refreshJsonTheme() {
  renderLesson();
  renderCodeEditor(false);
  renderTree();
  runValidation();
}

export function getJsonModuleHtml() {
  return `
  <div id="module-json" class="hidden flex-1 flex flex-col">
    <!-- Barra Interna de Abas do Módulo JSON -->
    <div class="bg-white/80 dark:bg-[#181825]/80 border-b border-slate-200 dark:border-[#313244] px-4 lg:px-8 py-2.5">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <span class="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-sm">{ }</span>
          <div>
            <h2 class="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">Módulo 3: Desvendando o JSON</h2>
            <p class="text-[11px] text-slate-500 dark:text-[#a6adc8]">Objetos, Arrays, Pares Chave-Valor e Validação Formal RFC 8259</p>
          </div>
        </div>
        <div class="flex items-center bg-slate-100 dark:bg-[#11111b] p-1 rounded-xl border border-slate-200 dark:border-[#313244]">
          <button id="tab-btn-builder" onclick="switchMainTab('builder')" class="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm bg-white text-indigo-700 dark:bg-[#313244] dark:text-white border border-slate-200 dark:border-transparent">
            <i class="fa-solid fa-wand-magic-sparkles text-indigo-600 dark:text-amber-400"></i>
            <span>1. Construtor Guiado</span>
          </button>
          <button id="tab-btn-validator" onclick="switchMainTab('validator')" class="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-[#a6adc8] hover:text-slate-900 dark:hover:text-white transition">
            <i class="fa-solid fa-file-circle-check text-emerald-600 dark:text-emerald-400"></i>
            <span>2. Validador de Arquivos</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ABA 1: CONSTRUTOR GUIADO & ANIMAÇÃO DE SINTAXE -->
    <div id="view-builder" class="flex-1 flex flex-col">
      <nav class="bg-slate-100/80 dark:bg-[#181825] border-b border-slate-200 dark:border-[#313244] px-4 py-2.5 overflow-x-auto no-scrollbar">
        <div class="max-w-7xl mx-auto flex items-center justify-between min-w-[680px] gap-2">
          <div id="stepper-container" class="flex items-center gap-2.5 w-full justify-between"></div>
        </div>
      </nav>

      <main class="max-w-7xl mx-auto w-full flex-1 p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section class="lg:col-span-5 flex flex-col gap-5">
          <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-5 shadow-md dark:shadow-xl relative overflow-hidden">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#313244] mb-4">
              <div class="flex items-center gap-2">
                <span id="badge-step-number" class="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 font-mono">
                  PASSO 1 DE 6
                </span>
                <span id="step-category" class="text-xs font-semibold text-slate-500 dark:text-[#a6adc8]">Fundamentos</span>
              </div>
              <span id="step-icon-container" class="text-indigo-600 dark:text-amber-400 text-lg">
                <i class="fa-solid fa-cube"></i>
              </span>
            </div>

            <h2 id="step-title" class="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-snug">
              O Objeto Vazio e o Escopo { }
            </h2>

            <p id="step-description" class="text-sm text-slate-600 dark:text-[#bac2de] leading-relaxed mb-4">
              O JSON sempre começa e termina delimitando um escopo principal.
            </p>

            <div id="step-rule-box" class="p-3.5 rounded-xl bg-amber-50/80 border-l-4 border-amber-500 dark:bg-[#181825] dark:border-amber-400 flex items-start gap-3 mb-5">
              <i class="fa-solid fa-lightbulb text-amber-600 dark:text-amber-400 mt-0.5 text-base"></i>
              <div class="text-xs space-y-1">
                <strong class="text-amber-900 dark:text-amber-300 block font-bold">Regra Fundamental:</strong>
                <span id="step-rule-text" class="text-slate-700 dark:text-[#a6adc8] font-medium leading-normal">
                  Tudo o que pertence a este objeto existirá internamente entre as chaves.
                </span>
              </div>
            </div>

            <div class="space-y-2 mb-5">
              <h3 class="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-[#a6adc8] flex items-center gap-1.5">
                <i class="fa-solid fa-microscope text-indigo-600 dark:text-indigo-400"></i> Anatomia dos Elementos Envolvidos
              </h3>
              <div id="step-tokens-container" class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs"></div>
            </div>

            <div class="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-[#313244]">
              <button id="btn-prev" onclick="prevStep()" class="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#313244] dark:hover:bg-[#45475a] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-700 dark:text-white flex items-center justify-center gap-2 transition shadow-sm border border-slate-200 dark:border-transparent">
                <i class="fa-solid fa-arrow-left"></i> Voltar
              </button>
              <button id="btn-play-step" onclick="replayTyping()" title="Repetir Animação de Digitação" class="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#313244] dark:hover:bg-[#45475a] text-slate-700 dark:text-amber-300 transition border border-slate-200 dark:border-transparent">
                <i class="fa-solid fa-rotate-right"></i>
              </button>
              <button id="btn-next" onclick="nextStep()" class="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-indigo-500 dark:hover:from-indigo-500 dark:hover:to-indigo-400 text-xs font-bold text-white flex items-center justify-center gap-2 transition shadow-md shadow-indigo-600/20">
                <span>Avançar</span> <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <!-- Laboratório de Erro -->
          <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-5 shadow-md dark:shadow-xl">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-rose-100 dark:bg-red-500/20 text-rose-600 dark:text-red-400 flex items-center justify-center text-xs">
                  <i class="fa-solid fa-bug"></i>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-slate-900 dark:text-white">Laboratório do Erro Sintático</h3>
                  <p class="text-[11px] text-slate-500 dark:text-[#a6adc8]">Simule armadilhas com 1 clique</p>
                </div>
              </div>
              <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-red-500/10 dark:text-red-400 border border-rose-200 dark:border-red-500/20 font-bold">
                Interativo
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <button onclick="triggerTrap('no_quotes')" class="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-[#181825] dark:hover:bg-red-500/10 border border-slate-200 hover:border-rose-400 dark:border-[#313244] dark:hover:border-red-500/40 text-xs transition group">
                <div class="font-bold text-slate-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-red-300 flex items-center justify-between">
                  <span>1. Chave sem Aspas</span>
                  <i class="fa-solid fa-triangle-exclamation text-xs text-rose-500 opacity-0 group-hover:opacity-100"></i>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-[#a6adc8] mt-0.5 font-mono"><code>{ nome: "Ana" }</code></p>
              </button>
              <button onclick="triggerTrap('single_quotes')" class="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-[#181825] dark:hover:bg-red-500/10 border border-slate-200 hover:border-rose-400 dark:border-[#313244] dark:hover:border-red-500/40 text-xs transition group">
                <div class="font-bold text-slate-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-red-300 flex items-center justify-between">
                  <span>2. Aspas Simples ' '</span>
                  <i class="fa-solid fa-triangle-exclamation text-xs text-rose-500 opacity-0 group-hover:opacity-100"></i>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-[#a6adc8] mt-0.5 font-mono"><code>{'status': 'ok'}</code></p>
              </button>
              <button onclick="triggerTrap('trailing_comma')" class="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-[#181825] dark:hover:bg-red-500/10 border border-slate-200 hover:border-rose-400 dark:border-[#313244] dark:hover:border-red-500/40 text-xs transition group">
                <div class="font-bold text-slate-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-red-300 flex items-center justify-between">
                  <span>3. Vírgula no Final</span>
                  <i class="fa-solid fa-triangle-exclamation text-xs text-rose-500 opacity-0 group-hover:opacity-100"></i>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-[#a6adc8] mt-0.5 font-mono"><code>[1, 2, 3, ]</code></p>
              </button>
              <button onclick="triggerTrap('bracket_confusion')" class="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-[#181825] dark:hover:bg-red-500/10 border border-slate-200 hover:border-rose-400 dark:border-[#313244] dark:hover:border-red-500/40 text-xs transition group">
                <div class="font-bold text-slate-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-red-300 flex items-center justify-between">
                  <span>4. [ ] no lugar de { }</span>
                  <i class="fa-solid fa-triangle-exclamation text-xs text-rose-500 opacity-0 group-hover:opacity-100"></i>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-[#a6adc8] mt-0.5 font-mono"><code>["id": 10]</code></p>
              </button>
            </div>

            <div id="trap-feedback-box" class="hidden p-3.5 rounded-xl bg-rose-50 border border-rose-200 dark:bg-[#181825] dark:border-red-500/30 transition-all">
              <div class="flex items-start gap-2.5">
                <i class="fa-solid fa-circle-xmark text-rose-600 dark:text-red-400 text-base mt-0.5"></i>
                <div class="text-xs space-y-1 flex-1">
                  <span id="trap-error-title" class="font-bold text-rose-900 dark:text-red-300 block">Erro de Análise:</span>
                  <p id="trap-error-desc" class="text-rose-800 dark:text-[#bac2de] font-mono text-[11px] bg-rose-100/70 dark:bg-red-950/40 p-2 rounded border border-rose-200 dark:border-red-900/50 my-1"></p>
                  <div class="mt-2 text-slate-700 dark:text-[#a6adc8]">
                    <strong class="text-emerald-700 dark:text-emerald-400 font-bold">Como corrigir:</strong>
                    <span id="trap-fix-text"></span>
                  </div>
                </div>
              </div>
              <button onclick="restoreCleanCode()" class="mt-3 w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600/30 text-white dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm">
                <i class="fa-solid fa-wand-magic-sparkles"></i> Restaurar JSON Válido
              </button>
            </div>
          </div>
        </section>

        <!-- Coluna Direita: Editor de Código & Árvore -->
        <section class="lg:col-span-7 flex flex-col gap-5">
          <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl shadow-lg dark:shadow-2xl overflow-hidden flex flex-col">
            <div class="bg-slate-100 dark:bg-[#181825] px-4 py-2.5 border-b border-slate-200 dark:border-[#313244] flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-rose-400 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
                <span class="ml-2 font-mono text-xs text-slate-700 dark:text-[#a6adc8] flex items-center gap-1.5 font-bold">
                  <i class="fa-solid fa-file-code text-amber-500"></i> estudante.json
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span id="syntax-status-badge" class="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30 flex items-center gap-1.5 font-bold">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Sintaxe Válida
                </span>
                <button onclick="copyCurrentCode()" title="Copiar JSON" class="p-1.5 text-xs text-slate-600 hover:text-slate-900 dark:text-[#a6adc8] dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-[#313244] transition">
                  <i class="fa-regular fa-copy"></i>
                </button>
              </div>
            </div>

            <div class="p-4 bg-slate-50/70 dark:bg-[#1e1e2e] font-mono text-sm leading-relaxed overflow-x-auto min-h-[290px]">
              <div id="code-canvas" class="grid grid-cols-[38px_1fr] gap-3 min-w-[300px]"></div>
            </div>

            <div class="bg-slate-100 dark:bg-[#181825] px-4 py-2 border-t border-slate-200 dark:border-[#313244] flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-[#a6adc8] gap-2">
              <div class="flex items-center gap-3">
                <span><strong class="text-slate-900 dark:text-white">Formato:</strong> JSON (RFC 8259)</span>
                <span><strong class="text-slate-900 dark:text-white">Codificação:</strong> UTF-8</span>
              </div>
              <span id="char-count" class="font-mono font-medium">Tamanho: 0 caracteres</span>
            </div>
          </div>

          <!-- Árvore Estrutural -->
          <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-5 shadow-md dark:shadow-xl">
            <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-[#313244]">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 flex items-center justify-center text-xs">
                  <i class="fa-solid fa-sitemap"></i>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-slate-900 dark:text-white">Árvore Estrutural do Objeto (Hierarquia em Memória)</h3>
                  <p class="text-[11px] text-slate-500 dark:text-[#a6adc8]">Como o interpretador organiza as chaves e valores</p>
                </div>
              </div>
              <span class="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 dark:text-indigo-300 dark:bg-indigo-900/30 dark:border-indigo-700/40 px-2 py-0.5 rounded">
                Profundidade: <span id="tree-depth">1</span>
              </span>
            </div>
            <div id="tree-canvas" class="space-y-2 font-mono text-xs overflow-x-auto p-2"></div>
          </div>
        </section>
      </main>
    </div>

    <!-- ABA 2: VALIDADOR & AUDITOR DIDÁTICO DE ARQUIVOS JSON -->
    <div id="view-validator" class="hidden flex-1 flex flex-col p-4 lg:p-6 max-w-7xl mx-auto w-full gap-6">
      <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="p-2 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 text-sm">
              <i class="fa-solid fa-file-shield"></i>
            </span>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Auditor e Validador Didático de JSON</h2>
          </div>
          <p class="text-xs text-slate-600 dark:text-[#a6adc8] mt-1 max-w-3xl">
            Envie um arquivo <code>.json</code> ou cole qualquer código textual abaixo. Se o JSON tiver falhas, nosso motor didático aponta a linha, coluna, o caractere causador e o motivo formal segundo a <strong>RFC 8259</strong>. Se for válido, você recebe uma auditoria completa de métricas e tipos.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2 shrink-0">
          <span class="text-xs font-semibold text-slate-500 dark:text-[#a6adc8]">Carregar Exemplo:</span>
          <button onclick="loadValidatorPreset('valid')" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30 transition">
            <i class="fa-solid fa-check"></i> Válido
          </button>
          <button onclick="loadValidatorPreset('err_comma')" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30 transition">
            <i class="fa-solid fa-bug"></i> Trailing Comma
          </button>
          <button onclick="loadValidatorPreset('err_quote')" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30 transition">
            <i class="fa-solid fa-quote-left"></i> Aspas Simples
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-6 flex flex-col gap-4">
          <div id="drop-zone" ondragover="handleDragOver(event)" ondragleave="handleDragLeave(event)" ondrop="handleFileDrop(event)"
            class="border-2 border-dashed border-slate-300 hover:border-indigo-500 dark:border-[#313244] dark:hover:border-indigo-400 bg-white dark:bg-[#181825] rounded-2xl p-5 text-center cursor-pointer transition shadow-sm flex flex-col items-center justify-center gap-2 group">
            <input type="file" id="file-input" accept=".json,application/json,text/plain" onchange="handleFileSelect(event)" class="hidden">
            <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 flex items-center justify-center text-xl group-hover:scale-110 transition">
              <i class="fa-solid fa-cloud-arrow-up"></i>
            </div>
            <div>
              <p class="text-sm font-bold text-slate-800 dark:text-white">
                Arraste e solte seu arquivo <span class="text-indigo-600 dark:text-indigo-400">.json</span> aqui
              </p>
              <p class="text-xs text-slate-500 dark:text-[#a6adc8] mt-0.5">ou clique para selecionar do seu dispositivo</p>
            </div>
            <button type="button" onclick="document.getElementById('file-input').click()" class="mt-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#313244] dark:hover:bg-[#45475a] text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-transparent">
              Escolher Arquivo do Computador
            </button>
          </div>

          <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl overflow-hidden shadow-md flex flex-col">
            <div class="bg-slate-100 dark:bg-[#181825] px-4 py-2.5 border-b border-slate-200 dark:border-[#313244] flex items-center justify-between">
              <span class="text-xs font-bold text-slate-700 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-code text-indigo-600 dark:text-amber-400"></i> Entrada de Código / Editor Direto
              </span>
              <div class="flex items-center gap-1">
                <button onclick="formatValidatorJSON()" title="Formatar / Indentar (Prettify)" class="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-200 hover:bg-slate-300 dark:bg-[#313244] dark:hover:bg-[#45475a] text-slate-700 dark:text-slate-200 transition">
                  <i class="fa-solid fa-wand-magic-sparkles text-amber-500"></i> Formatar
                </button>
                <button onclick="clearValidatorEditor()" title="Limpar editor" class="px-2.5 py-1 rounded-md text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition">
                  <i class="fa-solid fa-trash-can"></i> Limpar
                </button>
              </div>
            </div>

            <div class="relative p-3 bg-slate-50/50 dark:bg-[#1e1e2e]">
              <textarea id="validator-input" rows="14" spellcheck="false" oninput="runValidation()" placeholder="Cole seu JSON aqui ou selecione um arquivo acima..."
                class="w-full bg-white dark:bg-[#11111b] text-slate-800 dark:text-[#cdd6f4] font-mono text-xs p-3 rounded-xl border border-slate-300 dark:border-[#313244] focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed resize-y"></textarea>
            </div>

            <div class="bg-slate-100 dark:bg-[#181825] px-4 py-2 border-t border-slate-200 dark:border-[#313244] flex items-center justify-between text-xs text-slate-600 dark:text-[#a6adc8]">
              <span id="validator-file-name" class="font-mono text-[11px] truncate max-w-[200px]">Nenhum arquivo carregado</span>
              <span id="validator-stats-text" class="font-mono text-[11px]">0 linhas • 0 bytes</span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-6 flex flex-col gap-4">
          <div id="validator-result-card" class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-5 shadow-md flex flex-col gap-4 transition-all">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div id="validator-badge-icon" class="w-10 h-10 rounded-xl bg-slate-200 text-slate-600 dark:bg-[#313244] dark:text-[#a6adc8] flex items-center justify-center text-lg">
                  <i class="fa-solid fa-circle-question"></i>
                </div>
                <div>
                  <h3 id="validator-status-title" class="text-base font-extrabold text-slate-900 dark:text-white">
                    Aguardando conteúdo para validação
                  </h3>
                  <p id="validator-status-subtitle" class="text-xs text-slate-500 dark:text-[#a6adc8]">
                    Insira um código ou envie um arquivo para iniciar a auditoria
                  </p>
                </div>
              </div>
              <span id="validator-time-badge" class="text-[10px] font-mono text-slate-400"></span>
            </div>

            <div id="validator-error-section" class="hidden flex flex-col gap-3">
              <div class="p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-500/30 flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    Localização Exata: Linha <span id="error-loc-line" class="font-mono text-sm underline font-black">0</span>, Coluna <span id="error-loc-col" class="font-mono text-sm underline font-black">0</span>
                  </span>
                  <span id="error-category-badge" class="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-900 dark:bg-rose-800/50 dark:text-rose-200">
                    SyntaxError
                  </span>
                </div>
                <div class="mt-1 font-mono text-xs bg-slate-900 text-rose-200 p-3 rounded-lg overflow-x-auto shadow-inner border border-rose-900/40">
                  <div id="error-code-preview" class="leading-relaxed"></div>
                </div>
              </div>

              <div class="p-4 rounded-xl bg-amber-50/80 border-l-4 border-amber-500 dark:bg-[#181825] dark:border-amber-400 space-y-2">
                <h4 class="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <i class="fa-solid fa-graduation-cap"></i> O que quebrou e Por Que é Inválido?
                </h4>
                <p id="error-didactic-why" class="text-xs text-slate-700 dark:text-[#bac2de] leading-relaxed"></p>
              </div>

              <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-500/30 space-y-2">
                <h4 class="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <i class="fa-solid fa-screwdriver-wrench"></i> Como Corrigir Este Ponto
                </h4>
                <div id="error-didactic-fix" class="text-xs text-slate-700 dark:text-[#a6adc8] leading-relaxed font-mono"></div>
              </div>
            </div>

            <div id="validator-success-section" class="hidden flex flex-col gap-4">
              <div class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30 flex items-center gap-3">
                <i class="fa-solid fa-shield-check text-emerald-600 dark:text-emerald-400 text-xl"></i>
                <div class="text-xs">
                  <strong class="text-emerald-900 dark:text-emerald-300 block font-bold">Arquivo 100% Válido!</strong>
                  <span class="text-emerald-800 dark:text-[#a6adc8]">Em perfeita conformidade com as normas ECMA-404 e RFC 8259.</span>
                </div>
              </div>

              <div>
                <h4 class="text-xs font-bold text-slate-500 dark:text-[#a6adc8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <i class="fa-solid fa-chart-pie text-indigo-600 dark:text-indigo-400"></i> Métricas & Auditoria de Tipos
                </h4>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div class="bg-slate-50 dark:bg-[#181825] p-3 rounded-xl border border-slate-200 dark:border-[#313244]">
                    <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">Total de Chaves</span>
                    <span id="metric-keys" class="text-base font-extrabold text-blue-700 dark:text-blue-400 font-mono">0</span>
                  </div>
                  <div class="bg-slate-50 dark:bg-[#181825] p-3 rounded-xl border border-slate-200 dark:border-[#313244]">
                    <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">Profundidade Máx.</span>
                    <span id="metric-depth" class="text-base font-extrabold text-indigo-700 dark:text-indigo-400 font-mono">0</span>
                  </div>
                  <div class="bg-slate-50 dark:bg-[#181825] p-3 rounded-xl border border-slate-200 dark:border-[#313244]">
                    <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">Estrutura Raiz</span>
                    <span id="metric-root" class="text-base font-extrabold text-amber-700 dark:text-amber-400 font-mono">Object { }</span>
                  </div>
                  <div class="bg-slate-50 dark:bg-[#181825] p-3 rounded-xl border border-slate-200 dark:border-[#313244]">
                    <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">Strings (Textos)</span>
                    <span id="metric-strings" class="text-base font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">0</span>
                  </div>
                  <div class="bg-slate-50 dark:bg-[#181825] p-3 rounded-xl border border-slate-200 dark:border-[#313244]">
                    <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">Números</span>
                    <span id="metric-numbers" class="text-base font-extrabold text-sky-700 dark:text-sky-400 font-mono">0</span>
                  </div>
                  <div class="bg-slate-50 dark:bg-[#181825] p-3 rounded-xl border border-slate-200 dark:border-[#313244]">
                    <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">Booleanos / Nulos</span>
                    <span id="metric-bools" class="text-base font-extrabold text-purple-700 dark:text-purple-400 font-mono">0</span>
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <h4 class="text-xs font-bold text-slate-500 dark:text-[#a6adc8] uppercase tracking-wider flex items-center justify-between">
                  <span><i class="fa-solid fa-list-check text-indigo-600 dark:text-indigo-400"></i> Visualização Estrutural do Esquema</span>
                  <button onclick="copyCurrentValidatorText()" class="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    <i class="fa-regular fa-copy"></i> Copiar Formatado
                  </button>
                </h4>
                <div id="validator-tree-preview" class="p-3 bg-slate-50 dark:bg-[#181825] border border-slate-200 dark:border-[#313244] rounded-xl font-mono text-xs max-h-56 overflow-y-auto space-y-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
}

export function initJsonModule() {
  Object.assign(window, {
    switchMainTab,
    goToStep,
    nextStep,
    prevStep,
    replayTyping,
    triggerTrap,
    restoreCleanCode,
    copyCurrentCode,
    loadValidatorPreset,
    handleDragOver,
    handleDragLeave,
    handleFileDrop,
    handleFileSelect,
    clearValidatorEditor,
    formatValidatorJSON,
    copyCurrentValidatorText,
    runValidation,
  });

  updateAllViews(false);
  loadValidatorPreset('valid');
}
