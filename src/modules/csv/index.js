/**
 * Módulo 1: Arquivos CSV (Comma-Separated Values)
 * Base Canônica: Seção 4 de conteudo/04 - Arquivos Texto.pdf
 * Estrutura Pedagógica Dupla: 1. Construtor Guiado + Armadilhas | 2. Validador & Auditor de Arquivos CSV
 */
import {
  escapeHtmlText,
  showToast,
  copyTextToClipboard,
  MAX_UPLOAD_SIZE_BYTES,
} from '../../core/sanitizer.js';
import { playTone } from '../../core/audio.js';
import { getIsDarkMode } from '../../core/theme.js';

export const CSV_MODULE_ID = 'csv';

let csvCurrentStepIndex = 0;
let csvTypingTimeout = null;

export const csvStepsData = [
  {
    stepNumber: 1,
    title: 'O Cabeçalho e as Colunas',
    category: 'Estrutura Tabular',
    icon: 'fa-solid fa-table-columns',
    description:
      'CSV (Comma-Separated Values) é uma "planilha em texto puro". A primeira linha geralmente representa o CABEÇALHO, definindo os nomes das colunas separadas por um delimitador.',
    rule: 'Cada nome separado pelo delimitador na linha 1 batiza uma coluna da tabela. Sem cabeçalho, quem recebe o arquivo não sabe o que significa cada coluna.',
    tokens: [
      {
        label: 'Coluna "nome"',
        lightColor: 'text-teal-800 font-bold',
        darkColor: 'text-[#94e2d5]',
        desc: '1º campo do cabeçalho',
      },
      {
        label: 'Delimitador ,',
        lightColor: 'text-rose-700 font-bold',
        darkColor: 'text-[#f38ba8]',
        desc: 'Vírgula separadora de campos',
      },
      {
        label: 'Coluna "curso"',
        lightColor: 'text-teal-800 font-bold',
        darkColor: 'text-[#94e2d5]',
        desc: '2º campo do cabeçalho',
      },
      {
        label: 'Coluna "nota"',
        lightColor: 'text-teal-800 font-bold',
        darkColor: 'text-[#94e2d5]',
        desc: '3º campo do cabeçalho',
      },
    ],
    rawCsv: 'nome,curso,nota',
    delimiter: ',',
    highlightLines: [1],
  },
  {
    stepNumber: 2,
    title: 'Registros (Linhas) e Campos',
    category: 'Preenchimento de Dados',
    icon: 'fa-solid fa-bars-staggered',
    description:
      'Abaixo do cabeçalho, cada nova linha do arquivo representa um REGISTRO completo (uma linha da tabela), e cada valor separado pelo delimitador é um CAMPO.',
    rule: 'Toda linha de dados deve conter exatamente a mesma quantidade de campos definida no cabeçalho (neste caso, 3 campos separados por 2 vírgulas).',
    tokens: [
      {
        label: 'Registro 1',
        lightColor: 'text-blue-800 font-bold',
        darkColor: 'text-[#89b4fa]',
        desc: 'Linha de dados da Ana',
      },
      {
        label: 'Campo "Sistemas"',
        lightColor: 'text-emerald-800 font-bold',
        darkColor: 'text-[#a6e3a1]',
        desc: 'Valor da 2ª coluna',
      },
      {
        label: 'Decimal 8.5',
        lightColor: 'text-amber-800 font-bold',
        darkColor: 'text-[#f9e2af]',
        desc: 'Ponto decimal (padrão EUA)',
      },
    ],
    rawCsv: 'nome,curso,nota\nAna,Sistemas,8.5\nBruno,Sistemas,7.0\nCarla,Direito,9.2',
    delimiter: ',',
    highlightLines: [2, 3, 4],
  },
  {
    stepNumber: 3,
    title: 'O Caso Brasileiro: Vírgula × Ponto e Vírgula',
    category: 'Padrão Regional (Brasil)',
    icon: 'fa-solid fa-earth-americas',
    description:
      'No Brasil, o separador decimal oficial é a vírgula (`8,5`). Por isso, planilhas configuradas em português geram arquivos CSV usando o PONTO E VÍRGULA (`;`) como delimitador de colunas!',
    rule: 'Se usarmos vírgula tanto para separar colunas quanto para separar decimais (`8,5`), o número será partido em duas colunas. Por isso o padrão brasileiro adota `;`.',
    tokens: [
      {
        label: 'Delimitador ;',
        lightColor: 'text-rose-700 font-bold',
        darkColor: 'text-[#f38ba8]',
        desc: 'Ponto e vírgula separa colunas',
      },
      {
        label: 'Nota 8,5',
        lightColor: 'text-sky-800 font-bold',
        darkColor: 'text-[#89b4fa]',
        desc: 'Vírgula decimal preservada',
      },
    ],
    rawCsv: 'nome;curso;nota\nAna;Sistemas;8,5\nBruno;Sistemas;7,0\nCarla;Direito;9,2',
    delimiter: ';',
    highlightLines: [1, 2, 3, 4],
  },
  {
    stepNumber: 4,
    title: 'Qualificador de Texto: Protegendo o Delimitador',
    category: 'Campos com Vírgula Interna',
    icon: 'fa-solid fa-shield-halved',
    description:
      'O que acontece quando o próprio texto de um campo contém uma vírgula (como `"Silva, Maria"` ou `"Rua das Flores, 123"`)? Usamos ASPAS DUPLAS como qualificador de texto!',
    rule: 'Qualquer delimitador que esteja dentro de um par de aspas duplas `"..."` é tratado como parte do texto e NÃO divide a coluna.',
    tokens: [
      {
        label: 'Qualificador " "',
        lightColor: 'text-amber-800 font-bold',
        darkColor: 'text-[#fab387]',
        desc: 'Protege o campo inteiro',
      },
      {
        label: '"Silva, Maria"',
        lightColor: 'text-emerald-800 font-bold',
        darkColor: 'text-[#a6e3a1]',
        desc: 'Vírgula interna ignorada',
      },
      {
        label: '"Rua das Flores, 123"',
        lightColor: 'text-emerald-800 font-bold',
        darkColor: 'text-[#a6e3a1]',
        desc: 'Endereço mantido em 1 coluna',
      },
    ],
    rawCsv:
      'nome,endereco,nota\n"Silva, Maria","Rua das Flores, 123",8.5\nBruno,"Av. Brasil, 45",7.0',
    delimiter: ',',
    highlightLines: [2, 3],
  },
  {
    stepNumber: 5,
    title: 'Aspas Duplicadas ("") e Zeros à Esquerda',
    category: 'Regras de Escape e Tipagem',
    icon: 'fa-solid fa-quote-right',
    description:
      'Se um campo protegido por aspas também tiver aspas no meio do texto (como um apelido), duplicamos as aspas internas (`""Zé""`). Além disso, códigos como CPF/CEP com zero à esquerda (`00123`) devem ser tratados como texto.',
    rule: 'Dentro de um campo qualificado `"..."`, duas aspas duplas seguidas `""` representam um único caractere `"` literal. E cuidado ao abrir no Excel: sem tratamento textual, `00123` vira `123`!',
    tokens: [
      {
        label: 'Escape ""Zé""',
        lightColor: 'text-purple-800 font-bold',
        darkColor: 'text-[#cba6f7]',
        desc: 'Aspas internas duplicadas',
      },
      {
        label: 'Código "00123"',
        lightColor: 'text-sky-800 font-bold',
        darkColor: 'text-[#89b4fa]',
        desc: 'Zero à esquerda preservado',
      },
    ],
    rawCsv:
      'nome,endereco,codigo_matricula\n"Silva, Maria","Rua das Flores, 123","00123"\n"Pedro ""Zé"" Souza","Av. Brasil, 45","00450"',
    delimiter: ',',
    highlightLines: [2, 3],
  },
  {
    stepNumber: 6,
    title: 'O Arquivo CSV Consolidado',
    category: 'Consolidação Tabular',
    icon: 'fa-solid fa-file-csv',
    description:
      'Excelente! Nosso arquivo CSV combina cabeçalho claro, delimitador consistente (`;`), notas no formato brasileiro e qualificadores de texto seguros para intercâmbio entre sistemas e planilhas.',
    rule: 'No CSV puro não existem tipos nativos nem hierarquia: tudo é texto organizado em linhas (registros) e colunas (campos).',
    tokens: [
      {
        label: 'Cabeçalho',
        lightColor: 'text-teal-800 font-bold',
        darkColor: 'text-[#94e2d5]',
        desc: 'Linha 1 com 4 colunas',
      },
      {
        label: 'Delimitador ;',
        lightColor: 'text-rose-700 font-bold',
        darkColor: 'text-[#f38ba8]',
        desc: 'Padrão seguro para decimal BR',
      },
      {
        label: 'Qualificadores',
        lightColor: 'text-emerald-800 font-bold',
        darkColor: 'text-[#a6e3a1]',
        desc: 'Aspas duplas quando necessário',
      },
      {
        label: 'Zeros à Esquerda',
        lightColor: 'text-sky-800 font-bold',
        darkColor: 'text-[#89b4fa]',
        desc: 'CPF/Matrícula como texto',
      },
    ],
    rawCsv:
      'matricula;nome;curso;nota\n00123;"Silva, Ana";Sistemas;8,5\n00124;"Pedro ""Zé"" Souza";Sistemas;7,0\n00125;Carla Oliveira;Direito;9,2',
    delimiter: ';',
    highlightLines: [1, 2, 3, 4],
  },
];

export const csvTraps = {
  decimal_collision: {
    title: 'Erro: Vírgula Decimal Colidindo com Delimitador Vírgula',
    rawCode: 'nome,curso,nota\nAna,Sistemas,8,5\nBruno,Sistemas,7,0',
    delimiter: ',',
    highlightLine: 2,
    errorDesc:
      'A linha 2 possui 4 campos ("Ana", "Sistemas", "8", "5"), mas o cabeçalho define apenas 3 colunas ("nome", "curso", "nota")!',
    fix: 'Use ponto e vírgula `;` como delimitador da planilha (`Ana;Sistemas;8,5`) ou proteja o valor com ponto decimal (`8.5`).',
  },
  unquoted_delimiter: {
    title: 'Erro: Campo com Vírgula Interna sem Aspas Protetoras',
    rawCode: 'nome,endereco,nota\nMaria,Rua das Flores, 123,8.5',
    delimiter: ',',
    highlightLine: 2,
    errorDesc:
      'A vírgula em "Rua das Flores, 123" foi interpretada como separador de coluna, deslocando "123" para a coluna "nota" e criando uma 4ª coluna órfã!',
    fix: 'Envolva todo campo que contenha o delimitador entre aspas duplas: `"Rua das Flores, 123"`.',
  },
  unescaped_quotes: {
    title: 'Erro: Aspas Internas Não Duplicadas',
    rawCode: 'nome,curso,nota\n"Pedro "Zé" Souza",Sistemas,8.5',
    delimiter: ',',
    highlightLine: 2,
    errorDesc:
      'Erro Léxico na coluna 9: a aspa antes de Zé fechou prematuramente o qualificador do campo, deixando `Zé" Souza"` corrompido!',
    fix: 'Dentro de um campo entre aspas, duplique qualquer aspa interna: `"Pedro ""Zé"" Souza"`.',
  },
  column_mismatch: {
    title: 'Erro: Registro com Colunas Faltantes (Tabela Desalinhada)',
    rawCode: 'nome;curso;nota\nAna;Sistemas;8,5\nBruno;Sistemas\nCarla;Direito;9,2',
    delimiter: ';',
    highlightLine: 3,
    errorDesc:
      'Inconsistência Tabular na linha 3: encontrados apenas 2 campos para 3 colunas do cabeçalho. O campo "nota" está ausente!',
    fix: 'Garanta que todos os registros tenham o mesmo número de delimitadores do cabeçalho (mesmo que o valor seja vazio: `Bruno;Sistemas;`).',
  },
};

export const csvValidatorPresets = {
  valid:
    'matricula;nome;curso;nota\n00123;"Silva, Ana";Sistemas;8,5\n00124;"Pedro ""Zé"" Souza";Sistemas;7,0\n00125;Carla Oliveira;Direito;9,2',
  err_decimal: 'nome,curso,nota\nAna,Sistemas,8,5\nBruno,Sistemas,7,0',
  err_quotes: 'nome;endereco;nota\n"Pedro "Zé" Souza";Rua A, 10;8,5',
  err_cols: 'nome;curso;nota\nAna;Sistemas;8,5\nBruno;Sistemas',
};

export function stopCsvTyping() {
  if (csvTypingTimeout) {
    clearTimeout(csvTypingTimeout);
    csvTypingTimeout = null;
  }
}

export function detectCsvDelimiter(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return ';';
  const header = lines[0];
  const countOutsideQuotes = (line, ch) => {
    let inQuotes = false;
    let count = 0;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') {
        if (inQuotes && line[i + 1] === '"') {
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (!inQuotes && line[i] === ch) {
        count++;
      }
    }
    return count;
  };

  const semiCount = countOutsideQuotes(header, ';');
  const commaCount = countOutsideQuotes(header, ',');
  const pipeCount = countOutsideQuotes(header, '|');
  const tabCount = countOutsideQuotes(header, '\t');

  if (semiCount >= commaCount && semiCount > 0) return ';';
  if (commaCount > 0) return ',';
  if (pipeCount > 0) return '|';
  if (tabCount > 0) return '\t';
  return ';';
}

/**
 * Analisa uma única linha CSV segundo RFC 4180 + Delimitador Informado.
 * Retorna { fields, quotedCount, error }
 */
export function parseCsvLine(line, delimiter = ';') {
  const fields = [];
  let current = '';
  let inQuotes = false;
  let fieldQuoted = false;
  let quotedCount = 0;
  let justClosedQuote = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
          justClosedQuote = true;
        }
      } else {
        current += ch;
      }
    } else {
      if (justClosedQuote) {
        if (ch === delimiter) {
          fields.push({ value: current, quoted: fieldQuoted });
          current = '';
          fieldQuoted = false;
          justClosedQuote = false;
          continue;
        } else if (ch === ' ' || ch === '\t') {
          continue;
        } else {
          return {
            fields,
            quotedCount,
            error: {
              col: i + 1,
              code: 'UNESCAPED_QUOTE',
              message: `Caractere '${ch}' inesperado após fechamento de aspas na coluna ${i + 1}. Aspas internas devem ser duplicadas ("").`,
            },
          };
        }
      }

      if (ch === '"') {
        if (current.length === 0) {
          inQuotes = true;
          fieldQuoted = true;
          quotedCount++;
        } else {
          return {
            fields,
            quotedCount,
            error: {
              col: i + 1,
              code: 'MID_FIELD_QUOTE',
              message: `Aspas duplas encontradas no meio de um campo não qualificado na coluna ${i + 1}.`,
            },
          };
        }
      } else if (ch === delimiter) {
        fields.push({ value: current, quoted: fieldQuoted });
        current = '';
        fieldQuoted = false;
      } else {
        current += ch;
      }
    }
  }

  if (inQuotes) {
    return {
      fields,
      quotedCount,
      error: {
        col: line.length,
        code: 'UNCLOSED_QUOTE',
        message: 'Qualificador de texto (aspas duplas ") aberto e não fechado até o fim da linha.',
      },
    };
  }

  fields.push({ value: current, quoted: fieldQuoted });
  return { fields, quotedCount, error: null };
}

/**
 * Valida e Audita um texto CSV completo sem exigir configuração manual.
 */
export function validateCsvText(rawText) {
  const normalized = (rawText || '').replace(/\r\n/g, '\n');
  const rawLines = normalized.split('\n');
  // Ignora linhas em branco apenas no final do arquivo
  while (rawLines.length > 1 && rawLines[rawLines.length - 1].trim() === '') {
    rawLines.pop();
  }

  const delimiter = detectCsvDelimiter(normalized);
  const parsedRows = [];
  let totalQuotedFields = 0;
  let leadingZeroCount = 0;

  for (let idx = 0; idx < rawLines.length; idx++) {
    const lineNum = idx + 1;
    const lineText = rawLines[idx];

    if (lineText.trim() === '') {
      return {
        valid: false,
        line: lineNum,
        col: 1,
        category: 'CSV: Linha Vazia Intermediária',
        headline: 'Linha em Branco no Meio da Tabela',
        explanation:
          'Um arquivo CSV não deve conter linhas vazias entre os registros, pois leitores de dados interpretam como um registro sem colunas.',
        fixSuggestion: `Remova a linha em branco na linha ${lineNum}.`,
        lineText,
      };
    }

    const res = parseCsvLine(lineText, delimiter);
    if (res.error) {
      const isUnescaped =
        res.error.code === 'UNESCAPED_QUOTE' || res.error.code === 'MID_FIELD_QUOTE';
      return {
        valid: false,
        line: lineNum,
        col: res.error.col,
        category: isUnescaped ? 'CSV: Escape de Aspas ("")' : 'CSV: Qualificador Não Fechado',
        headline: isUnescaped
          ? 'Aspas Internas Não Duplicadas ou Fora de Lugar'
          : 'Qualificador de Aspas Duplas Não Fechado',
        explanation: isUnescaped
          ? `Na linha ${lineNum}, o campo utiliza aspas duplas no meio do texto sem seguir a regra de duplicação (<code>""</code>). Quando um campo começa com <code>"</code>, qualquer <code>"</code> sozinho encerra o campo imediatamente.`
          : `Na linha ${lineNum}, um campo começou com aspas duplas <code>"</code>, mas a linha terminou sem a aspa de fechamento correspondente.`,
        fixSuggestion: isUnescaped
          ? 'Envolva o campo inteiro com aspas duplas e duplique as aspas internas: ex. <code>"Pedro ""Zé"" Souza"</code>.'
          : 'Adicione a aspa dupla <code>"</code> de fechamento ao final do campo.',
        lineText,
      };
    }

    totalQuotedFields += res.quotedCount;
    parsedRows.push({
      lineNum,
      lineText,
      fields: res.fields,
    });
  }

  if (parsedRows.length === 0) {
    return { valid: false, empty: true };
  }

  const headerFields = parsedRows[0].fields;
  const expectedCols = headerFields.length;

  if (expectedCols < 2) {
    return {
      valid: false,
      line: 1,
      col: Math.max(1, parsedRows[0].lineText.length),
      category: 'CSV: Sem Delimitador de Colunas',
      headline: 'Nenhum Delimitador Detectado no Cabeçalho',
      explanation:
        'A primeira linha contém apenas 1 coluna e nenhum delimitador (<code>;</code> ou <code>,</code>). Um arquivo CSV tabular deve separar os campos por delimitador.',
      fixSuggestion:
        'Separe os nomes das colunas na primeira linha usando ponto e vírgula (ex.: <code>nome;curso;nota</code>) ou vírgula.',
      lineText: parsedRows[0].lineText,
    };
  }

  for (let i = 1; i < parsedRows.length; i++) {
    const row = parsedRows[i];
    const actualCols = row.fields.length;

    if (actualCols !== expectedCols) {
      // Verifica se foi colisão de vírgula decimal (delimitador ',' e dois campos numéricos seguidos)
      const hasDecimalSplit =
        delimiter === ',' &&
        actualCols > expectedCols &&
        row.fields.some(
          (f, idx) =>
            idx < row.fields.length - 1 &&
            /^\d+$/.test(f.value.trim()) &&
            /^\d+$/.test(row.fields[idx + 1].value.trim())
        );

      const errorCol =
        actualCols > expectedCols
          ? Math.max(1, row.lineText.lastIndexOf(delimiter) + 1)
          : row.lineText.length + 1;

      if (hasDecimalSplit) {
        return {
          valid: false,
          line: row.lineNum,
          col: errorCol,
          category: 'CSV: Colisão de Vírgula Decimal',
          headline: 'Vírgula Decimal Quebrou a Linha em Colunas Extras',
          explanation: `A linha ${row.lineNum} possui <strong>${actualCols} campos</strong>, mas o cabeçalho define apenas <strong>${expectedCols} colunas</strong>. Como o delimitador do arquivo é a vírgula (<code>,</code>), um número com vírgula decimal (ex.: <code>8,5</code>) foi partido em duas colunas diferentes!`,
          fixSuggestion:
            'No padrão brasileiro, utilize ponto e vírgula (<code>;</code>) como delimitador das colunas ou escreva decimais com ponto (<code>8.5</code>).',
          lineText: row.lineText,
        };
      }

      return {
        valid: false,
        line: row.lineNum,
        col: errorCol,
        category: 'CSV: Divergência de Colunas',
        headline: `Quantidade de Campos Inconsistente (${actualCols} de ${expectedCols})`,
        explanation: `O cabeçalho na linha 1 define <strong>${expectedCols} colunas</strong> (${headerFields.map((h) => `<code>${escapeHtmlText(h.value)}</code>`).join(', ')}), porém a linha ${row.lineNum} entregou <strong>${actualCols} campos</strong>. Isso ocorre quando falta um delimitador ou quando um campo contém o delimitador sem estar protegido por aspas duplas.`,
        fixSuggestion:
          actualCols > expectedCols
            ? `Se um dos campos contiver <code>${delimiter}</code> no texto (como endereço ou nome), envolva esse campo entre aspas duplas <code>"..."</code>.`
            : `Adicione os campos/delimitadores faltantes na linha ${row.lineNum} para completar as ${expectedCols} colunas.`,
        lineText: row.lineText,
      };
    }

    row.fields.forEach((f) => {
      if (/^0\d+$/.test(f.value.trim())) {
        leadingZeroCount++;
      }
    });
  }

  return {
    valid: true,
    delimiter,
    header: headerFields.map((f) => f.value),
    records: parsedRows.slice(1).map((r) => r.fields.map((f) => f.value)),
    metrics: {
      totalRecords: parsedRows.length - 1,
      totalColumns: expectedCols,
      delimiterLabel:
        delimiter === ';'
          ? 'Ponto e vírgula (;)'
          : delimiter === ','
            ? 'Vírgula (,)'
            : delimiter === '|'
              ? 'Pipe (|)'
              : 'Tab (\\t)',
      quotedFields: totalQuotedFields,
      totalCells: (parsedRows.length - 1) * expectedCols,
      leadingZeros: leadingZeroCount,
    },
  };
}

export function colorizeCsvLine(lineText, delimiter = ',', isHeader = false) {
  if (!lineText) return '&nbsp;';
  let html = '';
  let inQuotes = false;
  let token = '';

  const flushToken = (t, quoted) => {
    if (!t) return;
    if (isHeader) {
      html += `<span class="token-header">${escapeHtmlText(t)}</span>`;
    } else if (quoted) {
      html += `<span class="token-string">${escapeHtmlText(t)}</span>`;
    } else if (/^-?\d+(?:[.,]\d+)?$/.test(t.trim())) {
      html += `<span class="token-number">${escapeHtmlText(t)}</span>`;
    } else {
      html += `<span class="token-plain">${escapeHtmlText(t)}</span>`;
    }
  };

  for (let i = 0; i < lineText.length; i++) {
    const ch = lineText[i];
    if (ch === '"') {
      token += ch;
      if (inQuotes && lineText[i + 1] === '"') {
        token += lineText[i + 1];
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (!inQuotes && ch === delimiter) {
      flushToken(token, token.startsWith('"'));
      token = '';
      html += `<span class="token-delim">${escapeHtmlText(ch)}</span>`;
    } else {
      token += ch;
    }
  }
  flushToken(token, token.startsWith('"'));
  return html || '&nbsp;';
}

export function switchCsvTab(tabId) {
  const builderTab = document.getElementById('csv-view-builder');
  const validatorTab = document.getElementById('csv-view-validator');
  const btnBuilder = document.getElementById('csv-tab-btn-builder');
  const btnValidator = document.getElementById('csv-tab-btn-validator');
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
    stopCsvTyping();
    builderTab.classList.add('hidden');
    validatorTab.classList.remove('hidden');
    btnValidator.className =
      'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm bg-white text-emerald-700 dark:bg-[#313244] dark:text-white border border-slate-200 dark:border-transparent';
    btnBuilder.className =
      'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-[#a6adc8] hover:text-slate-900 dark:hover:text-white transition';
    playTone('G5');
    runCsvValidation();
  }
}

export function renderCsvStepper() {
  const container = document.getElementById('csv-stepper-container');
  if (!container) return;
  container.innerHTML = csvStepsData
    .map((step, idx) => {
      const isCurrent = idx === csvCurrentStepIndex;
      const isCompleted = idx < csvCurrentStepIndex;
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
        <button onclick="csvGoToStep(${idx})" class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all border shrink-0 ${statusClass}">
          <span class="w-5 h-5 rounded-full flex items-center justify-center font-mono text-[11px] font-bold ${isCurrent ? 'bg-white text-indigo-900' : isCompleted ? 'bg-emerald-600 text-white dark:bg-emerald-500/30 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-black/30 dark:text-slate-300'}">
            ${isCompleted ? '<i class="fa-solid fa-check text-[10px]"></i>' : idx + 1}
          </span>
          <span class="font-medium whitespace-nowrap">${step.title.split(' ')[0]} ${step.title.split(' ')[1] || ''}</span>
        </button>
      `;
    })
    .join('');
}

export function renderCsvLesson() {
  const step = csvStepsData[csvCurrentStepIndex];
  const badgeEl = document.getElementById('csv-badge-step-number');
  if (!badgeEl) return;

  const isDarkMode = getIsDarkMode();
  badgeEl.innerText = `PASSO ${step.stepNumber} DE ${csvStepsData.length}`;
  document.getElementById('csv-step-category').innerText = step.category;
  document.getElementById('csv-step-icon-container').innerHTML = `<i class="${step.icon}"></i>`;
  document.getElementById('csv-step-title').innerText = step.title;
  document.getElementById('csv-step-description').innerText = step.description;
  document.getElementById('csv-step-rule-text').innerText = step.rule;

  const tokenContainer = document.getElementById('csv-step-tokens-container');
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

  document.getElementById('csv-btn-prev').disabled = csvCurrentStepIndex === 0;
  const nextBtn = document.getElementById('csv-btn-next');
  nextBtn.innerHTML =
    csvCurrentStepIndex === csvStepsData.length - 1
      ? `<span>Finalizar</span> <i class="fa-solid fa-check"></i>`
      : `<span>Avançar</span> <i class="fa-solid fa-arrow-right"></i>`;
  document.getElementById('csv-trap-feedback-box').classList.add('hidden');
  updateCsvSyntaxBadge(true);
}

export function renderCsvCodeEditor(animated = true) {
  const step = csvStepsData[csvCurrentStepIndex];
  const codeCanvas = document.getElementById('csv-code-canvas');
  if (!codeCanvas) return;

  const lines = step.rawCsv.split('\n');
  stopCsvTyping();
  const isDarkMode = getIsDarkMode();
  const gutterClass = isDarkMode
    ? 'text-[#585b70] border-r border-[#313244]'
    : 'text-slate-400 border-r border-slate-300 font-semibold';

  document.getElementById('csv-delim-indicator').innerText =
    step.delimiter === ';' ? 'Ponto e vírgula (;)' : 'Vírgula (,)';

  if (!animated) {
    codeCanvas.innerHTML = lines
      .map((line, i) => {
        const lineNum = i + 1;
        const isActive = step.highlightLines.includes(lineNum);
        return `
          <div class="${gutterClass} select-none text-right font-mono pr-2.5 text-xs leading-6">${lineNum}</div>
          <div class="pl-2 font-mono text-xs leading-6 whitespace-pre ${isActive ? 'highlight-active-row rounded font-medium' : ''}">
            ${colorizeCsvLine(line, step.delimiter, i === 0)}
          </div>
        `;
      })
      .join('');
    document.getElementById('csv-char-count').innerText =
      `Tamanho: ${step.rawCsv.length} caracteres`;
    return;
  }

  codeCanvas.innerHTML = '';
  let currentLineIndex = 0;
  let currentCharIndex = 0;

  function typeChar() {
    if (currentLineIndex >= lines.length) {
      renderCsvCodeEditor(false);
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
        lineContent = colorizeCsvLine(lines[i], step.delimiter, i === 0);
      } else {
        const partialRaw = targetLine.substring(0, currentCharIndex);
        lineContent = escapeHtmlText(partialRaw) || '&nbsp;';
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
    const totalCharsTyped = lines.slice(0, currentLineIndex).join('\n').length + currentCharIndex;
    document.getElementById('csv-char-count').innerText =
      `Construindo: ${totalCharsTyped} caracteres`;
    csvTypingTimeout = setTimeout(typeChar, 16);
  }
  typeChar();
}

export function renderCsvTableStructure() {
  const step = csvStepsData[csvCurrentStepIndex];
  const container = document.getElementById('csv-table-canvas');
  if (!container) return;

  const lines = step.rawCsv.split('\n');
  const parsedLines = lines.map((l) => parseCsvLine(l, step.delimiter).fields);
  const headers = parsedLines[0] || [];
  const rows = parsedLines.slice(1);

  document.getElementById('csv-cols-badge').innerText =
    `${headers.length} Colunas × ${rows.length} Registros`;

  let tableHtml = `
    <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#313244]">
      <table class="w-full text-left border-collapse text-xs font-mono">
        <thead>
          <tr class="bg-slate-100 dark:bg-[#181825] border-b border-slate-200 dark:border-[#313244]">
            <th class="py-2 px-3 text-[10px] uppercase text-slate-500 dark:text-[#a6adc8] font-sans font-bold w-24">Linha</th>
            ${headers
              .map(
                (h, idx) => `
              <th class="py-2 px-3 text-teal-800 dark:text-[#94e2d5] font-bold border-l border-slate-200 dark:border-[#313244]">
                <span class="text-[10px] text-slate-400 block font-normal">Coluna #${idx + 1}</span>
                ${escapeHtmlText(h.value)}
              </th>
            `
              )
              .join('')}
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-[#313244]">
  `;

  if (rows.length === 0) {
    tableHtml += `
      <tr>
        <td colspan="${headers.length + 1}" class="py-4 px-3 text-center text-slate-400 dark:text-[#6c7086] italic font-sans">
          Cabeçalho definido! Avance para o Passo 2 para inserir os registros de dados.
        </td>
      </tr>
    `;
  } else {
    rows.forEach((r, rIdx) => {
      tableHtml += `
        <tr class="hover:bg-slate-50 dark:hover:bg-[#181825]/60">
          <td class="py-2 px-3 font-sans font-bold text-[11px] text-indigo-700 dark:text-indigo-300 bg-slate-50/60 dark:bg-[#181825]/40">
            Registro #${rIdx + 1}
          </td>
          ${r
            .map(
              (cell) => `
            <td class="py-2 px-3 border-l border-slate-200 dark:border-[#313244] text-slate-800 dark:text-[#cdd6f4]">
              <div class="flex items-center justify-between gap-2">
                <span class="font-semibold">${escapeHtmlText(cell.value)}</span>
                <span class="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-[#313244] text-slate-600 dark:text-[#a6adc8]">texto${cell.quoted ? ' ""' : ''}</span>
              </div>
            </td>
          `
            )
            .join('')}
        </tr>
      `;
    });
  }

  tableHtml += `
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = tableHtml;
}

export function updateAllCsvViews(animated = true) {
  renderCsvStepper();
  renderCsvLesson();
  renderCsvCodeEditor(animated);
  renderCsvTableStructure();
}

export function csvNextStep() {
  if (csvCurrentStepIndex < csvStepsData.length - 1) {
    csvCurrentStepIndex++;
    playTone('C5');
    updateAllCsvViews(true);
  } else {
    showToast('Você concluiu todas as etapas guiadas de CSV!');
    playTone('C6');
  }
}

export function csvPrevStep() {
  if (csvCurrentStepIndex > 0) {
    csvCurrentStepIndex--;
    playTone('G4');
    updateAllCsvViews(false);
  }
}

export function csvGoToStep(idx) {
  if (idx !== csvCurrentStepIndex && idx >= 0 && idx < csvStepsData.length) {
    csvCurrentStepIndex = idx;
    playTone('D5');
    updateAllCsvViews(true);
  }
}

export function csvReplayTyping() {
  playTone('F5');
  renderCsvCodeEditor(true);
}

export function updateCsvSyntaxBadge(isValid) {
  const badge = document.getElementById('csv-syntax-status-badge');
  if (!badge) return;
  const isDarkMode = getIsDarkMode();
  if (isValid) {
    badge.className = isDarkMode
      ? 'text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 font-bold'
      : 'text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 font-bold';
    badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Estrutura Tabular Válida`;
  } else {
    badge.className = isDarkMode
      ? 'text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5 font-bold'
      : 'text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1.5 font-bold';
    badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span> Tabela Corrompida`;
  }
}

export function triggerCsvTrap(trapKey) {
  stopCsvTyping();
  const trap = csvTraps[trapKey];
  if (!trap) return;

  playTone('C3');
  const box = document.getElementById('csv-trap-feedback-box');
  box.classList.remove('hidden');
  document.getElementById('csv-trap-error-title').innerText = trap.title;
  document.getElementById('csv-trap-error-desc').innerText = trap.errorDesc;
  document.getElementById('csv-trap-fix-text').innerText = trap.fix;
  updateCsvSyntaxBadge(false);

  const lines = trap.rawCode.split('\n');
  const codeCanvas = document.getElementById('csv-code-canvas');
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
        <div class="pl-2 font-mono text-xs leading-6 whitespace-pre ${isErrorLine ? errBg : ''}">${colorizeCsvLine(line, trap.delimiter, i === 0)}</div>
      `;
    })
    .join('');

  document.getElementById('csv-char-count').innerText = 'Status: TABELA CORROMPIDA';
  showToast('Armadilha de CSV simulada para estudo!');
}

export function restoreCleanCsvCode() {
  playTone('E5');
  document.getElementById('csv-trap-feedback-box').classList.add('hidden');
  updateCsvSyntaxBadge(true);
  renderCsvCodeEditor(false);
  showToast('Arquivo CSV válido restaurado!');
}

export function copyCurrentCsvCode() {
  const step = csvStepsData[csvCurrentStepIndex];
  copyTextToClipboard(step.rawCsv, 'CSV copiado para a área de transferência!');
  playTone('A5');
}

export function loadCsvValidatorPreset(key) {
  const text = csvValidatorPresets[key];
  if (text) {
    document.getElementById('csv-validator-input').value = text;
    document.getElementById('csv-validator-file-name').innerText = `exemplo_${key}.csv`;
    runCsvValidation();
    playTone('D5');
  }
}

export function handleCsvDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('csv-drop-zone').classList.add('drop-active');
}

export function handleCsvDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('csv-drop-zone').classList.remove('drop-active');
}

export function handleCsvFileDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('csv-drop-zone').classList.remove('drop-active');
  const files = e.dataTransfer.files;
  if (files && files.length > 0) {
    processCsvUploadedFile(files[0]);
  }
}

export function handleCsvFileSelect(e) {
  const files = e.target.files;
  if (files && files.length > 0) {
    processCsvUploadedFile(files[0]);
  }
}

export function processCsvUploadedFile(file) {
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    showToast('Arquivo excede o limite didático de 1 MB.');
    return;
  }
  document.getElementById('csv-validator-file-name').innerText = file.name;
  const reader = new FileReader();
  reader.onload = function (evt) {
    document.getElementById('csv-validator-input').value = evt.target.result;
    runCsvValidation();
    showToast(`Arquivo "${file.name}" carregado com sucesso!`);
    playTone('F5');
  };
  reader.readAsText(file, 'UTF-8');
}

export function clearCsvValidatorEditor() {
  document.getElementById('csv-validator-input').value = '';
  document.getElementById('csv-validator-file-name').innerText = 'Editor em branco';
  runCsvValidation();
  playTone('C4');
}

export function normalizeCsvValidatorText() {
  const input = document.getElementById('csv-validator-input');
  if (!input || !input.value.trim()) return;
  const cleaned = input.value
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.trimEnd())
    .filter((l) => l.trim() !== '')
    .join('\n');
  input.value = cleaned;
  runCsvValidation();
  showToast('Linhas vazias removidas e quebras normalizadas!');
  playTone('A5');
}

export function copyCurrentCsvValidatorText() {
  const val = document.getElementById('csv-validator-input').value;
  copyTextToClipboard(val, 'CSV copiado para a área de transferência!');
  playTone('A5');
}

export function runCsvValidation() {
  const inputEl = document.getElementById('csv-validator-input');
  if (!inputEl) return;
  const text = inputEl.value;
  const statsText = document.getElementById('csv-validator-stats-text');
  const linesCount = text ? text.split(/\r?\n/).length : 0;
  const bytesCount = new Blob([text]).size;
  statsText.innerText = `${linesCount} linhas • ${bytesCount} bytes`;

  const statusTitle = document.getElementById('csv-validator-status-title');
  const statusSubtitle = document.getElementById('csv-validator-status-subtitle');
  const badgeIcon = document.getElementById('csv-validator-badge-icon');
  const errSection = document.getElementById('csv-validator-error-section');
  const succSection = document.getElementById('csv-validator-success-section');

  if (!text.trim()) {
    statusTitle.innerText = 'Aguardando conteúdo CSV para validação';
    statusSubtitle.innerText = 'Insira dados tabulares ou envie um arquivo .csv para auditoria';
    badgeIcon.className =
      'w-10 h-10 rounded-xl bg-slate-200 text-slate-600 dark:bg-[#313244] dark:text-[#a6adc8] flex items-center justify-center text-lg';
    badgeIcon.innerHTML = `<i class="fa-solid fa-circle-question"></i>`;
    errSection.classList.add('hidden');
    succSection.classList.add('hidden');
    return;
  }

  const result = validateCsvText(text);

  if (result.valid) {
    statusTitle.innerText = 'CSV Válido e Consistente na Auditoria';
    statusSubtitle.innerText = `Estrutura tabular íntegra • Delimitador detectado: ${result.metrics.delimiterLabel}`;
    badgeIcon.className =
      'w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 flex items-center justify-center text-lg';
    badgeIcon.innerHTML = `<i class="fa-solid fa-circle-check"></i>`;

    errSection.classList.add('hidden');
    succSection.classList.remove('hidden');

    document.getElementById('csv-metric-records').innerText = result.metrics.totalRecords;
    document.getElementById('csv-metric-cols').innerText = result.metrics.totalColumns;
    document.getElementById('csv-metric-delim').innerText = result.metrics.delimiterLabel;
    document.getElementById('csv-metric-quoted').innerText = result.metrics.quotedFields;
    document.getElementById('csv-metric-cells').innerText = result.metrics.totalCells;
    document.getElementById('csv-metric-zeros').innerText =
      result.metrics.leadingZeros > 0 ? `${result.metrics.leadingZeros} campo(s)` : 'Nenhum';

    const previewEl = document.getElementById('csv-validator-table-preview');
    previewEl.innerHTML = `
      <table class="w-full text-left border-collapse text-xs font-mono">
        <thead>
          <tr class="bg-slate-100 dark:bg-[#11111b] border-b border-slate-200 dark:border-[#313244]">
            <th class="py-1.5 px-2.5 text-slate-400">#</th>
            ${result.header.map((h) => `<th class="py-1.5 px-2.5 text-teal-700 dark:text-[#94e2d5] font-bold border-l border-slate-200 dark:border-[#313244]">${escapeHtmlText(h)}</th>`).join('')}
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-[#313244]">
          ${result.records
            .slice(0, 10)
            .map(
              (row, idx) => `
            <tr>
              <td class="py-1.5 px-2.5 text-slate-400">${idx + 1}</td>
              ${row.map((val) => `<td class="py-1.5 px-2.5 border-l border-slate-200 dark:border-[#313244] text-slate-800 dark:text-[#cdd6f4]">${escapeHtmlText(val)}</td>`).join('')}
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;
  } else {
    statusTitle.innerText = result.headline;
    statusSubtitle.innerText = 'Detectada falha de estrutura tabular ou qualificador de texto';
    badgeIcon.className =
      'w-10 h-10 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 flex items-center justify-center text-lg';
    badgeIcon.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i>`;

    succSection.classList.add('hidden');
    errSection.classList.remove('hidden');

    document.getElementById('csv-error-loc-line').innerText = result.line;
    document.getElementById('csv-error-loc-col').innerText = result.col;
    document.getElementById('csv-error-category-badge').innerText = result.category;

    const safeLine = escapeHtmlText(result.lineText || '');
    const pointerSpaces = ' '.repeat(Math.max(0, result.col - 1));
    document.getElementById('csv-error-code-preview').innerHTML = `
      <div class="text-slate-400 select-none">// Linha ${result.line}:</div>
      <div class="text-white whitespace-pre">${safeLine || '&nbsp;'}</div>
      <div class="text-rose-400 font-bold whitespace-pre">${pointerSpaces}^ [Coluna ${result.col}]</div>
    `;
    document.getElementById('csv-error-didactic-why').innerHTML = result.explanation;
    document.getElementById('csv-error-didactic-fix').innerHTML = result.fixSuggestion;
    playTone('C3');
  }
}

export function refreshCsvTheme() {
  renderCsvLesson();
  renderCsvCodeEditor(false);
  renderCsvTableStructure();
  runCsvValidation();
}

export function getCsvModuleHtml() {
  return `
  <div id="module-csv" class="flex-1 flex flex-col">
    <!-- Barra Interna de Abas do Módulo CSV -->
    <div class="bg-white/80 dark:bg-[#181825]/80 border-b border-slate-200 dark:border-[#313244] px-4 lg:px-8 py-2.5">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <span class="w-8 h-8 rounded-lg bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30 flex items-center justify-center font-mono font-bold text-sm">
            <i class="fa-solid fa-table"></i>
          </span>
          <div>
            <h2 class="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">Módulo 1: Arquivos CSV (Comma-Separated Values)</h2>
            <p class="text-[11px] text-slate-500 dark:text-[#a6adc8]">Tabelas em Texto Puro, Cabeçalho, Delimitadores (, vs ;) e Qualificadores de Texto</p>
          </div>
        </div>
        <div class="flex items-center bg-slate-100 dark:bg-[#11111b] p-1 rounded-xl border border-slate-200 dark:border-[#313244]">
          <button id="csv-tab-btn-builder" onclick="switchCsvTab('builder')" class="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm bg-white text-indigo-700 dark:bg-[#313244] dark:text-white border border-slate-200 dark:border-transparent">
            <i class="fa-solid fa-wand-magic-sparkles text-indigo-600 dark:text-amber-400"></i>
            <span>1. Construtor Guiado</span>
          </button>
          <button id="csv-tab-btn-validator" onclick="switchCsvTab('validator')" class="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-[#a6adc8] hover:text-slate-900 dark:hover:text-white transition">
            <i class="fa-solid fa-file-circle-check text-emerald-600 dark:text-emerald-400"></i>
            <span>2. Validador de Arquivos</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ABA 1: CONSTRUTOR GUIADO DE CSV -->
    <div id="csv-view-builder" class="flex-1 flex flex-col">
      <nav class="bg-slate-100/80 dark:bg-[#181825] border-b border-slate-200 dark:border-[#313244] px-4 py-2.5 overflow-x-auto no-scrollbar">
        <div class="max-w-7xl mx-auto flex items-center justify-between min-w-[680px] gap-2">
          <div id="csv-stepper-container" class="flex items-center gap-2.5 w-full justify-between"></div>
        </div>
      </nav>

      <main class="max-w-7xl mx-auto w-full flex-1 p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section class="lg:col-span-5 flex flex-col gap-5">
          <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-5 shadow-md dark:shadow-xl">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#313244] mb-4">
              <div class="flex items-center gap-2">
                <span id="csv-badge-step-number" class="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 font-mono">
                  PASSO 1 DE 6
                </span>
                <span id="csv-step-category" class="text-xs font-semibold text-slate-500 dark:text-[#a6adc8]">Estrutura Tabular</span>
              </div>
              <span id="csv-step-icon-container" class="text-indigo-600 dark:text-amber-400 text-lg">
                <i class="fa-solid fa-table-columns"></i>
              </span>
            </div>

            <h2 id="csv-step-title" class="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-snug"></h2>
            <p id="csv-step-description" class="text-sm text-slate-600 dark:text-[#bac2de] leading-relaxed mb-4"></p>

            <div class="p-3.5 rounded-xl bg-amber-50/80 border-l-4 border-amber-500 dark:bg-[#181825] dark:border-amber-400 flex items-start gap-3 mb-5">
              <i class="fa-solid fa-lightbulb text-amber-600 dark:text-amber-400 mt-0.5 text-base"></i>
              <div class="text-xs space-y-1">
                <strong class="text-amber-900 dark:text-amber-300 block font-bold">Regra Fundamental:</strong>
                <span id="csv-step-rule-text" class="text-slate-700 dark:text-[#a6adc8] font-medium leading-normal"></span>
              </div>
            </div>

            <div class="space-y-2 mb-5">
              <h3 class="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-[#a6adc8] flex items-center gap-1.5">
                <i class="fa-solid fa-microscope text-indigo-600 dark:text-indigo-400"></i> Anatomia dos Elementos Envolvidos
              </h3>
              <div id="csv-step-tokens-container" class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs"></div>
            </div>

            <div class="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-[#313244]">
              <button id="csv-btn-prev" onclick="csvPrevStep()" class="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#313244] dark:hover:bg-[#45475a] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-700 dark:text-white flex items-center justify-center gap-2 transition shadow-sm border border-slate-200 dark:border-transparent">
                <i class="fa-solid fa-arrow-left"></i> Voltar
              </button>
              <button onclick="csvReplayTyping()" title="Repetir Animação de Digitação" class="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#313244] dark:hover:bg-[#45475a] text-slate-700 dark:text-amber-300 transition border border-slate-200 dark:border-transparent">
                <i class="fa-solid fa-rotate-right"></i>
              </button>
              <button id="csv-btn-next" onclick="csvNextStep()" class="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-indigo-500 text-xs font-bold text-white flex items-center justify-center gap-2 transition shadow-md shadow-indigo-600/20">
                <span>Avançar</span> <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <!-- Laboratório do Erro CSV -->
          <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-5 shadow-md dark:shadow-xl">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-rose-100 dark:bg-red-500/20 text-rose-600 dark:text-red-400 flex items-center justify-center text-xs">
                  <i class="fa-solid fa-bug"></i>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-slate-900 dark:text-white">Laboratório do Erro em CSV</h3>
                  <p class="text-[11px] text-slate-500 dark:text-[#a6adc8]">Simule armadilhas tabulares com 1 clique</p>
                </div>
              </div>
              <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-red-500/10 dark:text-red-400 border border-rose-200 dark:border-red-500/20 font-bold">
                Interativo
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <button onclick="triggerCsvTrap('decimal_collision')" class="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-[#181825] dark:hover:bg-red-500/10 border border-slate-200 hover:border-rose-400 dark:border-[#313244] dark:hover:border-red-500/40 text-xs transition group">
                <div class="font-bold text-slate-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-red-300 flex items-center justify-between">
                  <span>1. Vírgula Decimal × ,</span>
                  <i class="fa-solid fa-triangle-exclamation text-xs text-rose-500 opacity-0 group-hover:opacity-100"></i>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-[#a6adc8] mt-0.5 font-mono"><code>Ana,Sistemas,8,5</code></p>
              </button>
              <button onclick="triggerCsvTrap('unquoted_delimiter')" class="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-[#181825] dark:hover:bg-red-500/10 border border-slate-200 hover:border-rose-400 dark:border-[#313244] dark:hover:border-red-500/40 text-xs transition group">
                <div class="font-bold text-slate-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-red-300 flex items-center justify-between">
                  <span>2. Vírgula sem Aspas</span>
                  <i class="fa-solid fa-triangle-exclamation text-xs text-rose-500 opacity-0 group-hover:opacity-100"></i>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-[#a6adc8] mt-0.5 font-mono"><code>Rua Flores, 123</code></p>
              </button>
              <button onclick="triggerCsvTrap('unescaped_quotes')" class="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-[#181825] dark:hover:bg-red-500/10 border border-slate-200 hover:border-rose-400 dark:border-[#313244] dark:hover:border-red-500/40 text-xs transition group">
                <div class="font-bold text-slate-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-red-300 flex items-center justify-between">
                  <span>3. Aspas Não Duplicadas</span>
                  <i class="fa-solid fa-triangle-exclamation text-xs text-rose-500 opacity-0 group-hover:opacity-100"></i>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-[#a6adc8] mt-0.5 font-mono"><code>"Pedro "Zé" Souza"</code></p>
              </button>
              <button onclick="triggerCsvTrap('column_mismatch')" class="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-[#181825] dark:hover:bg-red-500/10 border border-slate-200 hover:border-rose-400 dark:border-[#313244] dark:hover:border-red-500/40 text-xs transition group">
                <div class="font-bold text-slate-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-red-300 flex items-center justify-between">
                  <span>4. Coluna Faltando</span>
                  <i class="fa-solid fa-triangle-exclamation text-xs text-rose-500 opacity-0 group-hover:opacity-100"></i>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-[#a6adc8] mt-0.5 font-mono"><code>Bruno;Sistemas</code></p>
              </button>
            </div>

            <div id="csv-trap-feedback-box" class="hidden p-3.5 rounded-xl bg-rose-50 border border-rose-200 dark:bg-[#181825] dark:border-red-500/30 transition-all">
              <div class="flex items-start gap-2.5">
                <i class="fa-solid fa-circle-xmark text-rose-600 dark:text-red-400 text-base mt-0.5"></i>
                <div class="text-xs space-y-1 flex-1">
                  <span id="csv-trap-error-title" class="font-bold text-rose-900 dark:text-red-300 block"></span>
                  <p id="csv-trap-error-desc" class="text-rose-800 dark:text-[#bac2de] font-mono text-[11px] bg-rose-100/70 dark:bg-red-950/40 p-2 rounded border border-rose-200 dark:border-red-900/50 my-1"></p>
                  <div class="mt-2 text-slate-700 dark:text-[#a6adc8]">
                    <strong class="text-emerald-700 dark:text-emerald-400 font-bold">Como corrigir:</strong>
                    <span id="csv-trap-fix-text"></span>
                  </div>
                </div>
              </div>
              <button onclick="restoreCleanCsvCode()" class="mt-3 w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600/30 text-white dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm">
                <i class="fa-solid fa-wand-magic-sparkles"></i> Restaurar CSV Válido
              </button>
            </div>
          </div>
        </section>

        <!-- Coluna Direita: Editor CSV & Visualizador de Tabela -->
        <section class="lg:col-span-7 flex flex-col gap-5">
          <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl shadow-lg dark:shadow-2xl overflow-hidden flex flex-col">
            <div class="bg-slate-100 dark:bg-[#181825] px-4 py-2.5 border-b border-slate-200 dark:border-[#313244] flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-rose-400 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
                <span class="ml-2 font-mono text-xs text-slate-700 dark:text-[#a6adc8] flex items-center gap-1.5 font-bold">
                  <i class="fa-solid fa-file-csv text-teal-600 dark:text-teal-400"></i> alunos.csv
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span id="csv-syntax-status-badge" class="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30 flex items-center gap-1.5 font-bold">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Estrutura Tabular Válida
                </span>
                <button onclick="copyCurrentCsvCode()" title="Copiar CSV" class="p-1.5 text-xs text-slate-600 hover:text-slate-900 dark:text-[#a6adc8] dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-[#313244] transition">
                  <i class="fa-regular fa-copy"></i>
                </button>
              </div>
            </div>

            <div class="p-4 bg-slate-50/70 dark:bg-[#1e1e2e] font-mono text-sm leading-relaxed overflow-x-auto min-h-[210px]">
              <div id="csv-code-canvas" class="grid grid-cols-[38px_1fr] gap-3 min-w-[300px]"></div>
            </div>

            <div class="bg-slate-100 dark:bg-[#181825] px-4 py-2 border-t border-slate-200 dark:border-[#313244] flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-[#a6adc8] gap-2">
              <div class="flex items-center gap-3">
                <span><strong class="text-slate-900 dark:text-white">Delimitador Ativo:</strong> <span id="csv-delim-indicator" class="font-mono">Vírgula (,)</span></span>
                <span><strong class="text-slate-900 dark:text-white">Codificação:</strong> UTF-8</span>
              </div>
              <span id="csv-char-count" class="font-mono font-medium">Tamanho: 0 caracteres</span>
            </div>
          </div>

          <!-- Visualizador Estrutural em Memória: Tabela Interpretada -->
          <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-5 shadow-md dark:shadow-xl">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-[#313244]">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs">
                  <i class="fa-solid fa-table-list"></i>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-slate-900 dark:text-white">Tabela de Registros e Colunas (Estrutura Interpretada)</h3>
                  <p class="text-[11px] text-slate-500 dark:text-[#a6adc8]">Como o sistema enxerga as linhas e colunas após separar pelo delimitador</p>
                </div>
              </div>
              <span id="csv-cols-badge" class="text-xs font-mono font-bold text-teal-700 bg-teal-50 border border-teal-200 dark:text-teal-300 dark:bg-teal-900/30 dark:border-teal-700/40 px-2.5 py-0.5 rounded">
                3 Colunas × 0 Registros
              </span>
            </div>
            <div id="csv-table-canvas" class="space-y-2"></div>
          </div>
        </section>
      </main>
    </div>

    <!-- ABA 2: VALIDADOR & AUDITOR DIDÁTICO DE CSV -->
    <div id="csv-view-validator" class="hidden flex-1 flex flex-col p-4 lg:p-6 max-w-7xl mx-auto w-full gap-6">
      <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="p-2 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 text-sm">
              <i class="fa-solid fa-file-csv"></i>
            </span>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Auditor e Validador Didático de CSV</h2>
          </div>
          <p class="text-xs text-slate-600 dark:text-[#a6adc8] mt-1 max-w-3xl">
            Envie um arquivo <code>.csv</code> ou cole seu texto abaixo. O motor detecta automaticamente o delimitador (<code>;</code> ou <code>,</code>), verifica o alinhamento de colunas com o cabeçalho, audita qualificadores de aspas duplas (<code>""</code>) e alerta sobre colisões de vírgula decimal.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2 shrink-0">
          <span class="text-xs font-semibold text-slate-500 dark:text-[#a6adc8]">Carregar Exemplo:</span>
          <button onclick="loadCsvValidatorPreset('valid')" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30 transition">
            <i class="fa-solid fa-check"></i> Válido (Padrão BR ;)
          </button>
          <button onclick="loadCsvValidatorPreset('err_decimal')" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30 transition">
            <i class="fa-solid fa-bug"></i> Colisão Decimal
          </button>
          <button onclick="loadCsvValidatorPreset('err_quotes')" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30 transition">
            <i class="fa-solid fa-quote-left"></i> Aspas Inválidas
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-6 flex flex-col gap-4">
          <div id="csv-drop-zone" ondragover="handleCsvDragOver(event)" ondragleave="handleCsvDragLeave(event)" ondrop="handleCsvFileDrop(event)"
            class="border-2 border-dashed border-slate-300 hover:border-indigo-500 dark:border-[#313244] dark:hover:border-indigo-400 bg-white dark:bg-[#181825] rounded-2xl p-5 text-center cursor-pointer transition shadow-sm flex flex-col items-center justify-center gap-2 group">
            <input type="file" id="csv-file-input" accept=".csv,text/csv,text/plain" onchange="handleCsvFileSelect(event)" class="hidden">
            <div class="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400 flex items-center justify-center text-xl group-hover:scale-110 transition">
              <i class="fa-solid fa-cloud-arrow-up"></i>
            </div>
            <div>
              <p class="text-sm font-bold text-slate-800 dark:text-white">
                Arraste e solte seu arquivo <span class="text-teal-600 dark:text-teal-400">.csv</span> aqui
              </p>
              <p class="text-xs text-slate-500 dark:text-[#a6adc8] mt-0.5">ou clique para selecionar do seu dispositivo</p>
            </div>
            <button type="button" onclick="document.getElementById('csv-file-input').click()" class="mt-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#313244] dark:hover:bg-[#45475a] text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-transparent">
              Escolher Arquivo CSV
            </button>
          </div>

          <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl overflow-hidden shadow-md flex flex-col">
            <div class="bg-slate-100 dark:bg-[#181825] px-4 py-2.5 border-b border-slate-200 dark:border-[#313244] flex items-center justify-between">
              <span class="text-xs font-bold text-slate-700 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-table text-teal-600 dark:text-teal-400"></i> Entrada de Texto CSV / Editor Direto
              </span>
              <div class="flex items-center gap-1">
                <button onclick="normalizeCsvValidatorText()" title="Remover linhas em branco e normalizar quebras" class="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-200 hover:bg-slate-300 dark:bg-[#313244] dark:hover:bg-[#45475a] text-slate-700 dark:text-slate-200 transition">
                  <i class="fa-solid fa-broom text-amber-500"></i> Higienizar Linhas
                </button>
                <button onclick="clearCsvValidatorEditor()" title="Limpar editor" class="px-2.5 py-1 rounded-md text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition">
                  <i class="fa-solid fa-trash-can"></i> Limpar
                </button>
              </div>
            </div>

            <div class="relative p-3 bg-slate-50/50 dark:bg-[#1e1e2e]">
              <textarea id="csv-validator-input" rows="12" spellcheck="false" oninput="runCsvValidation()" placeholder="Cole seu CSV aqui ou selecione um arquivo acima..."
                class="w-full bg-white dark:bg-[#11111b] text-slate-800 dark:text-[#cdd6f4] font-mono text-xs p-3 rounded-xl border border-slate-300 dark:border-[#313244] focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed resize-y"></textarea>
            </div>

            <div class="bg-slate-100 dark:bg-[#181825] px-4 py-2 border-t border-slate-200 dark:border-[#313244] flex items-center justify-between text-xs text-slate-600 dark:text-[#a6adc8]">
              <span id="csv-validator-file-name" class="font-mono text-[11px] truncate max-w-[200px]">Nenhum arquivo carregado</span>
              <span id="csv-validator-stats-text" class="font-mono text-[11px]">0 linhas • 0 bytes</span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-6 flex flex-col gap-4">
          <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-5 shadow-md flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div id="csv-validator-badge-icon" class="w-10 h-10 rounded-xl bg-slate-200 text-slate-600 dark:bg-[#313244] dark:text-[#a6adc8] flex items-center justify-center text-lg">
                  <i class="fa-solid fa-circle-question"></i>
                </div>
                <div>
                  <h3 id="csv-validator-status-title" class="text-base font-extrabold text-slate-900 dark:text-white">
                    Aguardando conteúdo CSV para validação
                  </h3>
                  <p id="csv-validator-status-subtitle" class="text-xs text-slate-500 dark:text-[#a6adc8]">
                    Insira dados tabulares ou envie um arquivo .csv para auditoria
                  </p>
                </div>
              </div>
            </div>

            <!-- Seção de Erro CSV -->
            <div id="csv-validator-error-section" class="hidden flex flex-col gap-3">
              <div class="p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-500/30 flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    Localização: Linha <span id="csv-error-loc-line" class="font-mono text-sm underline font-black">0</span>, Coluna <span id="csv-error-loc-col" class="font-mono text-sm underline font-black">0</span>
                  </span>
                  <span id="csv-error-category-badge" class="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-900 dark:bg-rose-800/50 dark:text-rose-200">
                    CSV Error
                  </span>
                </div>
                <div class="mt-1 font-mono text-xs bg-slate-900 text-rose-200 p-3 rounded-lg overflow-x-auto shadow-inner border border-rose-900/40">
                  <div id="csv-error-code-preview" class="leading-relaxed"></div>
                </div>
              </div>

              <div class="p-4 rounded-xl bg-amber-50/80 border-l-4 border-amber-500 dark:bg-[#181825] dark:border-amber-400 space-y-2">
                <h4 class="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <i class="fa-solid fa-graduation-cap"></i> O que quebrou e Por Que é Inválido?
                </h4>
                <p id="csv-error-didactic-why" class="text-xs text-slate-700 dark:text-[#bac2de] leading-relaxed"></p>
              </div>

              <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-500/30 space-y-2">
                <h4 class="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <i class="fa-solid fa-screwdriver-wrench"></i> Como Corrigir Este Ponto
                </h4>
                <div id="csv-error-didactic-fix" class="text-xs text-slate-700 dark:text-[#a6adc8] leading-relaxed font-mono"></div>
              </div>
            </div>

            <!-- Seção de Sucesso CSV -->
            <div id="csv-validator-success-section" class="hidden flex flex-col gap-4">
              <div class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30 flex items-center gap-3">
                <i class="fa-solid fa-shield-check text-emerald-600 dark:text-emerald-400 text-xl"></i>
                <div class="text-xs">
                  <strong class="text-emerald-900 dark:text-emerald-300 block font-bold">Tabela CSV 100% Íntegra!</strong>
                  <span class="text-emerald-800 dark:text-[#a6adc8]">Todas as linhas respeitam o número de colunas do cabeçalho e as regras de qualificadores.</span>
                </div>
              </div>

              <div>
                <h4 class="text-xs font-bold text-slate-500 dark:text-[#a6adc8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <i class="fa-solid fa-chart-pie text-teal-600 dark:text-teal-400"></i> Métricas & Auditoria Tabular
                </h4>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div class="bg-slate-50 dark:bg-[#181825] p-3 rounded-xl border border-slate-200 dark:border-[#313244]">
                    <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">Registros (Dados)</span>
                    <span id="csv-metric-records" class="text-base font-extrabold text-blue-700 dark:text-blue-400 font-mono">0</span>
                  </div>
                  <div class="bg-slate-50 dark:bg-[#181825] p-3 rounded-xl border border-slate-200 dark:border-[#313244]">
                    <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">Colunas (Cabeçalho)</span>
                    <span id="csv-metric-cols" class="text-base font-extrabold text-teal-700 dark:text-teal-400 font-mono">0</span>
                  </div>
                  <div class="bg-slate-50 dark:bg-[#181825] p-3 rounded-xl border border-slate-200 dark:border-[#313244]">
                    <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">Delimitador</span>
                    <span id="csv-metric-delim" class="text-xs font-extrabold text-amber-700 dark:text-amber-400 font-mono">;</span>
                  </div>
                  <div class="bg-slate-50 dark:bg-[#181825] p-3 rounded-xl border border-slate-200 dark:border-[#313244]">
                    <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">Campos com Aspas</span>
                    <span id="csv-metric-quoted" class="text-base font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">0</span>
                  </div>
                  <div class="bg-slate-50 dark:bg-[#181825] p-3 rounded-xl border border-slate-200 dark:border-[#313244]">
                    <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">Total de Células</span>
                    <span id="csv-metric-cells" class="text-base font-extrabold text-sky-700 dark:text-sky-400 font-mono">0</span>
                  </div>
                  <div class="bg-slate-50 dark:bg-[#181825] p-3 rounded-xl border border-slate-200 dark:border-[#313244]">
                    <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">Zeros à Esquerda</span>
                    <span id="csv-metric-zeros" class="text-xs font-extrabold text-purple-700 dark:text-purple-400 font-mono">Nenhum</span>
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <h4 class="text-xs font-bold text-slate-500 dark:text-[#a6adc8] uppercase tracking-wider flex items-center justify-between">
                  <span><i class="fa-solid fa-table text-teal-600 dark:text-teal-400"></i> Prévia da Tabela Interpretada</span>
                  <button onclick="copyCurrentCsvValidatorText()" class="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    <i class="fa-regular fa-copy"></i> Copiar CSV
                  </button>
                </h4>
                <div id="csv-validator-table-preview" class="bg-slate-50 dark:bg-[#181825] border border-slate-200 dark:border-[#313244] rounded-xl overflow-x-auto max-h-60"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
}

export function initCsvModule() {
  Object.assign(window, {
    switchCsvTab,
    csvGoToStep,
    csvNextStep,
    csvPrevStep,
    csvReplayTyping,
    triggerCsvTrap,
    restoreCleanCsvCode,
    copyCurrentCsvCode,
    loadCsvValidatorPreset,
    handleCsvDragOver,
    handleCsvDragLeave,
    handleCsvFileDrop,
    handleCsvFileSelect,
    clearCsvValidatorEditor,
    normalizeCsvValidatorText,
    copyCurrentCsvValidatorText,
    runCsvValidation,
  });

  updateAllCsvViews(true);
  loadCsvValidatorPreset('valid');
}
