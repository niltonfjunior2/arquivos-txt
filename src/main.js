/**
 * Ponto de Entrada Principal da Aplicação (Sprint 1)
 * Ordem Canônica Obrigatória: 1. CSV -> 2. Posicionais -> 3. JSON -> 4. XML -> 5. Conversor
 */
import { toggleTheme, loadSavedTheme, onThemeChange } from './core/theme.js';
import { toggleMute, playTone } from './core/audio.js';
import {
  CSV_MODULE_ID,
  getCsvModuleHtml,
  initCsvModule,
  stopCsvTyping,
  refreshCsvTheme,
  csvNextStep,
  csvPrevStep,
} from './modules/csv/index.js';
import {
  POSITIONAL_MODULE_ID,
  getPositionalModuleHtml,
  initPositionalModule,
  stopPosTyping,
  refreshPosTheme,
  posNextStep,
  posPrevStep,
} from './modules/positional/index.js';
import {
  JSON_MODULE_ID,
  getJsonModuleHtml,
  initJsonModule,
  stopJsonTyping,
  refreshJsonTheme,
  nextStep as jsonNextStep,
  prevStep as jsonPrevStep,
} from './modules/json/index.js';
import {
  XML_MODULE_ID,
  getXmlModuleHtml,
  initXmlModule,
  stopXmlTyping,
  refreshXmlTheme,
  xmlNextStep,
  xmlPrevStep,
} from './modules/xml/index.js';
import {
  CONVERTER_MODULE_ID,
  getConverterModuleHtml,
  initConverterModule,
  refreshConverterTheme,
} from './modules/converter/index.js';

export const MODULE_ORDER = [
  CSV_MODULE_ID,
  POSITIONAL_MODULE_ID,
  JSON_MODULE_ID,
  XML_MODULE_ID,
  CONVERTER_MODULE_ID,
];

let activeModuleId = CSV_MODULE_ID;

export function getActiveModuleId() {
  return activeModuleId;
}

export function stopAllTypingAnimations() {
  stopCsvTyping();
  stopPosTyping();
  stopJsonTyping();
  stopXmlTyping();
}

export function switchFormatModule(moduleId) {
  if (!MODULE_ORDER.includes(moduleId)) return;
  stopAllTypingAnimations();
  activeModuleId = moduleId;

  MODULE_ORDER.forEach((id) => {
    const section = document.getElementById(`module-${id}`);
    const navBtn = document.getElementById(`nav-format-${id}`);
    if (section) {
      if (id === moduleId) {
        section.classList.remove('hidden');
      } else {
        section.classList.add('hidden');
      }
    }
    if (navBtn) {
      if (id === moduleId) {
        navBtn.className =
          'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition shadow-sm bg-indigo-600 text-white dark:bg-indigo-500 dark:text-white shrink-0 border border-indigo-600 dark:border-indigo-400';
      } else {
        navBtn.className =
          'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-[#cdd6f4] bg-white hover:bg-slate-100 dark:bg-[#1e1e2e] dark:hover:bg-[#313244] border border-slate-200 dark:border-[#313244] transition shrink-0';
      }
    }
  });

  playTone('D5');
}

export function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('hidden');
}

export function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('hidden');
}

export function buildAppShellHtml() {
  return `
  <!-- Header Global Mobile-First -->
  <header class="border-b border-slate-200 dark:border-[#313244] bg-white/95 dark:bg-[#181825]/95 backdrop-blur sticky top-0 z-50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
      <!-- Logo e Título -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-indigo-600 to-amber-500 p-[2px] shadow-md shadow-indigo-500/20 shrink-0">
          <div class="w-full h-full bg-white dark:bg-[#181825] rounded-[10px] flex items-center justify-center font-mono font-bold text-base text-indigo-600 dark:text-amber-400">
            TXT
          </div>
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">Arquivos de Texto na Programação</h1>
            <span class="text-[10px] sm:text-[11px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 px-2 py-0.5 rounded-full">
              Objeto de Aprendizagem
            </span>
          </div>
          <p class="text-[11px] sm:text-xs text-slate-600 dark:text-[#a6adc8] font-medium">
            Laboratório Interativo: Construtor Guiado, Armadilhas e Validador de Formatos
          </p>
        </div>
      </div>

      <!-- Controles Globais: Tema, Som e Guia -->
      <div class="flex items-center gap-2">
        <button id="btn-toggle-theme" onclick="toggleTheme()" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 dark:bg-[#313244] dark:hover:bg-[#45475a] dark:border-[#45475a] text-xs font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 transition shadow-sm">
          <i id="theme-icon" class="fa-solid fa-sun text-amber-300"></i>
          <span id="theme-label" class="hidden sm:inline">Modo Claro</span>
        </button>

        <button id="btn-toggle-sound" onclick="toggleMute()" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 dark:bg-[#313244] dark:hover:bg-[#45475a] dark:border-[#45475a] text-xs font-medium text-slate-700 dark:text-[#cdd6f4] flex items-center gap-2 transition shadow-sm">
          <i id="sound-icon" class="fa-solid fa-volume-high text-amber-600 dark:text-amber-400"></i>
          <span id="sound-label" class="hidden sm:inline">Som: Ativo</span>
        </button>

        <button onclick="openModal('modal-sobre')" class="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 dark:bg-indigo-600/30 dark:hover:bg-indigo-600/50 dark:border-indigo-500/40 text-xs font-bold dark:text-indigo-200 flex items-center gap-2 transition shadow-sm">
          <i class="fa-solid fa-chalkboard-user"></i>
          <span class="hidden sm:inline">Guia do Instrutor</span>
        </button>
      </div>
    </div>

    <!-- Barra Principal de Navegação da Trilha (Ordem Estrita Obrigatória, Mobile-First Scrollable) -->
    <div class="bg-slate-100/90 dark:bg-[#11111b]/90 border-t border-slate-200 dark:border-[#313244] px-4 lg:px-8 py-2 overflow-x-auto no-scrollbar">
      <div class="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
        <button id="nav-format-csv" onclick="switchFormatModule('csv')" class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition shadow-sm bg-indigo-600 text-white dark:bg-indigo-500 dark:text-white shrink-0 border border-indigo-600 dark:border-indigo-400">
          <span class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-mono text-[11px]">1</span>
          <i class="fa-solid fa-table"></i>
          <span>Arquivos CSV</span>
        </button>

        <button id="nav-format-positional" onclick="switchFormatModule('positional')" class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-[#cdd6f4] bg-white hover:bg-slate-100 dark:bg-[#1e1e2e] dark:hover:bg-[#313244] border border-slate-200 dark:border-[#313244] transition shrink-0">
          <span class="w-5 h-5 rounded-full bg-slate-200 dark:bg-[#313244] flex items-center justify-center font-mono text-[11px]">2</span>
          <i class="fa-solid fa-ruler-horizontal text-amber-500"></i>
          <span>Arquivos Posicionais</span>
        </button>

        <button id="nav-format-json" onclick="switchFormatModule('json')" class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-[#cdd6f4] bg-white hover:bg-slate-100 dark:bg-[#1e1e2e] dark:hover:bg-[#313244] border border-slate-200 dark:border-[#313244] transition shrink-0">
          <span class="w-5 h-5 rounded-full bg-slate-200 dark:bg-[#313244] flex items-center justify-center font-mono text-[11px]">3</span>
          <span class="font-mono font-bold text-indigo-600 dark:text-amber-400">{ }</span>
          <span>Arquivos JSON</span>
        </button>

        <button id="nav-format-xml" onclick="switchFormatModule('xml')" class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-[#cdd6f4] bg-white hover:bg-slate-100 dark:bg-[#1e1e2e] dark:hover:bg-[#313244] border border-slate-200 dark:border-[#313244] transition shrink-0">
          <span class="w-5 h-5 rounded-full bg-slate-200 dark:bg-[#313244] flex items-center justify-center font-mono text-[11px]">4</span>
          <i class="fa-solid fa-code text-sky-500"></i>
          <span>Arquivos XML</span>
        </button>

        <button id="nav-format-converter" onclick="switchFormatModule('converter')" class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-[#cdd6f4] bg-white hover:bg-slate-100 dark:bg-[#1e1e2e] dark:hover:bg-[#313244] border border-slate-200 dark:border-[#313244] transition shrink-0">
          <span class="w-5 h-5 rounded-full bg-slate-200 dark:bg-[#313244] flex items-center justify-center font-mono text-[11px]">5</span>
          <i class="fa-solid fa-arrows-spin text-purple-500"></i>
          <span>Conversor 4 Formatos</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Container de Módulos na Ordem Canônica -->
  <div id="modules-viewport" class="flex-1 flex flex-col">
    ${getCsvModuleHtml()}
    ${getPositionalModuleHtml()}
    ${getJsonModuleHtml()}
    ${getXmlModuleHtml()}
    ${getConverterModuleHtml()}
  </div>

  <!-- Rodapé Institucional (Footer) -->
  <footer id="app-footer" class="border-t border-slate-200 dark:border-[#313244] bg-white/95 dark:bg-[#181825]/95 mt-auto">
    <div class="max-w-7xl mx-auto px-4 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-3 text-center sm:text-left">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-500 via-indigo-600 to-amber-500 p-[2px] shadow-sm shrink-0">
          <div class="w-full h-full bg-white dark:bg-[#181825] rounded-[6px] flex items-center justify-center font-mono font-bold text-xs text-indigo-600 dark:text-amber-400">
            TXT
          </div>
        </div>
        <div>
          <div class="text-xs font-bold text-slate-800 dark:text-white">
            <strong>Arquivos de Texto na Programação</strong> • Laboratório Interativo
          </div>
          <div class="text-[11px] text-slate-500 dark:text-[#a6adc8] mt-0.5">
            Conteúdos fundamentados em materiais didáticos e atividades práticas de fixação.
          </div>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
        <button id="footer-btn-sobre" onclick="openModal('modal-sobre-projeto')" class="text-slate-600 hover:text-indigo-600 dark:text-[#a6adc8] dark:hover:text-white transition">
          Sobre
        </button>
        <span class="text-slate-300 dark:text-[#45475a]">•</span>
        <button id="footer-btn-termos" onclick="openModal('modal-termos')" class="text-slate-600 hover:text-indigo-600 dark:text-[#a6adc8] dark:hover:text-white transition">
          Termos de Uso
        </button>
        <span class="text-slate-300 dark:text-[#45475a]">•</span>
        <button id="footer-btn-privacidade" onclick="openModal('modal-privacidade')" class="text-slate-600 hover:text-indigo-600 dark:text-[#a6adc8] dark:hover:text-white transition">
          Políticas de Privacidade
        </button>
      </div>
    </div>
  </footer>

  <!-- Modal do Guia do Instrutor -->
  <div id="modal-sobre" onclick="if(event.target===this) closeModal('modal-sobre')" class="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] max-w-xl w-full rounded-2xl p-6 shadow-2xl space-y-4">
      <div class="flex items-center justify-between border-b border-slate-100 dark:border-[#313244] pb-3">
        <h3 class="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
          <i class="fa-solid fa-graduation-cap text-indigo-600 dark:text-indigo-400"></i> Plano Didático para Professores e Alunos
        </h3>
        <button onclick="closeModal('modal-sobre')" class="text-slate-400 hover:text-slate-700 dark:text-[#a6adc8] dark:hover:text-white text-lg">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="text-xs text-slate-600 dark:text-[#bac2de] space-y-3 leading-relaxed">
        <p>Esta plataforma unifica o estudo prático de <strong>Formatos de Arquivos de Texto</strong> na ordem pedagógica da disciplina:</p>
        <ol class="list-decimal pl-5 space-y-1 text-slate-800 dark:text-[#cdd6f4] font-medium">
          <li><strong>Arquivos CSV:</strong> Estrutura tabular, cabeçalho, delimitadores (<code>,</code> vs <code>;</code> no Brasil) e qualificadores de texto (<code>""</code>).</li>
          <li><strong>Arquivos Posicionais (CNAB):</strong> Largura fixa por posição, preenchimento com espaços/zeros e casas decimais implícitas.</li>
          <li><strong>Arquivos JSON:</strong> Objetos <code>{ }</code>, arrays <code>[ ]</code>, pares chave-valor e norma RFC 8259.</li>
          <li><strong>Arquivos XML:</strong> Tags hierárquicas, elemento raiz único, atributos e regras de documento bem formado.</li>
          <li><strong>Conversor em Tempo Real:</strong> O mesmo conjunto de dados traduzido simultaneamente nos 4 formatos.</li>
        </ol>
        <div class="p-3 bg-indigo-50 border border-indigo-200 dark:bg-[#181825] dark:border-indigo-500/20 rounded-xl text-slate-700 dark:text-[#a6adc8]">
          <strong class="text-indigo-800 dark:text-indigo-300 block mb-1">Dupla Abordagem em Cada Formato:</strong>
          Use a <strong>Aba 1 (Construtor Guiado + Laboratório do Erro)</strong> para projeção passo a passo em aula, e a <strong>Aba 2 (Validador de Arquivos)</strong> para que os estudantes testem e auditem seus próprios arquivos.
        </div>
      </div>

      <div class="pt-3 border-t border-slate-100 dark:border-[#313244] flex justify-end">
        <button onclick="closeModal('modal-sobre')" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-md shadow-indigo-600/20">
          Entendido, voltar ao laboratório
        </button>
      </div>
    </div>
  </div>

  <!-- Janela Flutuante: Sobre o Projeto (Modelo MétricaLab) -->
  <div id="modal-sobre-projeto" onclick="if(event.target===this) closeModal('modal-sobre-projeto')" class="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] max-w-3xl w-full max-h-[88vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      <!-- Cabeçalho Fixo -->
      <div class="px-6 py-4 border-b border-slate-200 dark:border-[#313244] bg-slate-50 dark:bg-[#181825] flex items-center justify-between">
        <div>
          <span class="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
            Início / Sobre
          </span>
          <h3 class="font-extrabold text-slate-900 dark:text-white text-lg mt-1">
            Sobre o Laboratório de Arquivos de Texto
          </h3>
          <p class="text-xs text-slate-500 dark:text-[#a6adc8]">
            Iniciativa educacional concebida para o ensino prático e dinâmico de Formatos de Arquivos de Texto na Programação.
          </p>
        </div>
        <button onclick="closeModal('modal-sobre-projeto')" class="text-slate-400 hover:text-slate-700 dark:text-[#a6adc8] dark:hover:text-white text-lg p-1.5">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Corpo Rolável -->
      <div class="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-600 dark:text-[#bac2de] leading-relaxed">
        <!-- Seção: O Foco na Educação -->
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#181825] border border-slate-200 dark:border-[#313244]">
          <h4 class="font-bold text-slate-900 dark:text-white text-sm mb-2 flex items-center gap-2">
            <i class="fa-solid fa-bullseye text-indigo-600 dark:text-indigo-400"></i> O Foco na Educação
          </h4>
          <p>
            Compreender a anatomia dos arquivos de texto é um alicerce indispensável para a interoperabilidade entre sistemas, integrações financeiras, APIs web e documentos fiscais eletrônicos. O ponto central deste laboratório são os <strong>construtores passo a passo, simuladores de armadilhas sintáticas, validadores de arquivos reais e o tradutor em tempo real</strong> entre <strong>CSV, Posicional (CNAB), JSON e XML</strong> — concentrando 100% da atenção visual na estrutura dos dados.
          </p>
        </div>

        <!-- Seção: Quem Sou Eu (Autoria) -->
        <div class="p-5 rounded-xl bg-slate-50 dark:bg-[#181825] border border-slate-200 dark:border-[#313244] border-l-4 border-l-indigo-600 dark:border-l-indigo-400">
          <h4 class="font-bold text-slate-900 dark:text-white text-sm mb-3">Quem Sou Eu</h4>
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img src="/NJ.png" alt="Logo NJ - Prof. Nilton F. Junior" class="w-20 h-20 object-contain shrink-0 drop-shadow-md" />
            <div class="flex-1 text-center sm:text-left">
              <h5 class="text-base font-extrabold text-slate-900 dark:text-white mb-1">
                Prof. Nilton F. Junior
              </h5>
              <p class="mb-3 text-slate-600 dark:text-[#bac2de]">
                A tecnologia não deve burocratizar o aprendizado, mas facilitá-lo. Este laboratório interativo é a materialização da minha vivência como Desenvolvedor e Pesquisador, unindo minha experiência no ensino e no desenvolvimento de soluções tecnológicas.
              </p>
              <div class="flex flex-wrap justify-center sm:justify-start gap-2">
                <a href="https://professornilton.vercel.app/" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-lg bg-white hover:bg-indigo-50 text-indigo-700 border border-slate-300 dark:bg-[#313244] dark:hover:bg-[#45475a] dark:text-indigo-200 dark:border-[#45475a] text-xs font-bold transition shadow-sm">
                  Acessar Meu Portfólio &rarr;
                </a>
                <a href="https://metricalab.vercel.app/" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-lg bg-white hover:bg-indigo-50 text-slate-700 border border-slate-300 dark:bg-[#313244] dark:hover:bg-[#45475a] dark:text-[#cdd6f4] dark:border-[#45475a] text-xs font-semibold transition shadow-sm">
                  MétricaLab &rarr;
                </a>
                <a href="https://niltonfjunior2.github.io/simulador_criptografia/index.html" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-lg bg-white hover:bg-indigo-50 text-slate-700 border border-slate-300 dark:bg-[#313244] dark:hover:bg-[#45475a] dark:text-[#cdd6f4] dark:border-[#45475a] text-xs font-semibold transition shadow-sm">
                  Simulador de Criptografia &rarr;
                </a>
                <a href="https://tabela-hash.vercel.app/" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-lg bg-white hover:bg-indigo-50 text-slate-700 border border-slate-300 dark:bg-[#313244] dark:hover:bg-[#45475a] dark:text-[#cdd6f4] dark:border-[#45475a] text-xs font-semibold transition shadow-sm">
                  Laboratório de Tabela Hash &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Seção: Fontes de Conteúdo Curricular -->
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#181825] border border-slate-200 dark:border-[#313244]">
          <h4 class="font-bold text-slate-900 dark:text-white text-sm mb-2 flex items-center gap-2">
            <i class="fa-solid fa-book-open text-teal-600 dark:text-teal-400"></i> Fontes de Conteúdo e Trilha de Estudo
          </h4>
          <p class="mb-2">
            O escopo teórico e prático sintetiza os tópicos fundamentais de <strong>Programação e Interoperabilidade de Dados</strong> e padrões reais da indústria:
          </p>
          <ul class="list-disc pl-5 space-y-1.5 text-xs">
            <li><strong>Módulo 01 — Arquivos CSV:</strong> Estrutura tabular delimitada, cabeçalho, conflito regional da vírgula decimal no Brasil (<code>,</code> vs <code>;</code>), qualificadores <code>"..."</code>, aspas duplicadas <code>""</code> e preservação de zeros à esquerda.</li>
            <li><strong>Módulo 02 — Arquivos Posicionais e CNAB:</strong> Largura fixa por posição, preenchimento alfanumérico (espaços à direita) vs. numérico (zeros à esquerda), casas decimais implícitas, efeito cascata e arquitetura de lotes bancários <strong>CNAB 240/400</strong>.</li>
            <li><strong>Módulo 03 — Arquivos JSON:</strong> Norma <strong>RFC 8259</strong>, objetos <code>{ }</code>, listas <code>[ ]</code>, pares chave-valor, tipos primitivos e estruturas aninhadas para APIs REST.</li>
            <li><strong>Módulo 04 — Arquivos XML:</strong> Prólogo, elemento raiz único, atributos vs. elementos filhos, entidades especiais (<code>&amp;amp;</code>, <code>&amp;lt;</code>, <code>&amp;gt;</code>), as 6 Regras de XML Bem Formado e aplicações em NF-e/XSD.</li>
            <li><strong>Módulo 05 — Conversor 4 Formatos:</strong> Tradução simultânea em tempo real do mesmo conjunto de dados entre CSV, Posicional, JSON e XML lado a lado, com comparativo de verbosidade em bytes (UTF-8).</li>
          </ul>
        </div>

        <!-- Seção: Pilares Arquiteturais -->
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#181825] border border-slate-200 dark:border-[#313244]">
          <h4 class="font-bold text-slate-900 dark:text-white text-sm mb-3 flex items-center gap-2">
            <i class="fa-solid fa-cubes text-amber-500"></i> Pilares Arquiteturais
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div class="p-3 rounded-lg bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244]">
              <div class="font-extrabold text-cyan-600 dark:text-cyan-400 mb-1">Privacidade Absoluta</div>
              <div class="text-slate-600 dark:text-[#a6adc8]">Sem coleta de dados pessoais, sem cookies invasivos, validação de arquivos 100% local e segura.</div>
            </div>
            <div class="p-3 rounded-lg bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244]">
              <div class="font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">Performance Edge</div>
              <div class="text-slate-600 dark:text-[#a6adc8]">Arquitetura estática rápida servida globalmente na Vercel com carregamento instantâneo.</div>
            </div>
            <div class="p-3 rounded-lg bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244]">
              <div class="font-extrabold text-amber-600 dark:text-amber-400 mb-1">Manutenção via Git</div>
              <div class="text-slate-600 dark:text-[#a6adc8]">Módulos didáticos e motores de validação versionados e auditados por testes automatizados.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Rodapé do Modal -->
      <div class="px-6 py-3 border-t border-slate-200 dark:border-[#313244] bg-slate-50 dark:bg-[#181825] flex justify-end">
        <button onclick="closeModal('modal-sobre-projeto')" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-md">
          Fechar janela
        </button>
      </div>
    </div>
  </div>

  <!-- Janela Flutuante: Termos de Uso -->
  <div id="modal-termos" onclick="if(event.target===this) closeModal('modal-termos')" class="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] max-w-2xl w-full max-h-[88vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-200 dark:border-[#313244] bg-slate-50 dark:bg-[#181825] flex items-center justify-between">
        <div>
          <span class="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
            Início / Termos de Uso
          </span>
          <h3 class="font-extrabold text-slate-900 dark:text-white text-lg mt-1">
            Termos de Uso
          </h3>
          <p class="text-xs text-slate-500 dark:text-[#a6adc8]">
            Condições gerais de utilização da plataforma educacional de Arquivos de Texto na Programação.
          </p>
        </div>
        <button onclick="closeModal('modal-termos')" class="text-slate-400 hover:text-slate-700 dark:text-[#a6adc8] dark:hover:text-white text-lg p-1.5">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 dark:text-[#bac2de] leading-relaxed">
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#181825] border border-slate-200 dark:border-[#313244]">
          <h4 class="font-bold text-slate-900 dark:text-white text-sm mb-1.5">1. Aceitação dos Termos</h4>
          <p>
            Ao acessar e utilizar esta plataforma, você concorda expressamente em cumprir estes Termos de Uso. O propósito deste projeto é estritamente <strong>educacional, instrucional e de pesquisa</strong>, aberto a qualquer pessoa interessada no aprendizado de formatos de arquivos de texto e programação.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#181825] border border-slate-200 dark:border-[#313244]">
          <h4 class="font-bold text-slate-900 dark:text-white text-sm mb-1.5">2. Uso Permitido e Finalidade Educacional</h4>
          <p>
            O ambiente é disponibilizado gratuitamente para estudantes, professores, pesquisadores e profissionais de tecnologia para fins de autoaprendizagem, demonstração em sala de aula, consulta rápida e capacitação técnica. É vedado o uso deste sistema para práticas ilícitas, engenharia reversa maliciosa ou qualquer tentativa de sobrecarga dos serviços de distribuição.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#181825] border border-slate-200 dark:border-[#313244]">
          <h4 class="font-bold text-slate-900 dark:text-white text-sm mb-1.5">3. Propriedade Intelectual e Créditos</h4>
          <p>
            Os textos explicativos, cenários práticos, motores de simulação e validação, layout e marcas são de autoria e propriedade intelectual de seus respectivos criadores, sob coordenação do <strong>Prof. Nilton F. Junior</strong>, resguardados pela legislação de direitos autorais. O uso de trechos e exemplos para fins de citação e estudo acadêmico é livre, desde que citada a fonte original.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#181825] border border-slate-200 dark:border-[#313244]">
          <h4 class="font-bold text-slate-900 dark:text-white text-sm mb-1.5">4. Isenção de Garantias</h4>
          <p>
            O sistema é fornecido no estado em que se encontra (<em>"as is"</em>), sem garantias implícitas de adequação a fins comerciais ou disponibilidade ininterrupta. Os validadores e conversores refletem os padrões didáticos e normativos (CSV, Posicional/CNAB, JSON RFC 8259 e XML Bem Formado) elaborados para treinamento conceitual.
          </p>
        </div>
      </div>

      <div class="px-6 py-3 border-t border-slate-200 dark:border-[#313244] bg-slate-50 dark:bg-[#181825] flex justify-end">
        <button onclick="closeModal('modal-termos')" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-md">
          Fechar janela
        </button>
      </div>
    </div>
  </div>

  <!-- Janela Flutuante: Políticas de Privacidade -->
  <div id="modal-privacidade" onclick="if(event.target===this) closeModal('modal-privacidade')" class="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] max-w-2xl w-full max-h-[88vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-200 dark:border-[#313244] bg-slate-50 dark:bg-[#181825] flex items-center justify-between">
        <div>
          <span class="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
            Início / Políticas de Privacidade
          </span>
          <h3 class="font-extrabold text-slate-900 dark:text-white text-lg mt-1">
            Políticas de Privacidade
          </h3>
          <p class="text-xs text-slate-500 dark:text-[#a6adc8]">
            Compromisso de transparência e privacidade por padrão (Privacy by Design).
          </p>
        </div>
        <button onclick="closeModal('modal-privacidade')" class="text-slate-400 hover:text-slate-700 dark:text-[#a6adc8] dark:hover:text-white text-lg p-1.5">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 dark:text-[#bac2de] leading-relaxed">
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#181825] border border-slate-200 dark:border-[#313244]">
          <h4 class="font-bold text-slate-900 dark:text-white text-sm mb-1.5">1. Coleta e Tratamento de Dados</h4>
          <p>
            Esta plataforma é uma aplicação executada <strong>inteiramente no lado do cliente (100% no seu navegador)</strong>. Não solicitamos cadastro, login, e-mail ou quaisquer dados pessoais. Todos os arquivos carregados ou textos digitados nos Validadores e no Conversor (<code>.csv</code>, <code>.txt</code>, <code>.json</code>, <code>.xml</code>) são processados exclusivamente na memória local do seu dispositivo e jamais são enviados para servidores externos.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#181825] border border-slate-200 dark:border-[#313244]">
          <h4 class="font-bold text-slate-900 dark:text-white text-sm mb-1.5">2. Uso de Cookies e Armazenamento Local</h4>
          <p>
            <strong>Não utilizamos cookies para rastreamento de usuários, perfilamento ou publicidade.</strong> O único recurso de armazenamento empregado é o <code>localStorage</code> do próprio navegador do usuário, com o propósito técnico estrito de salvar sua preferência visual de tema (Modo Claro ou Modo Escuro).
          </p>
        </div>

        <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#181825] border border-slate-200 dark:border-[#313244]">
          <h4 class="font-bold text-slate-900 dark:text-white text-sm mb-1.5">3. Compartilhamento de Informações</h4>
          <p>
            Como não coletamos nem mantemos informações pessoais ou arquivos de usuários em servidores, inexiste qualquer compartilhamento, cessão ou comercialização de dados com parceiros, patrocinadores ou terceiros.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#181825] border border-slate-200 dark:border-[#313244]">
          <h4 class="font-bold text-slate-900 dark:text-white text-sm mb-1.5">4. Alinhamento com a LGPD</h4>
          <p>
            O projeto atende com rigor aos princípios da Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD), em especial os princípios de <strong>finalidade</strong>, <strong>adequação</strong>, <strong>necessidade (minimização de dados)</strong> e <strong>segurança</strong>, garantindo acesso aberto, anônimo e seguro a todos os estudantes e professores.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#181825] border border-slate-200 dark:border-[#313244]">
          <h4 class="font-bold text-slate-900 dark:text-white text-sm mb-1.5">5. Alterações nesta Política</h4>
          <p>
            Reservamo-nos o direito de atualizar este documento periodicamente para refletir evoluções pedagógicas ou aprimoramentos técnicos no sistema.
          </p>
        </div>
      </div>

      <div class="px-6 py-3 border-t border-slate-200 dark:border-[#313244] bg-slate-50 dark:bg-[#181825] flex justify-end">
        <button onclick="closeModal('modal-privacidade')" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-md">
          Fechar janela
        </button>
      </div>
    </div>
  </div>

  <!-- Toast Notification Box -->
  <div id="toast" class="fixed bottom-6 right-6 z-50 transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none">
    <div class="bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold">
      <i class="fa-solid fa-circle-check text-emerald-300 text-sm"></i>
      <span id="toast-message">Mensagem</span>
    </div>
  </div>
  `;
}

export function initApp() {
  const appRoot = document.getElementById('app');
  if (!appRoot) return;

  appRoot.innerHTML = buildAppShellHtml();

  Object.assign(window, {
    toggleTheme,
    toggleMute,
    openModal,
    closeModal,
    switchFormatModule,
  });

  onThemeChange(() => {
    refreshCsvTheme();
    refreshPosTheme();
    refreshJsonTheme();
    refreshXmlTheme();
    refreshConverterTheme();
  });

  initCsvModule();
  initPositionalModule();
  initJsonModule();
  initXmlModule();
  initConverterModule();
  loadSavedTheme();

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      ['modal-sobre', 'modal-sobre-projeto', 'modal-termos', 'modal-privacidade'].forEach((id) =>
        closeModal(id)
      );
      return;
    }
    if (document.activeElement && ['TEXTAREA', 'INPUT'].includes(document.activeElement.tagName)) {
      return;
    }
    if (activeModuleId === CSV_MODULE_ID) {
      const builder = document.getElementById('csv-view-builder');
      if (builder && !builder.classList.contains('hidden')) {
        if (e.key === 'ArrowRight') csvNextStep();
        if (e.key === 'ArrowLeft') csvPrevStep();
      }
    } else if (activeModuleId === POSITIONAL_MODULE_ID) {
      const builder = document.getElementById('pos-view-builder');
      if (builder && !builder.classList.contains('hidden')) {
        if (e.key === 'ArrowRight') posNextStep();
        if (e.key === 'ArrowLeft') posPrevStep();
      }
    } else if (activeModuleId === JSON_MODULE_ID) {
      const builder = document.getElementById('view-builder');
      if (builder && !builder.classList.contains('hidden')) {
        if (e.key === 'ArrowRight') jsonNextStep();
        if (e.key === 'ArrowLeft') jsonPrevStep();
      }
    } else if (activeModuleId === XML_MODULE_ID) {
      const builder = document.getElementById('xml-view-builder');
      if (builder && !builder.classList.contains('hidden')) {
        if (e.key === 'ArrowRight') xmlNextStep();
        if (e.key === 'ArrowLeft') xmlPrevStep();
      }
    }
  });
}

if (typeof document !== 'undefined' && document.getElementById('app')) {
  initApp();
}
