import { describe, it, expect, beforeEach } from 'vitest';
import {
  initApp,
  switchFormatModule,
  getActiveModuleId,
  openModal,
  closeModal,
} from '../src/main.js';
import {
  converterPresets,
  getConverterRecords,
  computeAllFormatOutputs,
  updateConverterField,
  addConverterRecord,
  removeConverterRecord,
  loadConverterPreset,
  sendConverterToValidator,
  getConverterModuleHtml,
} from '../src/modules/converter/index.js';
import { validateCsvText } from '../src/modules/csv/index.js';
import { validatePositionalText } from '../src/modules/positional/index.js';
import { validateXmlText } from '../src/modules/xml/index.js';

describe('Sprint 4 — Módulo 5: Conversor / Tradutor Interativo em Tempo Real (US-5.1)', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    initApp();
    switchFormatModule('converter');
    loadConverterPreset('canonical');
  });

  it('deve carregar o cenário canônico da Seção 9 (Ana e Bruno) sem exibir nenhum código Python na interface', () => {
    const records = getConverterRecords();
    expect(records).toEqual(converterPresets.canonical);

    const html = getConverterModuleHtml();
    expect(html).not.toMatch(/import csv|import json|ElementTree|def |with open\(/i);

    const outputs = computeAllFormatOutputs();
    expect(outputs.csv.text).toBe('nome;curso;nota\nAna;Sistemas;8.5\nBruno;Sistemas;7.0');
    expect(outputs.positional.text).toBe('Ana       Sistemas  0085\nBruno     Sistemas  0070');
    expect(JSON.parse(outputs.json.text)).toHaveLength(2);
    expect(outputs.xml.text).toContain('<alunos>');
    expect(outputs.xml.text).toContain('<aluno id="1">');
  });

  it('deve atualizar instantaneamente os 4 formatos e métricas de bytes/linhas ao editar, adicionar ou remover registros', () => {
    updateConverterField(0, 'nome', 'Mariana');
    updateConverterField(0, 'nota', '9.8');

    let outputs = computeAllFormatOutputs();
    expect(outputs.csv.text).toContain('Mariana;Sistemas;9.8');
    expect(outputs.positional.text.split('\n')[0]).toBe('Mariana   Sistemas  0098');
    expect(outputs.json.text).toContain('"nome": "Mariana"');
    expect(outputs.xml.text).toContain('<nome>Mariana</nome>');
    expect(outputs.xml.text).toContain('<nota>9.8</nota>');

    addConverterRecord();
    expect(getConverterRecords()).toHaveLength(3);
    outputs = computeAllFormatOutputs();
    expect(outputs.csv.lines).toBe(4); // 1 header + 3 rows
    expect(outputs.positional.lines).toBe(3);

    removeConverterRecord(2);
    expect(getConverterRecords()).toHaveLength(2);
  });

  it('deve escapar caracteres especiais (; " & <>) mantendo os 4 formatos 100% válidos nos respectivos Validadores', () => {
    loadConverterPreset('special_chars');
    const outputs = computeAllFormatOutputs();

    // 1. Valida CSV gerado contra o motor do Módulo 1
    const csvCheck = validateCsvText(outputs.csv.text);
    expect(csvCheck.valid).toBe(true);
    expect(csvCheck.records[0][0]).toBe('Ana; "Bia"');

    // 2. Valida Posicional de 24 colunas gerado contra o motor do Módulo 2
    const posCheck = validatePositionalText(outputs.positional.text);
    expect(posCheck.valid).toBe(true);
    expect(posCheck.metrics.lineLength).toBe('24 cols');

    // 3. Valida JSON gerado contra RFC 8259
    const parsedJson = JSON.parse(outputs.json.text);
    expect(parsedJson[0].nome).toBe('Ana; "Bia"');

    // 4. Valida XML gerado contra as 6 Regras do Módulo 4
    const xmlCheck = validateXmlText(outputs.xml.text);
    expect(xmlCheck.valid).toBe(true);
    expect(outputs.xml.text).toContain('Sistemas &amp; IA');
    expect(outputs.xml.text).toContain('Redes &lt;Cloud&gt;');
  });

  it('deve enviar qualquer formato gerado diretamente para auditoria no Validador do módulo correspondente', () => {
    sendConverterToValidator('positional');
    expect(getActiveModuleId()).toBe('positional');
    expect(
      document.getElementById('pos-validator-success-section').classList.contains('hidden')
    ).toBe(false);

    switchFormatModule('converter');
    sendConverterToValidator('xml');
    expect(getActiveModuleId()).toBe('xml');
    expect(
      document.getElementById('xml-validator-success-section').classList.contains('hidden')
    ).toBe(false);
  });

  it('deve renderizar o rodapé (footer) e abrir/fechar as janelas flutuantes Sobre, Termos de Uso e Políticas de Privacidade', () => {
    const footer = document.getElementById('app-footer');
    expect(footer).not.toBeNull();
    expect(footer.textContent).toContain('Sobre');
    expect(footer.textContent).toContain('Termos de Uso');
    expect(footer.textContent).toContain('Políticas de Privacidade');

    const modalSobre = document.getElementById('modal-sobre-projeto');
    const modalTermos = document.getElementById('modal-termos');
    const modalPrivacidade = document.getElementById('modal-privacidade');

    expect(modalSobre.textContent).toContain('Prof. Nilton F. Junior');
    expect(modalSobre.textContent).toContain('O Foco na Educação');
    expect(modalSobre.textContent).toContain('Pilares Arquiteturais');

    openModal('modal-sobre-projeto');
    expect(modalSobre.classList.contains('hidden')).toBe(false);
    closeModal('modal-sobre-projeto');
    expect(modalSobre.classList.contains('hidden')).toBe(true);

    openModal('modal-termos');
    expect(modalTermos.classList.contains('hidden')).toBe(false);
    closeModal('modal-termos');
    expect(modalTermos.classList.contains('hidden')).toBe(true);

    openModal('modal-privacidade');
    expect(modalPrivacidade.classList.contains('hidden')).toBe(false);
    closeModal('modal-privacidade');
    expect(modalPrivacidade.classList.contains('hidden')).toBe(true);
  });
});
