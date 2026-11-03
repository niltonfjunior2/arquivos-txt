import { describe, it, expect, beforeEach } from 'vitest';
import { initApp, switchFormatModule } from '../src/main.js';
import {
  BREACH_PHASES,
  BREACH_SCENARIOS,
  getBreachState,
  loadBreachScenario,
  handleBreachDecision,
  jumpToBreachPhase,
  awardBreachPitchBonus,
  resetBreachGame,
} from '../src/modules/breach/index.js';

describe('Evolução Day 2 — Módulo 6: Desafio do Arquiteto de Dados (25 Cenários em 5 Fases)', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    initApp();
    switchFormatModule('breach');
    resetBreachGame();
  });

  it('deve conter exatamente 25 cenários divididos em 5 fases de 5 cenários cada, sem código de programação nem menções institucionais', () => {
    expect(BREACH_PHASES).toHaveLength(5);
    expect(BREACH_SCENARIOS).toHaveLength(25);

    for (let phase = 1; phase <= 5; phase++) {
      const inPhase = BREACH_SCENARIOS.filter((s) => s.phase === phase);
      expect(inPhase).toHaveLength(5);
    }

    const allText = JSON.stringify(BREACH_SCENARIOS);
    expect(allText).not.toMatch(/UEMG|Sistemas de Informa|Carangola|import csv|def /i);
  });

  it('deve apresentar os 4 botões de decisão na ordem canônica: [1] CSV, [2] POSICIONAL, [3] JSON, [4] XML', () => {
    const decisionBtns = Array.from(document.querySelectorAll('.breach-decision-btn')).map((btn) =>
      btn.getAttribute('data-breach-format')
    );
    expect(decisionBtns).toEqual(['CSV', 'POSICIONAL', 'JSON', 'XML']);
  });

  it('deve permitir saltar entre as 5 fases, pontuar escalonadamente por dificuldade e conceder bônus de Pitch', () => {
    // Fase 1 (Cenário 01 -> CSV vale 10 pts)
    handleBreachDecision('CSV');
    expect(getBreachState().teams[0].score).toBe(10);
    expect(document.getElementById('breach-resolution-box').classList.contains('hidden')).toBe(
      false
    );

    awardBreachPitchBonus();
    expect(getBreachState().teams[0].score).toBe(20);

    // Salta para a Fase 5 (Cenário 21 -> POSICIONAL vale 30 pts)
    jumpToBreachPhase(5);
    expect(getBreachState().roundIndex).toBe(20);
    expect(document.getElementById('breach-incident-code').textContent).toBe('#CEN-21');

    handleBreachDecision('POSICIONAL');
    expect(getBreachState().teams[0].score).toBe(50);
  });

  it('deve exibir o Relatório Final do Conselho de Arquitetura ao concluir o 25º cenário', () => {
    loadBreachScenario(24);
    expect(document.getElementById('breach-incident-code').textContent).toBe('#CEN-25');
    handleBreachDecision('POSICIONAL');

    loadBreachScenario(25);
    expect(document.getElementById('breach-debriefing-screen').classList.contains('hidden')).toBe(
      false
    );
  });
});

