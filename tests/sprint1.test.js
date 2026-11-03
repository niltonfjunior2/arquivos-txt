import { describe, it, expect, beforeEach } from 'vitest';
import { initApp, switchFormatModule, getActiveModuleId, MODULE_ORDER } from '../src/main.js';
import {
  csvStepsData,
  csvTraps,
  detectCsvDelimiter,
  parseCsvLine,
  validateCsvText,
  triggerCsvTrap,
  restoreCleanCsvCode,
  loadCsvValidatorPreset,
} from '../src/modules/csv/index.js';
import {
  stepsData as jsonStepsData,
  traps as jsonTraps,
  validatorPresets as jsonPresets,
  analyzeJsonError,
  computeMetrics,
  triggerTrap as triggerJsonTrap,
  loadValidatorPreset as loadJsonPreset,
} from '../src/modules/json/index.js';

describe('Sprint 1 — App Shell, Módulo JSON Integral e Módulo 1 (CSV)', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    initApp();
  });

  describe('US-1.1 — App Shell Mobile-First e Ordem Canônica', () => {
    it('deve apresentar os módulos na ordem estrita: CSV, Posicionais, JSON, XML, Conversor e Desafio Arquiteto', () => {
      expect(MODULE_ORDER).toEqual(['csv', 'positional', 'json', 'xml', 'converter', 'breach']);
      const navButtons = Array.from(document.querySelectorAll('[id^="nav-format-"]')).map(
        (el) => el.id
      );
      expect(navButtons).toEqual([
        'nav-format-csv',
        'nav-format-positional',
        'nav-format-json',
        'nav-format-xml',
        'nav-format-converter',
        'nav-format-breach',
      ]);
    });

    it('deve alternar corretamente entre os módulos sem quebrar o estado', () => {
      expect(getActiveModuleId()).toBe('csv');
      expect(document.getElementById('module-csv').classList.contains('hidden')).toBe(false);
      expect(document.getElementById('module-json').classList.contains('hidden')).toBe(true);

      switchFormatModule('json');
      expect(getActiveModuleId()).toBe('json');
      expect(document.getElementById('module-json').classList.contains('hidden')).toBe(false);
      expect(document.getElementById('module-csv').classList.contains('hidden')).toBe(true);
    });
  });

  describe('US-1.2 — Preservação Integral do Módulo JSON Homologado', () => {
    it('deve preservar integralmente os 6 passos guiados e as 4 armadilhas do JSON original', () => {
      expect(jsonStepsData).toHaveLength(6);
      expect(Object.keys(jsonTraps)).toEqual([
        'no_quotes',
        'single_quotes',
        'trailing_comma',
        'bracket_confusion',
      ]);
      expect(Object.keys(jsonPresets)).toEqual(['valid', 'err_comma', 'err_quote']);
    });

    it('deve diagnosticar erros RFC 8259 e calcular métricas de JSON válido', () => {
      const validObj = JSON.parse(jsonPresets.valid);
      const metrics = computeMetrics(validObj);
      expect(metrics.keyCount).toBe(10);
      expect(metrics.maxDepth).toBe(3);
      expect(metrics.strings).toBe(9);
      expect(metrics.numbers).toBe(1);
      expect(metrics.booleans).toBe(1);

      let caughtErr = null;
      try {
        JSON.parse(jsonPresets.err_quote);
      } catch (e) {
        caughtErr = e;
      }
      const diag = analyzeJsonError(caughtErr, jsonPresets.err_quote);
      expect(diag.category).toBe('RFC 8259: Quotes Rule');

      switchFormatModule('json');
      triggerJsonTrap('no_quotes');
      expect(document.getElementById('trap-feedback-box').classList.contains('hidden')).toBe(false);

      loadJsonPreset('err_comma');
      expect(document.getElementById('validator-error-section').classList.contains('hidden')).toBe(
        false
      );
    });
  });

  describe('US-2.1 e US-2.2 — Módulo 1: Arquivos CSV (Construtor, Armadilhas e Validador)', () => {
    it('deve conter os 6 passos didáticos de CSV e as 4 armadilhas sem código Python', () => {
      expect(csvStepsData).toHaveLength(6);
      expect(Object.keys(csvTraps)).toEqual([
        'decimal_collision',
        'unquoted_delimiter',
        'unescaped_quotes',
        'column_mismatch',
      ]);

      const allText = JSON.stringify(csvStepsData) + JSON.stringify(csvTraps);
      expect(allText).not.toMatch(/import csv|DictReader|DictWriter|with open\(/i);
    });

    it('deve detectar automaticamente o delimitador (; vs ,) e fazer parse de qualificadores ""', () => {
      expect(detectCsvDelimiter('nome;curso;nota\nAna;Sistemas;8,5')).toBe(';');
      expect(detectCsvDelimiter('nome,curso,nota\nAna,Sistemas,8.5')).toBe(',');

      const parsed = parseCsvLine('"Pedro ""Zé"" Souza","Rua A, 123",8.5', ',');
      expect(parsed.error).toBeNull();
      expect(parsed.fields.map((f) => f.value)).toEqual(['Pedro "Zé" Souza', 'Rua A, 123', '8.5']);
    });

    it('deve validar arquivos CSV válidos e diagnosticar precisamente cada armadilha', () => {
      // 1. Caso Válido
      const validRes = validateCsvText(
        'matricula;nome;nota\n00123;"Silva, Ana";8,5\n00124;"Pedro ""Zé""";7,0'
      );
      expect(validRes.valid).toBe(true);
      expect(validRes.metrics.totalRecords).toBe(2);
      expect(validRes.metrics.totalColumns).toBe(3);
      expect(validRes.metrics.quotedFields).toBe(2);
      expect(validRes.metrics.leadingZeros).toBe(2);

      // 2. Colisão de Vírgula Decimal
      const decErr = validateCsvText('nome,curso,nota\nAna,Sistemas,8,5');
      expect(decErr.valid).toBe(false);
      expect(decErr.line).toBe(2);
      expect(decErr.category).toBe('CSV: Colisão de Vírgula Decimal');

      // 3. Aspas Internas Não Duplicadas
      const quoteErr = validateCsvText('nome;curso;nota\n"Pedro "Zé" Souza";Sistemas;8,5');
      expect(quoteErr.valid).toBe(false);
      expect(quoteErr.line).toBe(2);
      expect(quoteErr.category).toBe('CSV: Escape de Aspas ("")');

      // 4. Divergência de Colunas
      const colErr = validateCsvText('nome;curso;nota\nAna;Sistemas;8,5\nBruno;Sistemas');
      expect(colErr.valid).toBe(false);
      expect(colErr.line).toBe(3);
      expect(colErr.category).toBe('CSV: Divergência de Colunas');

      // Interação de UI com Trap e Validador CSV
      triggerCsvTrap('decimal_collision');
      expect(document.getElementById('csv-trap-feedback-box').classList.contains('hidden')).toBe(
        false
      );
      restoreCleanCsvCode();
      expect(document.getElementById('csv-trap-feedback-box').classList.contains('hidden')).toBe(
        true
      );

      loadCsvValidatorPreset('err_decimal');
      expect(
        document.getElementById('csv-validator-error-section').classList.contains('hidden')
      ).toBe(false);
    });
  });
});
