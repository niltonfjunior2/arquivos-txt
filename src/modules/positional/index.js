/**
 * Módulo 2: Arquivos Posicionais (Largura Fixa) e Padrão CNAB
 * Base Canônica: Seção 5 e Seção 9 de conteudo/04 - Arquivos Texto.pdf
 * Estrutura Pedagógica Dupla:
 *   1. Construtor Guiado (6 passos) + Régua Posicional Interativa + 4 Armadilhas
 *   2. Validador & Auditor Didático (Layouts Canônicos de 49 e 24 posições, sem configuração manual)
 */
import {
  escapeHtmlText,
  showToast,
  copyTextToClipboard,
  MAX_UPLOAD_SIZE_BYTES,
} from '../../core/sanitizer.js';
import { playTone } from '../../core/audio.js';
import { getIsDarkMode } from '../../core/theme.js';

export const POSITIONAL_MODULE_ID = 'positional';

let posCurrentStepIndex = 0;
let posTypingTimeout = null;

/**
 * Layouts Canônicos da Apostila (04 - Arquivos Texto.pdf)
 * Posições 1-based inclusivas conforme tabela da Seção 5.2 e Seção 9.
 */
export const CANONICAL_LAYOUTS = {
  layout49: {
    id: 'layout49',
    name: 'Layout Financeiro Canônico (Seção 5.2 — 49 posições)',
    totalLength: 49,
    fields: [
      {
        key: 'nome',
        label: 'Nome',
        start: 1,
        end: 20,
        length: 20,
        type: 'A',
        typeDesc: 'Alfanumérico (esq. + espaços)',
        badgeLight: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        badgeDark: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        textLight: 'text-emerald-800 font-bold',
        textDark: 'text-[#a6e3a1] font-bold',
        cellBgLight: 'bg-emerald-50/90 text-emerald-900 border-emerald-200',
        cellBgDark: 'bg-emerald-500/15 text-[#a6e3a1] border-emerald-500/30',
      },
      {
        key: 'cpf',
        label: 'CPF',
        start: 21,
        end: 31,
        length: 11,
        type: 'N',
        typeDesc: 'Numérico (11 dígitos)',
        badgeLight: 'bg-sky-100 text-sky-900 border-sky-300',
        badgeDark: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
        textLight: 'text-sky-800 font-bold',
        textDark: 'text-[#89b4fa] font-bold',
        cellBgLight: 'bg-sky-50/90 text-sky-900 border-sky-200',
        cellBgDark: 'bg-sky-500/15 text-[#89b4fa] border-sky-500/30',
      },
      {
        key: 'valor',
        label: 'Valor',
        start: 32,
        end: 41,
        length: 10,
        type: 'N2',
        typeDesc: 'Numérico (2 decimais implícitos)',
        badgeLight: 'bg-amber-100 text-amber-900 border-amber-300',
        badgeDark: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        textLight: 'text-amber-800 font-bold',
        textDark: 'text-[#f9e2af] font-bold',
        cellBgLight: 'bg-amber-50/90 text-amber-900 border-amber-200',
        cellBgDark: 'bg-amber-500/15 text-[#f9e2af] border-amber-500/30',
      },
      {
        key: 'data',
        label: 'Data',
        start: 42,
        end: 49,
        length: 8,
        type: 'D8',
        typeDesc: 'Data Numérica (DDMMAAAA)',
        badgeLight: 'bg-purple-100 text-purple-900 border-purple-300',
        badgeDark: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        textLight: 'text-purple-800 font-bold',
        textDark: 'text-[#cba6f7] font-bold',
        cellBgLight: 'bg-purple-50/90 text-purple-900 border-purple-200',
        cellBgDark: 'bg-purple-500/15 text-[#cba6f7] border-purple-500/30',
      },
    ],
  },
  layout24: {
    id: 'layout24',
    name: 'Layout Acadêmico Integrado (Seção 9 — 24 posições)',
    totalLength: 24,
    fields: [
      {
        key: 'nome',
        label: 'Nome',
        start: 1,
        end: 10,
        length: 10,
        type: 'A',
        typeDesc: 'Alfanumérico (10 posições)',
        badgeLight: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        badgeDark: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        textLight: 'text-emerald-800 font-bold',
        textDark: 'text-[#a6e3a1] font-bold',
        cellBgLight: 'bg-emerald-50/90 text-emerald-900 border-emerald-200',
        cellBgDark: 'bg-emerald-500/15 text-[#a6e3a1] border-emerald-500/30',
      },
      {
        key: 'curso',
        label: 'Curso',
        start: 11,
        end: 20,
        length: 10,
        type: 'A',
        typeDesc: 'Alfanumérico (10 posições)',
        badgeLight: 'bg-sky-100 text-sky-900 border-sky-300',
        badgeDark: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
        textLight: 'text-sky-800 font-bold',
        textDark: 'text-[#89b4fa] font-bold',
        cellBgLight: 'bg-sky-50/90 text-sky-900 border-sky-200',
        cellBgDark: 'bg-sky-500/15 text-[#89b4fa] border-sky-500/30',
      },
      {
        key: 'nota',
        label: 'Nota',
        start: 21,
        end: 24,
        length: 4,
        type: 'N1',
        typeDesc: 'Numérico (1 decimal implícito)',
        badgeLight: 'bg-amber-100 text-amber-900 border-amber-300',
        badgeDark: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        textLight: 'text-amber-800 font-bold',
        textDark: 'text-[#f9e2af] font-bold',
        cellBgLight: 'bg-amber-50/90 text-amber-900 border-amber-200',
        cellBgDark: 'bg-amber-500/15 text-[#f9e2af] border-amber-500/30',
      },
    ],
  },
};

export const posStepsData = [
  {
    stepNumber: 1,
    title: 'Conceito de Largura Fixa e o Layout',
    category: 'Anatomia Posicional',
    icon: 'fa-solid fa-ruler-horizontal',
    description:
      'Em um arquivo posicional NÃO existem delimitadores (nem vírgulas, nem tags). Cada campo ocupa posições de início, fim e tamanho rigidamente predefinidos em um documento externo chamado LAYOUT.',
    rule: 'Sem o documento de Layout, o arquivo é apenas um bloco contínuo de caracteres indecifrável. Nosso layout canônico possui exatas 49 posições por linha.',
    tokens: [
      {
        label: 'Nome [01..20]',
        lightColor: 'text-emerald-800 font-bold',
        darkColor: 'text-[#a6e3a1]',
        desc: 'Tam: 20 • Alfanumérico',
      },
      {
        label: 'CPF [21..31]',
        lightColor: 'text-sky-800 font-bold',
        darkColor: 'text-[#89b4fa]',
        desc: 'Tam: 11 • Numérico',
      },
      {
        label: 'Valor [32..41]',
        lightColor: 'text-amber-800 font-bold',
        darkColor: 'text-[#f9e2af]',
        desc: 'Tam: 10 • 2 Decimais Implícitos',
      },
      {
        label: 'Data [42..49]',
        lightColor: 'text-purple-800 font-bold',
        darkColor: 'text-[#cba6f7]',
        desc: 'Tam: 8 • DDMMAAAA',
      },
    ],
    rawPos: 'MARIA SILVA         12345678901000001505002112026',
    highlightLines: [1],
    activeRange: [1, 49],
    isCnabStep: false,
  },
  {
    stepNumber: 2,
    title: 'Campo Alfanumérico: Alinhamento e Espaços [01..20]',
    category: 'Preenchimento Textual',
    icon: 'fa-solid fa-align-left',
    description:
      'O campo Nome ocupa da posição 1 até a 20 (tamanho 20). Como "MARIA SILVA" tem apenas 11 caracteres, como ocupamos as 20 posições obrigatórias? Aplicamos a regra clássica para textos!',
    rule: 'Campos Alfanuméricos (Texto) são sempre ALINHADOS À ESQUERDA e completados com ESPAÇOS EM BRANCO À DIREITA (aqui restam 9 espaços das posições 12 a 20).',
    tokens: [
      {
        label: '"MARIA SILVA"',
        lightColor: 'text-emerald-800 font-bold',
        darkColor: 'text-[#a6e3a1]',
        desc: 'Posições 01 a 11 (11 letras)',
      },
      {
        label: '9 Espaços (␣)',
        lightColor: 'text-slate-600 font-bold',
        darkColor: 'text-[#9399b2]',
        desc: 'Posições 12 a 20 (preenchimento)',
      },
    ],
    rawPos: 'MARIA SILVA         ',
    highlightLines: [1],
    activeRange: [1, 20],
    isCnabStep: false,
  },
  {
    stepNumber: 3,
    title: 'Campo Numérico: Alinhamento e Zeros [21..31]',
    category: 'Preenchimento Numérico',
    icon: 'fa-solid fa-hashtag',
    description:
      'Imediatamente na posição 21 (sem espaço nem vírgula separadora!) começa o campo CPF, que vai da posição 21 à 31 (tamanho 11, somente dígitos).',
    rule: 'Campos Numéricos seguem a regra inversa do texto: são ALINHADOS À DIREITA e completados com ZEROS À ESQUERDA, contendo exclusivamente dígitos de 0 a 9.',
    tokens: [
      {
        label: 'Nome [01..20]',
        lightColor: 'text-emerald-800 font-bold',
        darkColor: 'text-[#a6e3a1]',
        desc: '20 caracteres iniciais',
      },
      {
        label: 'CPF "12345678901"',
        lightColor: 'text-sky-800 font-bold',
        darkColor: 'text-[#89b4fa]',
        desc: 'Posições 21 a 31 (11 dígitos)',
      },
    ],
    rawPos: 'MARIA SILVA         12345678901',
    highlightLines: [1],
    activeRange: [21, 31],
    isCnabStep: false,
  },
  {
    stepNumber: 4,
    title: 'Decimais Implícitos: Sem Vírgula no Arquivo [32..41]',
    category: 'Valores Monetários',
    icon: 'fa-solid fa-coins',
    description:
      'Da posição 32 à 41 (tamanho 10) temos o Valor com 2 casas decimais implícitas. Para representar R$ 150,50, NÃO gravamos vírgula nem ponto: gravamos `0000015050`!',
    rule: 'Em arquivos posicionais bancários, as casas decimais são IMPLÍCITAS: os últimos 2 dígitos (`50`) são os centavos, os anteriores (`00000150`) são os reais, preenchidos com zeros à esquerda.',
    tokens: [
      {
        label: 'Zeros à Esquerda',
        lightColor: 'text-amber-700 font-bold',
        darkColor: 'text-[#fab387]',
        desc: 'Posições 32 a 36 ("00000")',
      },
      {
        label: 'Parte Inteira "150"',
        lightColor: 'text-amber-800 font-bold',
        darkColor: 'text-[#f9e2af]',
        desc: 'Posições 37 a 39 (150 reais)',
      },
      {
        label: 'Centavos "50"',
        lightColor: 'text-rose-700 font-bold',
        darkColor: 'text-[#f38ba8]',
        desc: 'Posições 40 a 41 (,50 implícito)',
      },
    ],
    rawPos: 'MARIA SILVA         123456789010000015050',
    highlightLines: [1],
    activeRange: [32, 41],
    isCnabStep: false,
  },
  {
    stepNumber: 5,
    title: 'Data Posicional [42..49] e Múltiplos Registros',
    category: 'Fechamento da Linha (49 Colunas)',
    icon: 'fa-solid fa-calendar-check',
    description:
      'Completamos a linha com o campo Data nas posições 42 a 49 (tamanho 8, formato `DDMMAAAA`: `02112026` = 02/11/2026) e adicionamos um segundo registro. Veja como as colunas formam corredores verticais perfeitos!',
    rule: 'Toda linha do arquivo deve ter rigorosamente o mesmo tamanho exato (49 caracteres). Se um único campo tiver 1 caractere a mais ou a menos, todos os campos seguintes serão lidos errado!',
    tokens: [
      {
        label: 'Data "02112026"',
        lightColor: 'text-purple-800 font-bold',
        darkColor: 'text-[#cba6f7]',
        desc: 'Posições 42 a 49 (02/11/2026)',
      },
      {
        label: '2º Registro (JOAO)',
        lightColor: 'text-emerald-800 font-bold',
        darkColor: 'text-[#a6e3a1]',
        desc: 'Alinhado nas mesmas 49 colunas',
      },
    ],
    rawPos:
      'MARIA SILVA         12345678901000001505002112026\nJOAO SOUZA          98765432100000023000002112026',
    highlightLines: [1, 2],
    activeRange: [42, 49],
    isCnabStep: false,
  },
  {
    stepNumber: 6,
    title: 'O Padrão Bancário CNAB (Remessa e Retorno)',
    category: 'Contextualização FEBRABAN',
    icon: 'fa-solid fa-building-columns',
    description:
      'No mercado brasileiro, o padrão CNAB (Centro Nacional de Automação Bancária — CNAB 240 e CNAB 400) usa arquivos posicionais para trocar boletos, pagamentos e extratos entre empresas (Remessa) e bancos (Retorno).',
    rule: 'Um arquivo CNAB 240 organiza suas linhas em tipos de registro: Header de Arquivo (0), Header de Lote (1), Detalhes/Segmentos (3), Trailer de Lote (5) e Trailer de Arquivo (9).',
    tokens: [
      {
        label: 'Arquivo de Remessa',
        lightColor: 'text-indigo-800 font-bold',
        darkColor: 'text-[#89b4fa]',
        desc: 'Empresa envia ao banco (.rem)',
      },
      {
        label: 'Arquivo de Retorno',
        lightColor: 'text-emerald-800 font-bold',
        darkColor: 'text-[#a6e3a1]',
        desc: 'Banco devolve à empresa (.ret)',
      },
      {
        label: 'Headers (0 e 1)',
        lightColor: 'text-amber-800 font-bold',
        darkColor: 'text-[#f9e2af]',
        desc: 'Abrem o arquivo e o lote',
      },
      {
        label: 'Trailers (5 e 9)',
        lightColor: 'text-purple-800 font-bold',
        darkColor: 'text-[#cba6f7]',
        desc: 'Fecham e totalizam valores',
      },
    ],
    rawPos:
      'MARIA SILVA         12345678901000001505002112026\nJOAO SOUZA          98765432100000023000002112026\nCARLA OLIVEIRA      45678912399000000899002112026',
    highlightLines: [1, 2, 3],
    activeRange: [1, 49],
    isCnabStep: true,
  },
];

export const posTraps = {
  cascade_shift: {
    title: 'Erro: Efeito Cascata (1 Posição a Menos no Nome)',
    rawCode: 'MARIA SILVA        12345678901000001505002112026',
    highlightLine: 1,
    errorDesc:
      'A linha tem 48 caracteres em vez de 49! Faltou 1 espaço no Nome (pos. 20), fazendo o dígito "1" do CPF cair dentro do Nome e deslocando CPF, Valor e Data inteiros!',
    fix: 'Garanta que o campo Nome ocupe exatas 20 posições (11 letras + 9 espaços à direita) para manter todas as colunas seguintes alinhadas.',
  },
  explicit_comma: {
    title: 'Erro: Vírgula Explícita no Campo de Valor Decimal',
    rawCode: 'MARIA SILVA         123456789010000150,5002112026',
    highlightLine: 1,
    errorDesc:
      'Caractere inválido "," na posição 39! Em arquivos posicionais, campos com decimais implícitos aceitam apenas dígitos de 0 a 9.',
    fix: 'Remova a vírgula e preencha com zeros à esquerda para 10 dígitos: `0000015050` representa `150,50`.',
  },
  space_in_numeric: {
    title: 'Erro: Espaços em Branco em Campo Numérico (Valor)',
    rawCode: 'MARIA SILVA         12345678901     1505002112026',
    highlightLine: 1,
    errorDesc:
      'Encontrados espaços em branco nas posições 32 a 36 do campo numérico Valor! Campos numéricos não aceitam preenchimento com espaços.',
    fix: 'Alinhe o número à direita e preencha as posições vagas à esquerda exclusivamente com zeros: `0000015050`.',
  },
  intruder_delimiter: {
    title: 'Erro: Delimitador Intruso (;) em Arquivo Posicional',
    rawCode: 'MARIA SILVA         ;12345678901;0000015050;02112026',
    highlightLine: 1,
    errorDesc:
      'A linha estourou para 52 posições! Foram inseridos caracteres ";" entre os campos, deslocando o CPF para a posição 22 e corrompendo todo o fatiamento.',
    fix: 'Remova todos os delimitadores `;`. No formato posicional os campos são colados uns nos outros e separados apenas pela posição.',
  },
};

export const posValidatorPresets = {
  valid49:
    'MARIA SILVA         12345678901000001505002112026\nJOAO SOUZA          98765432100000023000002112026',
  valid24: 'Ana       Sistemas  0085\nBruno     Sistemas  0070',
  err_shift: 'MARIA SILVA        12345678901000001505002112026',
  err_comma: 'MARIA SILVA         123456789010000150,5002112026',
};

export function stopPosTyping() {
  if (posTypingTimeout) {
    clearTimeout(posTypingTimeout);
    posTypingTimeout = null;
  }
}

/**
 * Detecta automaticamente qual dos dois layouts canônicos da apostila corresponde ao texto:
 * - Layout 24 posições (Seção 9: Nome 10, Curso 10, Nota 4)
 * - Layout 49 posições (Seção 5.2: Nome 20, CPF 11, Valor 10, Data 8)
 */
export function detectCanonicalLayout(lines) {
  const nonEmpty = lines.filter((l) => l.length > 0);
  if (nonEmpty.length === 0) return CANONICAL_LAYOUTS.layout49;
  const firstLen = nonEmpty[0].length;
  // Se a linha estiver próxima de 24 caracteres (entre 15 e 34), usa o layout acadêmico de 24 posições
  if (firstLen >= 15 && firstLen <= 34) {
    return CANONICAL_LAYOUTS.layout24;
  }
  return CANONICAL_LAYOUTS.layout49;
}

/**
 * Formata um valor bruto extraído do arquivo posicional para leitura humana didática
 */
export function formatPositionalFieldValue(rawSlice, fieldDef) {
  if (fieldDef.type === 'A') {
    const trimmed = rawSlice.trimEnd();
    const trailingSpaces = rawSlice.length - trimmed.length;
    return {
      interpreted: trimmed || '(vazio)',
      detail: `${trimmed.length} caractere(s) + ${trailingSpaces} espaço(s)`,
      numericValue: 0,
    };
  }
  if (fieldDef.type === 'N2') {
    if (/^\d+$/.test(rawSlice)) {
      const val = parseInt(rawSlice, 10) / 100;
      const formatted = val.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return {
        interpreted: `R$ ${formatted}`,
        detail: `Inteiro ${rawSlice} ÷ 100 (2 decimais implícitos)`,
        numericValue: val,
      };
    }
  }
  if (fieldDef.type === 'N1') {
    if (/^\d+$/.test(rawSlice)) {
      const val = parseInt(rawSlice, 10) / 10;
      return {
        interpreted: val.toFixed(1).replace('.', ','),
        detail: `Inteiro ${rawSlice} ÷ 10 (1 decimal implícito)`,
        numericValue: val,
      };
    }
  }
  if (fieldDef.type === 'D8') {
    if (/^\d{8}$/.test(rawSlice)) {
      const d = rawSlice.slice(0, 2);
      const m = rawSlice.slice(2, 4);
      const y = rawSlice.slice(4, 8);
      return {
        interpreted: `${d}/${m}/${y}`,
        detail: 'Formato DDMMAAAA',
        numericValue: 0,
      };
    }
  }
  return {
    interpreted: rawSlice,
    detail: `${rawSlice.length} dígitos`,
    numericValue: 0,
  };
}

/**
 * Valida e Audita um arquivo posicional contra os Layouts Canônicos da Apostila (49 ou 24 posições)
 */
export function validatePositionalText(rawText) {
  const normalized = (rawText || '').replace(/\r\n/g, '\n');
  const rawLines = normalized.split('\n');
  while (rawLines.length > 1 && rawLines[rawLines.length - 1] === '') {
    rawLines.pop();
  }

  if (rawLines.length === 0 || (rawLines.length === 1 && rawLines[0] === '')) {
    return { valid: false, empty: true };
  }

  const layout = detectCanonicalLayout(rawLines);
  const expectedLen = layout.totalLength;
  const parsedRecords = [];
  let totalPaddingChars = 0;
  let totalNumericSum = 0;

  for (let idx = 0; idx < rawLines.length; idx++) {
    const lineNum = idx + 1;
    const line = rawLines[idx];

    // 1. Verifica delimitador intruso (; ou |) quando estoura ou corrompe a linha
    const semiIdx = line.indexOf(';');
    if (semiIdx !== -1) {
      return {
        valid: false,
        line: lineNum,
        col: semiIdx + 1,
        layout,
        category: 'Posicional: Delimitador Intruso',
        headline: 'Encontrado Delimitador ";" em Arquivo Posicional',
        explanation: `Na linha ${lineNum}, posição ${semiIdx + 1}, foi encontrado um ponto e vírgula (<code>;</code>). Em arquivos posicionais <strong>não existem caracteres separadores</strong>: os campos são colados e identificados exclusivamente pela posição inicial e final do layout.`,
        fixSuggestion:
          'Remova todos os caracteres <code>;</code> para que cada campo ocupe exatamente suas colunas no layout.',
        lineText: line,
      };
    }

    // 2. Verifica vírgula ou ponto explícito na região de campos numéricos antes mesmo do tamanho
    for (const field of layout.fields) {
      if (field.type !== 'A') {
        const slice = line.slice(field.start - 1, Math.min(line.length, field.end));
        const commaOrDotIdx = slice.search(/[,.]/);
        if (commaOrDotIdx !== -1) {
          const exactPos = field.start + commaOrDotIdx;
          return {
            valid: false,
            line: lineNum,
            col: exactPos,
            layout,
            category: 'Posicional: Decimal Implícito Violado',
            headline: `Separador Decimal Explícito ("${slice[commaOrDotIdx]}") no Campo ${field.label}`,
            explanation: `Na linha ${lineNum}, posição ${exactPos} (campo <strong>${field.label}</strong> [${field.start}..${field.end}]), foi encontrado o caractere <code>${slice[commaOrDotIdx]}</code>. Em arquivos posicionais, casas decimais são <strong>implícitas</strong> e o campo aceita apenas dígitos de 0 a 9.`,
            fixSuggestion:
              field.type === 'N2'
                ? `Remova a vírgula/ponto e alinhe à direita com zeros à esquerda (ex.: <code>150,50</code> deve ser gravado como <code>0000015050</code>).`
                : `Remova a vírgula/ponto e grave apenas os dígitos com zeros à esquerda (ex.: <code>8,5</code> vira <code>0085</code>).`,
            lineText: line,
          };
        }
      }
    }

    // 3. Verifica o tamanho exato da linha (49 ou 24 caracteres)
    if (line.length !== expectedLen) {
      const diff = line.length - expectedLen;
      const diffText =
        diff > 0 ? `${diff} caractere(s) A MAIS` : `${Math.abs(diff)} caractere(s) A MENOS`;
      return {
        valid: false,
        line: lineNum,
        col: Math.min(line.length + 1, expectedLen),
        layout,
        category: 'Posicional: Efeito Cascata (Tamanho Inválido)',
        headline: `Linha ${lineNum} com ${line.length} Posições (Esperado: ${expectedLen})`,
        explanation: `O <strong>${layout.name}</strong> exige rigorosamente <strong>${expectedLen} caracteres por linha</strong>, mas a linha ${lineNum} possui <strong>${line.length} caracteres</strong> (${diffText}). Em um arquivo posicional, uma única posição a mais ou a menos provoca o <em>efeito cascata</em>, deslocando e corrompendo a leitura de todos os campos seguintes!`,
        fixSuggestion: `Verifique o preenchimento de espaços à direita nos campos alfanuméricos e zeros à esquerda nos campos numéricos até a linha somar exatas ${expectedLen} posições.`,
        lineText: line,
      };
    }

    // 4. Valida cada campo individualmente segundo seu tipo no Layout
    const recordFields = [];
    for (const field of layout.fields) {
      const rawSlice = line.slice(field.start - 1, field.end);

      if (field.type === 'A') {
        const trailingSpaces = rawSlice.length - rawSlice.trimEnd().length;
        totalPaddingChars += trailingSpaces;
      } else {
        // Campo Numérico (N, N2, N1, D8)
        const spaceIdx = rawSlice.indexOf(' ');
        if (spaceIdx !== -1) {
          const exactPos = field.start + spaceIdx;
          return {
            valid: false,
            line: lineNum,
            col: exactPos,
            layout,
            category: 'Posicional: Espaço em Campo Numérico',
            headline: `Preenchimento com Espaço no Campo Numérico "${field.label}"`,
            explanation: `Na linha ${lineNum}, posição ${exactPos}, o campo numérico <strong>${field.label}</strong> (${field.start}..${field.end}) contém espaço em branco. Pela regra posicional, somente campos alfanuméricos usam espaços; campos numéricos exigem <strong>zeros à esquerda</strong>.`,
            fixSuggestion: `Substitua os espaços do campo ${field.label} por zeros à esquerda: <code>${escapeHtmlText(rawSlice.trim().padStart(field.length, '0'))}</code>.`,
            lineText: line,
          };
        }

        const nonDigitIdx = rawSlice.search(/\D/);
        if (nonDigitIdx !== -1) {
          const exactPos = field.start + nonDigitIdx;
          return {
            valid: false,
            line: lineNum,
            col: exactPos,
            layout,
            category: 'Posicional: Caractere Não Numérico',
            headline: `Caractere Inválido "${rawSlice[nonDigitIdx]}" no Campo Numérico "${field.label}"`,
            explanation: `O campo <strong>${field.label}</strong> (posições ${field.start} a ${field.end}) é estritamente numérico, mas encontrou o caractere <code>${escapeHtmlText(rawSlice[nonDigitIdx])}</code> na posição ${exactPos}.`,
            fixSuggestion: `Mantenha apenas dígitos de 0 a 9 nas posições ${field.start} a ${field.end}.`,
            lineText: line,
          };
        }

        if (field.type === 'D8') {
          const day = parseInt(rawSlice.slice(0, 2), 10);
          const month = parseInt(rawSlice.slice(2, 4), 10);
          const year = parseInt(rawSlice.slice(4, 8), 10);
          if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2100) {
            return {
              valid: false,
              line: lineNum,
              col: field.start,
              layout,
              category: 'Posicional: Data Inválida (DDMMAAAA)',
              headline: `Data "${rawSlice}" Fora do Padrão DDMMAAAA`,
              explanation: `Nas posições ${field.start} a ${field.end}, o valor <code>${rawSlice}</code> (Dia ${day}, Mês ${month}, Ano ${year}) não forma uma data válida no formato <code>DDMMAAAA</code>.`,
              fixSuggestion: `Informe uma data válida com 8 dígitos no formato Dia/Mês/Ano sem barras (ex.: <code>02112026</code>).`,
              lineText: line,
            };
          }
        }

        const leadingZerosMatch = rawSlice.match(/^0+/);
        if (leadingZerosMatch) {
          totalPaddingChars += leadingZerosMatch[0].length;
        }
      }

      const formatted = formatPositionalFieldValue(rawSlice, field);
      totalNumericSum += formatted.numericValue;

      recordFields.push({
        field,
        rawSlice,
        interpreted: formatted.interpreted,
        detail: formatted.detail,
      });
    }

    parsedRecords.push({
      lineNum,
      rawLine: line,
      fields: recordFields,
    });
  }

  return {
    valid: true,
    layout,
    records: parsedRecords,
    metrics: {
      layoutCode: `${layout.totalLength} pos (${layout.fields.length} campos)`,
      totalRecords: parsedRecords.length,
      lineLength: `${expectedLen} cols`,
      fieldsCount: layout.fields.length,
      paddingChars: totalPaddingChars,
      summaryValue:
        layout.id === 'layout49'
          ? `R$ ${totalNumericSum.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          : `Média ${(totalNumericSum / parsedRecords.length).toFixed(1).replace('.', ',')}`,
    },
  };
}

/**
 * Coloriza uma linha posicional destacando cada faixa do layout com sua cor semântica
 * e exibindo espaços de preenchimento de forma visível e didática.
 */
export function colorizePositionalLine(lineText, layout = CANONICAL_LAYOUTS.layout49) {
  if (!lineText) return '&nbsp;';
  const isDarkMode = getIsDarkMode();
  let html = '';

  for (let i = 0; i < lineText.length; i++) {
    const pos = i + 1;
    const ch = lineText[i];
    const field = layout.fields.find((f) => pos >= f.start && pos <= f.end);

    if (!field) {
      // Caractere excedente além do limite do layout
      html += `<span class="bg-rose-500/30 text-rose-700 dark:text-rose-300 font-bold underline">${escapeHtmlText(ch)}</span>`;
      continue;
    }

    const colorClass = isDarkMode ? field.textDark : field.textLight;
    if (ch === ' ') {
      html += `<span class="text-slate-400/70 dark:text-slate-500 select-none" title="Posição ${pos} (${field.label}): Espaço de preenchimento">␣</span>`;
    } else {
      html += `<span class="${colorClass}" title="Posição ${pos} (${field.label})">${escapeHtmlText(ch)}</span>`;
    }
  }

  return html;
}

export function switchPosTab(tabId) {
  const builderTab = document.getElementById('pos-view-builder');
  const validatorTab = document.getElementById('pos-view-validator');
  const btnBuilder = document.getElementById('pos-tab-btn-builder');
  const btnValidator = document.getElementById('pos-tab-btn-validator');
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
    stopPosTyping();
    builderTab.classList.add('hidden');
    validatorTab.classList.remove('hidden');
    btnValidator.className =
      'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm bg-white text-emerald-700 dark:bg-[#313244] dark:text-white border border-slate-200 dark:border-transparent';
    btnBuilder.className =
      'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-[#a6adc8] hover:text-slate-900 dark:hover:text-white transition';
    playTone('G5');
    runPosValidation();
  }
}

export function renderPosStepper() {
  const container = document.getElementById('pos-stepper-container');
  if (!container) return;
  container.innerHTML = posStepsData
    .map((step, idx) => {
      const isCurrent = idx === posCurrentStepIndex;
      const isCompleted = idx < posCurrentStepIndex;
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
        <button onclick="posGoToStep(${idx})" class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all border shrink-0 ${statusClass}">
          <span class="w-5 h-5 rounded-full flex items-center justify-center font-mono text-[11px] font-bold ${isCurrent ? 'bg-white text-indigo-900' : isCompleted ? 'bg-emerald-600 text-white dark:bg-emerald-500/30 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-black/30 dark:text-slate-300'}">
            ${isCompleted ? '<i class="fa-solid fa-check text-[10px]"></i>' : idx + 1}
          </span>
          <span class="font-medium whitespace-nowrap">${step.title.split(' ')[0]} ${step.title.split(' ')[1] || ''}</span>
        </button>
      `;
    })
    .join('');
}

export function renderPosLesson() {
  const step = posStepsData[posCurrentStepIndex];
  const badgeEl = document.getElementById('pos-badge-step-number');
  if (!badgeEl) return;

  const isDarkMode = getIsDarkMode();
  badgeEl.innerText = `PASSO ${step.stepNumber} DE ${posStepsData.length}`;
  document.getElementById('pos-step-category').innerText = step.category;
  document.getElementById('pos-step-icon-container').innerHTML = `<i class="${step.icon}"></i>`;
  document.getElementById('pos-step-title').innerText = step.title;
  document.getElementById('pos-step-description').innerText = step.description;
  document.getElementById('pos-step-rule-text').innerText = step.rule;

  const tokenContainer = document.getElementById('pos-step-tokens-container');
  tokenContainer.innerHTML = step.tokens
    .map((token) => {
      const colorClass = isDarkMode ? token.darkColor : token.lightColor;
      return `
        <div class="bg-slate-50 dark:bg-[#181825] p-2.5 rounded-xl border border-slate-200 dark:border-[#313244] flex flex-col">
          <span class="font-mono text-xs ${colorClass}">${escapeHtmlText(token.label)}</span>
          <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] font-medium mt-0.5">${escapeHtmlText(token.desc)}</span>
        </div>
      `;
    })
    .join('');

  document.getElementById('pos-btn-prev').disabled = posCurrentStepIndex === 0;
  const nextBtn = document.getElementById('pos-btn-next');
  nextBtn.innerHTML =
    posCurrentStepIndex === posStepsData.length - 1
      ? `<span>Finalizar</span> <i class="fa-solid fa-check"></i>`
      : `<span>Avançar</span> <i class="fa-solid fa-arrow-right"></i>`;
  document.getElementById('pos-trap-feedback-box').classList.add('hidden');
  updatePosSyntaxBadge(true);
}

export function renderPosCodeEditor(animated = true) {
  const step = posStepsData[posCurrentStepIndex];
  const codeCanvas = document.getElementById('pos-code-canvas');
  if (!codeCanvas) return;

  const lines = step.rawPos.split('\n');
  stopPosTyping();
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
          <div class="pl-2 font-mono text-xs leading-6 whitespace-pre ${isActive ? 'highlight-active-row rounded font-medium' : ''}">
            ${colorizePositionalLine(line, CANONICAL_LAYOUTS.layout49)}
          </div>
        `;
      })
      .join('');
    document.getElementById('pos-char-count').innerText =
      `Largura da Linha 1: ${lines[0].length} / 49 posições`;
    return;
  }

  codeCanvas.innerHTML = '';
  let currentLineIndex = 0;
  let currentCharIndex = 0;

  function typeChar() {
    if (currentLineIndex >= lines.length) {
      renderPosCodeEditor(false);
      playTone('G5');
      return;
    }

    const targetLine = lines[currentLineIndex];
    if (currentCharIndex < targetLine.length) {
      currentCharIndex++;
      if (currentCharIndex % 4 === 0) playTone('A4');
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
        lineContent = colorizePositionalLine(lines[i], CANONICAL_LAYOUTS.layout49);
      } else {
        const partialRaw = targetLine.substring(0, currentCharIndex);
        lineContent = colorizePositionalLine(partialRaw, CANONICAL_LAYOUTS.layout49);
        if (isCurrentActiveLine) {
          lineContent += '<span class="typing-cursor"></span>';
        }
      }

      htmlBuffer += `
        <div class="${gutterClass} select-none text-right font-mono pr-2.5 text-xs leading-6">${lineNum}</div>
        <div class="pl-2 font-mono text-xs leading-6 whitespace-pre ${isActive ? 'highlight-active-row rounded' : ''}">
          ${lineContent}
        </div>
      `;
    }

    codeCanvas.innerHTML = htmlBuffer;
    document.getElementById('pos-char-count').innerText =
      `Preenchendo posição: ${currentCharIndex} / ${targetLine.length}`;
    posTypingTimeout = setTimeout(typeChar, 14);
  }
  typeChar();
}

/**
 * Renderiza a Régua Posicional Interativa (1 a 49) sincronizada caractere a caractere,
 * o Mapa de Fatiamento dos Campos e (no Passo 6) a Estrutura de Lotes do CNAB 240.
 */
export function renderPosRulerAndSlices() {
  const step = posStepsData[posCurrentStepIndex];
  const container = document.getElementById('pos-ruler-canvas');
  if (!container) return;

  const isDarkMode = getIsDarkMode();
  const layout = CANONICAL_LAYOUTS.layout49;
  const firstLine = step.rawPos.split('\n')[0] || '';
  const [activeStart, activeEnd] = step.activeRange || [1, 49];

  document.getElementById('pos-range-badge').innerText =
    `Foco: Posições ${String(activeStart).padStart(2, '0')} a ${String(activeEnd).padStart(2, '0')}`;

  // 1. Constrói as 49 células da régua sincronizadas caractere a caractere
  let rulerTensHtml = '';
  let rulerUnitsHtml = '';
  let rulerCharsHtml = '';

  for (let pos = 1; pos <= 49; pos++) {
    const field = layout.fields.find((f) => pos >= f.start && pos <= f.end);
    const ch = firstLine[pos - 1] ?? '';
    const isFocused = pos >= activeStart && pos <= activeEnd;
    const isBoundaryStart = field && pos === field.start;

    const tenDigit = pos % 10 === 0 ? String(pos / 10) : pos === 1 ? '0' : '·';
    const unitDigit = String(pos % 10);

    const cellTheme = field
      ? isDarkMode
        ? field.cellBgDark
        : field.cellBgLight
      : 'bg-slate-100 text-slate-500';
    const focusRing = isFocused ? 'opacity-100' : 'opacity-45';
    const leftSep = isBoundaryStart ? 'border-l-2 border-l-indigo-500 dark:border-l-amber-400' : '';

    rulerTensHtml += `<span class="w-[18px] shrink-0 text-center text-[9px] text-slate-400 dark:text-slate-500 font-mono select-none ${leftSep}">${tenDigit}</span>`;
    rulerUnitsHtml += `<span class="w-[18px] shrink-0 text-center text-[10px] font-bold text-slate-600 dark:text-slate-400 font-mono select-none ${leftSep}">${unitDigit}</span>`;

    const displayChar = ch === '' ? '·' : ch === ' ' ? '␣' : escapeHtmlText(ch);
    rulerCharsHtml += `
      <span title="Posição ${pos} — Campo ${field ? field.label : ''}" class="w-[18px] h-7 shrink-0 flex items-center justify-center font-mono text-xs border-y border-r ${cellTheme} ${focusRing} ${leftSep}">
        ${displayChar}
      </span>
    `;
  }

  // 2. Constrói os cartões de Campos Extraídos pelo Layout
  const slicesCardsHtml = layout.fields
    .map((field) => {
      const rawSlice = firstLine.slice(field.start - 1, field.end);
      const isFilled = rawSlice.length === field.length;
      const formatted = isFilled
        ? formatPositionalFieldValue(rawSlice, field)
        : {
            interpreted: rawSlice.length > 0 ? `${rawSlice} (incompleto)` : 'Aguardando passo...',
            detail: `Preenchido: ${rawSlice.length}/${field.length} posições`,
          };
      const badgeClass = isDarkMode ? field.badgeDark : field.badgeLight;
      const displayRaw = rawSlice ? rawSlice.replace(/ /g, '␣') : '—';

      return `
        <div class="p-3 rounded-xl bg-slate-50 dark:bg-[#181825] border border-slate-200 dark:border-[#313244] flex flex-col justify-between gap-1.5">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs font-extrabold text-slate-900 dark:text-white">${field.label}</span>
            <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${badgeClass}">
              Pos ${String(field.start).padStart(2, '0')}..${String(field.end).padStart(2, '0')} (Tam ${field.length})
            </span>
          </div>
          <div class="font-mono text-xs bg-white dark:bg-[#11111b] px-2.5 py-1.5 rounded border border-slate-200 dark:border-[#313244] flex items-center justify-between gap-2">
            <span class="text-[10px] text-slate-400">Bruto:</span>
            <span class="font-bold text-slate-800 dark:text-[#cdd6f4] truncate">${escapeHtmlText(displayRaw)}</span>
          </div>
          <div class="flex items-center justify-between text-[11px] pt-0.5">
            <span class="text-slate-500 dark:text-[#a6adc8]">${escapeHtmlText(field.typeDesc)}:</span>
            <strong class="font-mono text-indigo-700 dark:text-amber-300">${escapeHtmlText(formatted.interpreted)}</strong>
          </div>
        </div>
      `;
    })
    .join('');

  // 3. Bloco didático extra do Padrão CNAB 240 (exibido em destaque no Passo 6 ou como referência)
  const cnabDiagramHtml = step.isCnabStep
    ? `
      <div class="mt-4 p-4 rounded-xl bg-indigo-50/70 dark:bg-[#181825] border border-indigo-200 dark:border-indigo-500/30 space-y-2.5">
        <div class="flex items-center justify-between">
          <h4 class="text-xs font-extrabold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
            <i class="fa-solid fa-building-columns"></i> Arquitetura de Registros de um Arquivo CNAB 240 (FEBRABAN)
          </h4>
          <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-200/70 text-indigo-900 dark:bg-indigo-500/20 dark:text-indigo-200">
            Cada linha = exatas 240 posições
          </span>
        </div>
        <div class="space-y-1.5 font-mono text-[11px]">
          <div class="p-2 rounded-lg bg-white dark:bg-[#11111b] border border-indigo-200 dark:border-[#313244] flex items-center justify-between">
            <span><strong class="text-amber-600 dark:text-amber-400">[Tipo 0] HEADER DE ARQUIVO</strong> — Identifica a Empresa, o Banco, Data e Hora de geração</span>
            <span class="text-[10px] text-slate-400">1ª Linha</span>
          </div>
          <div class="pl-4 space-y-1.5 border-l-2 border-indigo-400 dark:border-indigo-500/40 ml-2">
            <div class="p-2 rounded-lg bg-white dark:bg-[#11111b] border border-slate-200 dark:border-[#313244] flex items-center justify-between">
              <span><strong class="text-sky-600 dark:text-sky-400">[Tipo 1] HEADER DE LOTE</strong> — Define o tipo de serviço (ex.: Pagamento de Salários, Boletos)</span>
              <span class="text-[10px] text-slate-400">Abre Lote</span>
            </div>
            <div class="p-2 rounded-lg bg-emerald-50/80 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-between">
              <span><strong class="text-emerald-700 dark:text-emerald-300">[Tipo 3] DETALHE (Segmentos A, B, J, P, Q...)</strong> — Cada linha é um boleto ou pagamento individual</span>
              <span class="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">N Linhas</span>
            </div>
            <div class="p-2 rounded-lg bg-white dark:bg-[#11111b] border border-slate-200 dark:border-[#313244] flex items-center justify-between">
              <span><strong class="text-sky-600 dark:text-sky-400">[Tipo 5] TRAILER DE LOTE</strong> — Quantidade de linhas e somatório financeiro do lote</span>
              <span class="text-[10px] text-slate-400">Fecha Lote</span>
            </div>
          </div>
          <div class="p-2 rounded-lg bg-white dark:bg-[#11111b] border border-indigo-200 dark:border-[#313244] flex items-center justify-between">
            <span><strong class="text-purple-600 dark:text-purple-400">[Tipo 9] TRAILER DE ARQUIVO</strong> — Totalizador geral de lotes e registros do arquivo</span>
            <span class="text-[10px] text-slate-400">Última Linha</span>
          </div>
        </div>
      </div>
    `
    : '';

  container.innerHTML = `
    <!-- Régua Monoespaçada Rolável Mobile-First -->
    <div class="p-3 rounded-xl bg-slate-50 dark:bg-[#181825] border border-slate-200 dark:border-[#313244] overflow-x-auto">
      <div class="flex items-center justify-between mb-2 text-[11px] text-slate-500 dark:text-[#a6adc8]">
        <span><i class="fa-solid fa-arrows-left-right text-indigo-500 mr-1"></i> Régua de Posições (1 a 49) sincronizada caractere a caractere:</span>
        <span class="font-mono text-[10px]">Legenda: <strong>␣</strong> = Espaço em branco</span>
      </div>
      <div class="inline-flex flex-col min-w-max pb-1">
        <div class="flex items-center">${rulerTensHtml}</div>
        <div class="flex items-center mb-1">${rulerUnitsHtml}</div>
        <div class="flex items-center rounded overflow-hidden border-l border-slate-300 dark:border-[#45475a]">${rulerCharsHtml}</div>
      </div>
    </div>

    <!-- Mapa de Fatiamento dos 4 Campos -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
      ${slicesCardsHtml}
    </div>
    ${cnabDiagramHtml}
  `;
}

export function updateAllPosViews(animated = true) {
  renderPosStepper();
  renderPosLesson();
  renderPosCodeEditor(animated);
  renderPosRulerAndSlices();
}

export function posNextStep() {
  if (posCurrentStepIndex < posStepsData.length - 1) {
    posCurrentStepIndex++;
    playTone('C5');
    updateAllPosViews(true);
  } else {
    showToast('Você concluiu todas as etapas de Arquivos Posicionais e CNAB!');
    playTone('C6');
  }
}

export function posPrevStep() {
  if (posCurrentStepIndex > 0) {
    posCurrentStepIndex--;
    playTone('G4');
    updateAllPosViews(false);
  }
}

export function posGoToStep(idx) {
  if (idx !== posCurrentStepIndex && idx >= 0 && idx < posStepsData.length) {
    posCurrentStepIndex = idx;
    playTone('D5');
    updateAllPosViews(true);
  }
}

export function posReplayTyping() {
  playTone('F5');
  renderPosCodeEditor(true);
}

export function updatePosSyntaxBadge(isValid) {
  const badge = document.getElementById('pos-syntax-status-badge');
  if (!badge) return;
  const isDarkMode = getIsDarkMode();
  if (isValid) {
    badge.className = isDarkMode
      ? 'text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 font-bold'
      : 'text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 font-bold';
    badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Layout 49 Posições Íntegro`;
  } else {
    badge.className = isDarkMode
      ? 'text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5 font-bold'
      : 'text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1.5 font-bold';
    badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span> Layout Desalinhado`;
  }
}

export function triggerPosTrap(trapKey) {
  stopPosTyping();
  const trap = posTraps[trapKey];
  if (!trap) return;

  playTone('C3');
  const box = document.getElementById('pos-trap-feedback-box');
  box.classList.remove('hidden');
  document.getElementById('pos-trap-error-title').innerText = trap.title;
  document.getElementById('pos-trap-error-desc').innerText = trap.errorDesc;
  document.getElementById('pos-trap-fix-text').innerText = trap.fix;
  updatePosSyntaxBadge(false);

  const lines = trap.rawCode.split('\n');
  const codeCanvas = document.getElementById('pos-code-canvas');
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
        <div class="pl-2 font-mono text-xs leading-6 whitespace-pre ${isErrorLine ? errBg : ''}">${colorizePositionalLine(line, CANONICAL_LAYOUTS.layout49)}</div>
      `;
    })
    .join('');

  document.getElementById('pos-char-count').innerText =
    `Status: POSIÇÕES CORROMPIDAS (${lines[0].length} chars)`;
  showToast('Deslocamento posicional simulado para estudo!');
}

export function restoreCleanPosCode() {
  playTone('E5');
  document.getElementById('pos-trap-feedback-box').classList.add('hidden');
  updatePosSyntaxBadge(true);
  renderPosCodeEditor(false);
  showToast('Layout posicional de 49 posições restaurado!');
}

export function copyCurrentPosCode() {
  const step = posStepsData[posCurrentStepIndex];
  copyTextToClipboard(step.rawPos, 'Arquivo Posicional copiado para a área de transferência!');
  playTone('A5');
}

export function loadPosValidatorPreset(key) {
  const text = posValidatorPresets[key];
  if (text) {
    document.getElementById('pos-validator-input').value = text;
    document.getElementById('pos-validator-file-name').innerText = `remessa_${key}.rem`;
    runPosValidation();
    playTone('D5');
  }
}

export function handlePosDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('pos-drop-zone').classList.add('drop-active');
}

export function handlePosDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('pos-drop-zone').classList.remove('drop-active');
}

export function handlePosFileDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('pos-drop-zone').classList.remove('drop-active');
  const files = e.dataTransfer.files;
  if (files && files.length > 0) {
    processPosUploadedFile(files[0]);
  }
}

export function handlePosFileSelect(e) {
  const files = e.target.files;
  if (files && files.length > 0) {
    processPosUploadedFile(files[0]);
  }
}

export function processPosUploadedFile(file) {
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    showToast('Arquivo excede o limite didático de 1 MB.');
    return;
  }
  document.getElementById('pos-validator-file-name').innerText = file.name;
  const reader = new FileReader();
  reader.onload = function (evt) {
    document.getElementById('pos-validator-input').value = evt.target.result;
    runPosValidation();
    showToast(`Arquivo "${file.name}" carregado com sucesso!`);
    playTone('F5');
  };
  reader.readAsText(file, 'UTF-8');
}

export function clearPosValidatorEditor() {
  document.getElementById('pos-validator-input').value = '';
  document.getElementById('pos-validator-file-name').innerText = 'Editor em branco';
  runPosValidation();
  playTone('C4');
}

/**
 * Higieniza quebras de linha (\r\n -> \n) e remove linhas vazias no fim,
 * SEM jamais indentar (pois indentação destruiria as posições fixas — Risco R6).
 */
export function normalizePosValidatorText() {
  const input = document.getElementById('pos-validator-input');
  if (!input || !input.value) return;
  const lines = input.value.replace(/\r\n/g, '\n').split('\n');
  while (lines.length > 1 && lines[lines.length - 1] === '') {
    lines.pop();
  }
  input.value = lines.join('\n');
  runPosValidation();
  showToast('Quebras de linha normalizadas sem alterar as posições fixas!');
  playTone('A5');
}

export function copyCurrentPosValidatorText() {
  const val = document.getElementById('pos-validator-input').value;
  copyTextToClipboard(val, 'Arquivo Posicional copiado para a área de transferência!');
  playTone('A5');
}

export function runPosValidation() {
  const inputEl = document.getElementById('pos-validator-input');
  if (!inputEl) return;
  const text = inputEl.value;
  const statsText = document.getElementById('pos-validator-stats-text');
  const linesCount = text ? text.replace(/\r\n/g, '\n').split('\n').length : 0;
  const bytesCount = new Blob([text]).size;
  statsText.innerText = `${linesCount} linha(s) • ${bytesCount} bytes`;

  const statusTitle = document.getElementById('pos-validator-status-title');
  const statusSubtitle = document.getElementById('pos-validator-status-subtitle');
  const badgeIcon = document.getElementById('pos-validator-badge-icon');
  const errSection = document.getElementById('pos-validator-error-section');
  const succSection = document.getElementById('pos-validator-success-section');

  if (!text) {
    statusTitle.innerText = 'Aguardando arquivo posicional para validação';
    statusSubtitle.innerText =
      'Cole registros de largura fixa (49 ou 24 posições) ou envie um arquivo .txt/.rem';
    badgeIcon.className =
      'w-10 h-10 rounded-xl bg-slate-200 text-slate-600 dark:bg-[#313244] dark:text-[#a6adc8] flex items-center justify-center text-lg';
    badgeIcon.innerHTML = `<i class="fa-solid fa-circle-question"></i>`;
    errSection.classList.add('hidden');
    succSection.classList.add('hidden');
    return;
  }

  const result = validatePositionalText(text);

  if (result.valid) {
    statusTitle.innerText = 'Arquivo Posicional Válido e Alinhado ao Layout';
    statusSubtitle.innerText = ` Auditado com sucesso segundo o ${result.layout.name}`;
    badgeIcon.className =
      'w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 flex items-center justify-center text-lg';
    badgeIcon.innerHTML = `<i class="fa-solid fa-circle-check"></i>`;

    errSection.classList.add('hidden');
    succSection.classList.remove('hidden');

    document.getElementById('pos-metric-layout').innerText = result.metrics.layoutCode;
    document.getElementById('pos-metric-records').innerText = result.metrics.totalRecords;
    document.getElementById('pos-metric-len').innerText = result.metrics.lineLength;
    document.getElementById('pos-metric-fields').innerText = result.metrics.fieldsCount;
    document.getElementById('pos-metric-padding').innerText =
      `${result.metrics.paddingChars} chars`;
    document.getElementById('pos-metric-sum').innerText = result.metrics.summaryValue;

    const previewEl = document.getElementById('pos-validator-slices-preview');
    previewEl.innerHTML = result.records
      .slice(0, 8)
      .map(
        (rec) => `
        <div class="p-3 rounded-xl bg-white dark:bg-[#11111b] border border-slate-200 dark:border-[#313244] space-y-2">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-[#313244] pb-1.5">
            <span class="font-bold text-indigo-700 dark:text-amber-300">Registro #${rec.lineNum}</span>
            <span class="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">${rec.rawLine.length}/${result.layout.totalLength} posições exatas</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${rec.fields
              .map(
                (f) => `
              <div class="text-[11px] bg-slate-50 dark:bg-[#181825] p-2 rounded-lg border border-slate-200 dark:border-[#313244] flex items-center justify-between gap-2">
                <span class="text-slate-500 dark:text-[#a6adc8]">${escapeHtmlText(f.field.label)} [${f.field.start}..${f.field.end}]:</span>
                <strong class="text-slate-900 dark:text-white">${escapeHtmlText(f.interpreted)}</strong>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `
      )
      .join('');
  } else {
    statusTitle.innerText = result.headline;
    statusSubtitle.innerText = `Violação detectada contra o ${result.layout ? result.layout.name : 'Layout Canônico'}`;
    badgeIcon.className =
      'w-10 h-10 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 flex items-center justify-center text-lg';
    badgeIcon.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i>`;

    succSection.classList.add('hidden');
    errSection.classList.remove('hidden');

    document.getElementById('pos-error-loc-line').innerText = result.line;
    document.getElementById('pos-error-loc-col').innerText = result.col;
    document.getElementById('pos-error-category-badge').innerText = result.category;

    const safeLine = escapeHtmlText((result.lineText || '').replace(/ /g, '␣'));
    const pointerSpaces = ' '.repeat(Math.max(0, result.col - 1));
    document.getElementById('pos-error-code-preview').innerHTML = `
      <div class="text-slate-400 select-none">// Linha ${result.line} (${(result.lineText || '').length} caracteres):</div>
      <div class="text-white whitespace-pre">${safeLine || '&nbsp;'}</div>
      <div class="text-rose-400 font-bold whitespace-pre">${pointerSpaces}^ [Posição ${result.col}]</div>
    `;
    document.getElementById('pos-error-didactic-why').innerHTML = result.explanation;
    document.getElementById('pos-error-didactic-fix').innerHTML = result.fixSuggestion;
    playTone('C3');
  }
}

export function refreshPosTheme() {
  renderPosLesson();
  renderPosCodeEditor(false);
  renderPosRulerAndSlices();
  runPosValidation();
}

export function getPositionalModuleHtml() {
  return `
  <div id="module-positional" class="hidden flex-1 flex flex-col">
    <!-- Barra Interna de Abas do Módulo Posicional -->
    <div class="bg-white/80 dark:bg-[#181825]/80 border-b border-slate-200 dark:border-[#313244] px-4 lg:px-8 py-2.5">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <span class="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-sm">
            <i class="fa-solid fa-ruler-horizontal"></i>
          </span>
          <div>
            <h2 class="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">Módulo 2: Arquivos Posicionais e Padrão CNAB</h2>
            <p class="text-[11px] text-slate-500 dark:text-[#a6adc8]">Largura Fixa por Posição, Régua de Layout, Decimais Implícitos e Lotes Bancários FEBRABAN</p>
          </div>
        </div>
        <div class="flex items-center bg-slate-100 dark:bg-[#11111b] p-1 rounded-xl border border-slate-200 dark:border-[#313244]">
          <button id="pos-tab-btn-builder" onclick="switchPosTab('builder')" class="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm bg-white text-indigo-700 dark:bg-[#313244] dark:text-white border border-slate-200 dark:border-transparent">
            <i class="fa-solid fa-wand-magic-sparkles text-indigo-600 dark:text-amber-400"></i>
            <span>1. Construtor Guiado</span>
          </button>
          <button id="pos-tab-btn-validator" onclick="switchPosTab('validator')" class="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-[#a6adc8] hover:text-slate-900 dark:hover:text-white transition">
            <i class="fa-solid fa-file-circle-check text-emerald-600 dark:text-emerald-400"></i>
            <span>2. Validador de Arquivos</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ABA 1: CONSTRUTOR GUIADO POSICIONAL & CNAB -->
    <div id="pos-view-builder" class="flex-1 flex flex-col">
      <nav class="bg-slate-100/80 dark:bg-[#181825] border-b border-slate-200 dark:border-[#313244] px-4 py-2.5 overflow-x-auto no-scrollbar">
        <div class="max-w-7xl mx-auto flex items-center justify-between min-w-[680px] gap-2">
          <div id="pos-stepper-container" class="flex items-center gap-2.5 w-full justify-between"></div>
        </div>
      </nav>

      <main class="max-w-7xl mx-auto w-full flex-1 p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section class="lg:col-span-5 flex flex-col gap-5">
          <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-5 shadow-md dark:shadow-xl">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#313244] mb-4">
              <div class="flex items-center gap-2">
                <span id="pos-badge-step-number" class="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 font-mono">
                  PASSO 1 DE 6
                </span>
                <span id="pos-step-category" class="text-xs font-semibold text-slate-500 dark:text-[#a6adc8]">Anatomia Posicional</span>
              </div>
              <span id="pos-step-icon-container" class="text-indigo-600 dark:text-amber-400 text-lg">
                <i class="fa-solid fa-ruler-horizontal"></i>
              </span>
            </div>

            <h2 id="pos-step-title" class="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-snug"></h2>
            <p id="pos-step-description" class="text-sm text-slate-600 dark:text-[#bac2de] leading-relaxed mb-4"></p>

            <div class="p-3.5 rounded-xl bg-amber-50/80 border-l-4 border-amber-500 dark:bg-[#181825] dark:border-amber-400 flex items-start gap-3 mb-5">
              <i class="fa-solid fa-lightbulb text-amber-600 dark:text-amber-400 mt-0.5 text-base"></i>
              <div class="text-xs space-y-1">
                <strong class="text-amber-900 dark:text-amber-300 block font-bold">Regra Fundamental:</strong>
                <span id="pos-step-rule-text" class="text-slate-700 dark:text-[#a6adc8] font-medium leading-normal"></span>
              </div>
            </div>

            <div class="space-y-2 mb-5">
              <h3 class="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-[#a6adc8] flex items-center gap-1.5">
                <i class="fa-solid fa-microscope text-indigo-600 dark:text-indigo-400"></i> Anatomia dos Elementos Envolvidos
              </h3>
              <div id="pos-step-tokens-container" class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs"></div>
            </div>

            <div class="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-[#313244]">
              <button id="pos-btn-prev" onclick="posPrevStep()" class="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#313244] dark:hover:bg-[#45475a] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-700 dark:text-white flex items-center justify-center gap-2 transition shadow-sm border border-slate-200 dark:border-transparent">
                <i class="fa-solid fa-arrow-left"></i> Voltar
              </button>
              <button onclick="posReplayTyping()" title="Repetir Animação de Digitação" class="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#313244] dark:hover:bg-[#45475a] text-slate-700 dark:text-amber-300 transition border border-slate-200 dark:border-transparent">
                <i class="fa-solid fa-rotate-right"></i>
              </button>
              <button id="pos-btn-next" onclick="posNextStep()" class="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-indigo-500 text-xs font-bold text-white flex items-center justify-center gap-2 transition shadow-md shadow-indigo-600/20">
                <span>Avançar</span> <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <!-- Laboratório do Erro Posicional -->
          <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-5 shadow-md dark:shadow-xl">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-rose-100 dark:bg-red-500/20 text-rose-600 dark:text-red-400 flex items-center justify-center text-xs">
                  <i class="fa-solid fa-bug"></i>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-slate-900 dark:text-white">Laboratório do Erro Posicional</h3>
                  <p class="text-[11px] text-slate-500 dark:text-[#a6adc8]">Simule o efeito cascata com 1 clique</p>
                </div>
              </div>
              <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-red-500/10 dark:text-red-400 border border-rose-200 dark:border-red-500/20 font-bold">
                Interativo
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <button onclick="triggerPosTrap('cascade_shift')" class="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-[#181825] dark:hover:bg-red-500/10 border border-slate-200 hover:border-rose-400 dark:border-[#313244] dark:hover:border-red-500/40 text-xs transition group">
                <div class="font-bold text-slate-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-red-300 flex items-center justify-between">
                  <span>1. Efeito Cascata (-1 pos)</span>
                  <i class="fa-solid fa-triangle-exclamation text-xs text-rose-500 opacity-0 group-hover:opacity-100"></i>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-[#a6adc8] mt-0.5 font-mono"><code>Nome com 19 posições</code></p>
              </button>
              <button onclick="triggerPosTrap('explicit_comma')" class="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-[#181825] dark:hover:bg-red-500/10 border border-slate-200 hover:border-rose-400 dark:border-[#313244] dark:hover:border-red-500/40 text-xs transition group">
                <div class="font-bold text-slate-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-red-300 flex items-center justify-between">
                  <span>2. Vírgula no Valor</span>
                  <i class="fa-solid fa-triangle-exclamation text-xs text-rose-500 opacity-0 group-hover:opacity-100"></i>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-[#a6adc8] mt-0.5 font-mono"><code>0000150,50 (inválido)</code></p>
              </button>
              <button onclick="triggerPosTrap('space_in_numeric')" class="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-[#181825] dark:hover:bg-red-500/10 border border-slate-200 hover:border-rose-400 dark:border-[#313244] dark:hover:border-red-500/40 text-xs transition group">
                <div class="font-bold text-slate-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-red-300 flex items-center justify-between">
                  <span>3. Espaço em Numérico</span>
                  <i class="fa-solid fa-triangle-exclamation text-xs text-rose-500 opacity-0 group-hover:opacity-100"></i>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-[#a6adc8] mt-0.5 font-mono"><code>"     15050" s/ zeros</code></p>
              </button>
              <button onclick="triggerPosTrap('intruder_delimiter')" class="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-[#181825] dark:hover:bg-red-500/10 border border-slate-200 hover:border-rose-400 dark:border-[#313244] dark:hover:border-red-500/40 text-xs transition group">
                <div class="font-bold text-slate-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-red-300 flex items-center justify-between">
                  <span>4. Delimitador Intruso ;</span>
                  <i class="fa-solid fa-triangle-exclamation text-xs text-rose-500 opacity-0 group-hover:opacity-100"></i>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-[#a6adc8] mt-0.5 font-mono"><code>...SILVA;12345...</code></p>
              </button>
            </div>

            <div id="pos-trap-feedback-box" class="hidden p-3.5 rounded-xl bg-rose-50 border border-rose-200 dark:bg-[#181825] dark:border-red-500/30 transition-all">
              <div class="flex items-start gap-2.5">
                <i class="fa-solid fa-circle-xmark text-rose-600 dark:text-red-400 text-base mt-0.5"></i>
                <div class="text-xs space-y-1 flex-1">
                  <span id="pos-trap-error-title" class="font-bold text-rose-900 dark:text-red-300 block"></span>
                  <p id="pos-trap-error-desc" class="text-rose-800 dark:text-[#bac2de] font-mono text-[11px] bg-rose-100/70 dark:bg-red-950/40 p-2 rounded border border-rose-200 dark:border-red-900/50 my-1"></p>
                  <div class="mt-2 text-slate-700 dark:text-[#a6adc8]">
                    <strong class="text-emerald-700 dark:text-emerald-400 font-bold">Como corrigir:</strong>
                    <span id="pos-trap-fix-text"></span>
                  </div>
                </div>
              </div>
              <button onclick="restoreCleanPosCode()" class="mt-3 w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600/30 text-white dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm">
                <i class="fa-solid fa-wand-magic-sparkles"></i> Restaurar Posições Corretas (49 cols)
              </button>
            </div>
          </div>
        </section>

        <!-- Coluna Direita: Editor Posicional & Régua Interativa -->
        <section class="lg:col-span-7 flex flex-col gap-5">
          <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl shadow-lg dark:shadow-2xl overflow-hidden flex flex-col">
            <div class="bg-slate-100 dark:bg-[#181825] px-4 py-2.5 border-b border-slate-200 dark:border-[#313244] flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-rose-400 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
                <span class="ml-2 font-mono text-xs text-slate-700 dark:text-[#a6adc8] flex items-center gap-1.5 font-bold">
                  <i class="fa-solid fa-file-lines text-amber-500"></i> remessa_pagamentos.rem
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span id="pos-syntax-status-badge" class="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30 flex items-center gap-1.5 font-bold">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Layout 49 Posições Íntegro
                </span>
                <button onclick="copyCurrentPosCode()" title="Copiar Arquivo Posicional" class="p-1.5 text-xs text-slate-600 hover:text-slate-900 dark:text-[#a6adc8] dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-[#313244] transition">
                  <i class="fa-regular fa-copy"></i>
                </button>
              </div>
            </div>

            <div class="p-4 bg-slate-50/70 dark:bg-[#1e1e2e] font-mono text-sm leading-relaxed overflow-x-auto min-h-[160px]">
              <div id="pos-code-canvas" class="grid grid-cols-[38px_1fr] gap-3 min-w-[520px]"></div>
            </div>

            <div class="bg-slate-100 dark:bg-[#181825] px-4 py-2 border-t border-slate-200 dark:border-[#313244] flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-[#a6adc8] gap-2">
              <div class="flex items-center gap-3">
                <span><strong class="text-slate-900 dark:text-white">Layout:</strong> Nome(20) | CPF(11) | Valor(10) | Data(8)</span>
              </div>
              <span id="pos-char-count" class="font-mono font-medium">Largura: 49 posições</span>
            </div>
          </div>

          <!-- Régua Posicional Numerada & Mapa de Fatiamento -->
          <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-5 shadow-md dark:shadow-xl">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-[#313244]">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs">
                  <i class="fa-solid fa-ruler-combined"></i>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-slate-900 dark:text-white">Régua Posicional (1 a 49) & Mapa de Fatiamento pelo Layout</h3>
                  <p class="text-[11px] text-slate-500 dark:text-[#a6adc8]">Como o leitor corta cada faixa de colunas e reconstrói os tipos de dados</p>
                </div>
              </div>
              <span id="pos-range-badge" class="text-xs font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 dark:text-amber-300 dark:bg-amber-900/30 dark:border-amber-700/40 px-2.5 py-0.5 rounded">
                Foco: Posições 01 a 49
              </span>
            </div>
            <div id="pos-ruler-canvas"></div>
          </div>
        </section>
      </main>
    </div>

    <!-- ABA 2: VALIDADOR & AUDITOR DIDÁTICO POSICIONAL -->
    <div id="pos-view-validator" class="hidden flex-1 flex flex-col p-4 lg:p-6 max-w-7xl mx-auto w-full gap-6">
      <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="p-2 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 text-sm">
              <i class="fa-solid fa-ruler-horizontal"></i>
            </span>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Auditor e Validador Didático de Arquivos Posicionais</h2>
          </div>
          <p class="text-xs text-slate-600 dark:text-[#a6adc8] mt-1 max-w-3xl">
            Envie um arquivo posicional (<code>.txt</code>, <code>.rem</code>, <code>.ret</code>) ou cole suas linhas abaixo. O motor reconhece automaticamente os layouts canônicos da apostila (<strong>49 posições</strong> da Seção 5.2 ou <strong>24 posições</strong> da Seção 9), auditando largura fixa, alinhamento de espaços/zeros e decimais implícitos.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2 shrink-0">
          <span class="text-xs font-semibold text-slate-500 dark:text-[#a6adc8]">Carregar Exemplo:</span>
          <button onclick="loadPosValidatorPreset('valid49')" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30 transition">
            <i class="fa-solid fa-check"></i> Válido (49 pos)
          </button>
          <button onclick="loadPosValidatorPreset('valid24')" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-300 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30 transition">
            <i class="fa-solid fa-check"></i> Válido (24 pos)
          </button>
          <button onclick="loadPosValidatorPreset('err_shift')" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30 transition">
            <i class="fa-solid fa-bug"></i> Efeito Cascata
          </button>
          <button onclick="loadPosValidatorPreset('err_comma')" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30 transition">
            <i class="fa-solid fa-coins"></i> Vírgula no Valor
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-6 flex flex-col gap-4">
          <div id="pos-drop-zone" ondragover="handlePosDragOver(event)" ondragleave="handlePosDragLeave(event)" ondrop="handlePosFileDrop(event)"
            class="border-2 border-dashed border-slate-300 hover:border-indigo-500 dark:border-[#313244] dark:hover:border-indigo-400 bg-white dark:bg-[#181825] rounded-2xl p-5 text-center cursor-pointer transition shadow-sm flex flex-col items-center justify-center gap-2 group">
            <input type="file" id="pos-file-input" accept=".txt,.rem,.ret,text/plain" onchange="handlePosFileSelect(event)" class="hidden">
            <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 flex items-center justify-center text-xl group-hover:scale-110 transition">
              <i class="fa-solid fa-cloud-arrow-up"></i>
            </div>
            <div>
              <p class="text-sm font-bold text-slate-800 dark:text-white">
                Arraste e solte seu arquivo <span class="text-amber-600 dark:text-amber-400">.txt / .rem</span> aqui
              </p>
              <p class="text-xs text-slate-500 dark:text-[#a6adc8] mt-0.5">ou clique para selecionar do seu dispositivo</p>
            </div>
            <button type="button" onclick="document.getElementById('pos-file-input').click()" class="mt-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#313244] dark:hover:bg-[#45475a] text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-transparent">
              Escolher Arquivo Posicional
            </button>
          </div>

          <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl overflow-hidden shadow-md flex flex-col">
            <div class="bg-slate-100 dark:bg-[#181825] px-4 py-2.5 border-b border-slate-200 dark:border-[#313244] flex items-center justify-between">
              <span class="text-xs font-bold text-slate-700 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-ruler-horizontal text-amber-600 dark:text-amber-400"></i> Entrada Posicional / Editor Direto
              </span>
              <div class="flex items-center gap-1">
                <button onclick="normalizePosValidatorText()" title="Normalizar quebras de linha sem indentar" class="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-200 hover:bg-slate-300 dark:bg-[#313244] dark:hover:bg-[#45475a] text-slate-700 dark:text-slate-200 transition">
                  <i class="fa-solid fa-arrows-up-down text-amber-500"></i> Ajustar Quebras
                </button>
                <button onclick="clearPosValidatorEditor()" title="Limpar editor" class="px-2.5 py-1 rounded-md text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition">
                  <i class="fa-solid fa-trash-can"></i> Limpar
                </button>
              </div>
            </div>

            <div class="relative p-3 bg-slate-50/50 dark:bg-[#1e1e2e]">
              <textarea id="pos-validator-input" rows="12" spellcheck="false" oninput="runPosValidation()" placeholder="Cole aqui suas linhas posicionais (49 ou 24 colunas por linha)..."
                class="w-full bg-white dark:bg-[#11111b] text-slate-800 dark:text-[#cdd6f4] font-mono text-xs p-3 rounded-xl border border-slate-300 dark:border-[#313244] focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed resize-y whitespace-pre overflow-x-auto"></textarea>
            </div>

            <div class="bg-slate-100 dark:bg-[#181825] px-4 py-2 border-t border-slate-200 dark:border-[#313244] flex items-center justify-between text-xs text-slate-600 dark:text-[#a6adc8]">
              <span id="pos-validator-file-name" class="font-mono text-[11px] truncate max-w-[200px]">Nenhum arquivo carregado</span>
              <span id="pos-validator-stats-text" class="font-mono text-[11px]">0 linhas • 0 bytes</span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-6 flex flex-col gap-4">
          <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-5 shadow-md flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div id="pos-validator-badge-icon" class="w-10 h-10 rounded-xl bg-slate-200 text-slate-600 dark:bg-[#313244] dark:text-[#a6adc8] flex items-center justify-center text-lg">
                  <i class="fa-solid fa-circle-question"></i>
                </div>
                <div>
                  <h3 id="pos-validator-status-title" class="text-base font-extrabold text-slate-900 dark:text-white">
                    Aguardando arquivo posicional para validação
                  </h3>
                  <p id="pos-validator-status-subtitle" class="text-xs text-slate-500 dark:text-[#a6adc8]">
                    Cole registros de largura fixa (49 ou 24 posições) ou envie um arquivo .txt/.rem
                  </p>
                </div>
              </div>
            </div>

            <!-- Seção de Erro Posicional -->
            <div id="pos-validator-error-section" class="hidden flex flex-col gap-3">
              <div class="p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-500/30 flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    Localização: Linha <span id="pos-error-loc-line" class="font-mono text-sm underline font-black">0</span>, Posição <span id="pos-error-loc-col" class="font-mono text-sm underline font-black">0</span>
                  </span>
                  <span id="pos-error-category-badge" class="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-900 dark:bg-rose-800/50 dark:text-rose-200">
                    Layout Error
                  </span>
                </div>
                <div class="mt-1 font-mono text-xs bg-slate-900 text-rose-200 p-3 rounded-lg overflow-x-auto shadow-inner border border-rose-900/40">
                  <div id="pos-error-code-preview" class="leading-relaxed"></div>
                </div>
              </div>

              <div class="p-4 rounded-xl bg-amber-50/80 border-l-4 border-amber-500 dark:bg-[#181825] dark:border-amber-400 space-y-2">
                <h4 class="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <i class="fa-solid fa-graduation-cap"></i> O que quebrou e Por Que é Inválido?
                </h4>
                <p id="pos-error-didactic-why" class="text-xs text-slate-700 dark:text-[#bac2de] leading-relaxed"></p>
              </div>

              <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-500/30 space-y-2">
                <h4 class="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <i class="fa-solid fa-screwdriver-wrench"></i> Como Corrigir Este Ponto
                </h4>
                <div id="pos-error-didactic-fix" class="text-xs text-slate-700 dark:text-[#a6adc8] leading-relaxed font-mono"></div>
              </div>
            </div>

            <!-- Seção de Sucesso Posicional -->
            <div id="pos-validator-success-section" class="hidden flex flex-col gap-4">
              <div class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30 flex items-center gap-3">
                <i class="fa-solid fa-shield-check text-emerald-600 dark:text-emerald-400 text-xl"></i>
                <div class="text-xs">
                  <strong class="text-emerald-900 dark:text-emerald-300 block font-bold">Largura Fixa e Tipos 100% Conformes!</strong>
                  <span class="text-emerald-800 dark:text-[#a6adc8]">Todas as linhas respeitam o comprimento exato, o preenchimento de espaços/zeros e os decimais implícitos.</span>
                </div>
              </div>

              <div>
                <h4 class="text-xs font-bold text-slate-500 dark:text-[#a6adc8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <i class="fa-solid fa-chart-pie text-amber-600 dark:text-amber-400"></i> Métricas & Auditoria Posicional
                </h4>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div class="bg-slate-50 dark:bg-[#181825] p-3 rounded-xl border border-slate-200 dark:border-[#313244]">
                    <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">Layout Ativo</span>
                    <span id="pos-metric-layout" class="text-xs font-extrabold text-amber-700 dark:text-amber-400 font-mono">49 pos</span>
                  </div>
                  <div class="bg-slate-50 dark:bg-[#181825] p-3 rounded-xl border border-slate-200 dark:border-[#313244]">
                    <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">Registros</span>
                    <span id="pos-metric-records" class="text-base font-extrabold text-blue-700 dark:text-blue-400 font-mono">0</span>
                  </div>
                  <div class="bg-slate-50 dark:bg-[#181825] p-3 rounded-xl border border-slate-200 dark:border-[#313244]">
                    <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">Tamanho / Linha</span>
                    <span id="pos-metric-len" class="text-base font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">49 cols</span>
                  </div>
                  <div class="bg-slate-50 dark:bg-[#181825] p-3 rounded-xl border border-slate-200 dark:border-[#313244]">
                    <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">Campos / Linha</span>
                    <span id="pos-metric-fields" class="text-base font-extrabold text-indigo-700 dark:text-indigo-400 font-mono">4</span>
                  </div>
                  <div class="bg-slate-50 dark:bg-[#181825] p-3 rounded-xl border border-slate-200 dark:border-[#313244]">
                    <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">Preenchimento (␣/0)</span>
                    <span id="pos-metric-padding" class="text-xs font-extrabold text-purple-700 dark:text-purple-400 font-mono">0 chars</span>
                  </div>
                  <div class="bg-slate-50 dark:bg-[#181825] p-3 rounded-xl border border-slate-200 dark:border-[#313244]">
                    <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">Total / Média</span>
                    <span id="pos-metric-sum" class="text-xs font-extrabold text-sky-700 dark:text-sky-400 font-mono">R$ 0,00</span>
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <h4 class="text-xs font-bold text-slate-500 dark:text-[#a6adc8] uppercase tracking-wider flex items-center justify-between">
                  <span><i class="fa-solid fa-scissors text-amber-600 dark:text-amber-400"></i> Fatiamento Interpretado dos Registros</span>
                  <button onclick="copyCurrentPosValidatorText()" class="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    <i class="fa-regular fa-copy"></i> Copiar Posicional
                  </button>
                </h4>
                <div id="pos-validator-slices-preview" class="p-3 bg-slate-50 dark:bg-[#181825] border border-slate-200 dark:border-[#313244] rounded-xl font-mono text-xs max-h-64 overflow-y-auto space-y-2.5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
}

export function initPositionalModule() {
  Object.assign(window, {
    switchPosTab,
    posGoToStep,
    posNextStep,
    posPrevStep,
    posReplayTyping,
    triggerPosTrap,
    restoreCleanPosCode,
    copyCurrentPosCode,
    loadPosValidatorPreset,
    handlePosDragOver,
    handlePosDragLeave,
    handlePosFileDrop,
    handlePosFileSelect,
    clearPosValidatorEditor,
    normalizePosValidatorText,
    copyCurrentPosValidatorText,
    runPosValidation,
  });

  updateAllPosViews(false);
  loadPosValidatorPreset('valid49');
}
