/**
 * Módulo 6: Desafio do Arquiteto de Dados (Simulador de Decisão Arquitetural)
 * Evolução de Sustentação (RAG Day 2) — 25 Cenários divididos em 5 Fases de Dificuldade Progressiva.
 * Interface redesenhada para alta legibilidade (Modo Claro para Projetor e Modo Escuro Catppuccin).
 * Placar Geral Unificado (Individual / Turma) e cenários embaralhados entre os 4 formatos.
 * Ordem Canônica dos Botões de Decisão: [1] CSV -> [2] POSICIONAL -> [3] JSON -> [4] XML.
 */
import { playTone } from '../../core/audio.js';

export const BREACH_MODULE_ID = 'breach';

export const BREACH_PHASES = [
  {
    phase: 1,
    title: 'Fase 1: Iniciante',
    subtitle: 'Fundamentos de Estrutura (Cenários 01 a 05)',
    badgeClass:
      'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40',
  },
  {
    phase: 2,
    title: 'Fase 2: Básico',
    subtitle: 'Regras e Contratos (Cenários 06 a 10)',
    badgeClass:
      'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/40',
  },
  {
    phase: 3,
    title: 'Fase 3: Intermediário',
    subtitle: 'Volume, Rede e Legado (Cenários 11 a 15)',
    badgeClass:
      'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/40',
  },
  {
    phase: 4,
    title: 'Fase 4: Avançado',
    subtitle: 'Casos Limítrofes e Armadilhas (Cenários 16 a 20)',
    badgeClass:
      'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40',
  },
  {
    phase: 5,
    title: 'Fase 5: Especialista',
    subtitle: 'Arquitetura de Missão Crítica (Cenários 21 a 25)',
    badgeClass:
      'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/40',
  },
];

export const BREACH_SCENARIOS = [
  // =========================================================================
  // FASE 1: INICIANTE — Fundamentos de Estrutura (Cenários 01 a 05)
  // Ordem de respostas misturada: JSON -> CSV -> XML -> POSICIONAL -> CSV
  // =========================================================================
  {
    id: 'CEN-01',
    phase: 1,
    phaseLabel: 'Nível 1 • Iniciante',
    sector: 'Aplicativo de Delivery: Painel do Pedido no Celular',
    badge: 'Comunicação Web / Mobile',
    briefing:
      'Quando o cliente abre o aplicativo no celular para acompanhar sua entrega, o aparelho solicita ao servidor os dados do pedido: nome do restaurante, valor total numérico, um indicador lógico se o entregador já saiu e uma lista com os pratos escolhidos.',
    req: 'Representar dados com hierarquia leve (um pedido contendo uma lista de pratos) e preservar tipos numéricos e lógicos sem exigir conversão manual no aplicativo.',
    lim: 'Consumo direto pelo navegador ou aplicativo móvel usando o mínimo possível de pacote de dados 4G.',
    correct: 'JSON',
    explanation:
      'O JSON (RFC 8259) é o formato padrão das APIs Web e Mobile modernas por suportar nativamente listas e objetos aninhados mantendo tipos primitivos (números, booleanos e nulos) com baixa verbosidade.',
    whyIdeal:
      'Interpretado nativamente pelo JavaScript do celular/navegador e representa a lista de pratos dentro do pedido sem repetir os dados do cliente.',
    whyOthersFail:
      'CSV e Posicional são planos e não suportam uma lista variável de pratos dentro de um único registro; XML adiciona sobrecarga desnecessária de marcação.',
  },
  {
    id: 'CEN-02',
    phase: 1,
    phaseLabel: 'Nível 1 • Iniciante',
    sector: 'Gestão Comercial: Relatório Mensal para Gerentes de Vendas',
    badge: 'Operação de Negócios',
    briefing:
      'O diretor comercial pediu uma exportação com os 500 clientes do mês contendo apenas quatro informações simples para cada um: Nome, Cidade, Telefone e Valor Comprado. Os gerentes regionais vão abrir esse arquivo diretamente em seus editores de planilha habituais.',
    req: 'Estrutura bidimensional simples (linhas e colunas) onde a primeira linha identifica o título de cada coluna.',
    lim: 'Os gerentes não possuem ferramentas técnicas e precisam abrir o arquivo com duplo-clique direto no Excel ou LibreOffice Calc.',
    correct: 'CSV',
    explanation:
      'Para dados puramente tabulares destinados a usuários de negócios, o formato CSV oferece abertura imediata em softwares de planilha com cabeçalho na primeira linha.',
    whyIdeal:
      'É universalmente reconhecido por planilhas eletrônicas e não desperdiça espaço repetindo os nomes das colunas em todas as linhas.',
    whyOthersFail:
      'Posicional exigiria configurar manualmente a régua de corte no Excel; JSON e XML são árvores hierárquicas que não abrem diretamente como tabela simples.',
  },
  {
    id: 'CEN-03',
    phase: 1,
    phaseLabel: 'Nível 1 • Iniciante',
    sector: 'Faturamento Corporativo: Autorização de Documento Fiscal',
    badge: 'Conformidade Legal',
    briefing:
      'Antes de o caminhão sair do centro de distribuição, o sistema da fábrica precisa transmitir eletronicamente os dados da operação comercial para o órgão fazendário estadual, incluindo emitente, destinatário, impostos detalhados e assinatura criptográfica embutida no próprio documento.',
    req: 'Estrutura hierárquica formal que permita validar rigorosamente o contrato de dados contra o esquema oficial do governo e anexar assinatura digital no documento.',
    lim: 'O barramento governamental rejeita qualquer formato que não suporte validação formal de esquema e assinatura digital padronizada.',
    correct: 'XML',
    explanation:
      'Todo o ecossistema de documentos fiscais eletrônicos brasileiros (NF-e, CT-e, NFS-e) baseia-se em documentos XML validados por esquemas XSD e assinados via XML-DSig.',
    whyIdeal:
      'Une hierarquia profunda, contrato estrito validado por XSD e padrão oficial de assinatura digital ICP-Brasil dentro da própria árvore do documento.',
    whyOthersFail:
      'CSV, Posicional e JSON não atendem ao protocolo normativo da SEFAZ nem ao padrão XML-DSig de assinatura fiscal.',
  },
  {
    id: 'CEN-04',
    phase: 1,
    phaseLabel: 'Nível 1 • Iniciante',
    sector: 'Tesouraria: Remessa Noturna de Títulos para Compensação',
    badge: 'Processamento Financeiro',
    briefing:
      'Todas as noites, o sistema financeiro gera um arquivo de cobrança para o banco onde cada linha deve conter rigorosamente 240 caracteres. O banco localiza o CPF e o valor do boleto contando em qual coluna numérica cada dado começa e termina.',
    req: 'Localização determinística de campos pela posição inicial e final na linha, preenchendo nomes curtos com espaços e valores com zeros.',
    lim: 'O validador bancário proíbe o uso de caracteres separadores entre os campos.',
    correct: 'POSICIONAL',
    explanation:
      'Os sistemas de compensação bancária (padrão CNAB) operam com arquivos posicionais de largura fixa, onde cada coluna pertence a um campo específico do manual.',
    whyIdeal:
      'Garante leitura ultrarrápida por fatiamento de posições fixas e comprimento exato de registro sem depender de caracteres delimitadores.',
    whyOthersFail:
      'CSV usa separadores e linhas de tamanho variável; JSON e XML usam estruturas de chaves e marcações incompatíveis com leitores posicionais.',
  },
  {
    id: 'CEN-05',
    phase: 1,
    phaseLabel: 'Nível 1 • Iniciante',
    sector: 'Secretaria Acadêmica: Migração de Diário de Classe',
    badge: 'Intercâmbio Tabular',
    briefing:
      'Um professor precisa transferir a lista de presença e notas finais de 45 alunos (`Matricula`, `Nome` e `MediaFinal`) de um sistema antigo para o portal novo. Todos os registros possuem exatamente essas 3 informações simples e tamanhos de nome variados.',
    req: 'Gerar o arquivo texto mais enxuto, direto e fácil de inspecionar visualmente em um bloco de notas sem precisar contar espaços em branco.',
    lim: 'Não há listas internas por aluno e não se deseja repetir os nomes dos campos 45 vezes no arquivo.',
    correct: 'CSV',
    explanation:
      'Quando todos os registros compartilham as mesmas colunas atômicas e têm comprimentos variados, o CSV representa a tabela com o mínimo de caracteres e máxima clareza.',
    whyIdeal:
      'Declara os nomes das colunas apenas na linha 1 e grava apenas o texto real de cada aluno separado por um delimitador.',
    whyOthersFail:
      'Posicional obrigaria a preencher espaços em cada nome até o limite máximo; JSON e XML repetiriam os rótulos dos campos em todos os 45 alunos.',
  },

  // =========================================================================
  // FASE 2: BÁSICO — Regras e Contratos (Cenários 06 a 10)
  // Ordem de respostas misturada: XML -> POSICIONAL -> CSV -> JSON -> POSICIONAL
  // =========================================================================
  {
    id: 'CEN-06',
    phase: 2,
    phaseLabel: 'Nível 2 • Básico',
    sector: 'Rede de Bibliotecas: Intercâmbio de Acervo Catalográfico',
    badge: 'Semântica Documental',
    briefing:
      'Um consórcio universitário precisa trocar arquivos de obras raras onde cada item do acervo traz metadados de controle acoplados diretamente na abertura do elemento (como código ISBN, idioma e status de conservação) separados do conteúdo textual dos capítulos e resumos.',
    req: 'Diferenciar estruturalmente metadados descritivos (acoplados ao nó) de elementos de conteúdo textual filhos, sob uma única raiz.',
    lim: 'O documento precisa distinguir letras maiúsculas de minúsculas nos nomes dos nós e fechar explicitamente cada bloco aberto.',
    correct: 'XML',
    explanation:
      'O XML é o único entre os quatro formatos que oferece distinção nativa entre Atributos (`isbn="..." idioma="pt-BR"`) e Elementos filhos de conteúdo.',
    whyIdeal:
      'Permite modelar documentos ricos em metadados editoriais mantendo regras estritas de boa formação e hierarquia.',
    whyOthersFail:
      'JSON trata tudo como propriedades chave-valor sem distinção nativa entre atributo e elemento; CSV e Posicional não possuem estrutura de árvore.',
  },
  {
    id: 'CEN-07',
    phase: 2,
    phaseLabel: 'Nível 2 • Básico',
    sector: 'Recursos Humanos: Motor de Folha de Pagamento',
    badge: 'Precisão Monetária',
    briefing:
      'O sistema contábil exige que o salário de `R$ 1.500,50` seja gravado como uma sequência pura de 10 dígitos (`0000150050`), colada imediatamente após os 11 dígitos do CPF do trabalhador, sem nenhum símbolo, ponto ou vírgula entre um dado e outro.',
    req: 'Alinhamento numérico à direita com preenchimento de zeros à esquerda e casas decimais implícitas.',
    lim: 'Qualquer caractere não numérico ou separador explícito no meio dos valores corrompe a leitura da linha.',
    correct: 'POSICIONAL',
    explanation:
      'A técnica de casas decimais implícitas (`N2`) combinada com zeros à esquerda sem separadores é o pilar dos arquivos posicionais financeiros.',
    whyIdeal:
      'Elimina qualquer ambiguidade regional entre ponto e vírgula decimal e mantém a largura exata do campo numérico.',
    whyOthersFail:
      'CSV, JSON e XML representam números decimais com caractere separador explícito (`.` ou `,`) e delimitadores sintáticos.',
  },
  {
    id: 'CEN-08',
    phase: 2,
    phaseLabel: 'Nível 2 • Básico',
    sector: 'Operador Logístico: Tabela de Entregas com Observações Livres',
    badge: 'Proteção de Texto',
    briefing:
      'Uma transportadora exporta diariamente uma tabela plana de entregas onde as colunas são separadas por ponto e vírgula. Contudo, os motoristas digitam observações como `"Bloco A; Portaria 2"` e `"Cliente pediu entrega ""urgente"""`, o que estava deslocando as colunas na importação.',
    req: 'Manter o arquivo como uma tabela simples delimitada, mas isolar com segurança textos que contenham o próprio caractere separador ou aspas.',
    lim: 'O sistema parceiro lê apenas tabelas planas compatíveis com a norma RFC 4180.',
    correct: 'CSV',
    explanation:
      'Segundo a RFC 4180 do formato CSV, campos que contêm o delimitador ou quebras de linha devem ser envolvidos por aspas duplas, e aspas internas devem ser duplicadas (`""`).',
    whyIdeal:
      'Resolve a colisão do delimitador mantendo total compatibilidade com importadores tabulares e planilhas.',
    whyOthersFail:
      'Posicional truncaria observações longas de tamanho variável; JSON e XML exigiriam alterar toda a arquitetura tabular do sistema parceiro.',
  },
  {
    id: 'CEN-09',
    phase: 2,
    phaseLabel: 'Nível 2 • Básico',
    sector: 'Marketplace Digital: Vitrine de Produtos com Grade Variável',
    badge: 'Hierarquia de Dados',
    briefing:
      'Um portal de e-commerce precisa enviar para a página Web os dados de cada calçado: nome, preço numérico, disponibilidade em estoque e duas coleções internas que variam de produto para produto: a lista de numerações disponíveis (`38`, `39`, `40`) e a lista de avaliações dos compradores.',
    req: 'Agrupar dentro de um único registro tanto atributos simples quanto listas variáveis de valores e sub-objetos.',
    lim: 'Proibido duplicar os dados principais do calçado em várias linhas apenas por causa das numerações.',
    correct: 'JSON',
    explanation:
      'O JSON modela relacionamentos 1-para-muitos naturalmente através de arrays `[]` e sub-objetos `{}` aninhados dentro do objeto principal.',
    whyIdeal:
      'Mantém cada produto como uma entidade única e pronta para renderização imediata no front-end.',
    whyOthersFail:
      'Em formatos tabulares/planos (CSV e Posicional), representar duas listas independentes no mesmo registro gera repetição de linhas ou sub-delimitadores frágeis.',
  },
  {
    id: 'CEN-10',
    phase: 2,
    phaseLabel: 'Nível 2 • Básico',
    sector: 'Conciliação Financeira: Arquivo Estruturado em Lotes Sequenciais',
    badge: 'Controle de Lote',
    briefing:
      'Em uma integração corporativa, o arquivo texto possui linhas de comprimento idêntico, mas o significado da linha muda conforme o primeiro dígito: `0` abre o arquivo, `1` abre um lote de pagamentos, `3` traz os detalhes de cada pagamento e `9` fecha o arquivo com a soma total conferida.',
    req: 'Organizar cabeçalho, detalhes e rodapé totalizador em linhas planas de tamanho fixo identificadas por código de registro na coluna inicial.',
    lim: 'Processamento estritamente sequencial sem uso de árvores de objetos nem delimitadores de coluna.',
    correct: 'POSICIONAL',
    explanation:
      'A arquitetura de registros Header (`0`), Header de Lote (`1`), Detalhe (`3`) e Trailer (`9`) é o padrão clássico de arquivos posicionais de lote.',
    whyIdeal:
      'Permite processar milhões de linhas sequencialmente com baixo uso de memória e auditar se nenhuma linha foi perdida comparando a soma com o registro Trailer.',
    whyOthersFail:
      'CSV pressupõe que todas as linhas seguem as mesmas colunas do cabeçalho; JSON e XML estruturam lotes por aninhamento e não por códigos de coluna fixa.',
  },

  // =========================================================================
  // FASE 3: INTERMEDIÁRIO — Volume, Rede e Legado (Cenários 11 a 15)
  // Ordem de respostas misturada: CSV -> JSON -> XML -> POSICIONAL -> JSON
  // =========================================================================
  {
    id: 'CEN-11',
    phase: 3,
    phaseLabel: 'Nível 3 • Intermediário',
    sector: 'Centro de Operações de Segurança: Coleta de 20 Milhões de Logs/Hora',
    badge: 'Alto Volume Tabular',
    briefing:
      'O firewall central registra 20 milhões de conexões por hora. Cada evento possui exatamente os mesmos 6 campos atômicos (`Horario`, `IP_Origem`, `IP_Destino`, `Porta`, `Protocolo`, `Status`), mas o comprimento dos IPs e portas varia bastante de linha para linha.',
    req: 'Minimizar o espaço ocupado em disco para registros homogêneos de largura variável sem repetir os nomes dos campos em cada linha.',
    lim: 'Preencher espaços em branco até o tamanho máximo de um endereço IP ou repetir nomes de chaves geraria centenas de gigabytes extras por dia.',
    correct: 'CSV',
    explanation:
      'Para grandes volumes de dados homogêneos e planos com textos de tamanhos variáveis (como IPs curtos `10.0.0.1` vs longos `192.168.100.250`), o CSV evita tanto o overhead de chaves quanto o desperdício de padding.',
    whyIdeal:
      'Grava apenas os bytes estritamente necessários de cada valor e um único caractere separador por coluna.',
    whyOthersFail:
      'Posicional desperdiçaria espaço preenchendo cada IP curto com espaços; JSON e XML multiplicariam o arquivo repetindo os 6 nomes de campos 20 milhões de vezes.',
  },
  {
    id: 'CEN-12',
    phase: 3,
    phaseLabel: 'Nível 3 • Intermediário',
    sector: 'Agrotech: Estações Meteorológicas via Rádio de Baixa Banda',
    badge: 'Telemetria & IoT',
    briefing:
      'Sensores espalhados em fazendas enviam a cada minuto um pacote de dados para uma plataforma em nuvem contendo o identificador da estação, um par de coordenadas geográficas e uma lista com as leituras de umidade em 4 profundidades diferentes do solo.',
    req: 'Suportar estrutura hierárquica (objeto de coordenadas + lista de leituras numéricas) com baixo consumo de bytes na transmissão.',
    lim: 'O link de rádio rural é lento e a bateria do sensor é limitada: repetir palavras de fechamento para cada leitura esgotaria a transmissão.',
    correct: 'JSON',
    explanation:
      'Em cenários de IoT e telemetria enviados para nuvem, o JSON combina capacidade hierárquica e tipagem numérica real (`float`) com um payload muito mais enxuto que formatos de marcação.',
    whyIdeal:
      'Representa listas numéricas e sub-objetos de localização com poucos bytes e é ingerido diretamente por bancos NoSQL e APIs em nuvem.',
    whyOthersFail:
      'XML dobraria o tamanho do pacote com tags de abertura e fechamento; CSV e Posicional não representam bem objetos + arrays em uma única mensagem.',
  },
  {
    id: 'CEN-13',
    phase: 3,
    phaseLabel: 'Nível 3 • Intermediário',
    sector: 'Rede Hospitalar: Transferência de Prontuário Clínico Eletrônico',
    badge: 'Interoperabilidade em Saúde',
    briefing:
      'Dois hospitais precisam intercambiar o histórico médico completo de um paciente. O documento combina seções estruturadas de exames, laudos narrativos contendo símbolos matemáticos (`< 5 mg/dL`, `Saturação > 98%`) e vocabulários clínicos de diferentes órgãos reguladores.',
    req: 'Suportar documentos mistos (texto rico + estrutura profunda), proteção de símbolos reservados por entidades e validação contratual rigorosa antes da aceitação clínica.',
    lim: 'Exigência de conformidade com padrões internacionais de arquitetura de documentos clínicos (HL7 CDA / TISS).',
    correct: 'XML',
    explanation:
      'Padrões clínicos normativos como HL7 CDA e TISS utilizam XML pela necessidade de combinar múltiplos vocabulários (namespaces), validação XSD estrita e conteúdo documental misto.',
    whyIdeal:
      'Garante que o prontuário siga rigorosamente o esquema médico obrigatório e protege caracteres clínicos sensíveis via entidades padronizadas.',
    whyOthersFail:
      'CSV e Posicional não comportam a árvore complexa de um prontuário; JSON não possui validação XSD nativa nem suporte a múltiplos namespaces W3C.',
  },
  {
    id: 'CEN-14',
    phase: 3,
    phaseLabel: 'Nível 3 • Intermediário',
    sector: 'Auditoria Previdenciária: Resgate de Acervo de Mainframe (1978)',
    badge: 'Arqueologia de Dados',
    briefing:
      'Uma equipe de perícia precisa extrair dados de fitas históricas gravadas em sistemas de grande porte na década de 1970. Ao abrir o arquivo bruto, observa-se um bloco contínuo de caracteres com exatas 80 colunas por linha, sem linha de títulos no topo e sem nenhum caractere separador.',
    req: 'Decodificar os registros apoiando-se exclusivamente no manual externo de posições (mapa de início, fim e tamanho de cada campo).',
    lim: 'O arquivo não é autodescritivo: qualquer tentativa de buscar separadores ou nomes de campos dentro do arquivo falhará.',
    correct: 'POSICIONAL',
    explanation:
      'Arquivos históricos de mainframes (herança direta dos cartões perfurados de 80 colunas do COBOL) são puramente posicionais e dependem 100% do documento de Layout externo.',
    whyIdeal:
      'Reflete exatamente o mapeamento físico de memória de tamanho fixo utilizado pelos sistemas de grande porte.',
    whyOthersFail:
      'Sem separadores, chaves ou marcações no texto bruto, parsers de CSV, JSON ou XML são incapazes de distinguir onde termina o nome e começa o valor.',
  },
  {
    id: 'CEN-15',
    phase: 3,
    phaseLabel: 'Nível 3 • Intermediário',
    sector: 'Super-App Financeiro: Orquestração de Checkout entre Microsserviços',
    badge: 'Arquitetura Distribuída',
    briefing:
      'No momento em que o usuário confirma uma compra, o aplicativo dispara uma requisição HTTPS para o motor de antifraude contendo dados do comprador, endereço de cobrança, indicador se usa cupom (`null` quando ausente) e a árvore de itens e opcionais do carrinho.',
    req: 'Representar árvores de objetos com distinção explícita entre valor ausente (`null`), texto vazio (`""`), booleano e número.',
    lim: 'Comunicação síncrona REST de baixa latência entre serviços escritos em linguagens diferentes.',
    correct: 'JSON',
    explanation:
      'A comunicação entre microsserviços modernos depende de payloads hierárquicos leves que diferenciem nativamente `null`, `false`, `0` e `""` sem depender de schemas externos.',
    whyIdeal:
      'Serialização e desserialização ultrarrápida em qualquer linguagem moderna com fidelidade imediata de tipos primitivos.',
    whyOthersFail:
      'No CSV e Posicional não há distinção nativa entre nulo e vazio nem suporte a árvores; no XML tudo é texto bruto a menos que um esquema XSD seja processado junto.',
  },

  // =========================================================================
  // FASE 4: AVANÇADO — Casos Limítrofes e Armadilhas (Cenários 16 a 20)
  // Ordem de respostas misturada: POSICIONAL -> JSON -> CSV -> XML -> CSV
  // =========================================================================
  {
    id: 'CEN-16',
    phase: 4,
    phaseLabel: 'Nível 4 • Avançado',
    sector: 'Automação Industrial: Catraca Embarcada com Apenas 2 KB de RAM',
    badge: 'Restrição Extrema de Hardware',
    briefing:
      'Um microcontrolador industrial com apenas 2 KB de memória RAM precisa consultar um arquivo de 100.000 crachás no cartão SD e pular instantaneamente para o registro número `50.000` calculando o byte exato no disco (`50000 * 49 bytes`), sem ler as 49.999 linhas anteriores.',
    req: 'Permitir acesso direto por deslocamento matemático de bytes (`seek` $O(1)$) garantindo que absolutamente todos os registros tenham o mesmo tamanho físico.',
    lim: 'O hardware não possui memória nem processamento para varrer o arquivo desde o início procurando quebras de linha variáveis.',
    correct: 'POSICIONAL',
    explanation:
      'Como cada linha de um arquivo Posicional possui comprimento rigorosamente constante em bytes, o sistema operacional ou microcontrolador pode calcular o endereço exato de qualquer linha $k$ multiplicando $k \\times \\text{largura}$.',
    whyIdeal:
      'É o único dos quatro formatos de texto que viabiliza busca direta por byte offset sem leitura sequencial prévia.',
    whyOthersFail:
      'Em CSV, JSON e XML os registros têm comprimentos variáveis, tornando impossível saber em qual byte começa o registro 50.000 sem ler todos os anteriores.',
  },
  {
    id: 'CEN-17',
    phase: 4,
    phaseLabel: 'Nível 4 • Avançado',
    sector: 'Plataforma SaaS: Motor de Regras com Configurações Polimórficas',
    badge: 'Esquema Dinâmico',
    briefing:
      'Em um sistema de automação, cada cliente cria gatilhos com propriedades totalmente diferentes: o Cliente A configura apenas tentativas e tempo de espera, enquanto o Cliente B configura cabeçalhos de autenticação aninhados, listas de e-mails de alerta e filtros condicionais.',
    req: 'Armazenar e transmitir configurações onde cada registro possui uma estrutura de campos e níveis de profundidade completamente diferente.',
    lim: 'Impossível definir colunas fixas previamente, pois novas propriedades aninhadas são criadas dinamicamente pelos usuários.',
    correct: 'JSON',
    explanation:
      'Cenários *schema-less* (sem esquema fixo) onde cada documento possui atributos e sub-estruturas polimórficas são o caso de uso clássico do JSON.',
    whyIdeal:
      'Adapta-se dinamicamente a qualquer combinação de objetos e listas sem exigir migração de colunas nem verbosidade excessiva.',
    whyOthersFail:
      'CSV e Posicional exigem que todos os registros obedeçam às mesmas colunas tabulares; XML adicionaria complexidade desnecessária para objetos dinâmicos de aplicação.',
  },
  {
    id: 'CEN-18',
    phase: 4,
    phaseLabel: 'Nível 4 • Avançado',
    sector: 'Auditoria de Dados: O Mistério da Linha com Colunas Fantasmas',
    badge: 'Diagnóstico Forense',
    briefing:
      'Durante uma importação de preços no Brasil, o sistema rejeitou o arquivo acusando que a linha `101,Teclado,125,90,Ativo` possuía 5 colunas quando o cabeçalho declarava apenas 4 (`Codigo,Produto,Preco,Status`). Qual formato está sendo utilizado e sofreu colisão entre o separador de colunas e a vírgula decimal brasileira?',
    req: 'Identificar o formato delimitado vulnerável à colisão da vírgula decimal (`125,90`) quando não se usa ponto e vírgula ou qualificadores de aspas.',
    lim: 'Manter a simplicidade tabular corrigindo a convenção regional do separador.',
    correct: 'CSV',
    explanation:
      'No Brasil, usar a vírgula `,` como separador de um arquivo CSV sem proteger valores decimais como `125,90` entre aspas faz o parser enxergar a vírgula do preço como uma nova coluna (`125` e `90`).',
    whyIdeal:
      'Reconhecer essa armadilha permite corrigir o pipeline adotando o padrão brasileiro de CSV separado por ponto e vírgula (`;`).',
    whyOthersFail:
      'Posicional não usa separadores nem vírgula explícita; JSON exige ponto decimal (`.`) por norma da RFC 8259; XML delimita cada campo por tags.',
  },
  {
    id: 'CEN-19',
    phase: 4,
    phaseLabel: 'Nível 4 • Avançado',
    sector: 'Cartório Digital: Contrato Eletrônico com Assinaturas Parciais',
    badge: 'Segurança & Multi-Vocabulário',
    briefing:
      'Um contrato imobiliário digital reúne no mesmo arquivo normas técnicas da Receita Federal e do Registro de Imóveis (que usam campos com o mesmo nome `codigo`, mas significados distintos). Além disso, o comprador assina digitalmente apenas o bloco de cláusulas e o tabelião assina o bloco de selo notarial.',
    req: 'Evitar colisão de nomes entre padrões de órgãos diferentes usando prefixos de vocabulário (Namespaces) e assinar sub-nós específicos da árvore.',
    lim: 'Necessidade jurídica de validação formal contra dois esquemas oficiais distintos no mesmo documento.',
    correct: 'XML',
    explanation:
      'O suporte a múltiplos Namespaces (`xmlns:rfb` e `xmlns:ri`) e a assinatura criptográfica de sub-árvores específicas (XML-DSig) são recursos nativos da família de especificações XML da W3C.',
    whyIdeal:
      'Resolve colisões de vocabulário sem renomear tags oficiais e garante validade jurídica para assinaturas parciais ou múltiplas no mesmo arquivo.',
    whyOthersFail:
      'JSON, CSV e Posicional não possuem o mecanismo nativo de Namespaces W3C nem validação combinada de múltiplos esquemas XSD.',
  },
  {
    id: 'CEN-20',
    phase: 4,
    phaseLabel: 'Nível 4 • Avançado',
    sector: 'Pipeline de Ciência de Dados: Matriz de Treinamento com CEPs',
    badge: 'Engenharia de Features',
    briefing:
      'Cientistas de dados precisam compartilhar um dataset tabular de 800.000 imóveis contendo cabeçalho descritivo das 15 variáveis estatísticas e códigos postais iniciados em zero (`01310100`) para leitura rápida em bibliotecas analíticas (como Pandas e R).',
    req: 'Formato tabular universal com nomes de colunas na primeira linha, altíssima velocidade de leitura vetorizada e excelente taxa de compressão.',
    lim: 'Alertar os analistas para lerem o código postal como texto no script, evitando que softwares de planilha removam o zero à esquerda.',
    correct: 'CSV',
    explanation:
      'No ecossistema de Data Science, o CSV é o padrão universal para matrizes tabulares de features por unir cabeçalho autodescritivo na linha 1 com leitura sequencial rápida em memória.',
    whyIdeal:
      'Combina legibilidade humana, nomes das variáveis na primeira linha e suporte nativo em todas as ferramentas de estatística e Machine Learning.',
    whyOthersFail:
      'Posicional não carrega os nomes das variáveis no arquivo; JSON e XML geram alto custo de CPU e memória RAM para converter 800.000 árvores em matriz tabular.',
  },

  // =========================================================================
  // FASE 5: ESPECIALISTA — Arquitetura de Missão Crítica (Cenários 21 a 25)
  // Ordem de respostas misturada: XML -> CSV -> POSICIONAL -> JSON -> POSICIONAL
  // =========================================================================
  {
    id: 'CEN-21',
    phase: 5,
    phaseLabel: 'Nível 5 • Especialista',
    sector: 'Comércio Exterior: Despacho Aduaneiro entre 15 Países',
    badge: 'Governança Internacional',
    briefing:
      'Um barramento governamental de importação e exportação precisa receber declarações de carga de 15 países, aplicar uma folha de transformação estrutural padronizada para converter o documento ao modelo nacional e rejeitar qualquer arquivo que contenha um caractere `&` solto não escapado na razão social.',
    req: 'Suportar transformação declarativa entre árvores documentais (XSLT), consultas por caminho estrutural e validação contratual rígida.',
    lim: 'Tolerância zero a erros de boa formação: qualquer símbolo reservado sem escape formal deve abortar a recepção.',
    correct: 'XML',
    explanation:
      'Integrações internacionais aduaneiras e governamentais apoiam-se no ecossistema XML completo: validação por XSD, transformação estrutural via XSLT e rigor léxico com entidades (`&amp;`, `&lt;`).',
    whyIdeal:
      'Permite auditar contratos complexos e transformar árvores documentais entre normas internacionais usando padrões abertos W3C.',
    whyOthersFail:
      'CSV, Posicional e JSON não possuem motor nativo de transformação XSLT nem o rigor de validação multi-esquema exigido pelo barramento aduaneiro.',
  },
  {
    id: 'CEN-22',
    phase: 5,
    phaseLabel: 'Nível 5 • Especialista',
    sector: 'Benchmark de Arquitetura: O Teste de Economia de Bytes em Tabelas',
    badge: 'Análise de Trade-Off',
    briefing:
      'Ao exportar a mesma base tabular de 100.000 cidadãos nos quatro formatos, a equipe mediu o tamanho final: o 1º formato ocupou 14 MB; o 2º ocupou 9,2 MB; o 3º ocupou exatos 2,4 MB (24 bytes fixos por linha); e o 4º formato ocupou apenas 1,7 MB porque a maioria dos nomes era curta ("Ana", "Lia", "Ivo") e não precisou reservar espaços em branco.',
    req: 'Identificar qual formato alcança a menor pegada em bytes quando os dados são tabulares e os textos têm comprimento médio bem inferior ao limite máximo.',
    lim: 'Preservar a primeira linha com o nome das colunas e usar apenas um caractere separador entre os campos.',
    correct: 'CSV',
    explanation:
      'Enquanto o Posicional reserva sempre a largura máxima da coluna (gastando espaços em branco em nomes curtos), o CSV grava apenas os caracteres reais seguidos do delimitador.',
    whyIdeal:
      'Entrega a menor quantidade total de bytes para dados tabulares com textos curtos/variáveis, mantendo o cabeçalho na linha 1.',
    whyOthersFail:
      'Posicional paga o preço do padding fixo em todas as linhas; JSON e XML repetem os nomes das colunas 100.000 vezes.',
  },
  {
    id: 'CEN-23',
    phase: 5,
    phaseLabel: 'Nível 5 • Especialista',
    sector: 'Câmara de Liquidação Interbancária: Janela Noturna de 50 Milhões de Lançamentos',
    badge: 'Missão Crítica & Throughput',
    briefing:
      'Na janela da madrugada, a câmara de compensação entre bancos precisa liquidar 50 milhões de transações em menos de 20 minutos. O motor em baixo nível exige tamanho de linha 100% previsível, validação de lotes e zero custo de varredura procurando aspas ou caracteres separadores.',
    req: 'Garantir fatiamento determinístico por endereço fixo de memória e validação física imediata do arquivo pelo seu tamanho total em bytes.',
    lim: 'Proibido qualquer custo computacional de busca por delimitadores, abertura de chaves ou fechamento de nós.',
    correct: 'POSICIONAL',
    explanation:
      'Nos núcleos de compensação financeira de altíssimo volume, o formato Posicional elimina a análise léxica de delimitadores: cada campo é extraído por offset constante de memória.',
    whyIdeal:
      'Máximo desempenho de leitura sequencial e paralela em lote, com auditoria contábil embutida nos registros de controle Header e Trailer.',
    whyOthersFail:
      'CSV, JSON e XML obrigam o processador a inspecionar caractere por caractere para descobrir onde cada campo ou estrutura termina.',
  },
  {
    id: 'CEN-24',
    phase: 5,
    phaseLabel: 'Nível 5 • Especialista',
    sector: 'Barramento de Eventos Cloud: Mensageria Assíncrona Polimórfica',
    badge: 'Arquitetura Orientada a Eventos',
    briefing:
      'Em uma plataforma global de streaming, os microsserviços publicam eventos em tempo real contendo um envelope fixo (`idEvento`, `timestamp`, `origem`) e um bloco interno `dados` cuja estrutura muda radicalmente conforme o evento (`AssinaturaCriada`, `VideoAssistido`, `FaturaEstornada`).',
    req: 'Formato autodescritivo, leve em rede, que suporte objetos polimórficos aninhados e seja consumido nativamente por serviços em Go, Python, Node.js e navegadores.',
    lim: 'Agilidade de evolução de schema (adicionar novos campos opcionais no evento sem quebrar consumidores existentes).',
    correct: 'JSON',
    explanation:
      'Em arquiteturas orientadas a eventos (Event-Driven Architecture) e Webhooks modernos, o JSON é o padrão de fato por permitir envelopes padronizados com cargas (`payloads`) internas flexíveis e tipadas.',
    whyIdeal:
      'Permite evoluir propriedades do evento sem quebrar leitores por posição fixa e mantém excelente equilíbrio entre legibilidade e tamanho de rede.',
    whyOthersFail:
      'Posicional quebraria qualquer consumidor ao adicionar 1 byte no meio do registro; CSV não modela envelopes com sub-objetos variáveis; XML aumenta a latência e o volume de tráfego.',
  },
  {
    id: 'CEN-25',
    phase: 5,
    phaseLabel: 'Nível 5 • Especialista',
    sector: 'Perícia Forense do Conselho: O Colapso em Cascata na Linha 4.812',
    badge: 'Desafio Final do Arquiteto',
    briefing:
      'Uma falha grave interrompeu o processamento noturno na linha 4.812: o nome de um cliente foi gravado com 21 letras em vez do limite contratual de 20. Como resultado, a 21ª letra invadiu a 1ª casa do documento, o valor monetário foi lido deslocado em uma casa (multiplicando a dívida por 10!) e a data virou texto inválido.',
    req: 'Diagnosticar qual formato de arquivo sofre o "Efeito Cascata de Deslocamento" quando um único campo ultrapassa ou fica abaixo da largura contratada.',
    lim: 'Ausência absoluta de caracteres delimitadores ou rótulos internos para reancorar a leitura dos campos seguintes.',
    correct: 'POSICIONAL',
    explanation:
      'O "Efeito Cascata" é a falha estrutural clássica dos Arquivos Posicionais: como as fronteiras entre colunas são puramente matemáticas, 1 caractere a mais ou a menos desloca todos os campos subsequentes daquela linha.',
    whyIdeal:
      'Dominar esse diagnóstico permite ao Arquiteto de Dados identificar imediatamente erros de falta de truncamento ou padding em integrações legadas e bancárias.',
    whyOthersFail:
      'No CSV o separador `;` preserva o alinhamento das colunas seguintes; no JSON e no XML cada campo é isolado por sua própria chave ou tag.',
  },
];

const breachState = {
  roundIndex: 0,
  totalRounds: BREACH_SCENARIOS.length,
  timerDuration: 0, // 0 = Modo Estudo (Sem Tempo) por padrão; opções: 0, 15, 20, 30
  timeRemaining: 0,
  timerInterval: null,
  isPaused: false,
  isAnswered: false,
  score: 0,
  streak: 0,
  maxStreak: 0,
  correctCount: 0,
  answeredCount: 0,
  bonusClaimedThisRound: false,
};

export function getBreachState() {
  return breachState;
}

export function stopBreachTimer() {
  if (breachState.timerInterval) {
    clearInterval(breachState.timerInterval);
    breachState.timerInterval = null;
  }
}

function startBreachCountdown() {
  stopBreachTimer();
  updateBreachTimerUI();

  if (breachState.timerDuration <= 0 || breachState.isAnswered || breachState.isPaused) {
    return;
  }

  breachState.timerInterval = setInterval(() => {
    const section = document.getElementById('module-breach');
    if (!section || section.classList.contains('hidden')) {
      stopBreachTimer();
      return;
    }

    breachState.timeRemaining--;
    updateBreachTimerUI();

    if (breachState.timeRemaining <= 5 && breachState.timeRemaining > 0) {
      playTone('A5');
    }

    if (breachState.timeRemaining <= 0) {
      stopBreachTimer();
      handleBreachTimeout();
    }
  }, 1000);
}

function updateBreachTimerUI() {
  const numEl = document.getElementById('breach-timer-number');
  const statusEl = document.getElementById('breach-timer-status');
  const pauseBtn = document.getElementById('breach-btn-pause');

  if (!numEl || !statusEl) return;

  if (breachState.timerDuration <= 0) {
    numEl.textContent = 'Livre';
    numEl.className =
      'font-mono text-lg sm:text-xl font-extrabold text-indigo-600 dark:text-indigo-400';
    statusEl.textContent = 'Modo Estudo (Sem Pressão)';
    if (pauseBtn) pauseBtn.classList.add('hidden');
    return;
  }

  if (pauseBtn) {
    pauseBtn.classList.remove('hidden');
    pauseBtn.innerHTML = breachState.isPaused
      ? '<i class="fa-solid fa-play mr-1"></i>Retomar'
      : '<i class="fa-solid fa-pause mr-1"></i>Pausar';
  }

  numEl.textContent = `${breachState.timeRemaining}s`;
  statusEl.textContent = breachState.isPaused ? 'Cronômetro Pausado' : 'Tempo Restante';

  const fraction = breachState.timeRemaining / breachState.timerDuration;
  if (fraction > 0.5) {
    numEl.className =
      'font-mono text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400';
  } else if (fraction > 0.25) {
    numEl.className =
      'font-mono text-lg sm:text-xl font-extrabold text-amber-600 dark:text-amber-400';
  } else {
    numEl.className =
      'font-mono text-lg sm:text-xl font-extrabold text-rose-600 dark:text-rose-400 animate-pulse';
  }
}

function renderBreachScoreAndPhasesUI() {
  const lblScore = document.getElementById('breach-lbl-score');
  const lblRound = document.getElementById('breach-lbl-round');
  const lblStreak = document.getElementById('breach-lbl-streak');
  const lblAccuracy = document.getElementById('breach-lbl-accuracy');
  const phasesNav = document.getElementById('breach-phases-nav');

  const currentScenario = BREACH_SCENARIOS[breachState.roundIndex] || BREACH_SCENARIOS[0];
  const currentPhaseNum = currentScenario.phase;

  if (phasesNav) {
    phasesNav.innerHTML = BREACH_PHASES.map((p) => {
      const isCurrent = p.phase === currentPhaseNum;
      const startScenarioIdx = (p.phase - 1) * 5;
      return `
      <button
        onclick="jumpToBreachPhase(${p.phase})"
        class="flex-1 min-w-[140px] p-2.5 rounded-xl border text-left transition ${
          isCurrent
            ? `${p.badgeClass} border-2 shadow-sm`
            : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200 dark:bg-[#181825] dark:hover:bg-[#313244]/60 dark:text-[#a6adc8] dark:border-[#313244]'
        }"
      >
        <div class="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider">
          <span>${p.title}</span>
          <span class="font-mono text-[10px] opacity-80">#${startScenarioIdx + 1}–${startScenarioIdx + 5}</span>
        </div>
        <div class="text-[11px] font-medium mt-0.5 truncate opacity-90">${p.subtitle}</div>
      </button>`;
    }).join('');
  }

  if (lblScore) {
    lblScore.textContent = `${breachState.score} pts`;
  }
  if (lblRound) {
    lblRound.textContent = `${breachState.roundIndex + 1} / ${breachState.totalRounds}`;
  }
  if (lblStreak) {
    lblStreak.textContent = `${breachState.streak}x`;
  }
  if (lblAccuracy) {
    const pct =
      breachState.answeredCount > 0
        ? Math.round((breachState.correctCount / breachState.answeredCount) * 100)
        : 0;
    lblAccuracy.textContent = `${breachState.correctCount}/${breachState.answeredCount} (${pct}%)`;
  }
}

export function loadBreachScenario(index) {
  stopBreachTimer();

  const cardEl = document.getElementById('breach-incident-card');
  const debriefEl = document.getElementById('breach-debriefing-screen');

  if (index >= breachState.totalRounds) {
    showBreachDebriefing();
    return;
  }

  if (cardEl) cardEl.classList.remove('hidden');
  if (debriefEl) debriefEl.classList.add('hidden');

  breachState.roundIndex = Math.max(0, Math.min(breachState.totalRounds - 1, index));
  const scenario = BREACH_SCENARIOS[breachState.roundIndex];
  const phaseObj = BREACH_PHASES[scenario.phase - 1] || BREACH_PHASES[0];

  breachState.isAnswered = false;
  breachState.isPaused = false;
  breachState.bonusClaimedThisRound = false;
  breachState.timeRemaining = breachState.timerDuration;

  const phaseBadgeEl = document.getElementById('breach-phase-badge');
  const sectorBadgeEl = document.getElementById('breach-sector-badge');
  const codeEl = document.getElementById('breach-incident-code');
  const titleEl = document.getElementById('breach-incident-sector');
  const briefingEl = document.getElementById('breach-incident-briefing');
  const reqEl = document.getElementById('breach-constraint-req');
  const limEl = document.getElementById('breach-constraint-lim');
  const resBox = document.getElementById('breach-resolution-box');
  const bonusBtn = document.getElementById('breach-btn-pitch-bonus');

  if (phaseBadgeEl) {
    phaseBadgeEl.className = `px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${phaseObj.badgeClass}`;
    phaseBadgeEl.textContent = `${scenario.phaseLabel} (Cenário ${breachState.roundIndex + 1} de 25)`;
  }
  if (sectorBadgeEl) sectorBadgeEl.textContent = scenario.badge;
  if (codeEl) codeEl.textContent = `#${scenario.id}`;
  if (titleEl) titleEl.textContent = scenario.sector;
  if (briefingEl) briefingEl.textContent = scenario.briefing;
  if (reqEl) reqEl.textContent = scenario.req;
  if (limEl) limEl.textContent = scenario.lim;

  if (resBox) resBox.classList.add('hidden');
  if (bonusBtn) {
    bonusBtn.disabled = false;
    bonusBtn.className =
      'px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 dark:text-amber-300 dark:border-amber-500/40 text-xs font-bold transition flex items-center gap-1.5 shadow-sm';
    bonusBtn.innerHTML =
      '<i class="fa-solid fa-star text-amber-500"></i><span>+10 pts (Justificativa Técnica / Pitch)</span>';
  }

  document.querySelectorAll('.breach-decision-btn').forEach((btn) => {
    btn.disabled = false;
    btn.className =
      'breach-decision-btn group p-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/50 dark:border-[#313244] dark:bg-[#181825] dark:hover:border-indigo-400 dark:hover:bg-indigo-500/10 text-left transition-all shadow-sm';
  });

  renderBreachScoreAndPhasesUI();
  startBreachCountdown();
}

export function handleBreachDecision(chosenFormat) {
  if (breachState.isAnswered) return;
  breachState.isAnswered = true;
  stopBreachTimer();

  const scenario = BREACH_SCENARIOS[breachState.roundIndex];
  const isCorrect = chosenFormat === scenario.correct;

  breachState.answeredCount++;
  // Pontuação escalonada por fase: Fase 1 = 10 pts, Fase 2 = 15 pts, Fase 3 = 20 pts, Fase 4 = 25 pts, Fase 5 = 30 pts
  const phasePoints = scenario.phase * 5 + 5;

  document.querySelectorAll('.breach-decision-btn').forEach((btn) => {
    btn.disabled = true;
    const fmt = btn.getAttribute('data-breach-format');
    if (fmt === scenario.correct) {
      btn.className =
        'breach-decision-btn p-4 rounded-2xl border-2 border-emerald-600 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-500/20 text-left transition-all shadow-md ring-2 ring-emerald-500/30';
    } else if (fmt === chosenFormat && !isCorrect) {
      btn.className =
        'breach-decision-btn p-4 rounded-2xl border-2 border-rose-600 bg-rose-50 dark:border-rose-400 dark:bg-rose-500/20 text-left transition-all opacity-90';
    } else {
      btn.className =
        'breach-decision-btn p-4 rounded-2xl border border-slate-200 bg-slate-100 dark:border-[#313244] dark:bg-[#11111b] text-left opacity-45';
    }
  });

  if (isCorrect) {
    playTone('C5');
    breachState.streak++;
    if (breachState.streak > breachState.maxStreak) {
      breachState.maxStreak = breachState.streak;
    }
    breachState.correctCount++;
    breachState.score += phasePoints;
    showBreachResolution(
      true,
      `Decisão Aprovada! (+${phasePoints} pts • Formato Ideal: ${scenario.correct})`
    );
  } else {
    playTone('C2');
    breachState.streak = 0;
    showBreachResolution(
      false,
      `Incompatibilidade Arquitetural! Você escolheu ${chosenFormat}, mas o formato ideal é ${scenario.correct}.`
    );
  }

  renderBreachScoreAndPhasesUI();
}

function handleBreachTimeout() {
  if (breachState.isAnswered) return;
  breachState.isAnswered = true;
  breachState.answeredCount++;
  breachState.streak = 0;
  playTone('C2');

  const scenario = BREACH_SCENARIOS[breachState.roundIndex];

  document.querySelectorAll('.breach-decision-btn').forEach((btn) => {
    btn.disabled = true;
    const fmt = btn.getAttribute('data-breach-format');
    if (fmt === scenario.correct) {
      btn.className =
        'breach-decision-btn p-4 rounded-2xl border-2 border-emerald-600 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-500/20 text-left transition-all shadow-md';
    } else {
      btn.className =
        'breach-decision-btn p-4 rounded-2xl border border-slate-200 bg-slate-100 dark:border-[#313244] dark:bg-[#11111b] text-left opacity-45';
    }
  });

  showBreachResolution(
    false,
    `Tempo Esgotado! O formato ideal para este cenário era ${scenario.correct}.`
  );
  renderBreachScoreAndPhasesUI();
}

function showBreachResolution(isCorrect, titleMessage) {
  const scenario = BREACH_SCENARIOS[breachState.roundIndex];
  const resBox = document.getElementById('breach-resolution-box');
  const badge = document.getElementById('breach-resolution-badge');
  const title = document.getElementById('breach-resolution-title');
  const exp = document.getElementById('breach-resolution-explanation');
  const whyIdeal = document.getElementById('breach-resolution-why-ideal');
  const whyFail = document.getElementById('breach-resolution-why-fail');

  if (!resBox) return;
  resBox.classList.remove('hidden');

  if (badge) {
    badge.className = isCorrect
      ? 'px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40'
      : 'px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/40';
    badge.textContent = isCorrect ? 'Arquitetura Validada' : 'Decisão Rejeitada';
  }

  if (title) title.textContent = titleMessage;
  if (exp) exp.textContent = scenario.explanation;
  if (whyIdeal) whyIdeal.textContent = scenario.whyIdeal;
  if (whyFail) whyFail.textContent = scenario.whyOthersFail;
}

export function advanceBreachNextRound() {
  const nextIdx = breachState.roundIndex + 1;
  loadBreachScenario(nextIdx);
}

export function prevBreachRound() {
  if (breachState.roundIndex <= 0) return;
  loadBreachScenario(breachState.roundIndex - 1);
}

export function jumpToBreachPhase(phaseNumber) {
  const targetIdx = Math.max(0, Math.min(24, (phaseNumber - 1) * 5));
  playTone('E5');
  loadBreachScenario(targetIdx);
}

export function awardBreachPitchBonus() {
  if (breachState.bonusClaimedThisRound) return;
  breachState.bonusClaimedThisRound = true;
  playTone('G5');

  breachState.score += 10;

  const bonusBtn = document.getElementById('breach-btn-pitch-bonus');
  if (bonusBtn) {
    bonusBtn.disabled = true;
    bonusBtn.className =
      'px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 opacity-80 cursor-not-allowed';
    bonusBtn.innerHTML =
      '<i class="fa-solid fa-check"></i><span>+10 pts adicionados ao Placar Geral!</span>';
  }
  renderBreachScoreAndPhasesUI();
}

export function setBreachTimerDuration(seconds) {
  breachState.timerDuration = Number(seconds) || 0;
  breachState.isPaused = false;

  document.querySelectorAll('.breach-timer-opt').forEach((btn) => {
    const val = Number(btn.getAttribute('data-breach-duration'));
    if (val === breachState.timerDuration) {
      btn.className =
        'breach-timer-opt px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs transition shadow-sm';
    } else {
      btn.className =
        'breach-timer-opt px-2.5 py-1 rounded-lg text-slate-600 hover:bg-slate-200 dark:text-[#cdd6f4] dark:hover:bg-[#313244] font-semibold text-xs transition';
    }
  });

  if (!breachState.isAnswered) {
    breachState.timeRemaining = breachState.timerDuration;
    startBreachCountdown();
  }
}

export function toggleBreachPause() {
  if (breachState.timerDuration <= 0 || breachState.isAnswered) return;
  breachState.isPaused = !breachState.isPaused;
  if (breachState.isPaused) {
    stopBreachTimer();
    updateBreachTimerUI();
  } else {
    startBreachCountdown();
  }
}

export function resetBreachGame() {
  stopBreachTimer();
  breachState.roundIndex = 0;
  breachState.score = 0;
  breachState.streak = 0;
  breachState.maxStreak = 0;
  breachState.correctCount = 0;
  breachState.answeredCount = 0;
  playTone('D5');
  loadBreachScenario(0);
}

function showBreachDebriefing() {
  stopBreachTimer();
  const cardEl = document.getElementById('breach-incident-card');
  const debriefEl = document.getElementById('breach-debriefing-screen');
  const listEl = document.getElementById('breach-final-scores-list');
  const summaryEl = document.getElementById('breach-final-summary');

  if (cardEl) cardEl.classList.add('hidden');
  if (debriefEl) debriefEl.classList.remove('hidden');
  playTone('G5');

  const pct =
    breachState.answeredCount > 0
      ? Math.round((breachState.correctCount / breachState.answeredCount) * 100)
      : 0;

  let architectRank = 'Arquiteto em Formação';
  if (pct >= 90) architectRank = 'Arquiteto Principal de Dados (Nível Especialista)';
  else if (pct >= 75) architectRank = 'Arquiteto Sênior de Dados';
  else if (pct >= 55) architectRank = 'Arquiteto Pleno de Sistemas';

  if (summaryEl) {
    summaryEl.textContent = `Você concluiu a trilha de 25 cenários nas 5 fases de dificuldade com classificação "${architectRank}".`;
  }

  if (listEl) {
    listEl.innerHTML = `
      <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#181825] border border-slate-200 dark:border-[#313244] flex items-center justify-between">
        <div>
          <div class="text-xs text-slate-500 dark:text-[#a6adc8] font-bold uppercase">Pontuação Geral</div>
          <div class="font-extrabold text-slate-900 dark:text-white text-sm mt-0.5">Placar Acumulado</div>
        </div>
        <div class="text-right">
          <span class="font-mono font-extrabold text-2xl text-indigo-600 dark:text-indigo-400">${breachState.score}</span>
          <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">pontos</span>
        </div>
      </div>
      <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#181825] border border-slate-200 dark:border-[#313244] flex items-center justify-between">
        <div>
          <div class="text-xs text-slate-500 dark:text-[#a6adc8] font-bold uppercase">Precisão Arquitetural</div>
          <div class="font-extrabold text-slate-900 dark:text-white text-sm mt-0.5">Decisões Corretas</div>
        </div>
        <div class="text-right">
          <span class="font-mono font-extrabold text-2xl text-emerald-600 dark:text-emerald-400">${breachState.correctCount}/${breachState.answeredCount}</span>
          <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">${pct}% de acerto</span>
        </div>
      </div>
    `;
  }
}

export function handleBreachKeydown(e) {
  const key = e.key.toUpperCase();
  if (!breachState.isAnswered) {
    if (key === '1' || key === 'C') handleBreachDecision('CSV');
    else if (key === '2' || key === 'P') handleBreachDecision('POSICIONAL');
    else if (key === '3' || key === 'J') handleBreachDecision('JSON');
    else if (key === '4' || key === 'X') handleBreachDecision('XML');
  } else {
    if (e.key === 'Enter' || e.key === 'ArrowRight') {
      e.preventDefault();
      advanceBreachNextRound();
    } else if (key === 'B' && !breachState.bonusClaimedThisRound) {
      awardBreachPitchBonus();
    }
  }
}

export function refreshBreachTheme() {
  renderBreachScoreAndPhasesUI();
}

export function getBreachModuleHtml() {
  return `
  <section id="module-breach" class="hidden flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 space-y-5">
    <!-- Cabeçalho Limpo e Legível do Módulo 6 -->
    <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-4 sm:p-5 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div class="flex items-start sm:items-center gap-3">
        <div class="w-11 h-11 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center justify-center text-xl shrink-0">
          <i class="fa-solid fa-shield-halved"></i>
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300">
              Módulo 6 • Simulador de Decisão Arquitetural
            </span>
            <span class="text-[11px] font-mono text-slate-500 dark:text-[#a6adc8]">
              25 Cenários Reais • 5 Fases de Dificuldade
            </span>
          </div>
          <h2 class="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
            Desafio do Arquiteto de Dados: Qual Formato Salva o Pipeline?
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-[#a6adc8]">
            Analise o dilema de negócio, o requisito e a restrição técnica de cada incidente e escolha o formato ideal (<strong>CSV</strong>, <strong>Posicional</strong>, <strong>JSON</strong> ou <strong>XML</strong>).
          </p>
        </div>
      </div>

      <!-- Controles de Tempo e Reinício -->
      <div class="flex flex-wrap items-center gap-2 shrink-0">
        <div class="flex items-center gap-1 bg-slate-100 dark:bg-[#181825] border border-slate-200 dark:border-[#313244] rounded-xl p-1">
          <span class="text-[11px] font-bold text-slate-500 dark:text-[#a6adc8] px-2">Tempo:</span>
          <button data-breach-duration="0" onclick="setBreachTimerDuration(0)" class="breach-timer-opt px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs transition shadow-sm">
            Sem Tempo
          </button>
          <button data-breach-duration="15" onclick="setBreachTimerDuration(15)" class="breach-timer-opt px-2.5 py-1 rounded-lg text-slate-600 hover:bg-slate-200 dark:text-[#cdd6f4] dark:hover:bg-[#313244] font-semibold text-xs transition">
            15s
          </button>
          <button data-breach-duration="20" onclick="setBreachTimerDuration(20)" class="breach-timer-opt px-2.5 py-1 rounded-lg text-slate-600 hover:bg-slate-200 dark:text-[#cdd6f4] dark:hover:bg-[#313244] font-semibold text-xs transition">
            20s
          </button>
          <button data-breach-duration="30" onclick="setBreachTimerDuration(30)" class="breach-timer-opt px-2.5 py-1 rounded-lg text-slate-600 hover:bg-slate-200 dark:text-[#cdd6f4] dark:hover:bg-[#313244] font-semibold text-xs transition">
            30s
          </button>
        </div>

        <button onclick="resetBreachGame()" class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 dark:bg-[#313244] dark:hover:bg-rose-500/20 dark:text-[#cdd6f4] dark:border-[#45475a] text-xs font-bold transition">
          <i class="fa-solid fa-rotate-left mr-1"></i>Reiniciar Jogo
        </button>
      </div>
    </div>

    <!-- Placar Geral e Trilha de 5 Fases de Dificuldade Progressiva -->
    <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-4 shadow-sm space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-3 sm:gap-5 text-xs font-semibold text-slate-600 dark:text-[#a6adc8]">
          <div class="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 flex items-center gap-2">
            <i class="fa-solid fa-trophy text-indigo-600 dark:text-indigo-400"></i>
            <span class="font-bold text-slate-700 dark:text-[#cdd6f4]">Placar Geral:</span>
            <strong id="breach-lbl-score" class="font-mono text-sm text-indigo-700 dark:text-indigo-300">0 pts</strong>
          </div>
          <span>Cenário: <strong id="breach-lbl-round" class="font-mono text-indigo-600 dark:text-indigo-400">1 / 25</strong></span>
          <span>Precisão: <strong id="breach-lbl-accuracy" class="font-mono text-emerald-600 dark:text-emerald-400">0/0 (0%)</strong></span>
          <span>Sequência: <strong id="breach-lbl-streak" class="font-mono text-amber-600 dark:text-amber-400">0x</strong></span>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="prevBreachRound()" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#313244] dark:hover:bg-[#45475a] text-xs font-bold text-slate-700 dark:text-[#cdd6f4] transition">
            <i class="fa-solid fa-arrow-left mr-1"></i>Anterior
          </button>
          <button onclick="advanceBreachNextRound()" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#313244] dark:hover:bg-[#45475a] text-xs font-bold text-slate-700 dark:text-[#cdd6f4] transition">
            Pular / Próximo<i class="fa-solid fa-arrow-right ml-1"></i>
          </button>
        </div>
      </div>

      <div id="breach-phases-nav" class="flex flex-wrap gap-2"></div>
    </div>

    <!-- Cartão Principal do Cenário (Alta Legibilidade) -->
    <div id="breach-incident-card" class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-5 sm:p-7 shadow-md space-y-6">
      <!-- Topo do Cenário -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-[#313244] pb-4 gap-3">
        <div class="space-y-1.5">
          <div class="flex flex-wrap items-center gap-2">
            <span id="breach-phase-badge" class="px-2.5 py-0.5 rounded-full text-xs font-extrabold border">
              Nível 1 • Iniciante
            </span>
            <span id="breach-sector-badge" class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-[#313244] dark:text-[#cdd6f4]">
              Comunicação Web / Mobile
            </span>
            <span id="breach-incident-code" class="text-xs font-mono font-bold text-slate-400 dark:text-[#6c7086]">
              #CEN-01
            </span>
          </div>
          <h3 id="breach-incident-sector" class="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            Aplicativo de Delivery: Painel do Pedido no Celular
          </h3>
        </div>

        <!-- Painel do Cronômetro -->
        <div class="flex items-center gap-3 bg-slate-50 dark:bg-[#181825] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#313244] shrink-0">
          <div class="text-right">
            <div id="breach-timer-status" class="text-[11px] font-semibold text-slate-500 dark:text-[#a6adc8]">
              Modo Estudo (Sem Pressão)
            </div>
            <div id="breach-timer-number" class="font-mono text-lg sm:text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
              Livre
            </div>
          </div>
          <button
            id="breach-btn-pause"
            onclick="toggleBreachPause()"
            class="hidden px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-[#313244] dark:hover:bg-[#45475a] text-xs font-bold text-slate-700 dark:text-[#cdd6f4] transition"
          >
            <i class="fa-solid fa-pause mr-1"></i>Pausar
          </button>
        </div>
      </div>

      <!-- Contexto do Problema, Requisito e Restrição (Fontes Amplas e Claras) -->
      <div class="space-y-4">
        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#181825] border border-slate-200 dark:border-[#313244]">
          <div class="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1.5 flex items-center gap-1.5">
            <i class="fa-solid fa-file-Waveform"></i> Dilema do Cenário:
          </div>
          <p id="breach-incident-briefing" class="text-sm sm:text-base text-slate-800 dark:text-[#edf2f7] leading-relaxed font-normal">
            Carregando cenário...
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30">
            <div class="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
              <i class="fa-solid fa-circle-check"></i> Requisito Arquitetural:
            </div>
            <p id="breach-constraint-req" class="text-xs sm:text-sm text-slate-700 dark:text-[#cdd6f4] leading-relaxed"></p>
          </div>

          <div class="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30">
            <div class="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-1 flex items-center gap-1.5">
              <i class="fa-solid fa-triangle-exclamation"></i> Restrição Técnica:
            </div>
            <p id="breach-constraint-lim" class="text-xs sm:text-sm text-slate-700 dark:text-[#cdd6f4] leading-relaxed"></p>
          </div>
        </div>
      </div>

      <!-- 4 Botões de Decisão na Ordem Canônica (1. CSV, 2. Posicional, 3. JSON, 4. XML) -->
      <div>
        <div class="text-xs font-bold text-slate-500 dark:text-[#a6adc8] mb-2.5 flex items-center justify-between">
          <span>ESCOLHA O FORMATO DE ARQUIVO MAIS ADEQUADO:</span>
          <span class="hidden sm:inline font-mono text-[11px]">Atalhos de teclado: [1] CSV • [2] Posicional • [3] JSON • [4] XML</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <!-- 1. CSV -->
          <button
            data-breach-format="CSV"
            onclick="handleBreachDecision('CSV')"
            class="breach-decision-btn group p-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/50 dark:border-[#313244] dark:bg-[#181825] dark:hover:border-indigo-400 dark:hover:bg-indigo-500/10 text-left transition-all shadow-sm"
          >
            <div class="flex items-center justify-between text-xs font-bold text-teal-700 dark:text-teal-300 mb-1">
              <span>[1] FORMATO</span>
              <span class="px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-500/20 text-[10px]">TABULAR</span>
            </div>
            <div class="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <i class="fa-solid fa-table text-teal-600 dark:text-teal-400"></i> 1. CSV
            </div>
            <p class="text-xs text-slate-600 dark:text-[#a6adc8] mt-1 leading-snug">
              Cabeçalho na 1ª linha e campos separados por delimitador (<code>;</code> ou <code>,</code>).
            </p>
          </button>

          <!-- 2. POSICIONAL -->
          <button
            data-breach-format="POSICIONAL"
            onclick="handleBreachDecision('POSICIONAL')"
            class="breach-decision-btn group p-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/50 dark:border-[#313244] dark:bg-[#181825] dark:hover:border-indigo-400 dark:hover:bg-indigo-500/10 text-left transition-all shadow-sm"
          >
            <div class="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">
              <span>[2] FORMATO</span>
              <span class="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-[10px]">LARGURA FIXA</span>
            </div>
            <div class="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <i class="fa-solid fa-ruler-horizontal text-amber-500"></i> 2. Posicional
            </div>
            <p class="text-xs text-slate-600 dark:text-[#a6adc8] mt-1 leading-snug">
              Colunas de tamanho fixo (CNAB), sem delimitadores e com decimal implícito.
            </p>
          </button>

          <!-- 3. JSON -->
          <button
            data-breach-format="JSON"
            onclick="handleBreachDecision('JSON')"
            class="breach-decision-btn group p-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/50 dark:border-[#313244] dark:bg-[#181825] dark:hover:border-indigo-400 dark:hover:bg-indigo-500/10 text-left transition-all shadow-sm"
          >
            <div class="flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-1">
              <span>[3] FORMATO</span>
              <span class="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/20 text-[10px]">CHAVE-VALOR</span>
            </div>
            <div class="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="font-mono text-indigo-600 dark:text-amber-400">{ }</span> 3. JSON
            </div>
            <p class="text-xs text-slate-600 dark:text-[#a6adc8] mt-1 leading-snug">
              Objetos <code>{}</code>, listas <code>[]</code> e tipos primitivos nativos para APIs e Web.
            </p>
          </button>

          <!-- 4. XML -->
          <button
            data-breach-format="XML"
            onclick="handleBreachDecision('XML')"
            class="breach-decision-btn group p-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/50 dark:border-[#313244] dark:bg-[#181825] dark:hover:border-indigo-400 dark:hover:bg-indigo-500/10 text-left transition-all shadow-sm"
          >
            <div class="flex items-center justify-between text-xs font-bold text-sky-700 dark:text-sky-300 mb-1">
              <span>[4] FORMATO</span>
              <span class="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-500/20 text-[10px]">MARCAÇÃO</span>
            </div>
            <div class="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <i class="fa-solid fa-code text-sky-500"></i> 4. XML
            </div>
            <p class="text-xs text-slate-600 dark:text-[#a6adc8] mt-1 leading-snug">
              Árvore de tags, atributos, validação formal XSD e assinatura digital (NF-e).
            </p>
          </button>
        </div>
      </div>

      <!-- Painel de Resolução e Diagnóstico do Arquiteto -->
      <div id="breach-resolution-box" class="hidden pt-5 border-t border-slate-200 dark:border-[#313244] space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-2.5">
            <span id="breach-resolution-badge" class="px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider">
              Arquitetura Validada
            </span>
            <h4 id="breach-resolution-title" class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white"></h4>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button id="breach-btn-pitch-bonus" onclick="awardBreachPitchBonus()">
              <i class="fa-solid fa-star text-amber-500"></i>
              <span>+10 pts (Justificativa Técnica / Pitch)</span>
            </button>
            <button
              id="breach-btn-next-round"
              onclick="advanceBreachNextRound()"
              class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
            >
              <span>Próximo Cenário</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#181825] border border-slate-200 dark:border-[#313244] space-y-3">
          <div>
            <div class="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              <i class="fa-solid fa-magnifying-glass-chart mr-1"></i>Fundamentação Técnica do Arquiteto:
            </div>
            <p id="breach-resolution-explanation" class="text-xs sm:text-sm text-slate-700 dark:text-[#cdd6f4] leading-relaxed"></p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-[#313244]">
            <div class="p-3 rounded-xl bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244]">
              <div class="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 mb-1">
                <i class="fa-solid fa-check mr-1"></i>Por que este formato é o ideal?
              </div>
              <p id="breach-resolution-why-ideal" class="text-xs text-slate-600 dark:text-[#a6adc8] leading-relaxed"></p>
            </div>

            <div class="p-3 rounded-xl bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244]">
              <div class="text-xs font-extrabold text-rose-700 dark:text-rose-400 mb-1">
                <i class="fa-solid fa-xmark mr-1"></i>Por que os outros formatos falham aqui?
              </div>
              <p id="breach-resolution-why-fail" class="text-xs text-slate-600 dark:text-[#a6adc8] leading-relaxed"></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tela Final de Consolidação dos 25 Cenários -->
    <div id="breach-debriefing-screen" class="hidden bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-6 sm:p-10 shadow-lg text-center max-w-3xl mx-auto w-full space-y-5">
      <div class="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl">
        <i class="fa-solid fa-award"></i>
      </div>
      <div>
        <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
          Jornada de 25 Cenários Concluída
        </span>
        <h3 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
          Relatório do Conselho de Arquitetura de Dados
        </h3>
        <p id="breach-final-summary" class="text-xs sm:text-sm text-slate-600 dark:text-[#a6adc8] mt-1 max-w-xl mx-auto leading-relaxed"></p>
      </div>

      <div id="breach-final-scores-list" class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left"></div>

      <div class="pt-2 flex justify-center">
        <button
          onclick="resetBreachGame()"
          class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm transition shadow-md flex items-center gap-2"
        >
          <i class="fa-solid fa-rotate-right"></i>
          <span>Iniciar Nova Rodada Completa (25 Cenários)</span>
        </button>
      </div>
    </div>
  </section>
  `;
}

export function initBreachModule() {
  Object.assign(window, {
    handleBreachDecision,
    advanceBreachNextRound,
    prevBreachRound,
    jumpToBreachPhase,
    awardBreachPitchBonus,
    setBreachTimerDuration,
    toggleBreachPause,
    resetBreachGame,
  });

  loadBreachScenario(0);
}
