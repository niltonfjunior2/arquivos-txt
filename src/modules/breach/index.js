/**
 * Módulo 6: Desafio do Arquiteto de Dados (Simulador de Decisão Arquitetural)
 * Evolução de Sustentação (RAG Day 2) — 25 Cenários divididos em 5 Fases de Dificuldade Progressiva.
 * Interface redesenhada para alta legibilidade (Modo Claro para Projetor e Modo Escuro Catppuccin).
 * Ordem Canônica dos Botões de Decisão: [1] CSV -> [2] POSICIONAL -> [3] JSON -> [4] XML.
 */
import { playTone } from '../../core/audio.js';

export const BREACH_MODULE_ID = 'breach';

export const BREACH_PHASES = [
  {
    phase: 1,
    title: 'Fase 1: Iniciante',
    subtitle: 'Fundamentos Claros (Cenários 01 a 05)',
    badgeClass:
      'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40',
  },
  {
    phase: 2,
    title: 'Fase 2: Básico',
    subtitle: 'Regras Estruturais (Cenários 06 a 10)',
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
    subtitle: 'Casos Limítrofes e Escapes (Cenários 16 a 20)',
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
  // FASE 1: INICIANTE — Fundamentos Claros (Cenários 01 a 05)
  // =========================================================================
  {
    id: 'CEN-01',
    phase: 1,
    phaseLabel: 'Nível 1 • Iniciante',
    sector: 'Setor Comercial: Planilha Rápida de Clientes',
    badge: 'Análise em Planilha',
    briefing:
      'A equipe de vendas precisa exportar uma lista simples de 500 clientes (Nome, Telefone, Cidade e Valor da Compra) para que os gerentes abram diretamente com duplo-clique no Microsoft Excel ou LibreOffice Calc, sem precisar de suporte técnico.',
    req: 'Estrutura puramente tabular (linhas e colunas) com 1ª linha de cabeçalho e abertura imediata em softwares de planilha.',
    lim: 'Usuários de negócios sem conhecimento de estruturas hierárquicas ou manuais de posição.',
    correct: 'CSV',
    explanation:
      'O formato CSV representa uma tabela bidimensional simples onde a primeira linha define os nomes das colunas e o delimitador (; no padrão brasileiro) separa cada célula.',
    whyIdeal:
      'É o formato nativo mais leve e universalmente reconhecido por qualquer editor de planilhas eletrônicas com duplo-clique.',
    whyOthersFail:
      'JSON e XML exigiriam importação de árvore de dados; Posicional exigiria configurar manualmente a largura de cada coluna no assistente do Excel.',
  },
  {
    id: 'CEN-02',
    phase: 1,
    phaseLabel: 'Nível 1 • Iniciante',
    sector: 'Setor Bancário: Remessa de Boletos CNAB',
    badge: 'Padrão Bancário',
    briefing:
      'O sistema financeiro da empresa precisa gerar o arquivo noturno de remessa de boletos para o banco seguindo o manual oficial da FEBRABAN, onde cada linha tem exatas 240 posições e cada campo ocupa colunas fixas.',
    req: 'Campos localizados exclusivamente pela posição inicial e final (ex.: colunas 01 a 20 para Nome, 21 a 31 para CPF).',
    lim: 'Proibido usar caracteres delimitadores (; ou ,) ou tags entre os campos.',
    correct: 'POSICIONAL',
    explanation:
      'Os padrões bancários CNAB 240 e CNAB 400 utilizam arquivos posicionais de largura fixa, preenchendo textos com espaços à direita e números com zeros à esquerda.',
    whyIdeal:
      'Garante tamanho de linha rigorosamente previsível e leitura direta por fatiamento de posições nos sistemas bancários.',
    whyOthersFail:
      'CSV, JSON e XML são rejeitados pelos validadores de compensação CNAB, que esperam posições fixas sem separadores.',
  },
  {
    id: 'CEN-03',
    phase: 1,
    phaseLabel: 'Nível 1 • Iniciante',
    sector: 'Aplicativo Mobile: Perfil de Usuário via API Web',
    badge: 'Integração Web / REST',
    briefing:
      'Um aplicativo de celular precisa buscar no servidor os dados do perfil do estudante logado, incluindo nome, idade (numérico), se está ativo (`true`/`false`) e uma lista simples com os nomes das matérias favoritas.',
    req: 'Suporte nativo a pares `"chave": valor`, booleanos, números e listas `[]` com leitura imediata no navegador e no celular.',
    lim: 'Deve evitar tags de abertura e fechamento verbosas para economizar pacote de dados móveis.',
    correct: 'JSON',
    explanation:
      'O JSON (RFC 8259) é o padrão universal das APIs REST modernas, representando objetos `{}` e listas `[]` com tipos primitivos nativos.',
    whyIdeal:
      'Leve, autodescritivo e interpretado nativamente por aplicações Web e Mobile sem bibliotecas extras.',
    whyOthersFail:
      'CSV e Posicional não suportam listas aninhadas naturalmente; XML adiciona verbosidade desnecessária de tags repetidas.',
  },
  {
    id: 'CEN-04',
    phase: 1,
    phaseLabel: 'Nível 1 • Iniciante',
    sector: 'Setor Fiscal: Emissão de Nota Fiscal Eletrônica (NF-e)',
    badge: 'Documento Fiscal',
    briefing:
      'Ao vender uma mercadoria, o sistema precisa transmitir o documento fiscal eletrônico oficial para a Secretaria da Fazenda (SEFAZ), contendo blocos hierárquicos de emitente, destinatário, impostos e assinatura digital.',
    req: 'Documento de marcação hierárquica validado por esquema oficial XSD e suporte ao padrão governamental de assinatura digital.',
    lim: 'Obrigatório seguir a norma técnica fiscal brasileira baseada em tags de abertura e fechamento.',
    correct: 'XML',
    explanation:
      'No Brasil, toda Nota Fiscal Eletrônica (NF-e, NFS-e, CT-e) é obrigatoriamente um arquivo XML bem formado e validado contra esquemas XSD da SEFAZ.',
    whyIdeal:
      'Suporta validação formal rigorosa de estrutura/tipos via XSD e assinatura digital embutida no próprio documento (XML-DSig).',
    whyOthersFail:
      'CSV, Posicional e JSON não são aceitos pelo barramento autorizador da SEFAZ para documentos fiscais.',
  },
  {
    id: 'CEN-05',
    phase: 1,
    phaseLabel: 'Nível 1 • Iniciante',
    sector: 'Secretaria Escolar: Importação de Notas Finais',
    badge: 'Tabela Simples',
    briefing:
      'Um professor digitou as notas finais de 40 alunos em uma tabela simples contendo apenas três colunas (`Matricula;Nome;Nota`) e quer enviar o arquivo mais enxuto e legível possível para o sistema acadêmico importar.',
    req: 'Arquivo texto humano-legível com uma linha por aluno e campos separados por ponto e vírgula.',
    lim: 'Não há dados aninhados nem necessidade de preencher espaços em branco para igualar o tamanho dos nomes.',
    correct: 'CSV',
    explanation:
      'Quando os dados são 100% tabulares e planos (mesmas 3 colunas para todos os registros), o CSV é a representação mais simples, direta e compacta.',
    whyIdeal:
      'Zero desperdício de caracteres com chaves repetidas, tags ou preenchimento de espaços em branco.',
    whyOthersFail:
      'Posicional obrigaria a contar colunas e preencher espaços; JSON e XML repetiriam os nomes dos campos 40 vezes sem necessidade.',
  },

  // =========================================================================
  // FASE 2: BÁSICO — Regras Estruturais e Sintáticas (Cenários 06 a 10)
  // =========================================================================
  {
    id: 'CEN-06',
    phase: 2,
    phaseLabel: 'Nível 2 • Básico',
    sector: 'Folha de Pagamento: Valores com Casas Decimais Implícitas',
    badge: 'Layout Rígido',
    briefing:
      'O motor de cálculo de folha exige que um salário de `R$ 1.500,50` seja gravado exatamente como `0000150050` em um bloco de 10 dígitos numéricos colado imediatamente após os 11 dígitos do CPF, sem nenhum separador entre eles.',
    req: 'Alinhamento numérico à direita com zeros à esquerda e duas casas decimais implícitas (`N2`).',
    lim: 'Qualquer ponto, vírgula ou caractere separador entre os campos invalida a linha inteira.',
    correct: 'POSICIONAL',
    explanation:
      'A representação de valores com casas decimais implícitas (`N2`) e preenchimento com zeros à esquerda sem delimitadores é a assinatura clássica do formato Posicional.',
    whyIdeal:
      'Elimina ambiguidades regionais entre ponto e vírgula decimal e mantém cada registro com comprimento fixo exato.',
    whyOthersFail:
      'CSV utiliza delimitadores explícitos e separador decimal no texto; JSON e XML estruturam os campos com chaves ou tags.',
  },
  {
    id: 'CEN-07',
    phase: 2,
    phaseLabel: 'Nível 2 • Básico',
    sector: 'Catálogo E-Commerce: Produto com Variações e Avaliações',
    badge: 'Dados Aninhados',
    briefing:
      'Cada produto do catálogo possui código, descrição, preço numérico e duas listas internas variáveis: uma lista de tamanhos disponíveis (`["P", "M", "G"]`) e uma lista de objetos de avaliações de clientes.',
    req: 'Representar listas dentro de objetos (`1:N`) mantendo tipos numéricos e booleanos sem precisar repetir os dados do produto em várias linhas.',
    lim: 'Consumo direto pelo front-end em JavaScript.',
    correct: 'JSON',
    explanation:
      'O JSON permite aninhar arrays `[]` e objetos `{}` livremente dentro de um mesmo registro, mantendo a fidelidade de tipos primitivos.',
    whyIdeal:
      'Representa perfeitamente a relação 1-para-muitos (1 produto -> N tamanhos e N avaliações) sem redundância tabular.',
    whyOthersFail:
      'Em CSV ou Posicional, listas variáveis dentro de um registro obrigam a duplicar linhas ou criar gambiarras de sub-delimitadores.',
  },
  {
    id: 'CEN-08',
    phase: 2,
    phaseLabel: 'Nível 2 • Básico',
    sector: 'Biblioteca Digital: Acervo com Metadados em Atributos',
    badge: 'Marcação e Atributos',
    briefing:
      'Uma rede de bibliotecas precisa intercambiar seu catálogo onde cada `<livro isbn="978-85" idioma="pt-BR">` possui metadados de identificação acoplados na própria tag de abertura e elementos filhos para `<titulo>` e `<resumo>`.',
    req: 'Distinção explícita entre metadados em atributos (`nome="valor"`) e conteúdo textual em elementos filhos, sob um único elemento raiz `<acervo>`.',
    lim: 'Deve seguir as 6 regras de documento bem formado (tags fechadas, aninhadas e case-sensitive).',
    correct: 'XML',
    explanation:
      'O XML é o único formato entre os quatro que diferencia nativamente Atributos na tag de abertura (`@isbn`, `@idioma`) de Elementos filhos (`<titulo>`).',
    whyIdeal:
      'Semântica riquíssima para documentos editoriais e científicos, separando metadados de controle do conteúdo textual.',
    whyOthersFail:
      'JSON não possui conceito nativo de atributo vs elemento; CSV e Posicional são planos e não possuem tags.',
  },
  {
    id: 'CEN-09',
    phase: 2,
    phaseLabel: 'Nível 2 • Básico',
    sector: 'Cadastro Logístico: Endereços Contendo Ponto e Vírgula',
    badge: 'Qualificadores de Texto',
    briefing:
      'Uma planilha de entregas usa `;` como separador de colunas, mas o campo de complemento de alguns clientes contém textos como `"Bloco A; Apto 202"` e `"Caixa D""Água"`. O arquivo precisa continuar sendo uma tabela simples.',
    req: 'Manter a estrutura tabular plana protegendo campos que contêm o próprio delimitador ou aspas internas.',
    lim: 'O sistema destino espera uma tabela delimitada padrão compatível com RFC 4180.',
    correct: 'CSV',
    explanation:
      'O padrão CSV resolve a presença do delimitador dentro do texto envolvendo o campo em aspas duplas (`"Bloco A; Apto 202"`) e duplicando aspas internas (`""`).',
    whyIdeal:
      'Permite exportar tabelas com textos livres mantendo total compatibilidade com importadores de planilhas e bancos de dados.',
    whyOthersFail:
      'Posicional truncaria textos longos em larguras fixas; JSON e XML exigiriam reescrever o importador tabular do cliente.',
  },
  {
    id: 'CEN-10',
    phase: 2,
    phaseLabel: 'Nível 2 • Básico',
    sector: 'Integração Bancária: Arquivo com Header, Detalhe e Trailer',
    badge: 'Estrutura de Lotes',
    briefing:
      'Um arquivo de retorno de cobrança identifica o papel de cada linha pelo 1º caractere da linha: `0` indica Cabeçalho do Arquivo, `1` indica Cabeçalho de Lote, `3` indica Registro de Detalhe e `9` indica Rodapé Totalizador.',
    req: 'Hierarquia baseada em códigos de tipo de registro na coluna 1 e comprimento fixo em todas as linhas.',
    lim: 'Processamento sequencial linha a linha sem delimitadores nem aninhamento de chaves.',
    correct: 'POSICIONAL',
    explanation:
      'Nos arquivos posicionais corporativos (como CNAB), a hierarquia de lotes é construída através de tipos de registro (Header, Detalhe, Trailer) identificados nas primeiras posições da linha.',
    whyIdeal:
      'Permite validar integridade de lotes (quantidade de linhas e somatória de valores no Trailer) mantendo largura fixa.',
    whyOthersFail:
      'CSV supõe que todas as linhas seguem o mesmo cabeçalho; JSON e XML usam árvores sintáticas em vez de registros planos numerados.',
  },

  // =========================================================================
  // FASE 3: INTERMEDIÁRIO — Volume, Rede e Legado (Cenários 11 a 15)
  // =========================================================================
  {
    id: 'CEN-11',
    phase: 3,
    phaseLabel: 'Nível 3 • Intermediário',
    sector: 'Telemetria IoT: Sensores Agrícolas em Rede de Baixa Banda',
    badge: 'IoT & Nuvem',
    briefing:
      'Estações meteorológicas no campo enviam a cada minuto um pacote para uma API em nuvem contendo ID da estação, coordenadas `{lat, lon}` e um array de leituras de umidade em diferentes profundidades do solo.',
    req: 'Estrutura hierárquica enxuta, tipagem numérica direta (`float`) e ingestão nativa em bancos de documentos NoSQL.',
    lim: 'Link de rádio de baixa velocidade: tags de fechamento repetitivas dobrariam o consumo de bateria e banda.',
    correct: 'JSON',
    explanation:
      'Para telemetria estruturada enviada a APIs Web e bancos NoSQL (como MongoDB), o JSON oferece hierarquia completa com muito menos bytes que o XML.',
    whyIdeal:
      'Objetos `{lat, lon}` e arrays de números `[42.1, 45.8]` são representados de forma compacta e sem tags de fechamento.',
    whyOthersFail:
      'XML gasta banda repetindo `<leitura>...</leitura>`; CSV e Posicional não representam bem o objeto de coordenadas junto a um array variável.',
  },
  {
    id: 'CEN-12',
    phase: 3,
    phaseLabel: 'Nível 3 • Intermediário',
    sector: 'Segurança de Rede: 20 Milhões de Logs de Firewall por Hora',
    badge: 'Big Data & Logs',
    briefing:
      'O firewall corporativo grava 20 milhões de eventos por hora, todos exatamente com os mesmos 6 campos (`Timestamp,IP_Origem,IP_Destino,Porta,Protocolo,Acao`), para carga em lote em um cluster de análise de dados.',
    req: 'Máxima compactação textual para registros homogêneos de tamanho variável (IPs de 7 a 15 caracteres, portas de 2 a 5 dígitos).',
    lim: 'Repetir nomes de chaves em cada linha aumentaria o armazenamento em centenas de gigabytes por dia.',
    correct: 'CSV',
    explanation:
      'Em logs tabulares massivos onde os campos têm comprimentos variáveis (ex.: `80` vs `65535`, `10.0.0.1` vs `192.168.100.250`), o CSV evita tanto a repetição de chaves quanto o desperdício de espaços fixos.',
    whyIdeal:
      'Economiza espaço em relação ao Posicional (não preenche zeros/espaços em IPs curtos) e evita o overhead de chaves do JSON/XML.',
    whyOthersFail:
      'JSON e XML multiplicariam o volume em disco; Posicional desperdiçaria bytes preenchendo cada IP e porta até o tamanho máximo.',
  },
  {
    id: 'CEN-13',
    phase: 3,
    phaseLabel: 'Nível 3 • Intermediário',
    sector: 'Auditoria Previdenciária: Fita Magnética de Mainframe (1978)',
    badge: 'Sistema Legado',
    briefing:
      'Uma auditoria precisa ler arquivos históricos gerados em COBOL na década de 1970. Os registros possuem 80 colunas exatas por linha, sem cabeçalho na linha 1 e sem nenhum caractere separador entre matrícula, nome e valor.',
    req: 'Fatiamento determinístico baseado exclusivamente no mapa de posições (Layout externo da documentação).',
    lim: 'O arquivo não é autodescritivo: não contém nomes de colunas nem delimitadores.',
    correct: 'POSICIONAL',
    explanation:
      'Arquivos de mainframes clássicos (herança dos cartões perfurados de 80 colunas) são puramente posicionais e dependem integralmente da tabela de Layout externa.',
    whyIdeal:
      'Compatibilidade total com estruturas de memória de tamanho fixo (`PIC X` e `PIC 9` do COBOL) e leitura por deslocamento (offset).',
    whyOthersFail:
      'Sem delimitadores, chaves ou tags no arquivo bruto, qualquer parser de CSV, JSON ou XML falharia imediatamente.',
  },
  {
    id: 'CEN-14',
    phase: 3,
    phaseLabel: 'Nível 3 • Intermediário',
    sector: 'Saúde Conectada: Prontuário Clínico Inter-Hospitalar (HL7 CDA)',
    badge: 'Saúde & Normas',
    briefing:
      'Dois hospitais precisam transferir o prontuário eletrônico de um paciente contendo histórico de internações, textos médicos com caracteres especiais (`<`, `>`, `&`), códigos de ontologias clínicas e validação estrita de esquema.',
    req: 'Suporte a árvores profundas de documentos mistos (texto + marcação), entidades escapadas (`&lt;`, `&amp;`) e validação formal XSD.',
    lim: 'Exigência regulatória do padrão internacional HL7 Clinical Document Architecture (CDA).',
    correct: 'XML',
    explanation:
      'Documentos clínicos normativos (HL7 CDA e padrão TISS da ANS no Brasil) utilizam XML pela combinação de árvore hierárquica, atributos semânticos e validação XSD.',
    whyIdeal:
      'Garante que nenhum campo clínico obrigatório seja omitido ou enviado fora do vocabulário controlado antes da aceitação pelo hospital destino.',
    whyOthersFail:
      'CSV e Posicional não suportam a complexa árvore de um prontuário médico; JSON não atende ao padrão normativo XSD do HL7 CDA.',
  },
  {
    id: 'CEN-15',
    phase: 3,
    phaseLabel: 'Nível 3 • Intermediário',
    sector: 'Checkout de Super-App: Carrinho de Compras Multimercado',
    badge: 'Microsserviços',
    briefing:
      'Ao clicar em "Finalizar Pedido", o app envia uma única mensagem HTTPS para o microsserviço de pagamentos contendo o objeto do cliente, o objeto de endereço de entrega e uma lista de itens com sub-itens de adicionais.',
    req: 'Serialização e desserialização instantânea em objetos nativos no front-end e no back-end com suporte a múltiplos níveis de aninhamento.',
    lim: 'A mensagem trafega via API REST e precisa manter tipos booleanos (`"entregaExpressa": true`) e nulos (`"cupom": null`).',
    correct: 'JSON',
    explanation:
      'Transações de checkout em microsserviços modernos são árvores de objetos e listas heterogêneas com tipos nativos (`boolean`, `number`, `null`), onde o JSON é imbatível.',
    whyIdeal:
      'Representa explicitamente `null`, `true`/`false` e números sem precisar de esquemas externos para diferenciar texto de número.',
    whyOthersFail:
      'No XML tudo no texto bruto é string (a menos que haja um XSD acoplado) e o payload seria muito maior; CSV e Posicional não modelam árvores de pedido.',
  },

  // =========================================================================
  // FASE 4: AVANÇADO — Casos Limítrofes e Armadilhas (Cenários 16 a 20)
  // =========================================================================
  {
    id: 'CEN-16',
    phase: 4,
    phaseLabel: 'Nível 4 • Avançado',
    sector: 'Importador Legado: O Problema do Efeito Cascata vs. Vírgula Decimal',
    badge: 'Diagnóstico de Armadilha',
    briefing:
      'Um analista exportou uma tabela de produtos do Brasil onde o preço `12,50` não estava entre aspas e o delimitador escolhido foi a vírgula `,`. O sistema importador acusou erro porque a linha passou a ter 5 colunas em vez de 4. Qual formato está sendo auditado e precisa ajustar seu delimitador para `;`?',
    req: 'Identificar o formato tabular afetado pela colisão entre separador decimal brasileiro (`,`) e delimitador de colunas.',
    lim: 'Manter o arquivo como tabela simples corrigindo o delimitador regional para ponto e vírgula (`;`).',
    correct: 'CSV',
    explanation:
      'Esta é a armadilha nº 1 do formato CSV no Brasil: usar vírgula `,` como delimitador quando os números decimais também usam vírgula (`12,50`), partindo um número em duas colunas.',
    whyIdeal:
      'Ao padronizar o CSV brasileiro com ponto e vírgula (`;`) ou proteger o campo entre aspas `"12,50"`, a integridade tabular das colunas é restaurada.',
    whyOthersFail:
      'No Posicional não existem delimitadores (usa-se decimal implícito); no JSON o separador decimal é obrigatoriamente o ponto (`.` segundo a RFC 8259).',
  },
  {
    id: 'CEN-17',
    phase: 4,
    phaseLabel: 'Nível 4 • Avançado',
    sector: 'Segurança Jurídica: Contrato Digital com Assinatura em Sub-Nó',
    badge: 'Criptografia & Schema',
    briefing:
      'Um sistema de cartório eletrônico precisa armazenar um documento onde o bloco `<clausulas>` é assinado digitalmente pelo comprador e o bloco `<autenticacao>` é assinado pelo tabelião dentro do mesmo arquivo, validando ambos contra dois vocabulários (namespaces) distintos.',
    req: 'Suporte nativo a múltiplos Namespaces (`xmlns:`) para evitar colisão de nomes de tags e assinatura digital de sub-árvores (`XML-DSig`).',
    lim: 'Padrão regulatório ICP-Brasil para documentos eletrônicos multi-assinados.',
    correct: 'XML',
    explanation:
      'O XML possui suporte nativo a Namespaces (`xmlns`) — permitindo combinar tags de órgãos diferentes sem colisão — e à especificação W3C XML Digital Signature para assinar nós específicos da árvore DOM.',
    whyIdeal:
      'Permite validar cada namespace contra seu próprio arquivo XSD e anexar assinaturas criptográficas parciais ou totais dentro da árvore.',
    whyOthersFail:
      'JSON, CSV e Posicional não possuem o mecanismo nativo de Namespaces W3C nem o padrão ICP-Brasil de assinatura em sub-nós DOM.',
  },
  {
    id: 'CEN-18',
    phase: 4,
    phaseLabel: 'Nível 4 • Avançado',
    sector: 'Processamento Embarcado: Leitura por Offset em Memória de 2 KB',
    badge: 'Sistemas Embarcados',
    briefing:
      'Uma leitora óptica industrial com apenas 2 KB de memória RAM precisa validar o código de um funcionário buscando diretamente o registro na linha `N` do arquivo no cartão SD usando cálculo matemático de byte (`linha * 49 bytes`), sem ler as linhas anteriores.',
    req: 'Acesso aleatório instantâneo (`seek` direto no byte exato do arquivo) onde todos os registros possuem rigorosamente o mesmo tamanho em bytes.',
    lim: 'O microcontrolador não tem CPU nem memória para varrer delimitadores ou montar árvores em RAM.',
    correct: 'POSICIONAL',
    explanation:
      'Como todo registro de um arquivo Posicional tem exatamente o mesmo comprimento em bytes (ex.: 49 bytes), é possível saltar diretamente para o registro `k` multiplicando `k * tamanho_da_linha` (acesso $O(1)$ em disco)!',
    whyIdeal:
      'É o único dos 4 formatos que permite acesso posicional direto por deslocamento de bytes (`seek`) sem precisar ler o arquivo desde o início.',
    whyOthersFail:
      'Em CSV, JSON e XML as linhas/registros têm tamanhos variáveis, obrigando a ler o arquivo sequencialmente para encontrar o enésimo registro.',
  },
  {
    id: 'CEN-19',
    phase: 4,
    phaseLabel: 'Nível 4 • Avançado',
    sector: 'Motor de Regras: Configuração Dinâmica Sem Schema Fixo',
    badge: 'Flexibilidade de Dados',
    briefing:
      'Uma plataforma de automação permite que cada cliente configure fluxos de trabalho com propriedades diferentes: um fluxo tem `{"tentativas": 3, "ativo": true}`, enquanto outro tem `{"webhook": "https://...", "cabecalhos": {"x-api": "123"}, "tags": ["urgente"]}`.',
    req: 'Representar estruturas polimórficas e profundamente aninhadas com tipos primitivos explícitos e leitura direta em memória.',
    lim: 'Cada registro possui um conjunto completamente diferente de propriedades (esquema livre/dinâmico).',
    correct: 'JSON',
    explanation:
      'O JSON brilha em cenários *schema-less* (sem esquema fixo), onde cada objeto pode conter chaves, sub-objetos e listas distintas mantendo tipagem nativa.',
    whyIdeal:
      'Mapeia 1:1 para dicionários/objetos de qualquer linguagem moderna sem exigir declaração prévia de colunas.',
    whyOthersFail:
      'CSV e Posicional exigem que todas as linhas sigam as mesmas colunas fixas; XML seria excessivamente verboso para objetos de configuração dinâmica.',
  },
  {
    id: 'CEN-20',
    phase: 4,
    phaseLabel: 'Nível 4 • Avançado',
    sector: 'Ciência de Dados: Exportação de Matriz de Features com Zeros à Esquerda',
    badge: 'Interoperabilidade & Cuidado',
    briefing:
      'Uma equipe de Ciência de Dados precisa compartilhar um dataset tabular de 500.000 linhas com códigos postais (`01310100`) e indicadores numéricos para leitura em bibliotecas de análise (como Pandas/R), mantendo formato tabular delimitado.',
    req: 'Formato tabular universal com cabeçalho na primeira linha, rápido de comprimir (`.gz`) e ler em pipelines de Data Science.',
    lim: 'Deve manter a simplicidade de tabela plana delimitada (alertando os analistas para não abrirem e salvarem no Excel sem proteger os zeros à esquerda).',
    correct: 'CSV',
    explanation:
      'Em Ciência de Dados e Aprendizado de Máquina, o CSV é o formato padrão de intercâmbio de matrizes tabulares por aliar cabeçalho descritivo das features com altíssima velocidade de leitura.',
    whyIdeal:
      'Lido nativamente por qualquer ferramenta estatística, compacto e mantém o nome das colunas apenas na linha 1.',
    whyOthersFail:
      'Posicional não traz os nomes das features no arquivo; JSON e XML consomem muito mais memória RAM durante o parsing de 500.000 linhas.',
  },

  // =========================================================================
  // FASE 5: ESPECIALISTA — Arquitetura de Missão Crítica (Cenários 21 a 25)
  // =========================================================================
  {
    id: 'CEN-21',
    phase: 5,
    phaseLabel: 'Nível 5 • Especialista',
    sector: 'Clearing Interbancária: Liquidação Noturna de 50 Milhões de Transações',
    badge: 'Alta Performance em Lote',
    briefing:
      'Uma câmara de compensação financeira processa 50 milhões de lançamentos na janela da madrugada entre bancos. O contrato exige tamanho de registro determinístico, validação de lotes por Header/Trailer e zero alocação dinâmica de strings durante o fatiamento.',
    req: 'Previsibilidade matemática de tamanho de arquivo (`N registros * largura fixa`), fatiamento por offset constante e totalizadores de lote.',
    lim: 'Proibido qualquer overhead de parsing léxico de aspas, chaves ou fechamento de tags.',
    correct: 'POSICIONAL',
    explanation:
      'Em motores de compensação financeira de altíssimo volume (Mainframes e Clearing Houses), o formato Posicional em lotes (padrão CNAB/FEBRABAN) garante throughput máximo por operar com offsets fixos de memória.',
    whyIdeal:
      'Zero custo de busca por caracteres delimitadores e auditoria imediata de integridade física do arquivo pelo tamanho exato em bytes.',
    whyOthersFail:
      'Qualquer formato baseado em delimitadores ou árvore (CSV, JSON, XML) exige varredura caractere a caractere para localizar onde cada campo termina.',
  },
  {
    id: 'CEN-22',
    phase: 5,
    phaseLabel: 'Nível 5 • Especialista',
    sector: 'Barramento Governamental: Integração Internacional Aduaneira (Single Window)',
    badge: 'Governança & Contratos Formais',
    briefing:
      'O sistema de comércio exterior precisa trocar declarações de importação entre alfândegas de 15 países. Cada mensagem combina normas da Organização Mundial das Alfândegas, exige transformação estrutural automatizada via folha de estilo (XSLT) e validação estrita XSD.',
    req: 'Suporte a múltiplos Namespaces internacionais, validação contratual XSD, consultas XPath e transformação nativa via XSLT.',
    lim: 'Qualquer falha de boa formação (como um `&` comercial não escapado como `&amp;` na razão social do exportador) deve abortar o processamento imediatamente.',
    correct: 'XML',
    explanation:
      'O ecossistema XML (XSD, XSLT, XPath, XML-DSig e Namespaces) foi projetado especificamente para integrações interinstitucionais complexas que exigem contratos formais auditáveis.',
    whyIdeal:
      'Permite validar rigorosamente o contrato antes do processamento e transformar documentos entre padrões de diferentes países usando XSLT.',
    whyOthersFail:
      'CSV, Posicional e JSON não possuem suporte nativo ao ecossistema W3C de transformação XSLT e validação multi-namespace XSD.',
  },
  {
    id: 'CEN-23',
    phase: 5,
    phaseLabel: 'Nível 5 • Especialista',
    sector: 'Arquitetura Orientada a Eventos: Mensageria de Microsserviços em Tempo Real',
    badge: 'Cloud Native & Eventos',
    briefing:
      'Em uma arquitetura de microsserviços, o serviço de Pedidos publica eventos em tempo real contendo metadados do evento (`eventId`, `timestamp`), dados do comprador e um sub-objeto variável `payload` que muda conforme o tipo do evento (`PedidoCriado`, `PagamentoAprovado`, `ItemCancelado`).',
    req: 'Formato autodescritivo, leve em rede, com suporte nativo a objetos polimórficos aninhados e compatibilidade direta com navegadores e APIs modernas.',
    lim: 'Baixa latência de serialização/desserialização em JavaScript/TypeScript, Go e Python sem necessidade de compilação de schemas externos.',
    correct: 'JSON',
    explanation:
      'Em arquiteturas Cloud Native e barramentos de eventos REST/Webhooks, o JSON permite encapsular envelopes de eventos com `payload` dinâmico de forma leve e autodescritiva.',
    whyIdeal:
      'Une autodescrição (chaves explícitas), suporte a hierarquia e tipagem nativa com excelente relação tamanho/legibilidade.',
    whyOthersFail:
      'CSV e Posicional são incapazes de representar um `payload` polimórfico aninhado; XML aumentaria o tráfego de rede e a complexidade de consumo nos clientes Web.',
  },
  {
    id: 'CEN-24',
    phase: 5,
    phaseLabel: 'Nível 5 • Especialista',
    sector: 'Auditoria de Interoperabilidade: O Dilema dos 4 Formatos na Mesma Base',
    badge: 'Decisão de Trade-Off',
    briefing:
      'Um arquiteto comparou o tamanho em bytes da mesma tabela de 10.000 alunos nos 4 formatos: o XML ocupou 1,4 MB; o JSON ocupou 920 KB; o Posicional ocupou 240 KB (24 bytes fixos por linha); e o quarto formato ocupou apenas 185 KB porque a maioria dos nomes era curta ("Ana", "Rui", "Lia") e não precisou preencher espaços em branco.',
    req: 'Identificar o formato textual que atinge o menor tamanho em bytes quando os registros são tabulares e os valores de texto são majoritariamente curtos.',
    lim: 'Manter a 1ª linha como cabeçalho autodescritivo das colunas e separar campos apenas por um único caractere delimitador.',
    correct: 'CSV',
    explanation:
      'Enquanto o Posicional reserva sempre o tamanho máximo da coluna (preenchendo "Ana" com 7 espaços em branco), o CSV grava apenas `"Ana;"`, economizando bytes sempre que os textos são menores que o limite máximo.',
    whyIdeal:
      'Apresenta a menor pegada em bytes para dados tabulares de comprimento variável, mantendo cabeçalho descritivo na linha 1.',
    whyOthersFail:
      'Posicional gasta bytes com padding de espaços/zeros; JSON e XML repetem os nomes dos campos em cada um dos 10.000 registros.',
  },
  {
    id: 'CEN-25',
    phase: 5,
    phaseLabel: 'Nível 5 • Especialista',
    sector: 'Desafio Final do Conselho: Reconciliação de Lote com Deslocamento Crítico',
    badge: 'Perícia Forense de Dados',
    briefing:
      'Durante uma perícia em um arquivo financeiro sem delimitadores, descobriu-se que na linha 4.812 o nome do cliente tinha 21 letras em vez do limite de 20 colunas. Como consequência, o 1º dígito do CPF virou a última letra do nome, o valor da transação foi lido deslocado em 1 casa (multiplicando por 10!) e a data ficou corrompida.',
    req: 'Identificar o formato sujeito ao fenômeno clássico do "Efeito Cascata de Deslocamento de Colunas" quando 1 único caractere a mais ou a menos viola o contrato da linha.',
    lim: 'Ausência total de delimitadores de campo: a fronteira entre um dado e o próximo é puramente matemática.',
    correct: 'POSICIONAL',
    explanation:
      'O "Efeito Cascata" é a vulnerabilidade estrutural mais crítica de um Arquivo Posicional: como não há delimitadores para ancorar o início do próximo campo, um erro de 1 caractere em um campo desloca todas as colunas subsequentes daquela linha.',
    whyIdeal:
      'Conhecer essa propriedade permite ao Arquiteto de Dados diagnosticar instantaneamente erros de truncamento ou falta de padding em integrações CNAB e legadas.',
    whyOthersFail:
      'Em CSV o delimitador `;` isola cada coluna; em JSON e XML as chaves e tags delimitam explicitamente cada valor.',
  },
];

const breachState = {
  roundIndex: 0,
  totalRounds: BREACH_SCENARIOS.length,
  timerDuration: 0, // 0 = Modo Estudo (Sem Tempo) por padrão para leitura confortável; opções: 0, 15, 20, 30
  timeRemaining: 0,
  timerInterval: null,
  isPaused: false,
  isAnswered: false,
  streak: 0,
  correctCount: 0,
  answeredCount: 0,
  activeTeamIndex: 0,
  teams: [
    {
      name: 'Alpha',
      score: 0,
      badgeBg:
        'bg-indigo-100 text-indigo-800 border-indigo-400 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-400',
    },
    {
      name: 'Bravo',
      score: 0,
      badgeBg:
        'bg-teal-100 text-teal-800 border-teal-400 dark:bg-teal-500/20 dark:text-teal-300 dark:border-teal-400',
    },
    {
      name: 'Charlie',
      score: 0,
      badgeBg:
        'bg-amber-100 text-amber-800 border-amber-400 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-400',
    },
    {
      name: 'Delta',
      score: 0,
      badgeBg:
        'bg-purple-100 text-purple-800 border-purple-400 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-400',
    },
  ],
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

function renderBreachTeamsAndPhasesUI() {
  const teamsContainer = document.getElementById('breach-teams-container');
  const lblRound = document.getElementById('breach-lbl-round');
  const lblStreak = document.getElementById('breach-lbl-streak');
  const lblAccuracy = document.getElementById('breach-lbl-accuracy');
  const phasesNav = document.getElementById('breach-phases-nav');

  const currentScenario = BREACH_SCENARIOS[breachState.roundIndex] || BREACH_SCENARIOS[0];
  const currentPhaseNum = currentScenario.phase;

  if (teamsContainer) {
    teamsContainer.innerHTML = breachState.teams
      .map((team, idx) => {
        const isActive = idx === breachState.activeTeamIndex;
        return `
        <button
          onclick="selectBreachTeam(${idx})"
          title="Clique para alternar a equipe da vez"
          class="px-3 py-1.5 rounded-xl border text-xs transition flex items-center gap-2 ${
            isActive
              ? `${team.badgeBg} font-extrabold shadow-sm ring-2 ring-indigo-500/30`
              : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200 dark:bg-[#181825] dark:hover:bg-[#313244] dark:text-[#a6adc8] dark:border-[#313244] font-semibold'
          }"
        >
          <span class="w-2 h-2 rounded-full ${isActive ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-slate-400 dark:bg-slate-600'}"></span>
          <span>Equipe ${team.name}:</span>
          <span class="font-mono font-bold text-slate-900 dark:text-white">${team.score} pts</span>
        </button>`;
      })
      .join('');
  }

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
      '<i class="fa-solid fa-star text-amber-500"></i><span>+10 pts (Justificativa Oral / Pitch)</span>';
  }

  document.querySelectorAll('.breach-decision-btn').forEach((btn) => {
    btn.disabled = false;
    btn.className =
      'breach-decision-btn group p-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/50 dark:border-[#313244] dark:bg-[#181825] dark:hover:border-indigo-400 dark:hover:bg-indigo-500/10 text-left transition-all shadow-sm';
  });

  renderBreachTeamsAndPhasesUI();
  startBreachCountdown();
}

export function handleBreachDecision(chosenFormat) {
  if (breachState.isAnswered) return;
  breachState.isAnswered = true;
  stopBreachTimer();

  const scenario = BREACH_SCENARIOS[breachState.roundIndex];
  const isCorrect = chosenFormat === scenario.correct;
  const activeTeam = breachState.teams[breachState.activeTeamIndex];

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
    breachState.correctCount++;
    activeTeam.score += phasePoints;
    showBreachResolution(
      true,
      `Decisão Aprovada para a Equipe ${activeTeam.name}! (+${phasePoints} pts • Formato Ideal: ${scenario.correct})`
    );
  } else {
    playTone('C2');
    breachState.streak = 0;
    showBreachResolution(
      false,
      `Incompatibilidade Arquitetural! Você escolheu ${chosenFormat}, mas o formato ideal é ${scenario.correct}.`
    );
  }

  renderBreachTeamsAndPhasesUI();
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
  renderBreachTeamsAndPhasesUI();
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
  breachState.activeTeamIndex = (breachState.activeTeamIndex + 1) % breachState.teams.length;
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

export function selectBreachTeam(teamIdx) {
  if (teamIdx < 0 || teamIdx >= breachState.teams.length) return;
  breachState.activeTeamIndex = teamIdx;
  renderBreachTeamsAndPhasesUI();
}

export function awardBreachPitchBonus() {
  if (breachState.bonusClaimedThisRound) return;
  breachState.bonusClaimedThisRound = true;
  playTone('G5');

  const currentTeam = breachState.teams[breachState.activeTeamIndex];
  currentTeam.score += 10;

  const bonusBtn = document.getElementById('breach-btn-pitch-bonus');
  if (bonusBtn) {
    bonusBtn.disabled = true;
    bonusBtn.className =
      'px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 opacity-80 cursor-not-allowed';
    bonusBtn.innerHTML = `<i class="fa-solid fa-check"></i><span>+10 pts concedidos (${currentTeam.name})!</span>`;
  }
  renderBreachTeamsAndPhasesUI();
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
  breachState.streak = 0;
  breachState.correctCount = 0;
  breachState.answeredCount = 0;
  breachState.activeTeamIndex = 0;
  breachState.teams.forEach((t) => {
    t.score = 0;
  });
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
  if (summaryEl) {
    summaryEl.textContent = `Você concluiu a jornada de 25 cenários nas 5 fases de dificuldade com ${breachState.correctCount} acertos em ${breachState.answeredCount} decisões (${pct}% de precisão arquitetural).`;
  }

  if (listEl) {
    const sorted = [...breachState.teams].sort((a, b) => b.score - a.score);
    listEl.innerHTML = sorted
      .map(
        (team, rank) => `
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#181825] border border-slate-200 dark:border-[#313244] flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-indigo-600/15 text-indigo-700 dark:text-indigo-300 font-mono font-extrabold text-sm flex items-center justify-center">#${rank + 1}</span>
            <div>
              <div class="font-extrabold text-slate-900 dark:text-white text-sm">Equipe ${team.name}</div>
              <div class="text-xs text-slate-500 dark:text-[#a6adc8]">Pontuação Acumulada</div>
            </div>
          </div>
          <div class="text-right">
            <span class="font-mono font-extrabold text-xl text-indigo-600 dark:text-indigo-400">${team.score}</span>
            <span class="text-[11px] text-slate-500 dark:text-[#a6adc8] block">pontos</span>
          </div>
        </div>`
      )
      .join('');
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
  renderBreachTeamsAndPhasesUI();
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
            Analise o problema de negócio, o requisito e a restrição técnica de cada incidente e escolha o formato ideal (<strong>CSV</strong>, <strong>Posicional</strong>, <strong>JSON</strong> ou <strong>XML</strong>).
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
          <i class="fa-solid fa-rotate-left mr-1"></i>Reiniciar Trilha
        </button>
      </div>
    </div>

    <!-- Trilha de 5 Fases de Dificuldade Progressiva (5 Cenários por Fase) -->
    <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl p-3.5 shadow-sm space-y-2.5">
      <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span class="font-extrabold uppercase tracking-wider text-slate-700 dark:text-[#cdd6f4] flex items-center gap-1.5">
          <i class="fa-solid fa-layer-group text-indigo-600 dark:text-indigo-400"></i>
          Progressão de Dificuldade (Clique em uma fase para saltar):
        </span>
        <div class="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 dark:text-[#a6adc8]">
          <span>Cenário: <strong id="breach-lbl-round" class="font-mono text-indigo-600 dark:text-indigo-400">1 / 25</strong></span>
          <span>Precisão: <strong id="breach-lbl-accuracy" class="font-mono text-emerald-600 dark:text-emerald-400">0/0 (0%)</strong></span>
          <span>Sequência (Streak): <strong id="breach-lbl-streak" class="font-mono text-amber-600 dark:text-amber-400">0x</strong></span>
        </div>
      </div>

      <div id="breach-phases-nav" class="flex flex-wrap gap-2"></div>
    </div>

    <!-- Placar Opcional de Equipes / Turnos -->
    <div class="bg-white dark:bg-[#1e1e2e] border border-slate-200 dark:border-[#313244] rounded-2xl px-4 py-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-[#a6adc8] mr-1">
          <i class="fa-solid fa-users mr-1"></i>Placar / Equipe da Vez:
        </span>
        <div id="breach-teams-container" class="flex flex-wrap items-center gap-2"></div>
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
              Análise em Planilha
            </span>
            <span id="breach-incident-code" class="text-xs font-mono font-bold text-slate-400 dark:text-[#6c7086]">
              #CEN-01
            </span>
          </div>
          <h3 id="breach-incident-sector" class="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            Setor Comercial: Planilha Rápida de Clientes
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
            <i class="fa-solid fa-file-Waveform"></i> Cenário do Problema:
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
              <span>+10 pts (Justificativa Oral / Pitch)</span>
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
    selectBreachTeam,
    awardBreachPitchBonus,
    setBreachTimerDuration,
    toggleBreachPause,
    resetBreachGame,
  });

  loadBreachScenario(0);
}
