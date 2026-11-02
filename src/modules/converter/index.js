/**
 * Módulo 5: Conversor / Tradutor Interativo em Tempo Real (4 Formatos)
 * Base Canônica: Seções 8 (Quadro Comparativo) e 9 (Exemplo Integrado) de "04 - Arquivos Texto.pdf"
 * Ordem Canônica nos Painéis: 1. CSV -> 2. Posicional -> 3. JSON -> 4. XML
 * Zero código de programação na interface — foco 100% na anatomia estrutural dos 4 formatos.
 */
import { escapeHtmlText } from '../../core/sanitizer.js';
import { playTone } from '../../core/audio.js';
import { colorizeCsvLine } from '../csv/index.js';
import { colorizeXmlLine } from '../xml/index.js';

export const CONVERTER_MODULE_ID = 'converter';

export const converterPresets = {
  canonical: [
    { nome: 'Ana', curso: 'Sistemas', nota: 8.5 },
    { nome: 'Bruno', curso: 'Sistemas', nota: 7.0 },
  ],
  special_chars: [
    { nome: 'Ana; "Bia"', curso: 'Sistemas & IA', nota: 9.5 },
    { nome: 'Carlos', curso: 'Redes <Cloud>', nota: 10.0 },
  ],
  expanded: [
    { nome: 'Ana', curso: 'Sistemas', nota: 8.5 },
    { nome: 'Bruno', curso: 'Sistemas', nota: 7.0 },
    { nome: 'Carla', curso: 'Direito', nota: 9.2 },
    { nome: 'Diego', curso: 'Engenharia', nota: 6.8 },
  ],
};

let converterRecords = structuredClone(converterPresets.canonical);
let showPositionalSpacesGlyph = true;

export function getConverterRecords() {
  return converterRecords;
}

/**
 * 1. Serializador CSV Canônico (Padrão BR com `;`, qualificadores `"` quando necessário e escape `""`)
 */
export function serializeToCsv(records, delimiter = ';') {
  const formatCell = (val) => {
    const str = String(val ?? '');
    const needsQuotes =
      str.includes(delimiter) || str.includes('"') || str.includes('\n') || str.includes(',');
    if (!needsQuotes) return str;
    return `"${str.replace(/"/g, '""')}"`;
  };

  const header = ['nome', 'curso', 'nota'].join(delimiter);
  const rows = (records || []).map((r) => {
    const notaNum = Number.isFinite(Number(r.nota)) ? Number(r.nota).toFixed(1) : '0.0';
    return [formatCell(r.nome), formatCell(r.curso), notaNum].join(delimiter);
  });

  return [header, ...rows].join('\n');
}

/**
 * 2. Serializador Posicional Canônico (Seção 9 da Apostila — 24 posições por linha)
 * - Nome: Pos 01..10 (10 chars, Alfanumérico A, alinhado à esquerda com espaços à direita)
 * - Curso: Pos 11..20 (10 chars, Alfanumérico A, alinhado à esquerda com espaços à direita)
 * - Nota: Pos 21..24 (4 chars, Numérico com 1 casa decimal implícita N1, alinhado à direita com zeros à esquerda)
 */
export function serializeToPositional(records) {
  const sanitizeAlpha = (str, len) => {
    // Remove quebras e ponto-e-vírgula para preservar o contrato posicional puro
    const clean = String(str ?? '')
      .replace(/[\r\n;]/g, ' ')
      .slice(0, len);
    return clean.padEnd(len, ' ');
  };

  const formatImplicitDecimal1 = (val, len = 4) => {
    const num = Number(val);
    const clamped = Number.isFinite(num) ? Math.max(0, Math.min(999.9, num)) : 0;
    const tenths = Math.round(clamped * 10);
    return String(tenths).slice(0, len).padStart(len, '0');
  };

  return (records || [])
    .map((r) => {
      const fNome = sanitizeAlpha(r.nome, 10);
      const fCurso = sanitizeAlpha(r.curso, 10);
      const fNota = formatImplicitDecimal1(r.nota, 4);
      return `${fNome}${fCurso}${fNota}`;
    })
    .join('\n');
}

/**
 * 3. Serializador JSON Canônico (RFC 8259 — indentação de 2 espaços)
 */
export function serializeToJson(records) {
  const normalized = (records || []).map((r) => {
    const num = Number(r.nota);
    const notaVal = Number.isFinite(num) ? Number(num.toFixed(1)) : 0;
    return {
      nome: String(r.nome ?? ''),
      curso: String(r.curso ?? ''),
      nota: notaVal,
    };
  });
  return JSON.stringify(normalized, null, 2);
}

/**
 * 4. Serializador XML Canônico Bem Formado (Seção 9 da Apostila — com escape das 5 entidades oficiais)
 */
export function escapeXmlEntities(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function serializeToXml(records) {
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<alunos>'];
  (records || []).forEach((r, idx) => {
    const num = Number(r.nota);
    const notaStr = Number.isFinite(num) ? num.toFixed(1) : '0.0';
    lines.push(`  <aluno id="${idx + 1}">`);
    lines.push(`    <nome>${escapeXmlEntities(r.nome)}</nome>`);
    lines.push(`    <curso>${escapeXmlEntities(r.curso)}</curso>`);
    lines.push(`    <nota>${notaStr}</nota>`);
    lines.push('  </aluno>');
  });
  lines.push('</alunos>');
  return lines.join('\n');
}

/**
 * Calcula métricas comparativas em tempo real para os 4 formatos gerados
 */
export function computeAllFormatOutputs(records = converterRecords) {
  const csvText = serializeToCsv(records);
  const posText = serializeToPositional(records);
  const jsonText = serializeToJson(records);
  const xmlText = serializeToXml(records);

  const byteLen = (str) => new TextEncoder().encode(str).length;
  const lineCount = (str) => (str ? str.split('\n').length : 0);

  return {
    csv: {
      text: csvText,
      bytes: byteLen(csvText),
      lines: lineCount(csvText),
    },
    positional: {
      text: posText,
      bytes: byteLen(posText),
      lines: lineCount(posText),
    },
    json: {
      text: jsonText,
      bytes: byteLen(jsonText),
      lines: lineCount(jsonText),
    },
    xml: {
      text: xmlText,
      bytes: byteLen(xmlText),
      lines: lineCount(xmlText),
    },
  };
}

function colorizePositionalConverterLine(line) {
  if (!line) return '&nbsp;';
  const sliceWithGlyph = (s) => {
    const escaped = escapeHtmlText(s);
    if (!showPositionalSpacesGlyph) return escaped;
    return escaped.replace(/ /g, '<span class="opacity-45 select-none">␣</span>');
  };

  const pNome = line.slice(0, 10);
  const pCurso = line.slice(10, 20);
  const pNota = line.slice(20, 24);

  return (
    `<span class="bg-amber-500/15 text-amber-800 dark:text-[#f9e2af] border-b border-amber-500/40 font-semibold" title="Nome [Pos 01..10]">${sliceWithGlyph(pNome)}</span>` +
    `<span class="bg-sky-500/15 text-sky-800 dark:text-[#89b4fa] border-b border-sky-500/40 font-semibold" title="Curso [Pos 11..20]">${sliceWithGlyph(pCurso)}</span>` +
    `<span class="bg-emerald-500/15 text-emerald-800 dark:text-[#a6e3a1] border-b border-emerald-500/40 font-bold" title="Nota [Pos 21..24 N1]">${sliceWithGlyph(pNota)}</span>`
  );
}

function colorizeJsonConverterLine(lineText) {
  if (!lineText) return '&nbsp;';
  const isLight = !document.documentElement.classList.contains('dark');
  let html = escapeHtmlText(lineText);

  const keyClass = isLight ? 'text-blue-700 font-bold' : 'text-[#89b4fa] font-semibold';
  const strClass = isLight ? 'text-emerald-700' : 'text-[#a6e3a1]';
  const numClass = isLight ? 'text-orange-700 font-bold' : 'text-[#fab387] font-semibold';
  const braceClass = isLight ? 'text-amber-700 font-bold' : 'text-[#f9e2af] font-bold';

  html = html.replace(/"([^"]+)"(\s*:)/g, `<span class="${keyClass}">"$1"</span>$2`);
  html = html.replace(/:\s*"(.*)"(,?)$/g, `: <span class="${strClass}">"$1"</span>$2`);
  html = html.replace(/:\s*(-?\d+(?:\.\d+)?)(,?)$/g, `: <span class="${numClass}">$1</span>$2`);
  html = html.replace(/([{}[\]])/g, `<span class="${braceClass}">$1</span>`);
  return html;
}

function renderCodeLinesHtml(rawText, lineColorizer) {
  const lines = (rawText || '').split('\n');
  return lines
    .map(
      (line, idx) => `
      <div class="code-line flex items-start px-2 py-0.5 rounded">
        <span class="w-6 shrink-0 text-[10px] text-slate-400 dark:text-[#6c7086] select-none text-right pr-2 font-mono">${idx + 1}</span>
        <span class="flex-1 font-mono text-xs whitespace-pre">${lineColorizer(line, idx)}</span>
      </div>`
    )
    .join('');
}

function renderEditableRows() {
  const tbody = document.getElementById('conv-records-tbody');
  if (!tbody) return;

  tbody.innerHTML = converterRecords
    .map(
      (rec, idx) => `
      <tr class="border-b border-slate-100 dark:border-[#313244]/70 hover:bg-slate-50/70 dark:hover:bg-[#181825]/60 transition">
        <td class="px-3 py-2 font-mono text-[11px] font-bold text-slate-400 dark:text-[#6c7086] text-center">
          #${idx + 1}
        </td>
        <td class="px-2 py-1.5">
          <input
            type="text"
            data-conv-idx="${idx}"
            data-conv-field="nome"
            value="${escapeHtmlText(rec.nome)}"
            maxlength="30"
            placeholder="Nome do estudante"
            oninput="updateConverterField(${idx}, 'nome', this.value)"
            class="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#11111b] border border-slate-200 dark:border-[#313244] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition"
          />
        </td>
        <td class="px-2 py-1.5">
          <input
            type="text"
            data-conv-idx="${idx}"
            data-conv-field="curso"
            value="${escapeHtmlText(rec.curso)}"
            maxlength="30"
            placeholder="Curso"
            oninput="updateConverterField(${idx}, 'curso', this.value)"
            class="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#11111b] border border-slate-200 dark:border-[#313244] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition"
          />
        </td>
        <td class="px-2 py-1.5 w-28">
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            data-conv-idx="${idx}"
            data-conv-field="nota"
            value="${escapeHtmlText(String(rec.nota))}"
            oninput="updateConverterField(${idx}, 'nota', this.value)"
            class="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#11111b] border border-slate-200 dark:border-[#313244] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition text-right"
          />
        </td>
        <td class="px-2 py-1.5 text-center w-12">
          <button
            onclick="removeConverterRecord(${idx})"
            ${converterRecords.length <= 1 ? 'disabled' : ''}
            title="${converterRecords.length <= 1 ? 'Mantenha ao menos 1 registro' : 'Remover registro'}"
            class="p-1.5 rounded-lg text-xs ${
              converterRecords.length <= 1
                ? 'text-slate-300 dark:text-[#45475a] cursor-not-allowed'
                : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/15'
            } transition"
          >
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>`
    )
    .join('');

  const countBadge = document.getElementById('conv-record-count');
  if (countBadge) {
    countBadge.textContent = `${converterRecords.length} ${converterRecords.length === 1 ? 'registro' : 'registros'}`;
  }
}

export function renderConverterOutputs() {
  const outputs = computeAllFormatOutputs(converterRecords);

  // 1. CSV
  const csvCodeEl = document.getElementById('conv-code-csv');
  const csvMetaEl = document.getElementById('conv-meta-csv');
  if (csvCodeEl) {
    csvCodeEl.innerHTML = renderCodeLinesHtml(outputs.csv.text, (line, idx) =>
      colorizeCsvLine(line, ';', idx === 0)
    );
  }
  if (csvMetaEl) {
    csvMetaEl.textContent = `${outputs.csv.bytes} B • ${outputs.csv.lines} linhas`;
  }

  // 2. Posicional
  const posCodeEl = document.getElementById('conv-code-positional');
  const posMetaEl = document.getElementById('conv-meta-positional');
  if (posCodeEl) {
    posCodeEl.innerHTML = renderCodeLinesHtml(
      outputs.positional.text,
      colorizePositionalConverterLine
    );
  }
  if (posMetaEl) {
    posMetaEl.textContent = `${outputs.positional.bytes} B • ${outputs.positional.lines} linhas (24 cols/linha)`;
  }

  // 3. JSON
  const jsonCodeEl = document.getElementById('conv-code-json');
  const jsonMetaEl = document.getElementById('conv-meta-json');
  if (jsonCodeEl) {
    jsonCodeEl.innerHTML = renderCodeLinesHtml(outputs.json.text, colorizeJsonConverterLine);
  }
  if (jsonMetaEl) {
    jsonMetaEl.textContent = `${outputs.json.bytes} B • ${outputs.json.lines} linhas`;
  }

  // 4. XML
  const xmlCodeEl = document.getElementById('conv-code-xml');
  const xmlMetaEl = document.getElementById('conv-meta-xml');
  if (xmlCodeEl) {
    xmlCodeEl.innerHTML = renderCodeLinesHtml(outputs.xml.text, colorizeXmlLine);
  }
  if (xmlMetaEl) {
    xmlMetaEl.textContent = `${outputs.xml.bytes} B • ${outputs.xml.lines} linhas`;
  }

  // Atualiza termômetros comparativos de tamanho em bytes
  const maxBytes = Math.max(
    1,
    outputs.csv.bytes,
    outputs.positional.bytes,
    outputs.json.bytes,
    outputs.xml.bytes
  );

  const updateBar = (fmtKey, data) => {
    const bar = document.getElementById(`conv-bar-${fmtKey}`);
    const label = document.getElementById(`conv-stat-${fmtKey}`);
    const pct = Math.max(8, Math.round((data.bytes / maxBytes) * 100));
    if (bar) bar.style.width = `${pct}%`;
    if (label) label.textContent = `${data.bytes} bytes (${data.lines} linhas)`;
  };

  updateBar('csv', outputs.csv);
  updateBar('positional', outputs.positional);
  updateBar('json', outputs.json);
  updateBar('xml', outputs.xml);
}

export function updateConverterField(index, field, value) {
  if (!converterRecords[index]) return;
  if (field === 'nota') {
    const parsed = parseFloat(value);
    converterRecords[index].nota = Number.isFinite(parsed) ? parsed : 0;
  } else {
    converterRecords[index][field] = value;
  }
  renderConverterOutputs();
}

export function addConverterRecord() {
  if (converterRecords.length >= 10) return;
  converterRecords.push({
    nome: `Aluno ${converterRecords.length + 1}`,
    curso: 'Sistemas',
    nota: 8.0,
  });
  playTone('E5');
  renderEditableRows();
  renderConverterOutputs();
}

export function removeConverterRecord(index) {
  if (converterRecords.length <= 1) return;
  converterRecords.splice(index, 1);
  playTone('C4');
  renderEditableRows();
  renderConverterOutputs();
}

export function loadConverterPreset(presetKey) {
  if (!converterPresets[presetKey]) return;
  converterRecords = structuredClone(converterPresets[presetKey]);
  playTone('G5');
  renderEditableRows();
  renderConverterOutputs();
}

export function toggleConverterPositionalGlyph() {
  showPositionalSpacesGlyph = !showPositionalSpacesGlyph;
  const btn = document.getElementById('conv-btn-pos-glyph');
  if (btn) {
    btn.textContent = showPositionalSpacesGlyph ? 'Espaços ␣: Visíveis' : 'Espaços ␣: Ocultos';
  }
  renderConverterOutputs();
}

function showGlobalToast(msg) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  if (!toast || !toastMessage) return;
  toastMessage.textContent = msg;
  toast.classList.remove('translate-y-20', 'opacity-0');
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 2400);
}

export function copyConverterFormat(formatKey) {
  const outputs = computeAllFormatOutputs(converterRecords);
  const target = outputs[formatKey];
  if (!target) return;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(target.text);
  }
  playTone('A5');
  const labels = {
    csv: 'CSV (alunos.csv)',
    positional: 'Posicional (alunos_pos.txt)',
    json: 'JSON (alunos.json)',
    xml: 'XML (alunos.xml)',
  };
  showGlobalToast(`Conteúdo ${labels[formatKey] || formatKey} copiado!`);
}

export function downloadConverterFormat(formatKey) {
  const outputs = computeAllFormatOutputs(converterRecords);
  const target = outputs[formatKey];
  if (!target) return;

  const meta = {
    csv: { filename: 'alunos.csv', mime: 'text/csv;charset=utf-8' },
    positional: { filename: 'alunos_pos.txt', mime: 'text/plain;charset=utf-8' },
    json: { filename: 'alunos.json', mime: 'application/json;charset=utf-8' },
    xml: { filename: 'alunos.xml', mime: 'application/xml;charset=utf-8' },
  }[formatKey];

  if (!meta) return;

  const blob = new Blob([target.text], { type: meta.mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = meta.filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  playTone('C5');
  showGlobalToast(`Download de ${meta.filename} iniciado!`);
}

/**
 * Envia o arquivo gerado diretamente para o Validador do módulo correspondente e navega até ele
 */
export function sendConverterToValidator(formatKey) {
  const outputs = computeAllFormatOutputs(converterRecords);
  const target = outputs[formatKey];
  if (!target) return;

  if (formatKey === 'csv' && typeof window.switchFormatModule === 'function') {
    window.switchFormatModule('csv');
    if (typeof window.switchCsvTab === 'function') window.switchCsvTab('validator');
    const input = document.getElementById('csv-validator-input');
    if (input) {
      input.value = target.text;
      if (typeof window.runCsvValidation === 'function') window.runCsvValidation();
    }
  } else if (formatKey === 'positional' && typeof window.switchFormatModule === 'function') {
    window.switchFormatModule('positional');
    if (typeof window.switchPosTab === 'function') window.switchPosTab('validator');
    const input = document.getElementById('pos-validator-input');
    if (input) {
      input.value = target.text;
      if (typeof window.runPosValidation === 'function') window.runPosValidation();
    }
  } else if (formatKey === 'json' && typeof window.switchFormatModule === 'function') {
    window.switchFormatModule('json');
    if (typeof window.switchTab === 'function') window.switchTab('validator');
    const input = document.getElementById('validator-input');
    if (input) {
      input.value = target.text;
      if (typeof window.runValidation === 'function') window.runValidation();
    }
  } else if (formatKey === 'xml' && typeof window.switchFormatModule === 'function') {
    window.switchFormatModule('xml');
    if (typeof window.switchXmlTab === 'function') window.switchXmlTab('validator');
    const input = document.getElementById('xml-validator-input');
    if (input) {
      input.value = target.text;
      if (typeof window.runXmlValidation === 'function') window.runXmlValidation();
    }
  }
  showGlobalToast('Arquivo enviado para auditoria no Validador!');
}

export function refreshConverterTheme() {
  renderConverterOutputs();
}

export function getConverterModuleHtml() {
  return `
  <section id="module-converter" class="hidden flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 space-y-6">
    <!-- Cabeçalho do Módulo 5 -->
    <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-4 sm:p-5 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div class="flex items-start sm:items-center gap-3">
        <div class="w-11 h-11 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 flex items-center justify-center text-xl shrink-0">
          <i class="fa-solid fa-arrows-spin"></i>
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300">
              Módulo 5 • Seções 8 e 9 da Apostila
            </span>
            <span class="text-[10px] font-mono text-slate-500 dark:text-[#a6adc8]">Mesmo Dado → 4 Formatos</span>
          </div>
          <h2 class="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
            Conversor e Tradutor Interativo em Tempo Real (CSV • Posicional • JSON • XML)
          </h2>
          <p class="text-xs text-slate-600 dark:text-[#a6adc8]">
            Altere qualquer célula da tabela de estudantes abaixo e observe instantaneamente como o <strong>mesmo conjunto de dados</strong> é estruturado nos 4 formatos de arquivo-texto.
          </p>
        </div>
      </div>

      <!-- Cenários Prontos da Apostila -->
      <div class="flex flex-wrap items-center gap-1.5 shrink-0">
        <span class="text-[11px] font-bold text-slate-500 dark:text-[#a6adc8] mr-1">Cenários:</span>
        <button onclick="loadConverterPreset('canonical')" class="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-500/15 dark:hover:bg-purple-500/25 dark:text-purple-300 dark:border-purple-500/30 text-xs font-bold transition">
          <i class="fa-solid fa-book-open mr-1"></i>Seção 9 (Ana & Bruno)
        </button>
        <button onclick="loadConverterPreset('special_chars')" class="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-500/15 dark:hover:bg-amber-500/25 dark:text-amber-300 dark:border-amber-500/30 text-xs font-bold transition">
          <i class="fa-solid fa-shield-halved mr-1"></i>Escapes (; " &amp; &lt;&gt;)
        </button>
        <button onclick="loadConverterPreset('expanded')" class="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 dark:bg-[#313244] dark:hover:bg-[#45475a] dark:text-[#cdd6f4] dark:border-[#45475a] text-xs font-semibold transition">
          <i class="fa-solid fa-users mr-1"></i>Turma (4 Alunos)
        </button>
      </div>
    </div>

    <!-- Painel Superior: Tabela Fonte de Dados Editável + Termômetro de Tamanho em Bytes -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Editor Tabular em Tempo Real (7 colunas) -->
      <div class="lg:col-span-7 bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl overflow-hidden shadow-md">
        <div class="px-4 py-3 border-b border-slate-200 dark:border-[#313244] bg-slate-50 dark:bg-[#181825] flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-pen-to-square text-purple-600 dark:text-purple-400"></i>
            <span class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
              Dados de Origem em Memória (Edite em Tempo Real)
            </span>
            <span id="conv-record-count" class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 font-bold">
              2 registros
            </span>
          </div>
          <button
            id="conv-btn-add-record"
            onclick="addConverterRecord()"
            class="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <i class="fa-solid fa-plus"></i> Adicionar Registro
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-200 dark:border-[#313244] bg-slate-100/70 dark:bg-[#11111b]/60 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-[#a6adc8]">
                <th class="px-3 py-2 w-12 text-center">#</th>
                <th class="px-2 py-2">Nome <span class="font-mono text-[10px] text-amber-600 dark:text-amber-400">(Pos 01..10 A)</span></th>
                <th class="px-2 py-2">Curso <span class="font-mono text-[10px] text-sky-600 dark:text-sky-400">(Pos 11..20 A)</span></th>
                <th class="px-2 py-2 text-right">Nota <span class="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">(Pos 21..24 N1)</span></th>
                <th class="px-2 py-2 text-center">Ação</th>
              </tr>
            </thead>
            <tbody id="conv-records-tbody"></tbody>
          </table>
        </div>

        <div class="px-4 py-2.5 bg-slate-50/80 dark:bg-[#181825]/60 border-t border-slate-200 dark:border-[#313244] text-[11px] text-slate-600 dark:text-[#a6adc8] flex flex-wrap items-center justify-between gap-2">
          <span><i class="fa-solid fa-lightbulb text-amber-500 mr-1"></i>Experimente digitar <code>;</code>, <code>"</code> ou <code>&amp;</code> em um nome/curso para ver o escape automático em cada formato!</span>
        </div>
      </div>

      <!-- Termômetro Ao Vivo de Verbosidade / Tamanho em Bytes (5 colunas) -->
      <div class="lg:col-span-5 bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-4 shadow-md space-y-3">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-[#313244] pb-2.5">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-scale-unbalanced-flip text-indigo-600 dark:text-indigo-400"></i>
            <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
              Comparativo de Tamanho (UTF-8 Ao Vivo)
            </h3>
          </div>
          <span class="text-[10px] font-mono text-slate-500 dark:text-[#a6adc8]">Compactação vs. Verbosidade</span>
        </div>

        <div class="space-y-2.5 text-xs">
          <!-- 1. CSV -->
          <div>
            <div class="flex justify-between mb-1">
              <span class="font-bold text-teal-700 dark:text-teal-300"><i class="fa-solid fa-table mr-1"></i>1. CSV (Delimitado)</span>
              <span id="conv-stat-csv" class="font-mono text-[11px] text-slate-600 dark:text-[#a6adc8]">0 bytes</span>
            </div>
            <div class="w-full h-2 bg-slate-100 dark:bg-[#11111b] rounded-full overflow-hidden">
              <div id="conv-bar-csv" class="h-full bg-teal-500 rounded-full transition-all duration-300" style="width: 30%"></div>
            </div>
          </div>

          <!-- 2. Posicional -->
          <div>
            <div class="flex justify-between mb-1">
              <span class="font-bold text-amber-700 dark:text-amber-300"><i class="fa-solid fa-ruler-horizontal mr-1"></i>2. Posicional (Largura Fixa 24 cols)</span>
              <span id="conv-stat-positional" class="font-mono text-[11px] text-slate-600 dark:text-[#a6adc8]">0 bytes</span>
            </div>
            <div class="w-full h-2 bg-slate-100 dark:bg-[#11111b] rounded-full overflow-hidden">
              <div id="conv-bar-positional" class="h-full bg-amber-500 rounded-full transition-all duration-300" style="width: 35%"></div>
            </div>
          </div>

          <!-- 3. JSON -->
          <div>
            <div class="flex justify-between mb-1">
              <span class="font-bold text-indigo-700 dark:text-indigo-300"><span class="font-mono mr-1">{ }</span>3. JSON (Chave-Valor)</span>
              <span id="conv-stat-json" class="font-mono text-[11px] text-slate-600 dark:text-[#a6adc8]">0 bytes</span>
            </div>
            <div class="w-full h-2 bg-slate-100 dark:bg-[#11111b] rounded-full overflow-hidden">
              <div id="conv-bar-json" class="h-full bg-indigo-500 rounded-full transition-all duration-300" style="width: 75%"></div>
            </div>
          </div>

          <!-- 4. XML -->
          <div>
            <div class="flex justify-between mb-1">
              <span class="font-bold text-sky-700 dark:text-sky-300"><i class="fa-solid fa-code mr-1"></i>4. XML (Marcação de Tags)</span>
              <span id="conv-stat-xml" class="font-mono text-[11px] text-slate-600 dark:text-[#a6adc8]">0 bytes</span>
            </div>
            <div class="w-full h-2 bg-slate-100 dark:bg-[#11111b] rounded-full overflow-hidden">
              <div id="conv-bar-xml" class="h-full bg-sky-500 rounded-full transition-all duration-300" style="width: 100%"></div>
            </div>
          </div>
        </div>

        <p class="text-[11px] text-slate-500 dark:text-[#a6adc8] leading-relaxed pt-1 border-t border-slate-100 dark:border-[#313244]">
          Observe o <em>trade-off</em> fundamental da Engenharia de Software: <strong>CSV e Posicional</strong> economizam bytes em disco/rede, enquanto <strong>JSON e XML</strong> gastam mais bytes repetindo chaves/tags em troca de <strong>autodescrição e hierarquia</strong>.
        </p>
      </div>
    </div>

    <!-- Grade 2x2 dos 4 Formatos Gerados em Tempo Real (Ordem Canônica: 1. CSV, 2. Posicional, 3. JSON, 4. XML) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Card 1: CSV -->
      <div class="bg-white dark:bg-[#181825] border border-slate-200 dark:border-[#313244] rounded-2xl overflow-hidden shadow-md flex flex-col">
        <div class="px-4 py-2.5 bg-slate-100 dark:bg-[#11111b] border-b border-slate-200 dark:border-[#313244] flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-teal-600 text-white font-mono text-[11px] font-bold flex items-center justify-center">1</span>
            <span class="font-mono text-xs font-bold text-slate-800 dark:text-white">alunos.csv</span>
            <span id="conv-meta-csv" class="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/15 text-teal-700 dark:text-teal-300 font-bold"></span>
          </div>
          <div class="flex items-center gap-1.5">
            <button onclick="sendConverterToValidator('csv')" class="px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:hover:bg-indigo-500/30 dark:text-indigo-300 text-[10px] font-bold transition" title="Auditar no Validador CSV">
              <i class="fa-solid fa-magnifying-glass-chart mr-1"></i>Validar
            </button>
            <button onclick="copyConverterFormat('csv')" class="px-2 py-1 rounded bg-slate-200/80 hover:bg-slate-300 dark:bg-[#313244] dark:hover:bg-[#45475a] text-slate-700 dark:text-[#cdd6f4] text-[10px] font-bold transition">
              <i class="fa-regular fa-copy mr-1"></i>Copiar
            </button>
            <button onclick="downloadConverterFormat('csv')" class="px-2 py-1 rounded bg-slate-200/80 hover:bg-slate-300 dark:bg-[#313244] dark:hover:bg-[#45475a] text-slate-700 dark:text-[#cdd6f4] text-[10px] font-bold transition">
              <i class="fa-solid fa-download mr-1"></i>.csv
            </button>
          </div>
        </div>
        <div id="conv-code-csv" class="p-3 overflow-x-auto flex-1 min-h-[150px] max-h-[260px]"></div>
        <div class="px-4 py-2 bg-slate-50 dark:bg-[#11111b]/60 border-t border-slate-200 dark:border-[#313244] text-[11px] text-slate-600 dark:text-[#a6adc8]">
          <strong>Anatomia CSV:</strong> 1ª linha de cabeçalho + campos separados por <code>;</code>. Aspas duplas aparecem apenas se o texto contiver delimitador ou aspas.
        </div>
      </div>

      <!-- Card 2: Posicional -->
      <div class="bg-white dark:bg-[#181825] border border-slate-200 dark:border-[#313244] rounded-2xl overflow-hidden shadow-md flex flex-col">
        <div class="px-4 py-2.5 bg-slate-100 dark:bg-[#11111b] border-b border-slate-200 dark:border-[#313244] flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-amber-600 text-white font-mono text-[11px] font-bold flex items-center justify-center">2</span>
            <span class="font-mono text-xs font-bold text-slate-800 dark:text-white">alunos_pos.txt</span>
            <span id="conv-meta-positional" class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold"></span>
          </div>
          <div class="flex items-center gap-1.5">
            <button id="conv-btn-pos-glyph" onclick="toggleConverterPositionalGlyph()" class="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300 text-[10px] font-bold transition">
              Espaços ␣: Visíveis
            </button>
            <button onclick="sendConverterToValidator('positional')" class="px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:hover:bg-indigo-500/30 dark:text-indigo-300 text-[10px] font-bold transition" title="Auditar no Validador Posicional">
              <i class="fa-solid fa-magnifying-glass-chart mr-1"></i>Validar
            </button>
            <button onclick="copyConverterFormat('positional')" class="px-2 py-1 rounded bg-slate-200/80 hover:bg-slate-300 dark:bg-[#313244] dark:hover:bg-[#45475a] text-slate-700 dark:text-[#cdd6f4] text-[10px] font-bold transition">
              <i class="fa-regular fa-copy mr-1"></i>Copiar
            </button>
            <button onclick="downloadConverterFormat('positional')" class="px-2 py-1 rounded bg-slate-200/80 hover:bg-slate-300 dark:bg-[#313244] dark:hover:bg-[#45475a] text-slate-700 dark:text-[#cdd6f4] text-[10px] font-bold transition">
              <i class="fa-solid fa-download mr-1"></i>.txt
            </button>
          </div>
        </div>
        <div id="conv-code-positional" class="p-3 overflow-x-auto flex-1 min-h-[150px] max-h-[260px]"></div>
        <div class="px-4 py-2 bg-slate-50 dark:bg-[#11111b]/60 border-t border-slate-200 dark:border-[#313244] text-[11px] text-slate-600 dark:text-[#a6adc8]">
          <strong>Anatomia Posicional (24 cols):</strong> <span class="text-amber-700 dark:text-amber-300 font-semibold">Nome [01..10]</span> + <span class="text-sky-700 dark:text-sky-300 font-semibold">Curso [11..20]</span> + <span class="text-emerald-700 dark:text-emerald-300 font-semibold">Nota [21..24 N1]</span> (ex.: <code>8.5</code> vira <code>0085</code>).
        </div>
      </div>

      <!-- Card 3: JSON -->
      <div class="bg-white dark:bg-[#181825] border border-slate-200 dark:border-[#313244] rounded-2xl overflow-hidden shadow-md flex flex-col">
        <div class="px-4 py-2.5 bg-slate-100 dark:bg-[#11111b] border-b border-slate-200 dark:border-[#313244] flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-indigo-600 text-white font-mono text-[11px] font-bold flex items-center justify-center">3</span>
            <span class="font-mono text-xs font-bold text-slate-800 dark:text-white">alunos.json</span>
            <span id="conv-meta-json" class="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-bold"></span>
          </div>
          <div class="flex items-center gap-1.5">
            <button onclick="sendConverterToValidator('json')" class="px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:hover:bg-indigo-500/30 dark:text-indigo-300 text-[10px] font-bold transition" title="Auditar no Validador JSON">
              <i class="fa-solid fa-magnifying-glass-chart mr-1"></i>Validar
            </button>
            <button onclick="copyConverterFormat('json')" class="px-2 py-1 rounded bg-slate-200/80 hover:bg-slate-300 dark:bg-[#313244] dark:hover:bg-[#45475a] text-slate-700 dark:text-[#cdd6f4] text-[10px] font-bold transition">
              <i class="fa-regular fa-copy mr-1"></i>Copiar
            </button>
            <button onclick="downloadConverterFormat('json')" class="px-2 py-1 rounded bg-slate-200/80 hover:bg-slate-300 dark:bg-[#313244] dark:hover:bg-[#45475a] text-slate-700 dark:text-[#cdd6f4] text-[10px] font-bold transition">
              <i class="fa-solid fa-download mr-1"></i>.json
            </button>
          </div>
        </div>
        <div id="conv-code-json" class="p-3 overflow-x-auto flex-1 min-h-[180px] max-h-[280px]"></div>
        <div class="px-4 py-2 bg-slate-50 dark:bg-[#11111b]/60 border-t border-slate-200 dark:border-[#313244] text-[11px] text-slate-600 dark:text-[#a6adc8]">
          <strong>Anatomia JSON:</strong> Lista <code>[ ]</code> de objetos <code>{ }</code> com pares <code>"chave": valor</code>. A nota <code>8.5</code> é tipo numérico nativo (sem aspas).
        </div>
      </div>

      <!-- Card 4: XML -->
      <div class="bg-white dark:bg-[#181825] border border-slate-200 dark:border-[#313244] rounded-2xl overflow-hidden shadow-md flex flex-col">
        <div class="px-4 py-2.5 bg-slate-100 dark:bg-[#11111b] border-b border-slate-200 dark:border-[#313244] flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-sky-600 text-white font-mono text-[11px] font-bold flex items-center justify-center">4</span>
            <span class="font-mono text-xs font-bold text-slate-800 dark:text-white">alunos.xml</span>
            <span id="conv-meta-xml" class="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/15 text-sky-700 dark:text-sky-300 font-bold"></span>
          </div>
          <div class="flex items-center gap-1.5">
            <button onclick="sendConverterToValidator('xml')" class="px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:hover:bg-indigo-500/30 dark:text-indigo-300 text-[10px] font-bold transition" title="Auditar no Validador XML">
              <i class="fa-solid fa-magnifying-glass-chart mr-1"></i>Validar
            </button>
            <button onclick="copyConverterFormat('xml')" class="px-2 py-1 rounded bg-slate-200/80 hover:bg-slate-300 dark:bg-[#313244] dark:hover:bg-[#45475a] text-slate-700 dark:text-[#cdd6f4] text-[10px] font-bold transition">
              <i class="fa-regular fa-copy mr-1"></i>Copiar
            </button>
            <button onclick="downloadConverterFormat('xml')" class="px-2 py-1 rounded bg-slate-200/80 hover:bg-slate-300 dark:bg-[#313244] dark:hover:bg-[#45475a] text-slate-700 dark:text-[#cdd6f4] text-[10px] font-bold transition">
              <i class="fa-solid fa-download mr-1"></i>.xml
            </button>
          </div>
        </div>
        <div id="conv-code-xml" class="p-3 overflow-x-auto flex-1 min-h-[180px] max-h-[280px]"></div>
        <div class="px-4 py-2 bg-slate-50 dark:bg-[#11111b]/60 border-t border-slate-200 dark:border-[#313244] text-[11px] text-slate-600 dark:text-[#a6adc8]">
          <strong>Anatomia XML:</strong> Prólogo + Raiz única <code>&lt;alunos&gt;</code> + atributo entre aspas <code>id="1"</code> + tags de abertura e fechamento estritas.
        </div>
      </div>
    </div>

    <!-- Quadro Comparativo Canônico (Seção 8 da Apostila) -->
    <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl overflow-hidden shadow-md">
      <div class="px-4 py-3 bg-slate-50 dark:bg-[#181825] border-b border-slate-200 dark:border-[#313244] flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-table-columns text-purple-600 dark:text-purple-400"></i>
          <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
            Quadro Comparativo Sintético dos 4 Formatos (Seção 8 da Apostila)
          </h3>
        </div>
        <span class="text-[11px] text-slate-500 dark:text-[#a6adc8]">Critérios de decisão arquitetural</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-slate-200 dark:border-[#313244] bg-slate-100/70 dark:bg-[#11111b]/60 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-[#a6adc8]">
              <th class="px-4 py-2.5">Critério Técnico</th>
              <th class="px-4 py-2.5 text-teal-700 dark:text-teal-300">1. CSV</th>
              <th class="px-4 py-2.5 text-amber-700 dark:text-amber-300">2. Posicional (CNAB)</th>
              <th class="px-4 py-2.5 text-indigo-700 dark:text-indigo-300">3. JSON</th>
              <th class="px-4 py-2.5 text-sky-700 dark:text-sky-300">4. XML</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-[#313244]/70 text-slate-700 dark:text-[#cdd6f4]">
            <tr>
              <td class="px-4 py-2.5 font-bold">Separação de Campos</td>
              <td class="px-4 py-2.5">Delimitador (<code>,</code> ou <code>;</code>)</td>
              <td class="px-4 py-2.5">Posição / Coluna fixa</td>
              <td class="px-4 py-2.5">Pares <code>"chave": valor</code></td>
              <td class="px-4 py-2.5">Tags <code>&lt;tag&gt;...&lt;/tag&gt;</code></td>
            </tr>
            <tr>
              <td class="px-4 py-2.5 font-bold">Autodescritivo?</td>
              <td class="px-4 py-2.5">Parcial (apenas se tiver cabeçalho)</td>
              <td class="px-4 py-2.5 font-semibold text-rose-600 dark:text-rose-400">Não (exige Manual de Layout externo)</td>
              <td class="px-4 py-2.5 font-semibold text-emerald-700 dark:text-emerald-400">Sim (nomes das chaves em cada objeto)</td>
              <td class="px-4 py-2.5 font-semibold text-emerald-700 dark:text-emerald-400">Sim (tags, atributos e schemas XSD)</td>
            </tr>
            <tr>
              <td class="px-4 py-2.5 font-bold">Suporte a Hierarquia</td>
              <td class="px-4 py-2.5">Não (estrutura tabular plana 2D)</td>
              <td class="px-4 py-2.5">Apenas por lotes/tipos de linha (CNAB)</td>
              <td class="px-4 py-2.5 font-semibold text-emerald-700 dark:text-emerald-400">Nativo (objetos e arrays aninhados)</td>
              <td class="px-4 py-2.5 font-semibold text-emerald-700 dark:text-emerald-400">Nativo (Árvore DOM de elementos)</td>
            </tr>
            <tr>
              <td class="px-4 py-2.5 font-bold">Tamanho do Arquivo</td>
              <td class="px-4 py-2.5 font-semibold text-emerald-700 dark:text-emerald-400">Muito Compacto</td>
              <td class="px-4 py-2.5">Previsível e Fixo (preenchimento)</td>
              <td class="px-4 py-2.5">Moderado (leve para web)</td>
              <td class="px-4 py-2.5 font-semibold text-amber-700 dark:text-amber-400">Verboso (tags de abertura e fechamento)</td>
            </tr>
            <tr>
              <td class="px-4 py-2.5 font-bold">Uso Principal no Mercado</td>
              <td class="px-4 py-2.5">Planilhas, BI, Ciência de Dados</td>
              <td class="px-4 py-2.5">Bancos (CNAB 240/400), Mainframes, ERPs</td>
              <td class="px-4 py-2.5">APIs REST, Apps Mobile/Web, NoSQL</td>
              <td class="px-4 py-2.5">Nota Fiscal Eletrônica (NF-e), TISS, SOAP</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
  `;
}

export function initConverterModule() {
  Object.assign(window, {
    updateConverterField,
    addConverterRecord,
    removeConverterRecord,
    loadConverterPreset,
    toggleConverterPositionalGlyph,
    copyConverterFormat,
    downloadConverterFormat,
    sendConverterToValidator,
  });

  renderEditableRows();
  renderConverterOutputs();
}
