import { describe, it, expect } from 'vitest';
import { MODULE_ORDER } from '../src/main.js';
import { CSV_MODULE_ID } from '../src/modules/csv/index.js';
import { POSITIONAL_MODULE_ID } from '../src/modules/positional/index.js';
import { JSON_MODULE_ID } from '../src/modules/json/index.js';
import { XML_MODULE_ID } from '../src/modules/xml/index.js';
import { CONVERTER_MODULE_ID } from '../src/modules/converter/index.js';
import { BREACH_MODULE_ID } from '../src/modules/breach/index.js';

describe('Fase 0 — Verificação da Estrutura Inicial e Ordem Canônica', () => {
  it('deve respeitar a ordem obrigatória dos módulos definida no PROJECT_DNA.md', () => {
    expect(MODULE_ORDER).toEqual([
      CSV_MODULE_ID,
      POSITIONAL_MODULE_ID,
      JSON_MODULE_ID,
      XML_MODULE_ID,
      CONVERTER_MODULE_ID,
      BREACH_MODULE_ID,
    ]);
  });
});
