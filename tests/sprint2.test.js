import { describe, it, expect, beforeEach } from 'vitest';
import { initApp, switchFormatModule } from '../src/main.js';
import {
  posStepsData,
  posTraps,
  posValidatorPresets,
  CANONICAL_LAYOUTS,
  detectCanonicalLayout,
  validatePositionalText,
  triggerPosTrap,
  restoreCleanPosCode,
  loadPosValidatorPreset,
  posGoToStep,
} from '../src/modules/positional/index.js';

describe('Sprint 2 — Módulo 2: Arquivos Posicionais e Padrão CNAB (US-3.1 e US-3.2)', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    initApp();
    switchFormatModule('positional');
  });

  describe('US-3.1 — Construtor Guiado com Régua Posicional e Mapa de Fatiamento (Layout & CNAB)', () => {
    it('deve conter os 6 passos didáticos (incluindo passo 6 do padrão CNAB) e 4 armadilhas sem código Python', () => {
      expect(posStepsData).toHaveLength(6);
      expect(posStepsData[5].isCnabStep).toBe(true);
      expect(Object.keys(posTraps)).toEqual([
        'cascade_shift',
        'explicit_comma',
        'space_in_numeric',
        'intruder_delimiter',
      ]);

      const allText = JSON.stringify(posStepsData) + JSON.stringify(posTraps);
      expect(allText).not.toMatch(/def ler_posicional|\.ljust\(|\.zfill\(|with open\(/i);
    });

    it('deve renderizar a régua de 49 posições e o diagrama de lotes do CNAB 240 no Passo 6', () => {
      const rulerCanvas = document.getElementById('pos-ruler-canvas');
      expect(rulerCanvas.innerHTML).toContain('Pos 01..20');
      expect(rulerCanvas.innerHTML).toContain('Pos 21..31');
      expect(rulerCanvas.innerHTML).toContain('Pos 32..41');
      expect(rulerCanvas.innerHTML).toContain('Pos 42..49');

      posGoToStep(5); // Passo 6 (CNAB)
      expect(rulerCanvas.innerHTML).toContain('HEADER DE ARQUIVO');
      expect(rulerCanvas.innerHTML).toContain('HEADER DE LOTE');
      expect(rulerCanvas.innerHTML).toContain('DETALHE');
      expect(rulerCanvas.innerHTML).toContain('TRAILER DE LOTE');
      expect(rulerCanvas.innerHTML).toContain('TRAILER DE ARQUIVO');
    });
  });

  describe('US-3.2 — Laboratório do Erro Posicional e Validador Canônico (49 e 24 posições)', () => {
    it('deve reconhecer e validar automaticamente tanto o Layout de 49 posições (Seção 5.2) quanto o de 24 posições (Seção 9)', () => {
      expect(detectCanonicalLayout([posValidatorPresets.valid49.split('\n')[0]]).id).toBe(
        CANONICAL_LAYOUTS.layout49.id
      );
      expect(detectCanonicalLayout([posValidatorPresets.valid24.split('\n')[0]]).id).toBe(
        CANONICAL_LAYOUTS.layout24.id
      );

      // Validação do Layout 49 posições
      const res49 = validatePositionalText(posValidatorPresets.valid49);
      expect(res49.valid).toBe(true);
      expect(res49.metrics.totalRecords).toBe(2);
      expect(res49.records[0].fields[0].interpreted).toBe('MARIA SILVA');
      expect(res49.records[0].fields[2].interpreted).toContain('150,50');
      expect(res49.records[0].fields[3].interpreted).toBe('02/11/2026');

      // Validação do Layout 24 posições (Interoperabilidade com Conversor)
      const res24 = validatePositionalText(posValidatorPresets.valid24);
      expect(res24.valid).toBe(true);
      expect(res24.metrics.totalRecords).toBe(2);
      expect(res24.records[0].fields[0].interpreted).toBe('Ana');
      expect(res24.records[0].fields[1].interpreted).toBe('Sistemas');
      expect(res24.records[0].fields[2].interpreted).toBe('8,5');
    });

    it('deve diagnosticar precisamente cada falha posicional (efeito cascata, vírgula explícita, espaço em numérico e delimitador intruso)', () => {
      // 1. Efeito Cascata (48 posições em vez de 49)
      const shiftErr = validatePositionalText(posTraps.cascade_shift.rawCode);
      expect(shiftErr.valid).toBe(false);
      expect(shiftErr.category).toBe('Posicional: Efeito Cascata (Tamanho Inválido)');

      // 2. Vírgula Explícita no Decimal Implícito
      const commaErr = validatePositionalText(posTraps.explicit_comma.rawCode);
      expect(commaErr.valid).toBe(false);
      expect(commaErr.col).toBe(39);
      expect(commaErr.category).toBe('Posicional: Decimal Implícito Violado');

      // 3. Espaço em Branco em Campo Numérico
      const spaceErr = validatePositionalText(posTraps.space_in_numeric.rawCode);
      expect(spaceErr.valid).toBe(false);
      expect(spaceErr.col).toBe(32);
      expect(spaceErr.category).toBe('Posicional: Espaço em Campo Numérico');

      // 4. Delimitador Intruso ;
      const delimErr = validatePositionalText(posTraps.intruder_delimiter.rawCode);
      expect(delimErr.valid).toBe(false);
      expect(delimErr.col).toBe(21);
      expect(delimErr.category).toBe('Posicional: Delimitador Intruso');

      // Interação de UI no Construtor e Validador
      triggerPosTrap('cascade_shift');
      expect(document.getElementById('pos-trap-feedback-box').classList.contains('hidden')).toBe(
        false
      );
      restoreCleanPosCode();
      expect(document.getElementById('pos-trap-feedback-box').classList.contains('hidden')).toBe(
        true
      );

      loadPosValidatorPreset('err_comma');
      expect(
        document.getElementById('pos-validator-error-section').classList.contains('hidden')
      ).toBe(false);
    });
  });
});
