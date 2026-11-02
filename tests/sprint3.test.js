import { describe, it, expect, beforeEach } from 'vitest';
import { initApp, switchFormatModule } from '../src/main.js';
import {
  xmlStepsData,
  xmlTraps,
  xmlValidatorPresets,
  validateXmlText,
  triggerXmlTrap,
  restoreCleanXmlCode,
  loadXmlValidatorPreset,
  formatValidatorXML,
  xmlGoToStep,
} from '../src/modules/xml/index.js';

describe('Sprint 3 — Módulo 4: Arquivos XML (US-4.1 e US-4.2)', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    initApp();
    switchFormatModule('xml');
  });

  describe('US-4.1 — Construtor Guiado XML, Árvore DOM e Comparação Atributos vs Elementos', () => {
    it('deve conter 6 passos didáticos e 4 armadilhas sem nenhum código Python na interface', () => {
      expect(xmlStepsData).toHaveLength(6);
      expect(Object.keys(xmlTraps)).toEqual([
        'multiple_roots',
        'crossed_tags',
        'case_mismatch',
        'unquoted_attr_or_amp',
      ]);

      const allText = JSON.stringify(xmlStepsData) + JSON.stringify(xmlTraps);
      expect(allText).not.toMatch(/ElementTree|ET\.parse|ET\.SubElement|import xml/i);
    });

    it('deve renderizar a Árvore DOM hierárquica sincronizada com os passos e destacar Atributos vs Elementos Filhos', () => {
      const treeCanvas = document.getElementById('xml-tree-canvas');
      expect(treeCanvas.innerHTML).toContain('&lt;turma&gt;');
      expect(treeCanvas.innerHTML).toContain('Raiz');

      // Passo 3: Atributos e Elementos Filhos (<aluno id="1">)
      xmlGoToStep(2);
      expect(treeCanvas.innerHTML).toContain('@id=');
      expect(treeCanvas.innerHTML).toContain('"1"');

      // Passo 6: XML Completo e Bem Formado
      xmlGoToStep(5);
      expect(treeCanvas.innerHTML).toContain('Ana');
      expect(treeCanvas.innerHTML).toContain('Bruno');
      expect(treeCanvas.innerHTML).toContain('Sistemas &amp;amp; Dados');
    });
  });

  describe('US-4.2 — Validador de XML Bem Formado (As 6 Regras Canônicas) e Laboratório do Erro', () => {
    it('deve validar um documento XML bem formado e extrair métricas de elementos, atributos, profundidade e raiz', () => {
      const res = validateXmlText(xmlValidatorPresets.valid);
      expect(res.valid).toBe(true);
      expect(res.metrics.rootName).toBe('<turma>');
      expect(res.metrics.totalElements).toBe(11);
      expect(res.metrics.totalAttributes).toBe(3);
      expect(res.metrics.maxDepth).toBe(3);
    });

    it('deve diagnosticar com precisão cada uma das 6 Regras de XML Bem Formado', () => {
      // Regra 1: Elemento raiz único
      const r1 = validateXmlText(xmlTraps.multiple_roots.rawCode);
      expect(r1.valid).toBe(false);
      expect(r1.category).toContain('Regra 1');

      // Regra 2: Toda tag aberta deve ser fechada
      const r2 = validateXmlText(
        '<?xml version="1.0" encoding="UTF-8"?>\n<turma>\n  <aluno id="1">\n    <nome>Ana</nome>'
      );
      expect(r2.valid).toBe(false);
      expect(r2.category).toContain('Regra 2');

      // Regra 3: Tags corretamente aninhadas (sem cruzamento)
      const r3 = validateXmlText(xmlTraps.crossed_tags.rawCode);
      expect(r3.valid).toBe(false);
      expect(r3.category).toContain('Regra 3');

      // Regra 4: Valores de atributos sempre entre aspas
      const r4 = validateXmlText(xmlValidatorPresets.err_attr);
      expect(r4.valid).toBe(false);
      expect(r4.category).toContain('Regra 4');

      // Regra 5: Sensibilidade a maiúsculas e minúsculas (Case-Sensitive)
      const r5 = validateXmlText(xmlTraps.case_mismatch.rawCode);
      expect(r5.valid).toBe(false);
      expect(r5.category).toContain('Regra 5');

      // Regra 6: Entidades especiais escapadas (&amp;)
      const r6 = validateXmlText(
        '<turma nome="SI-2">\n  <aluno id="1">\n    <curso>Sistemas & Dados</curso>\n  </aluno>\n</turma>'
      );
      expect(r6.valid).toBe(false);
      expect(r6.category).toContain('Regra 6');
    });

    it('deve acionar armadilhas, restaurar o XML limpo e formatar XML bem formado no Validador', () => {
      triggerXmlTrap('crossed_tags');
      expect(document.getElementById('xml-trap-feedback-box').classList.contains('hidden')).toBe(
        false
      );

      restoreCleanXmlCode();
      expect(document.getElementById('xml-trap-feedback-box').classList.contains('hidden')).toBe(
        true
      );

      loadXmlValidatorPreset('err_attr');
      expect(
        document.getElementById('xml-validator-error-section').classList.contains('hidden')
      ).toBe(false);

      loadXmlValidatorPreset('valid');
      formatValidatorXML();
      expect(
        document.getElementById('xml-validator-success-section').classList.contains('hidden')
      ).toBe(false);
    });
  });
});
