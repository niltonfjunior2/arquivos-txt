/**
 * Módulo 4: Arquivos XML (Extensible Markup Language)
 * Base Canônica: Seção 7 de conteudo/04 - Arquivos Texto.pdf
 * Estrutura Pedagógica Dupla:
 *   1. Construtor Guiado (6 passos) + Árvore DOM Didática + 4 Armadilhas
 *   2. Validador & Auditor Didático das 6 Regras de XML Bem Formado
 */
import {
  escapeHtmlText,
  showToast,
  copyTextToClipboard,
  MAX_UPLOAD_SIZE_BYTES,
} from '../../core/sanitizer.js';
import { playTone } from '../../core/audio.js';
import { getIsDarkMode } from '../../core/theme.js';

export const XML_MODULE_ID = 'xml';

let xmlCurrentStepIndex = 0;
let xmlTypingTimeout = null;

export const xmlStepsData = [
  {
    stepNumber: 1,
    title: 'O Prólogo e o Elemento Raiz Único',
    category: 'Declaração e Escopo Raiz',
    icon: 'fa-solid fa-code',
    description:
      'Um documento XML inicia com o PRÓLOGO (declaração opcional que informa a versão e a codificação UTF-8) seguido obrigatoriamente por um ÚNICO ELEMENTO RAIZ que envolverá todos os demais dados.',
    rule: 'Regra nº 1 do XML Bem Formado: deve existir exatamente UM elemento raiz no topo do documento (aqui `<turma>...</turma>`). Nada além do prólogo e comentários pode ficar fora dele.',
    tokens: [
      {
        label: '<?xml ... ?>',
        lightColor: 'text-purple-800 font-bold',
        darkColor: 'text-[#cba6f7]',
        desc: 'Prólogo (versão e UTF-8)',
      },
      {
        label: '<turma>',
        lightColor: 'text-sky-800 font-bold',
        darkColor: 'text-[#89b4fa]',
        desc: 'Tag de abertura da raiz',
      },
      {
        label: '</turma>',
        lightColor: 'text-sky-800 font-bold',
        darkColor: 'text-[#89b4fa]',
        desc: 'Tag de fechamento (com /)',
      },
    ],
    rawXml: '<?xml version="1.0" encoding="UTF-8"?>\n<turma>\n</turma>',
    highlightLines: [1, 2, 3],
  },
  {
    stepNumber: 2,
    title: 'Atributos na Tag de Abertura',
    category: 'Metadados em Tags',
    icon: 'fa-solid fa-tag',
    description:
      'Tags de abertura podem carregar ATRIBUTOS no formato `nome="valor"`. Eles fornecem metadados curtos (como identificadores ou códigos) diretamente no elemento.',
    rule: 'Regra nº 4 do XML Bem Formado: todos os valores de atributos no XML devem ficar OBRIGATORIAMENTE entre aspas (`nome="SI-2"`). Atributos sem aspas tornam o XML inválido!',
    tokens: [
      {
        label: 'Atributo nome=',
        lightColor: 'text-amber-800 font-bold',
        darkColor: 'text-[#f9e2af]',
        desc: 'Metadado dentro da tag',
      },
      {
        label: 'Valor "SI-2"',
        lightColor: 'text-emerald-800 font-bold',
        darkColor: 'text-[#a6e3a1]',
        desc: 'Sempre entre aspas',
      },
    ],
    rawXml: '<?xml version="1.0" encoding="UTF-8"?>\n<turma nome="SI-2">\n</turma>',
    highlightLines: [2],
  },
  {
    stepNumber: 3,
    title: 'Elementos-Filhos e Aninhamento Hierárquico',
    category: 'Hierarquia em Árvore',
    icon: 'fa-solid fa-sitemap',
    description:
      'Dentro do elemento raiz `<turma>`, inserimos o elemento `<aluno id="1">` contendo seus elementos-filhos `<nome>` e `<nota>`. O XML é extensível porque você mesmo define os nomes das suas tags!',
    rule: 'Regras nº 2, 3 e 5: toda tag aberta precisa ser fechada, na ordem rigorosamente inversa de abertura (aninhamento correto), respeitando maiúsculas e minúsculas (`<Nome>` ≠ `<nome>`).',
    tokens: [
      {
        label: '<aluno id="1">',
        lightColor: 'text-sky-800 font-bold',
        darkColor: 'text-[#89b4fa]',
        desc: 'Elemento-filho com atributo id',
      },
      {
        label: '<nome>Ana</nome>',
        lightColor: 'text-emerald-800 font-bold',
        darkColor: 'text-[#a6e3a1]',
        desc: 'Elemento com conteúdo textual',
      },
      {
        label: '<nota>8.5</nota>',
        lightColor: 'text-amber-800 font-bold',
        darkColor: 'text-[#fab387]',
        desc: 'Valor contido entre tags',
      },
    ],
    rawXml:
      '<?xml version="1.0" encoding="UTF-8"?>\n<turma nome="SI-2">\n  <aluno id="1">\n    <nome>Ana</nome>\n    <nota>8.5</nota>\n  </aluno>\n</turma>',
    highlightLines: [3, 4, 5, 6],
  },
  {
    stepNumber: 4,
    title: 'Elementos Vazios (<ativo/>) e Comentários',
    category: 'Sintaxe de Marcação',
    icon: 'fa-solid fa-comment-dots',
    description:
      'Adicionamos um segundo aluno, um COMENTÁRIO explicativo (`<!-- ... -->`, ignorado pelo processador) e um ELEMENTO VAZIO autofechado (`<ativo/>`, que não possui texto interno).',
    rule: 'Uma tag sem conteúdo interno pode ser escrita de forma compacta como elemento vazio `<ativo/>` (com a barra antes de `>`), equivalente a `<ativo></ativo>`.',
    tokens: [
      {
        label: '<!-- comentário -->',
        lightColor: 'text-slate-500 font-bold',
        darkColor: 'text-[#9399b2]',
        desc: 'Anotação ignorada pelo leitor',
      },
      {
        label: '<ativo/>',
        lightColor: 'text-rose-700 font-bold',
        darkColor: 'text-[#f38ba8]',
        desc: 'Elemento vazio autofechado',
      },
    ],
    rawXml:
      '<?xml version="1.0" encoding="UTF-8"?>\n<turma nome="SI-2">\n  <!-- Lista de estudantes matriculados -->\n  <aluno id="1">\n    <nome>Ana</nome>\n    <nota>8.5</nota>\n    <ativo/>\n  </aluno>\n  <aluno id="2">\n    <nome>Bruno</nome>\n    <nota>7.0</nota>\n    <ativo/>\n  </aluno>\n</turma>',
    highlightLines: [3, 7, 9, 10, 11, 12, 13],
  },
  {
    stepNumber: 5,
    title: 'Entidades Especiais (&amp;) e Elemento vs. Atributo',
    category: 'Escapes e Modelagem',
    icon: 'fa-solid fa-scale-balanced',
    description:
      'Como escrever caracteres reservados como `&` ou `<` dentro de um texto sem que o XML pense que é uma tag? Usamos ENTIDADES! E lembre-se do dilema clássico: use atributo para metadados curtos (`id="1"`) e elemento para o dado em si.',
    rule: 'Regra nº 6 do XML Bem Formado: caracteres especiais dentro do conteúdo devem usar as 5 entidades oficiais: `&amp;` (&), `&lt;` (<), `&gt;` (>), `&quot;` (") e `&apos;` (\').',
    tokens: [
      {
        label: '&amp;',
        lightColor: 'text-purple-800 font-bold',
        darkColor: 'text-[#cba6f7]',
        desc: 'Representa o caractere & comercial',
      },
      {
        label: '&lt; e &gt;',
        lightColor: 'text-purple-800 font-bold',
        darkColor: 'text-[#cba6f7]',
        desc: 'Representam < e > no texto',
      },
      {
        label: 'Atributo vs Elemento',
        lightColor: 'text-amber-800 font-bold',
        darkColor: 'text-[#f9e2af]',
        desc: 'id="1" (metadado) vs <nome> (dado)',
      },
    ],
    rawXml:
      '<?xml version="1.0" encoding="UTF-8"?>\n<turma nome="SI-2">\n  <!-- Lista de estudantes matriculados -->\n  <aluno id="1">\n    <nome>Ana</nome>\n    <curso>Sistemas &amp; Dados</curso>\n    <nota>8.5</nota>\n    <ativo/>\n  </aluno>\n  <aluno id="2">\n    <nome>Bruno</nome>\n    <curso>Sistemas &amp; Dados</curso>\n    <nota>7.0</nota>\n    <ativo/>\n  </aluno>\n</turma>',
    highlightLines: [6, 12],
  },
  {
    stepNumber: 6,
    title: 'XML Bem Formado e Uso em NF-e / XSD',
    category: 'Consolidação e Padrão Fiscal',
    icon: 'fa-solid fa-file-shield',
    description:
      'Parabéns! Nosso documento XML cumpre todas as 6 regras de boa formação. No Brasil, o XML validado por esquema XSD é a base obrigatória da Nota Fiscal Eletrônica (NF-e, NFS-e, CT-e) e integrações corporativas SOAP.',
    rule: 'Um XML é "Bem Formado" quando obedece às 6 regras sintáticas (raiz única, fechamento, aninhamento, aspas em atributos, case-sensitivity e entidades), e é "Válido" quando segue um esquema XSD.',
    tokens: [
      {
        label: 'Raiz Única <turma>',
        lightColor: 'text-sky-800 font-bold',
        darkColor: 'text-[#89b4fa]',
        desc: 'Envolve todo o documento',
      },
      {
        label: 'Atributos com ""',
        lightColor: 'text-amber-800 font-bold',
        darkColor: 'text-[#f9e2af]',
        desc: 'nome="SI-2", id="1"',
      },
      {
        label: 'Tags Aninhadas',
        lightColor: 'text-emerald-800 font-bold',
        darkColor: 'text-[#a6e3a1]',
        desc: 'Abertura e fechamento exatos',
      },
      {
        label: 'Entidade &amp;',
        lightColor: 'text-purple-800 font-bold',
        darkColor: 'text-[#cba6f7]',
        desc: 'Caracteres especiais protegidos',
      },
    ],
    rawXml:
      '<?xml version="1.0" encoding="UTF-8"?>\n<turma nome="SI-2">\n  <!-- Lista de estudantes matriculados -->\n  <aluno id="1">\n    <nome>Ana</nome>\n    <curso>Sistemas &amp; Dados</curso>\n    <nota>8.5</nota>\n    <ativo/>\n  </aluno>\n  <aluno id="2">\n    <nome>Bruno</nome>\n    <curso>Sistemas &amp; Dados</curso>\n    <nota>7.0</nota>\n    <ativo/>\n  </aluno>\n</turma>',
    highlightLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  },
];

export const xmlTraps = {
  multiple_roots: {
    title: 'Erro: Ausência de Elemento Raiz Único (Regra 1)',
    rawCode:
      '<?xml version="1.0" encoding="UTF-8"?>\n<aluno id="1">\n  <nome>Ana</nome>\n</aluno>\n<aluno id="2">\n  <nome>Bruno</nome>\n</aluno>',
    highlightLine: 5,
    errorDesc:
      'Violação da Regra 1 na linha 5: encontrado segundo elemento no topo (<aluno id="2">) após o fechamento do primeiro! Todo XML exige um único elemento raiz envolvendo todos os demais.',
    fix: 'Envolva todos os elementos `<aluno>` dentro de uma única tag raiz, como `<turma> ... </turma>`.',
  },
  crossed_tags: {
    title: 'Erro: Tags Cruzadas / Aninhamento Incorreto (Regra 3)',
    rawCode: '<turma nome="SI-2">\n  <aluno id="1">\n    <nome>Ana</aluno>\n  </nome>\n</turma>',
    highlightLine: 3,
    errorDesc:
      'Violação da Regra 3 na linha 3: tentou fechar `</aluno>` enquanto a tag interna `<nome>` ainda estava aberta (`<a><b></a></b>`)!',
    fix: 'Feche sempre a tag mais interna primeiro antes de fechar a tag externa: `<aluno><nome>Ana</nome></aluno>`.',
  },
  case_mismatch: {
    title: 'Erro: Diferença entre Maiúsculas e Minúsculas (Regra 5)',
    rawCode: '<turma nome="SI-2">\n  <aluno id="1">\n    <Nome>Ana</nome>\n  </aluno>\n</turma>',
    highlightLine: 3,
    errorDesc:
      'Violação da Regra 5 na linha 3: a tag foi aberta como `<Nome>` (N maiúsculo) e fechada como `</nome>` (n minúsculo)! No XML, maiúsculas e minúsculas são tags diferentes.',
    fix: 'Padronize a grafia exata na abertura e no fechamento: `<nome>Ana</nome>`.',
  },
  unquoted_attr_or_amp: {
    title: 'Erro: Atributo sem Aspas e & Desprotegido (Regras 4 e 6)',
    rawCode:
      '<turma nome="SI-2">\n  <aluno id=1>\n    <curso>Sistemas & Dados</curso>\n  </aluno>\n</turma>',
    highlightLine: 2,
    errorDesc:
      'Violação das Regras 4 e 6: na linha 2 o atributo `id=1` está sem aspas obrigatórias, e na linha 3 o caractere `&` foi usado puro sem a entidade `&amp;`!',
    fix: 'Coloque o valor do atributo entre aspas (`id="1"`) e escreva `&amp;` no lugar de `&`.',
  },
};

export const xmlValidatorPresets = {
  valid:
    '<?xml version="1.0" encoding="UTF-8"?>\n<turma nome="SI-2">\n  <!-- Lista de estudantes -->\n  <aluno id="1">\n    <nome>Ana</nome>\n    <curso>Sistemas &amp; Dados</curso>\n    <nota>8.5</nota>\n    <ativo/>\n  </aluno>\n  <aluno id="2">\n    <nome>Bruno</nome>\n    <curso>Sistemas &amp; Dados</curso>\n    <nota>7.0</nota>\n    <ativo/>\n  </aluno>\n</turma>',
  err_crossed:
    '<?xml version="1.0" encoding="UTF-8"?>\n<turma nome="SI-2">\n  <aluno id="1">\n    <nome>Ana</aluno>\n  </nome>\n</turma>',
  err_case:
    '<?xml version="1.0" encoding="UTF-8"?>\n<turma nome="SI-2">\n  <aluno id="1">\n    <Nome>Ana</nome>\n  </aluno>\n</turma>',
  err_attr:
    '<?xml version="1.0" encoding="UTF-8"?>\n<turma nome="SI-2">\n  <aluno id=1>\n    <nome>Ana</nome>\n  </aluno>\n</turma>',
};

export function stopXmlTyping() {
  if (xmlTypingTimeout) {
    clearTimeout(xmlTypingTimeout);
    xmlTypingTimeout = null;
  }
}

/**
 * Analisador Léxico e Sintático Didático de XML (Verifica as 6 Regras de XML Bem Formado da Seção 7.3)
 * Retorna { valid, rootNode, metrics } ou { valid: false, line, col, category, headline, explanation, fixSuggestion, lineText }
 */
export function validateXmlText(rawText) {
  const text = (rawText || '').replace(/\r\n/g, '\n');
  const lines = text.split('\n');

  if (!text.trim()) {
    return { valid: false, empty: true };
  }

  const getLineCol = (index) => {
    let acc = 0;
    for (let i = 0; i < lines.length; i++) {
      const lineLen = lines[i].length;
      if (acc + lineLen >= index) {
        return { line: i + 1, col: Math.max(1, index - acc + 1), lineText: lines[i] };
      }
      acc += lineLen + 1;
    }
    return {
      line: lines.length,
      col: Math.max(1, lines[lines.length - 1].length),
      lineText: lines[lines.length - 1] || '',
    };
  };

  let pos = 0;
  const len = text.length;
  const stack = [];
  let rootElement = null;
  let rootClosed = false;

  let totalElements = 0;
  let totalAttributes = 0;
  let maxDepth = 0;
  let textNodesCount = 0;
  let emptyElementsCount = 0;
  let commentsCount = 0;

  const checkRawEntitiesInSegment = (segment, startOffset) => {
    for (let i = 0; i < segment.length; i++) {
      if (segment[i] === '&') {
        const rest = segment.slice(i);
        if (!/^&(lt|gt|amp|quot|apos|#\d+|#x[0-9a-fA-F]+);/.test(rest)) {
          const loc = getLineCol(startOffset + i);
          return {
            valid: false,
            ...loc,
            category: 'Regra 6: Entidades Especiais (&amp;)',
            headline: 'Caractere "&" Literal Desprotegido Fora de Entidade',
            explanation: `Na linha ${loc.line}, coluna ${loc.col}, o caractere <code>&amp;</code> foi utilizado diretamente no texto sem formar uma entidade válida. No XML, o símbolo <code>&amp;</code> inicia uma referência de entidade e nunca pode aparecer solto.`,
            fixSuggestion:
              'Substitua o <code>&amp;</code> literal pela entidade oficial <code>&amp;amp;</code> (ou use <code>&amp;lt;</code> para <code>&lt;</code> e <code>&amp;gt;</code> para <code>&gt;</code>).',
          };
        }
      }
    }
    return null;
  };

  while (pos < len) {
    const ltIdx = text.indexOf('<', pos);

    // Processa texto antes da próxima tag
    const textSlice = ltIdx === -1 ? text.slice(pos) : text.slice(pos, ltIdx);
    if (textSlice.includes('>')) {
      const gtPos = pos + textSlice.indexOf('>');
      const loc = getLineCol(gtPos);
      return {
        valid: false,
        ...loc,
        category: 'Regra 6: Caractere > Desprotegido',
        headline: 'Símbolo ">" Solto Fora de Tag',
        explanation: `Na linha ${loc.line}, coluna ${loc.col}, foi encontrado um fechamento <code>&gt;</code> sem uma tag aberta correspondente.`,
        fixSuggestion:
          'Se desejar escrever o símbolo maior-que dentro de um texto, utilize a entidade <code>&amp;gt;</code>.',
      };
    }

    const entityErr = checkRawEntitiesInSegment(textSlice, pos);
    if (entityErr) return entityErr;

    if (textSlice.trim().length > 0) {
      if (stack.length === 0) {
        const firstCharIdx = pos + textSlice.search(/\S/);
        const loc = getLineCol(firstCharIdx);
        return {
          valid: false,
          ...loc,
          category: 'Regra 1: Elemento Raiz Único',
          headline: 'Texto Solto Fora do Elemento Raiz',
          explanation: `Na linha ${loc.line}, coluna ${loc.col}, existe conteúdo textual fora de qualquer elemento XML. Todo conteúdo deve estar contido dentro do elemento raiz.`,
          fixSuggestion: 'Mova o texto para dentro de um elemento válido subordinado à raiz.',
        };
      }
      const currentParent = stack[stack.length - 1];
      currentParent.textContent = (currentParent.textContent || '') + textSlice.trim();
      textNodesCount++;
    }

    if (ltIdx === -1) break;

    // 1. Comentário <!-- ... -->
    if (text.startsWith('<!--', ltIdx)) {
      const endComment = text.indexOf('-->', ltIdx + 4);
      if (endComment === -1) {
        const loc = getLineCol(ltIdx);
        return {
          valid: false,
          ...loc,
          category: 'XML: Comentário Não Fechado',
          headline: 'Comentário "<!--" Aberto e Não Fechado',
          explanation: `O comentário iniciado na linha ${loc.line} não possui o delimitador de fechamento <code>--&gt;</code>.`,
          fixSuggestion: 'Adicione <code>--&gt;</code> ao final do comentário.',
        };
      }
      commentsCount++;
      pos = endComment + 3;
      continue;
    }

    // 2. Prólogo <?xml ... ?>
    if (text.startsWith('<?', ltIdx)) {
      const endProlog = text.indexOf('?>', ltIdx + 2);
      if (endProlog === -1) {
        const loc = getLineCol(ltIdx);
        return {
          valid: false,
          ...loc,
          category: 'XML: Prólogo Malformado',
          headline: 'Declaração XML "<?xml" Sem Fechamento "?>"',
          explanation: `O prólogo XML iniciado na linha ${loc.line} precisa ser encerrado com <code>?&gt;</code>.`,
          fixSuggestion:
            'Feche o prólogo com <code>?&gt;</code>: ex. <code>&lt;?xml version="1.0" encoding="UTF-8"?&gt;</code>.',
        };
      }
      pos = endProlog + 2;
      continue;
    }

    // Localiza o '>' de fechamento da tag, verificando se não há '<' aninhado ilegalmente
    const gtIdx = text.indexOf('>', ltIdx + 1);
    const nextLtIdx = text.indexOf('<', ltIdx + 1);
    if (gtIdx === -1 || (nextLtIdx !== -1 && nextLtIdx < gtIdx)) {
      const loc = getLineCol(ltIdx);
      return {
        valid: false,
        ...loc,
        category: 'Regra 2: Tag Incompleta',
        headline: 'Tag Aberta com "<" Mas Sem Fechamento ">"',
        explanation: `Na linha ${loc.line}, coluna ${loc.col}, uma tag foi iniciada com <code>&lt;</code>, porém não foi fechada com <code>&gt;</code> (ou o símbolo <code>&lt;</code> foi usado dentro de um texto sem a entidade <code>&amp;lt;</code>).`,
        fixSuggestion:
          'Feche a tag com <code>&gt;</code> ou substitua <code>&lt;</code> literal em textos por <code>&amp;lt;</code>.',
      };
    }

    const rawTagContent = text.slice(ltIdx + 1, gtIdx).trim();
    if (!rawTagContent) {
      const loc = getLineCol(ltIdx);
      return {
        valid: false,
        ...loc,
        category: 'XML: Tag Vazia <>',
        headline: 'Tag Vazia "<>" Sem Nome de Elemento',
        explanation: `Na linha ${loc.line}, coluna ${loc.col}, foi encontrada uma marcação <code>&lt;&gt;</code> vazia.`,
        fixSuggestion:
          'Informe um identificador válido para a tag (ex.: <code>&lt;aluno&gt;</code>).',
      };
    }

    // 3. Tag de Fechamento </nome>
    if (rawTagContent.startsWith('/')) {
      const closeName = rawTagContent.slice(1).trim();
      if (!/^[a-zA-Z_][\w.-]*$/.test(closeName)) {
        const loc = getLineCol(ltIdx);
        return {
          valid: false,
          ...loc,
          category: 'Regra 2: Fechamento Inválido',
          headline: `Tag de Fechamento "</${closeName}>" Malformada`,
          explanation: `Tags de fechamento devem conter apenas <code>&lt;/nomeDaTag&gt;</code>, sem atributos ou espaços extras.`,
          fixSuggestion: `Corrija a tag de fechamento na linha ${loc.line}.`,
        };
      }

      if (stack.length === 0) {
        const loc = getLineCol(ltIdx);
        return {
          valid: false,
          ...loc,
          category: 'Regra 2: Tag Órfã',
          headline: `Tag de Fechamento "</${closeName}>" Sem Abertura Correspondente`,
          explanation: `Na linha ${loc.line}, foi encontrada a tag de fechamento <code>&lt;/${closeName}&gt;</code>, mas não há nenhuma tag aberta aguardando fechamento.`,
          fixSuggestion: `Verifique se a tag de abertura <code>&lt;${closeName}&gt;</code> foi omitida antes da linha ${loc.line}.`,
        };
      }

      const top = stack[stack.length - 1];
      if (top.name !== closeName) {
        const loc = getLineCol(ltIdx);
        // Caso A: Diferença apenas entre maiúsculas e minúsculas (Regra 5)
        if (top.name.toLowerCase() === closeName.toLowerCase()) {
          return {
            valid: false,
            ...loc,
            category: 'Regra 5: Case-Sensitivity (Maiúsculas ≠ Minúsculas)',
            headline: `Divergência de Caixa: Abriu <${top.name}> e Fechou </${closeName}>`,
            explanation: `O XML diferencia rigorosamente letras maiúsculas de minúsculas (<strong>Regra 5</strong>). Na linha ${top.line} a tag foi aberta como <code>&lt;${top.name}&gt;</code>, mas na linha ${loc.line} tentou ser fechada como <code>&lt;/${closeName}&gt;</code>.`,
            fixSuggestion: `Altere o fechamento na linha ${loc.line} para <code>&lt;/${top.name}&gt;</code> (ou padronize ambas em minúsculas).`,
          };
        }

        // Caso B: Tags Cruzadas / Aninhamento Incorreto (Regra 3)
        return {
          valid: false,
          ...loc,
          category: 'Regra 3: Tags Cruzadas (Aninhamento Incorreto)',
          headline: `Esperado Fechar </${top.name}>, Mas Encontrado </${closeName}>`,
          explanation: `Violação de aninhamento (<strong>Regra 3</strong>): a tag mais interna aberta no momento é <code>&lt;${top.name}&gt;</code> (aberta na linha ${top.line}), portanto ela precisa ser fechada <strong>antes</strong> de <code>&lt;/${closeName}&gt;</code>. No XML nunca é permitido cruzar tags (<code>&lt;a&gt;&lt;b&gt;&lt;/a&gt;&lt;/b&gt;</code>).`,
          fixSuggestion: `Feche <code>&lt;/${top.name}&gt;</code> antes de fechar <code>&lt;/${closeName}&gt;</code>.`,
        };
      }

      stack.pop();
      if (stack.length === 0) {
        rootClosed = true;
      }
      pos = gtIdx + 1;
      continue;
    }

    // 4. Tag de Abertura <tag ...> ou Elemento Vazio <tag .../>
    if (rootClosed && stack.length === 0) {
      const loc = getLineCol(ltIdx);
      return {
        valid: false,
        ...loc,
        category: 'Regra 1: Elemento Raiz Único Violado',
        headline: 'Múltiplos Elementos Raiz no Topo do Documento',
        explanation: `O elemento raiz <code>&lt;${rootElement.name}&gt;</code> já foi fechado, mas uma nova tag de topo foi encontrada na linha ${loc.line} (<strong>Regra 1</strong>). Um documento XML bem formado deve possuir um <strong>único elemento raiz</strong> envolvendo todos os demais elementos.`,
        fixSuggestion:
          'Crie um elemento raiz único (como <code>&lt;turma&gt;...&lt;/turma&gt;</code> ou <code>&lt;alunos&gt;...&lt;/alunos&gt;</code>) que abrace todos os registros do arquivo.',
      };
    }

    const isSelfClosing = rawTagContent.endsWith('/');
    const cleanContent = isSelfClosing ? rawTagContent.slice(0, -1).trim() : rawTagContent;

    const nameMatch = cleanContent.match(/^([a-zA-Z_][\w.-]*)/);
    if (!nameMatch) {
      const loc = getLineCol(ltIdx);
      return {
        valid: false,
        ...loc,
        category: 'XML: Nome de Tag Inválido',
        headline: 'Identificador de Tag XML Inválido',
        explanation: `Na linha ${loc.line}, o nome da tag não começa com uma letra válida.`,
        fixSuggestion:
          'Nomes de elementos XML devem começar com letra ou sublinhado e não podem conter espaços.',
      };
    }

    const tagName = nameMatch[1];
    const attrString = cleanContent.slice(tagName.length).trim();
    const attributes = [];

    // Parsing e Validação de Atributos (Regra 4: Aspas obrigatórias)
    if (attrString.length > 0) {
      let aPos = 0;
      while (aPos < attrString.length) {
        while (aPos < attrString.length && /\s/.test(attrString[aPos])) aPos++;
        if (aPos >= attrString.length) break;

        const attrNameMatch = attrString.slice(aPos).match(/^([a-zA-Z_][\w.-]*)/);
        if (!attrNameMatch) {
          const loc = getLineCol(ltIdx + 1 + tagName.length + 1 + aPos);
          return {
            valid: false,
            ...loc,
            category: 'Regra 4: Sintaxe de Atributo Inválida',
            headline: `Atributo Malformado na Tag <${tagName}>`,
            explanation: `Na linha ${loc.line}, a declaração de atributo dentro de <code>&lt;${tagName}&gt;</code> contém caracteres inesperados.`,
            fixSuggestion: 'Escreva atributos no formato <code>nome="valor"</code>.',
          };
        }

        const attrName = attrNameMatch[1];
        aPos += attrName.length;
        while (aPos < attrString.length && /\s/.test(attrString[aPos])) aPos++;

        if (attrString[aPos] !== '=') {
          const loc = getLineCol(ltIdx + 1 + tagName.length + 1 + aPos);
          return {
            valid: false,
            ...loc,
            category: 'Regra 4: Atributo Sem Valor',
            headline: `Atributo "${attrName}" Sem Sinal "=" e Valor entre Aspas`,
            explanation: `No XML, diferentemente do HTML, não existem atributos booleanos soltos: todo atributo deve possuir <code>=</code> e valor entre aspas.`,
            fixSuggestion: `Defina um valor entre aspas para o atributo: <code>${attrName}="true"</code>.`,
          };
        }
        aPos++; // pula '='
        while (aPos < attrString.length && /\s/.test(attrString[aPos])) aPos++;

        const quoteChar = attrString[aPos];
        if (quoteChar !== '"' && quoteChar !== "'") {
          const loc = getLineCol(ltIdx + 1 + tagName.length + 1 + aPos);
          return {
            valid: false,
            ...loc,
            category: 'Regra 4: Valor de Atributo Sem Aspas',
            headline: `Valor do Atributo "${attrName}" Não Está Entre Aspas`,
            explanation: `Violação da <strong>Regra 4</strong> na linha ${loc.line}: na tag <code>&lt;${tagName}&gt;</code>, o valor do atributo <code>${attrName}</code> foi escrito sem aspas. No XML todos os valores de atributos devem ser delimitados por aspas!`,
            fixSuggestion: `Envolva o valor do atributo entre aspas duplas: ex. <code>${attrName}="1"</code>.`,
          };
        }

        const closeQuoteIdx = attrString.indexOf(quoteChar, aPos + 1);
        if (closeQuoteIdx === -1) {
          const loc = getLineCol(ltIdx + 1 + tagName.length + 1 + aPos);
          return {
            valid: false,
            ...loc,
            category: 'Regra 4: Aspas de Atributo Não Fechadas',
            headline: `Aspas do Atributo "${attrName}" Não Foram Fechadas`,
            explanation: `O valor do atributo <code>${attrName}</code> na tag <code>&lt;${tagName}&gt;</code> abriu aspas mas não as fechou antes do fim da tag.`,
            fixSuggestion: `Feche as aspas do atributo <code>${attrName}</code> antes de <code>&gt;</code>.`,
          };
        }

        const attrVal = attrString.slice(aPos + 1, closeQuoteIdx);
        const attrEntityErr = checkRawEntitiesInSegment(
          attrVal,
          ltIdx + 1 + tagName.length + 1 + aPos + 1
        );
        if (attrEntityErr) return attrEntityErr;

        attributes.push({ name: attrName, value: attrVal });
        totalAttributes++;
        aPos = closeQuoteIdx + 1;
      }
    }

    const tagLoc = getLineCol(ltIdx);
    const newNode = {
      name: tagName,
      line: tagLoc.line,
      attributes,
      children: [],
      textContent: '',
      isSelfClosing,
    };

    totalElements++;
    if (isSelfClosing) emptyElementsCount++;

    const currentDepth = stack.length + 1;
    if (currentDepth > maxDepth) maxDepth = currentDepth;

    if (stack.length === 0) {
      rootElement = newNode;
    } else {
      stack[stack.length - 1].children.push(newNode);
    }

    if (!isSelfClosing) {
      stack.push(newNode);
    } else if (stack.length === 0) {
      rootClosed = true;
    }

    pos = gtIdx + 1;
  }

  if (!rootElement) {
    return {
      valid: false,
      line: 1,
      col: 1,
      lineText: lines[0] || '',
      category: 'Regra 1: Sem Elemento Raiz',
      headline: 'Nenhum Elemento XML Encontrado no Documento',
      explanation: 'O documento não contém nenhuma tag XML raiz.',
      fixSuggestion:
        'Inicie o documento com um elemento raiz, como <code>&lt;turma&gt;...&lt;/turma&gt;</code>.',
    };
  }

  if (stack.length > 0) {
    const unclosed = stack[stack.length - 1];
    const lastLineIdx = lines.length - 1;
    return {
      valid: false,
      line: unclosed.line,
      col: 1,
      lineText: lines[unclosed.line - 1] || lines[lastLineIdx] || '',
      category: 'Regra 2: Tag Aberta e Não Fechada',
      headline: `A Tag <${unclosed.name}> (Linha ${unclosed.line}) Nunca Foi Fechada`,
      explanation: `Violação da <strong>Regra 2</strong>: toda tag aberta precisa obrigatoriamente ser fechada. O documento terminou enquanto o elemento <code>&lt;${unclosed.name}&gt;</code> aberto na linha ${unclosed.line} ainda estava pendente de fechamento.`,
      fixSuggestion: `Adicione a tag de fechamento <code>&lt;/${unclosed.name}&gt;</code> correspondente.`,
    };
  }

  return {
    valid: true,
    rootNode: rootElement,
    metrics: {
      rootName: `<${rootElement.name}>`,
      totalElements,
      totalAttributes,
      maxDepth,
      textNodesCount,
      emptyAndComments: `${emptyElementsCount} vazios / ${commentsCount} coment.`,
    },
  };
}

/**
 * Tokenizador de Syntax Highlighting para linhas XML
 */
export function colorizeXmlLine(lineText) {
  if (!lineText) return '&nbsp;';

  // Comentário na linha
  if (lineText.trim().startsWith('<!--') && lineText.trim().endsWith('-->')) {
    return `<span class="text-slate-400 dark:text-[#6c7086] italic">${escapeHtmlText(lineText)}</span>`;
  }

  // Prólogo XML
  if (lineText.trim().startsWith('<?xml')) {
    return `<span class="token-null">${escapeHtmlText(lineText)}</span>`;
  }

  const tokenRegex =
    /(<!--[\s\S]*?-->|<\/?[a-zA-Z_][\w.-]*|\/>|>|[a-zA-Z_][\w.-]*=|"[^"]*"|'[^']*'|&(?:lt|gt|amp|quot|apos|#\d+);|[^<>="&']+)/g;

  let html = '';
  let match;
  while ((match = tokenRegex.exec(lineText)) !== null) {
    const token = match[0];
    if (token.startsWith('<!--')) {
      html += `<span class="text-slate-400 dark:text-[#6c7086] italic">${escapeHtmlText(token)}</span>`;
    } else if (token.startsWith('</') || token.startsWith('<')) {
      html += `<span class="token-number">${escapeHtmlText(token)}</span>`;
    } else if (token === '>' || token === '/>') {
      html += `<span class="token-number">${escapeHtmlText(token)}</span>`;
    } else if (token.endsWith('=')) {
      const attrName = token.slice(0, -1);
      html += `<span class="token-key">${escapeHtmlText(attrName)}</span><span class="token-punct">=</span>`;
    } else if (
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("'") && token.endsWith("'"))
    ) {
      html += `<span class="token-string">${escapeHtmlText(token)}</span>`;
    } else if (token.startsWith('&') && token.endsWith(';')) {
      html += `<span class="token-bool">${escapeHtmlText(token)}</span>`;
    } else {
      html += `<span class="token-plain">${escapeHtmlText(token)}</span>`;
    }
  }

  return html || '&nbsp;';
}

/**
 * Constrói o HTML recursivo da Árvore DOM Didática de Elementos e Atributos XML
 */
export function buildXmlDomTreeHtml(node, depth = 0) {
  if (!node) return '';
  const indentClass =
    depth === 0
      ? ''
      : depth === 1
        ? 'ml-4 sm:ml-5 pl-3 border-l-2 border-sky-400 dark:border-sky-500/30'
        : 'ml-6 sm:ml-8 pl-3 border-l-2 border-emerald-400 dark:border-emerald-500/30';

  const attrsBadges = (node.attributes || [])
    .map(
      (a) =>
        `<span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30">@${escapeHtmlText(a.name)}="${escapeHtmlText(a.value)}"</span>`
    )
    .join(' ');

  const selfClosingBadge = node.isSelfClosing
    ? `<span class="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-pink-500/20 dark:text-pink-300 font-bold">Elemento Vazio /&gt;</span>`
    : '';

  const textBadge = node.textContent
    ? `<span class="font-mono font-bold text-emerald-700 dark:text-[#a6e3a1] bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">"${escapeHtmlText(node.textContent)}"</span>`
    : '';

  const childrenHtml =
    node.children && node.children.length > 0
      ? `<div class="mt-1.5 space-y-1.5">${node.children.map((c) => buildXmlDomTreeHtml(c, depth + 1)).join('')}</div>`
      : '';

  return `
    <div class="${indentClass} tree-node-item">
      <div class="bg-slate-50 hover:bg-slate-100 dark:bg-[#181825] p-2 px-3 rounded-xl border border-slate-200 dark:border-[#313244] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div class="flex flex-wrap items-center gap-2">
          <span class="font-mono font-bold text-sky-700 dark:text-[#89b4fa]">&lt;${escapeHtmlText(node.name)}&gt;</span>
          ${attrsBadges}
          ${selfClosingBadge}
        </div>
        <div class="flex items-center gap-2">
          ${textBadge}
          <span class="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#313244] text-slate-600 dark:text-[#a6adc8] font-bold">
            ${depth === 0 ? 'Raiz' : node.children.length > 0 ? `${node.children.length} filho(s)` : 'Folha'}
          </span>
        </div>
      </div>
      ${childrenHtml}
    </div>
  `;
}

export function switchXmlTab(tabId) {
  const builderTab = document.getElementById('xml-view-builder');
  const validatorTab = document.getElementById('xml-view-validator');
  const btnBuilder = document.getElementById('xml-tab-btn-builder');
  const btnValidator = document.getElementById('xml-tab-btn-validator');
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
    stopXmlTyping();
    builderTab.classList.add('hidden');
    validatorTab.classList.remove('hidden');
    btnValidator.className =
      'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm bg-white text-emerald-700 dark:bg-[#313244] dark:text-white border border-slate-200 dark:border-transparent';
    btnBuilder.className =
      'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-[#a6adc8] hover:text-slate-900 dark:hover:text-white transition';
    playTone('G5');
    runXmlValidation();
  }
}

export function renderXmlStepper() {
  const container = document.getElementById('xml-stepper-container');
  if (!container) return;
  container.innerHTML = xmlStepsData
    .map((step, idx) => {
      const isCurrent = idx === xmlCurrentStepIndex;
      const isCompleted = idx < xmlCurrentStepIndex;
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
        <button onclick="xmlGoToStep(${idx})" class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all border shrink-0 ${statusClass}">
          <span class="w-5 h-5 rounded-full flex items-center justify-center font-mono text-[11px] font-bold ${isCurrent ? 'bg-white text-indigo-900' : isCompleted ? 'bg-emerald-600 text-white dark:bg-emerald-500/30 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-black/30 dark:text-slate-300'}">
            ${isCompleted ? '<i class="fa-solid fa-check text-[10px]"></i>' : idx + 1}
          </span>
          <span class="font-medium whitespace-nowrap">${step.title.split(' ')[0]} ${step.title.split(' ')[1] || ''}</span>
        </button>
      `;
    })
    .join('');
}

export function renderXmlLesson() {
  const step = xmlStepsData[xmlCurrentStepIndex];
  const badgeEl = document.getElementById('xml-badge-step-number');
  if (!badgeEl) return;

  const isDarkMode = getIsDarkMode();
  badgeEl.innerText = `PASSO ${step.stepNumber} DE ${xmlStepsData.length}`;
  document.getElementById('xml-step-category').innerText = step.category;
  document.getElementById('xml-step-icon-container').innerHTML = `<i class="${step.icon}"></i>`;
  document.getElementById('xml-step-title').innerText = step.title;
  document.getElementById('xml-step-description').innerText = step.description;
  document.getElementById('xml-step-rule-text').innerText = step.rule;

  const tokenContainer = document.getElementById('xml-step-tokens-container');
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

  document.getElementById('xml-btn-prev').disabled = xmlCurrentStepIndex === 0;
  const nextBtn = document.getElementById('xml-btn-next');
  nextBtn.innerHTML =
    xmlCurrentStepIndex === xmlStepsData.length - 1
      ? `<span>Finalizar</span> <i class="fa-solid fa-check"></i>`
      : `<span>Avançar</span> <i class="fa-solid fa-arrow-right"></i>`;
  document.getElementById('xml-trap-feedback-box').classList.add('hidden');
  updateXmlSyntaxBadge(true);
}

export function renderXmlCodeEditor(animated = true) {
  const step = xmlStepsData[xmlCurrentStepIndex];
  const codeCanvas = document.getElementById('xml-code-canvas');
  if (!codeCanvas) return;

  const lines = step.rawXml.split('\n');
  stopXmlTyping();
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
            ${colorizeXmlLine(line)}
          </div>
        `;
      })
      .join('');
    document.getElementById('xml-char-count').innerText =
      `Tamanho: ${step.rawXml.length} caracteres`;
    return;
  }

  codeCanvas.innerHTML = '';
  let currentLineIndex = 0;
  let currentCharIndex = 0;

  function typeChar() {
    if (currentLineIndex >= lines.length) {
      renderXmlCodeEditor(false);
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
        lineContent = colorizeXmlLine(lines[i]);
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
    document.getElementById('xml-char-count').innerText =
      `Construindo: ${totalCharsTyped} caracteres`;
    xmlTypingTimeout = setTimeout(typeChar, 14);
  }
  typeChar();
}

export function renderXmlTree() {
  const step = xmlStepsData[xmlCurrentStepIndex];
  const treeCanvas = document.getElementById('xml-tree-canvas');
  if (!treeCanvas) return;

  const parsed = validateXmlText(step.rawXml);
  if (parsed.valid && parsed.rootNode) {
    treeCanvas.innerHTML = buildXmlDomTreeHtml(parsed.rootNode, 0);
    document.getElementById('xml-tree-depth').innerText = parsed.metrics.maxDepth;
  }
}

export function updateAllXmlViews(animated = true) {
  renderXmlStepper();
  renderXmlLesson();
  renderXmlCodeEditor(animated);
  renderXmlTree();
}

export function xmlNextStep() {
  if (xmlCurrentStepIndex < xmlStepsData.length - 1) {
    xmlCurrentStepIndex++;
    playTone('C5');
    updateAllXmlViews(true);
  } else {
    showToast('Você concluiu todas as etapas guiadas de XML!');
    playTone('C6');
  }
}

export function xmlPrevStep() {
  if (xmlCurrentStepIndex > 0) {
    xmlCurrentStepIndex--;
    playTone('G4');
    updateAllXmlViews(false);
  }
}

export function xmlGoToStep(idx) {
  if (idx !== xmlCurrentStepIndex && idx >= 0 && idx < xmlStepsData.length) {
    xmlCurrentStepIndex = idx;
    playTone('D5');
    updateAllXmlViews(true);
  }
}

export function xmlReplayTyping() {
  playTone('F5');
  renderXmlCodeEditor(true);
}

export function updateXmlSyntaxBadge(isValid) {
  const badge = document.getElementById('xml-syntax-status-badge');
  if (!badge) return;
  const isDarkMode = getIsDarkMode();
  if (isValid) {
    badge.className = isDarkMode
      ? 'text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 font-bold'
      : 'text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 font-bold';
    badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> XML Bem Formado`;
  } else {
    badge.className = isDarkMode
      ? 'text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5 font-bold'
      : 'text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1.5 font-bold';
    badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span> XML Malformado`;
  }
}

export function triggerXmlTrap(trapKey) {
  stopXmlTyping();
  const trap = xmlTraps[trapKey];
  if (!trap) return;

  playTone('C3');
  const box = document.getElementById('xml-trap-feedback-box');
  box.classList.remove('hidden');
  document.getElementById('xml-trap-error-title').innerText = trap.title;
  document.getElementById('xml-trap-error-desc').innerText = trap.errorDesc;
  document.getElementById('xml-trap-fix-text').innerText = trap.fix;
  updateXmlSyntaxBadge(false);

  const lines = trap.rawCode.split('\n');
  const codeCanvas = document.getElementById('xml-code-canvas');
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
        <div class="pl-2 font-mono text-xs leading-6 whitespace-pre ${isErrorLine ? errBg : ''}">${colorizeXmlLine(line)}</div>
      `;
    })
    .join('');

  document.getElementById('xml-char-count').innerText = 'Status: XML MALFORMADO';
  showToast('Violação de XML Bem Formado simulada!');
}

export function restoreCleanXmlCode() {
  playTone('E5');
  document.getElementById('xml-trap-feedback-box').classList.add('hidden');
  updateXmlSyntaxBadge(true);
  renderXmlCodeEditor(false);
  showToast('Documento XML bem formado restaurado!');
}

export function copyCurrentXmlCode() {
  const step = xmlStepsData[xmlCurrentStepIndex];
  copyTextToClipboard(step.rawXml, 'XML copiado para a área de transferência!');
  playTone('A5');
}

export function loadXmlValidatorPreset(key) {
  const text = xmlValidatorPresets[key];
  if (text) {
    document.getElementById('xml-validator-input').value = text;
    document.getElementById('xml-validator-file-name').innerText = `documento_${key}.xml`;
    runXmlValidation();
    playTone('D5');
  }
}

export function handleXmlDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('xml-drop-zone').classList.add('drop-active');
}

export function handleXmlDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('xml-drop-zone').classList.remove('drop-active');
}

export function handleXmlFileDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('xml-drop-zone').classList.remove('drop-active');
  const files = e.dataTransfer.files;
  if (files && files.length > 0) {
    processXmlUploadedFile(files[0]);
  }
}

export function handleXmlFileSelect(e) {
  const files = e.target.files;
  if (files && files.length > 0) {
    processXmlUploadedFile(files[0]);
  }
}

export function processXmlUploadedFile(file) {
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    showToast('Arquivo excede o limite didático de 1 MB.');
    return;
  }
  document.getElementById('xml-validator-file-name').innerText = file.name;
  const reader = new FileReader();
  reader.onload = function (evt) {
    document.getElementById('xml-validator-input').value = evt.target.result;
    runXmlValidation();
    showToast(`Arquivo "${file.name}" carregado com sucesso!`);
    playTone('F5');
  };
  reader.readAsText(file, 'UTF-8');
}

export function clearXmlValidatorEditor() {
  document.getElementById('xml-validator-input').value = '';
  document.getElementById('xml-validator-file-name').innerText = 'Editor em branco';
  runXmlValidation();
  playTone('C4');
}

export function formatValidatorXML() {
  const input = document.getElementById('xml-validator-input');
  if (!input || !input.value.trim()) return;
  const res = validateXmlText(input.value);
  if (!res.valid) {
    showToast('Corrija os erros de formação do XML antes de formatar!');
    playTone('C3');
    return;
  }

  function serializeNode(node, indent = '') {
    const attrs = (node.attributes || []).map((a) => ` ${a.name}="${a.value}"`).join('');
    if (node.isSelfClosing) {
      return `${indent}<${node.name}${attrs}/>`;
    }
    if (node.children.length === 0) {
      return `${indent}<${node.name}${attrs}>${node.textContent || ''}</${node.name}>`;
    }
    const inner = node.children.map((c) => serializeNode(c, indent + '  ')).join('\n');
    return `${indent}<${node.name}${attrs}>\n${inner}\n${indent}</${node.name}>`;
  }

  const hasProlog = input.value.trim().startsWith('<?xml');
  const prologLine = hasProlog ? '<?xml version="1.0" encoding="UTF-8"?>\n' : '';
  input.value = prologLine + serializeNode(res.rootNode, '');
  runXmlValidation();
  showToast('Documento XML formatado e indentado com sucesso!');
  playTone('A5');
}

export function copyCurrentXmlValidatorText() {
  const val = document.getElementById('xml-validator-input').value;
  copyTextToClipboard(val, 'XML copiado para a área de transferência!');
  playTone('A5');
}

export function runXmlValidation() {
  const inputEl = document.getElementById('xml-validator-input');
  if (!inputEl) return;
  const text = inputEl.value;
  const statsText = document.getElementById('xml-validator-stats-text');
  const linesCount = text ? text.replace(/\r\n/g, '\n').split('\n').length : 0;
  const bytesCount = new Blob([text]).size;
  statsText.innerText = `${linesCount} linhas • ${bytesCount} bytes`;

  const statusTitle = document.getElementById('xml-validator-status-title');
  const statusSubtitle = document.getElementById('xml-validator-status-subtitle');
  const badgeIcon = document.getElementById('xml-validator-badge-icon');
  const errSection = document.getElementById('xml-validator-error-section');
  const succSection = document.getElementById('xml-validator-success-section');

  if (!text.trim()) {
    statusTitle.innerText = 'Aguardando documento XML para validação';
    statusSubtitle.innerText = 'Cole um código XML ou envie um arquivo .xml para auditoria';
    badgeIcon.className =
      'w-10 h-10 rounded-xl bg-slate-200 text-slate-600 dark:bg-[#313244] dark:text-[#a6adc8] flex items-center justify-center text-lg';
    badgeIcon.innerHTML = `<i class="fa-solid fa-circle-question"></i>`;
    errSection.classList.add('hidden');
    succSection.classList.add('hidden');
    return;
  }

  const result = validateXmlText(text);

  if (result.valid) {
    statusTitle.innerText = 'XML Bem Formado e Aprovado na Auditoria';
    statusSubtitle.innerText =
      '100% em conformidade com as 6 regras sintáticas W3C de XML Bem Formado';
    badgeIcon.className =
      'w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 flex items-center justify-center text-lg';
    badgeIcon.innerHTML = `<i class="fa-solid fa-circle-check"></i>`;

    errSection.classList.add('hidden');
    succSection.classList.remove('hidden');

    document.getElementById('xml-metric-root').innerText = result.metrics.rootName;
    document.getElementById('xml-metric-elements').innerText = result.metrics.totalElements;
    document.getElementById('xml-metric-attrs').innerText = result.metrics.totalAttributes;
    document.getElementById('xml-metric-depth').innerText = result.metrics.maxDepth;
    document.getElementById('xml-metric-texts').innerText = result.metrics.textNodesCount;
    document.getElementById('xml-metric-empty').innerText = result.metrics.emptyAndComments;

    const treePreview = document.getElementById('xml-validator-tree-preview');
    treePreview.innerHTML = buildXmlDomTreeHtml(result.rootNode, 0);
  } else {
    statusTitle.innerText = result.headline;
    statusSubtitle.innerText = 'Detectada violação das regras de XML Bem Formado';
    badgeIcon.className =
      'w-10 h-10 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 flex items-center justify-center text-lg';
    badgeIcon.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i>`;

    succSection.classList.add('hidden');
    errSection.classList.remove('hidden');

    document.getElementById('xml-error-loc-line').innerText = result.line;
    document.getElementById('xml-error-loc-col').innerText = result.col;
    document.getElementById('xml-error-category-badge').innerText = result.category;

    const safeLine = escapeHtmlText(result.lineText || '');
    const pointerSpaces = ' '.repeat(Math.max(0, result.col - 1));
    document.getElementById('xml-error-code-preview').innerHTML = `
      <div class="text-slate-400 select-none">// Linha ${result.line}:</div>
      <div class="text-white whitespace-pre">${safeLine || '&nbsp;'}</div>
      <div class="text-rose-400 font-bold whitespace-pre">${pointerSpaces}^ [Coluna ${result.col}]</div>
    `;
    document.getElementById('xml-error-didactic-why').innerHTML = result.explanation;
    document.getElementById('xml-error-didactic-fix').innerHTML = result.fixSuggestion;
    playTone('C3');
  }
}

export function refreshXmlTheme() {
  renderXmlLesson();
  renderXmlCodeEditor(false);
  renderXmlTree();
  runXmlValidation();
}

export function getXmlModuleHtml() {
  return `
  <div id="module-xml" class="hidden flex-1 flex flex-col">
    <!-- Barra Interna de Abas do Módulo XML -->
    <div class="bg-white/80 dark:bg-[#181825]/80 border-b border-slate-200 dark:border-[#313244] px-4 lg:px-8 py-2.5">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <span class="w-8 h-8 rounded-lg bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30 flex items-center justify-center font-mono font-bold text-xs">
            &lt;/&gt;
          </span>
          <div>
            <h2 class="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">Módulo 4: Arquivos XML (Extensible Markup Language)</h2>
            <p class="text-[11px] text-slate-500 dark:text-[#a6adc8]">Prólogo, Elemento Raiz Único, Tags, Atributos, Entidades e Regras de Boa Formação (NF-e / XSD)</p>
          </div>
        </div>
        <div class="flex items-center bg-slate-100 dark:bg-[#11111b] p-1 rounded-xl border border-slate-200 dark:border-[#313244]">
          <button id="xml-tab-btn-builder" onclick="switchXmlTab('builder')" class="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm bg-white text-indigo-700 dark:bg-[#313244] dark:text-white border border-slate-200 dark:border-transparent">
            <i class="fa-solid fa-wand-magic-sparkles text-indigo-600 dark:text-amber-400"></i>
            <span>1. Construtor Guiado</span>
          </button>
          <button id="xml-tab-btn-validator" onclick="switchXmlTab('validator')" class="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-[#a6adc8] hover:text-slate-900 dark:hover:text-white transition">
            <i class="fa-solid fa-file-circle-check text-emerald-600 dark:text-emerald-400"></i>
            <span>2. Validador de Arquivos</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ABA 1: CONSTRUTOR GUIADO DE XML -->
    <div id="xml-view-builder" class="flex-1 flex flex-col">
      <nav class="bg-slate-100/80 dark:bg-[#181825] border-b border-slate-200 dark:border-[#313244] px-4 py-2.5 overflow-x-auto no-scrollbar">
        <div class="max-w-7xl mx-auto flex items-center justify-between min-w-[680px] gap-2">
          <div id="xml-stepper-container" class="flex items-center gap-2.5 w-full justify-between"></div>
        </div>
      </nav>

      <main class="max-w-7xl mx-auto w-full flex-1 p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section class="lg:col-span-5 flex flex-col gap-5">
          <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-5 shadow-md dark:shadow-xl">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#313244] mb-4">
              <div class="flex items-center gap-2">
                <span id="xml-badge-step-number" class="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 font-mono">
                  PASSO 1 DE 6
                </span>
                <span id="xml-step-category" class="text-xs font-semibold text-slate-500 dark:text-[#a6adc8]">Declaração e Escopo Raiz</span>
              </div>
              <span id="xml-step-icon-container" class="text-indigo-600 dark:text-amber-400 text-lg">
                <i class="fa-solid fa-code"></i>
              </span>
            </div>

            <h2 id="xml-step-title" class="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-snug"></h2>
            <p id="xml-step-description" class="text-sm text-slate-600 dark:text-[#bac2de] leading-relaxed mb-4"></p>

            <div class="p-3.5 rounded-xl bg-amber-50/80 border-l-4 border-amber-500 dark:bg-[#181825] dark:border-amber-400 flex items-start gap-3 mb-5">
              <i class="fa-solid fa-lightbulb text-amber-600 dark:text-amber-400 mt-0.5 text-base"></i>
              <div class="text-xs space-y-1">
                <strong class="text-amber-900 dark:text-amber-300 block font-bold">Regra Fundamental:</strong>
                <span id="xml-step-rule-text" class="text-slate-700 dark:text-[#a6adc8] font-medium leading-normal"></span>
              </div>
            </div>

            <div class="space-y-2 mb-5">
              <h3 class="text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-[#a6adc8] flex items-center gap-1.5">
                <i class="fa-solid fa-microscope text-indigo-600 dark:text-indigo-400"></i> Anatomia dos Elementos Envolvidos
              </h3>
              <div id="xml-step-tokens-container" class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs"></div>
            </div>

            <div class="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-[#313244]">
              <button id="xml-btn-prev" onclick="xmlPrevStep()" class="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#313244] dark:hover:bg-[#45475a] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-700 dark:text-white flex items-center justify-center gap-2 transition shadow-sm border border-slate-200 dark:border-transparent">
                <i class="fa-solid fa-arrow-left"></i> Voltar
              </button>
              <button onclick="xmlReplayTyping()" title="Repetir Animação de Digitação" class="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#313244] dark:hover:bg-[#45475a] text-slate-700 dark:text-amber-300 transition border border-slate-200 dark:border-transparent">
                <i class="fa-solid fa-rotate-right"></i>
              </button>
              <button id="xml-btn-next" onclick="xmlNextStep()" class="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-gradient-to-r dark:from-indigo-600 dark:to-indigo-500 text-xs font-bold text-white flex items-center justify-center gap-2 transition shadow-md shadow-indigo-600/20">
                <span>Avançar</span> <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <!-- Laboratório do Erro XML -->
          <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-5 shadow-md dark:shadow-xl">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-rose-100 dark:bg-red-500/20 text-rose-600 dark:text-red-400 flex items-center justify-center text-xs">
                  <i class="fa-solid fa-bug"></i>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-slate-900 dark:text-white">Laboratório de XML Malformado</h3>
                  <p class="text-[11px] text-slate-500 dark:text-[#a6adc8]">Simule violações das 6 regras com 1 clique</p>
                </div>
              </div>
              <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-red-500/10 dark:text-red-400 border border-rose-200 dark:border-red-500/20 font-bold">
                Interativo
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <button onclick="triggerXmlTrap('multiple_roots')" class="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-[#181825] dark:hover:bg-red-500/10 border border-slate-200 hover:border-rose-400 dark:border-[#313244] dark:hover:border-red-500/40 text-xs transition group">
                <div class="font-bold text-slate-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-red-300 flex items-center justify-between">
                  <span>1. Sem Raiz Única</span>
                  <i class="fa-solid fa-triangle-exclamation text-xs text-rose-500 opacity-0 group-hover:opacity-100"></i>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-[#a6adc8] mt-0.5 font-mono"><code>Dois &lt;aluno&gt; soltos</code></p>
              </button>
              <button onclick="triggerXmlTrap('crossed_tags')" class="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-[#181825] dark:hover:bg-red-500/10 border border-slate-200 hover:border-rose-400 dark:border-[#313244] dark:hover:border-red-500/40 text-xs transition group">
                <div class="font-bold text-slate-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-red-300 flex items-center justify-between">
                  <span>2. Tags Cruzadas</span>
                  <i class="fa-solid fa-triangle-exclamation text-xs text-rose-500 opacity-0 group-hover:opacity-100"></i>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-[#a6adc8] mt-0.5 font-mono"><code>&lt;nome&gt;Ana&lt;/aluno&gt;</code></p>
              </button>
              <button onclick="triggerXmlTrap('case_mismatch')" class="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-[#181825] dark:hover:bg-red-500/10 border border-slate-200 hover:border-rose-400 dark:border-[#313244] dark:hover:border-red-500/40 text-xs transition group">
                <div class="font-bold text-slate-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-red-300 flex items-center justify-between">
                  <span>3. Maiúscula ≠ Minúscula</span>
                  <i class="fa-solid fa-triangle-exclamation text-xs text-rose-500 opacity-0 group-hover:opacity-100"></i>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-[#a6adc8] mt-0.5 font-mono"><code>&lt;Nome&gt;Ana&lt;/nome&gt;</code></p>
              </button>
              <button onclick="triggerXmlTrap('unquoted_attr_or_amp')" class="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 dark:bg-[#181825] dark:hover:bg-red-500/10 border border-slate-200 hover:border-rose-400 dark:border-[#313244] dark:hover:border-red-500/40 text-xs transition group">
                <div class="font-bold text-slate-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-red-300 flex items-center justify-between">
                  <span>4. Atributo s/ "" e &amp;</span>
                  <i class="fa-solid fa-triangle-exclamation text-xs text-rose-500 opacity-0 group-hover:opacity-100"></i>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-[#a6adc8] mt-0.5 font-mono"><code>&lt;aluno id=1&gt;</code></p>
              </button>
            </div>

            <div id="xml-trap-feedback-box" class="hidden p-3.5 rounded-xl bg-rose-50 border border-rose-200 dark:bg-[#181825] dark:border-red-500/30 transition-all">
              <div class="flex items-start gap-2.5">
                <i class="fa-solid fa-circle-xmark text-rose-600 dark:text-red-400 text-base mt-0.5"></i>
                <div class="text-xs space-y-1 flex-1">
                  <span id="xml-trap-error-title" class="font-bold text-rose-900 dark:text-red-300 block"></span>
                  <p id="xml-trap-error-desc" class="text-rose-800 dark:text-[#bac2de] font-mono text-[11px] bg-rose-100/70 dark:bg-red-950/40 p-2 rounded border border-rose-200 dark:border-red-900/50 my-1"></p>
                  <div class="mt-2 text-slate-700 dark:text-[#a6adc8]">
                    <strong class="text-emerald-700 dark:text-emerald-400 font-bold">Como corrigir:</strong>
                    <span id="xml-trap-fix-text"></span>
                  </div>
                </div>
              </div>
              <button onclick="restoreCleanXmlCode()" class="mt-3 w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600/30 text-white dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm">
                <i class="fa-solid fa-wand-magic-sparkles"></i> Restaurar XML Bem Formado
              </button>
            </div>
          </div>
        </section>

        <!-- Coluna Direita: Editor XML & Árvore DOM -->
        <section class="lg:col-span-7 flex flex-col gap-5">
          <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl shadow-lg dark:shadow-2xl overflow-hidden flex flex-col">
            <div class="bg-slate-100 dark:bg-[#181825] px-4 py-2.5 border-b border-slate-200 dark:border-[#313244] flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-rose-400 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
                <span class="ml-2 font-mono text-xs text-slate-700 dark:text-[#a6adc8] flex items-center gap-1.5 font-bold">
                  <i class="fa-solid fa-code text-sky-500"></i> turma.xml
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span id="xml-syntax-status-badge" class="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30 flex items-center gap-1.5 font-bold">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> XML Bem Formado
                </span>
                <button onclick="copyCurrentXmlCode()" title="Copiar XML" class="p-1.5 text-xs text-slate-600 hover:text-slate-900 dark:text-[#a6adc8] dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-[#313244] transition">
                  <i class="fa-regular fa-copy"></i>
                </button>
              </div>
            </div>

            <div class="p-4 bg-slate-50/70 dark:bg-[#1e1e2e] font-mono text-sm leading-relaxed overflow-x-auto min-h-[290px]">
              <div id="xml-code-canvas" class="grid grid-cols-[38px_1fr] gap-3 min-w-[340px]"></div>
            </div>

            <div class="bg-slate-100 dark:bg-[#181825] px-4 py-2 border-t border-slate-200 dark:border-[#313244] flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-[#a6adc8] gap-2">
              <div class="flex items-center gap-3">
                <span><strong class="text-slate-900 dark:text-white">Padrão:</strong> W3C XML 1.0</span>
                <span><strong class="text-slate-900 dark:text-white">Codificação:</strong> UTF-8</span>
              </div>
              <span id="xml-char-count" class="font-mono font-medium">Tamanho: 0 caracteres</span>
            </div>
          </div>

          <!-- Árvore Hierárquica DOM do XML -->
          <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-5 shadow-md dark:shadow-xl">
            <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-[#313244]">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 flex items-center justify-center text-xs">
                  <i class="fa-solid fa-folder-tree"></i>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-slate-900 dark:text-white">Árvore Hierárquica de Elementos e Atributos (DOM XML)</h3>
                  <p class="text-[11px] text-slate-500 dark:text-[#a6adc8]">Como o processador estrutura o elemento raiz, os atributos (@) e os nós de texto</p>
                </div>
              </div>
              <span class="text-xs font-mono font-bold text-sky-700 bg-sky-50 border border-sky-200 dark:text-sky-300 dark:bg-sky-900/30 dark:border-sky-700/40 px-2 py-0.5 rounded">
                Profundidade: <span id="xml-tree-depth">1</span>
              </span>
            </div>
            <div id="xml-tree-canvas" class="space-y-2 font-mono text-xs overflow-x-auto p-1"></div>
          </div>
        </section>
      </main>
    </div>

    <!-- ABA 2: VALIDADOR & AUDITOR DIDÁTICO DE XML -->
    <div id="xml-view-validator" class="hidden flex-1 flex flex-col p-4 lg:p-6 max-w-7xl mx-auto w-full gap-6">
      <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="p-2 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 text-sm">
              <i class="fa-solid fa-file-code"></i>
            </span>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Auditor e Validador Didático de XML Bem Formado</h2>
          </div>
          <p class="text-xs text-slate-600 dark:text-[#a6adc8] mt-1 max-w-3xl">
            Envie um arquivo <code>.xml</code> ou cole seu documento abaixo. Nosso analisador audita as <strong>6 Regras de XML Bem Formado</strong> (Raiz única, Fechamento obrigatório, Aninhamento sem cruzamento, Aspas em atributos, Case-sensitivity e Entidades especiais), apontando a linha e a coluna exatas de qualquer falha.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2 shrink-0">
          <span class="text-xs font-semibold text-slate-500 dark:text-[#a6adc8]">Carregar Exemplo:</span>
          <button onclick="loadXmlValidatorPreset('valid')" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30 transition">
            <i class="fa-solid fa-check"></i> Válido
          </button>
          <button onclick="loadXmlValidatorPreset('err_crossed')" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30 transition">
            <i class="fa-solid fa-bug"></i> Tags Cruzadas
          </button>
          <button onclick="loadXmlValidatorPreset('err_case')" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30 transition">
            <i class="fa-solid fa-font"></i> Case-Sensitivity
          </button>
          <button onclick="loadXmlValidatorPreset('err_attr')" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-300 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30 transition">
            <i class="fa-solid fa-quote-left"></i> Atributo s/ Aspas
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-6 flex flex-col gap-4">
          <div id="xml-drop-zone" ondragover="handleXmlDragOver(event)" ondragleave="handleXmlDragLeave(event)" ondrop="handleXmlFileDrop(event)"
            class="border-2 border-dashed border-slate-300 hover:border-indigo-500 dark:border-[#313244] dark:hover:border-indigo-400 bg-white dark:bg-[#181825] rounded-2xl p-5 text-center cursor-pointer transition shadow-sm flex flex-col items-center justify-center gap-2 group">
            <input type="file" id="xml-file-input" accept=".xml,text/xml,application/xml,text/plain" onchange="handleXmlFileSelect(event)" class="hidden">
            <div class="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400 flex items-center justify-center text-xl group-hover:scale-110 transition">
              <i class="fa-solid fa-cloud-arrow-up"></i>
            </div>
            <div>
              <p class="text-sm font-bold text-slate-800 dark:text-white">
                Arraste e solte seu arquivo <span class="text-sky-600 dark:text-sky-400">.xml</span> aqui
              </p>
              <p class="text-xs text-slate-500 dark:text-[#a6adc8] mt-0.5">ou clique para selecionar do seu dispositivo</p>
            </div>
            <button type="button" onclick="document.getElementById('xml-file-input').click()" class="mt-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#313244] dark:hover:bg-[#45475a] text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-transparent">
              Escolher Arquivo XML
            </button>
          </div>

          <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl overflow-hidden shadow-md flex flex-col">
            <div class="bg-slate-100 dark:bg-[#181825] px-4 py-2.5 border-b border-slate-200 dark:border-[#313244] flex items-center justify-between">
              <span class="text-xs font-bold text-slate-700 dark:text-white flex items-center gap-2">
                <i class="fa-solid fa-code text-sky-600 dark:text-sky-400"></i> Entrada de Documento XML / Editor Direto
              </span>
              <div class="flex items-center gap-1">
                <button onclick="formatValidatorXML()" title="Formatar e indentar hierarquia XML" class="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-200 hover:bg-slate-300 dark:bg-[#313244] dark:hover:bg-[#45475a] text-slate-700 dark:text-slate-200 transition">
                  <i class="fa-solid fa-wand-magic-sparkles text-amber-500"></i> Formatar
                </button>
                <button onclick="clearXmlValidatorEditor()" title="Limpar editor" class="px-2.5 py-1 rounded-md text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition">
                  <i class="fa-solid fa-trash-can"></i> Limpar
                </button>
              </div>
            </div>

            <div class="relative p-3 bg-slate-50/50 dark:bg-[#1e1e2e]">
              <textarea id="xml-validator-input" rows="13" spellcheck="false" oninput="runXmlValidation()" placeholder="Cole seu documento XML aqui ou selecione um arquivo acima..."
                class="w-full bg-white dark:bg-[#11111b] text-slate-800 dark:text-[#cdd6f4] font-mono text-xs p-3 rounded-xl border border-slate-300 dark:border-[#313244] focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed resize-y"></textarea>
            </div>

            <div class="bg-slate-100 dark:bg-[#181825] px-4 py-2 border-t border-slate-200 dark:border-[#313244] flex items-center justify-between text-xs text-slate-600 dark:text-[#a6adc8]">
              <span id="xml-validator-file-name" class="font-mono text-[11px] truncate max-w-[200px]">Nenhum arquivo carregado</span>
              <span id="xml-validator-stats-text" class="font-mono text-[11px]">0 linhas • 0 bytes</span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-6 flex flex-col gap-4">
          <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-5 shadow-md flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div id="xml-validator-badge-icon" class="w-10 h-10 rounded-xl bg-slate-200 text-slate-600 dark:bg-[#313244] dark:text-[#a6adc8] flex items-center justify-center text-lg">
                  <i class="fa-solid fa-circle-question"></i>
                </div>
                <div>
                  <h3 id="xml-validator-status-title" class="text-base font-extrabold text-slate-900 dark:text-white">
                    Aguardando documento XML para validação
                  </h3>
                  <p id="xml-validator-status-subtitle" class="text-xs text-slate-500 dark:text-[#a6adc8]">
                    Cole um código XML ou envie um arquivo .xml para auditoria
                  </p>
                </div>
              </div>
            </div>

            <!-- Seção de Erro XML -->
            <div id="xml-validator-error-section" class="hidden flex flex-col gap-3">
              <div class="p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-500/30 flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    Localização: Linha <span id="xml-error-loc-line" class="font-mono text-sm underline font-black">0</span>, Coluna <span id="xml-error-loc-col" class="font-mono text-sm underline font-black">0</span>
                  </span>
                  <span id="xml-error-category-badge" class="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-900 dark:bg-rose-800/50 dark:text-rose-200">
                    XML Error
                  </span>
                </div>
                <div class="mt-1 font-mono text-xs bg-slate-900 text-rose-200 p-3 rounded-lg overflow-x-auto shadow-inner border border-rose-900/40">
                  <div id="xml-error-code-preview" class="leading-relaxed"></div>
                </div>
              </div>

              <div class="p-4 rounded-xl bg-amber-50/80 border-l-4 border-amber-500 dark:bg-[#181825] dark:border-amber-400 space-y-2">
                <h4 class="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <i class="fa-solid fa-graduation-cap"></i> O que quebrou e Por Que é Inválido?
                </h4>
                <p id="xml-error-didactic-why" class="text-xs text-slate-700 dark:text-[#bac2de] leading-relaxed"></p>
              </div>

              <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-500/30 space-y-2">
                <h4 class="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <i class="fa-solid fa-screwdriver-wrench"></i> Como Corrigir Este Ponto
                </h4>
                <div id="xml-error-didactic-fix" class="text-xs text-slate-700 dark:text-[#a6adc8] leading-relaxed font-mono"></div>
              </div>
            </div>

            <!-- Seção de Sucesso XML -->
            <div id="xml-validator-success-section" class="hidden flex flex-col gap-4">
              <div class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30 flex items-center gap-3">
                <i class="fa-solid fa-shield-check text-emerald-600 dark:text-emerald-400 text-xl"></i>
                <div class="text-xs">
                  <strong class="text-emerald-900 dark:text-emerald-300 block font-bold">Documento XML 100% Bem Formado!</strong>
                  <span class="text-emerald-800 dark:text-[#a6adc8]">Raiz única, tags balanceadas e aninhadas, atributos com aspas e entidades válidas.</span>
                </div>
              </div>

              <div>
                <h4 class="text-xs font-bold text-slate-500 dark:text-[#a6adc8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <i class="fa-solid fa-chart-pie text-sky-600 dark:text-sky-400"></i> Métricas & Auditoria DOM XML
                </h4>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div class="bg-slate-50 dark:bg-[#181825] p-3 rounded-xl border border-slate-200 dark:border-[#313244]">
                    <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">Elemento Raiz</span>
                    <span id="xml-metric-root" class="text-sm font-extrabold text-sky-700 dark:text-sky-400 font-mono">&lt;turma&gt;</span>
                  </div>
                  <div class="bg-slate-50 dark:bg-[#181825] p-3 rounded-xl border border-slate-200 dark:border-[#313244]">
                    <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">Total Elementos</span>
                    <span id="xml-metric-elements" class="text-base font-extrabold text-blue-700 dark:text-blue-400 font-mono">0</span>
                  </div>
                  <div class="bg-slate-50 dark:bg-[#181825] p-3 rounded-xl border border-slate-200 dark:border-[#313244]">
                    <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">Total Atributos (@)</span>
                    <span id="xml-metric-attrs" class="text-base font-extrabold text-amber-700 dark:text-amber-400 font-mono">0</span>
                  </div>
                  <div class="bg-slate-50 dark:bg-[#181825] p-3 rounded-xl border border-slate-200 dark:border-[#313244]">
                    <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">Profundidade Máx.</span>
                    <span id="xml-metric-depth" class="text-base font-extrabold text-indigo-700 dark:text-indigo-400 font-mono">0</span>
                  </div>
                  <div class="bg-slate-50 dark:bg-[#181825] p-3 rounded-xl border border-slate-200 dark:border-[#313244]">
                    <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">Nós de Texto</span>
                    <span id="xml-metric-texts" class="text-base font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">0</span>
                  </div>
                  <div class="bg-slate-50 dark:bg-[#181825] p-3 rounded-xl border border-slate-200 dark:border-[#313244]">
                    <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">Vazios / Coment.</span>
                    <span id="xml-metric-empty" class="text-[11px] font-extrabold text-purple-700 dark:text-purple-400 font-mono">0</span>
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <h4 class="text-xs font-bold text-slate-500 dark:text-[#a6adc8] uppercase tracking-wider flex items-center justify-between">
                  <span><i class="fa-solid fa-sitemap text-sky-600 dark:text-sky-400"></i> Visualização da Árvore DOM</span>
                  <button onclick="copyCurrentXmlValidatorText()" class="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    <i class="fa-regular fa-copy"></i> Copiar XML
                  </button>
                </h4>
                <div id="xml-validator-tree-preview" class="p-3 bg-slate-50 dark:bg-[#181825] border border-slate-200 dark:border-[#313244] rounded-xl font-mono text-xs max-h-60 overflow-y-auto space-y-1.5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
}

export function initXmlModule() {
  Object.assign(window, {
    switchXmlTab,
    xmlGoToStep,
    xmlNextStep,
    xmlPrevStep,
    xmlReplayTyping,
    triggerXmlTrap,
    restoreCleanXmlCode,
    copyCurrentXmlCode,
    loadXmlValidatorPreset,
    handleXmlDragOver,
    handleXmlDragLeave,
    handleXmlFileDrop,
    handleXmlFileSelect,
    clearXmlValidatorEditor,
    formatValidatorXML,
    copyCurrentXmlValidatorText,
    runXmlValidation,
  });

  updateAllXmlViews(false);
  loadXmlValidatorPreset('valid');
}
