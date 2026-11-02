# Laboratório Interativo: Arquivos de Texto na Programação

![Status](https://img.shields.io/badge/Status-Release%20v1.0-10b981?style=for-the-badge)
![Acesso](https://img.shields.io/badge/Acesso-100%25%20Aberto%20e%20Gratuito-4f46e5?style=for-the-badge)
![Execução](https://img.shields.io/badge/100%25-Client--Side%20(Browser)-0ea5e9?style=for-the-badge)
![Testes](https://img.shields.io/badge/Testes-22%2F22%20Vitest-22c55e?style=for-the-badge)
![Deploy](https://img.shields.io/badge/Deploy-Vercel%20Ready-000000?style=for-the-badge&logo=vercel)

Objeto de aprendizagem interativo e *mobile-first* desenvolvido para o ensino e aprendizado aberto de **Formatos de Arquivos de Texto na Programação** (`CSV`, `Posicional/CNAB`, `JSON` e `XML`).

A aplicação traduz visualmente os conceitos, estruturas, regras sintáticas e armadilhas clássicas dos principais formatos de texto da indústria — permitindo que qualquer pessoa interessada no aprendizado, estudantes, professores ou desenvolvedores explorem e validem formatos de arquivos de texto diretamente pelo smartphone, tablet ou computador.

---

## 🎯 Proposta Pedagógica

* **Foco 100% na Anatomia do Arquivo-Texto (Zero Código de Programação na UI):** A interface não exibe scripts de programação; toda a atenção cognitiva do estudante é direcionada para a estrutura interna do arquivo bruto (delimitadores, posições de colunas, chaves/valores, tags, atributos e escapes).
* **Dupla Abordagem em Cada Formato:**
  1. **Aba 1 — Construtor Guiado + Laboratório do Erro:** Construção passo a passo comentada, visualização gráfica da estrutura em tempo real e simulação de **4 armadilhas clássicas** com 1 clique.
  2. **Aba 2 — Validador e Auditor de Arquivos:** Permite colar conteúdo ou enviar arquivos reais (`.csv`, `.txt`, `.json`, `.xml`) via *drag-and-drop*, recebendo diagnóstico didático de linha, coluna, categoria do erro e sugestão de correção — ou métricas estruturais completas quando válido.
* **Alto Contraste para Projetor (Modo Claro) e Estudo Individual (Modo Escuro):** Tema claro calibrado especificamente para legibilidade em projetores de sala de aula e tema escuro inspirado na paleta *Catppuccin Mocha*.

---

## 🧭 Trilha Didática (Os 5 Módulos)

A navegação principal segue rigorosamente a progressão pedagógica da disciplina:

| Ordem | Módulo | Conceitos-Chave Trabalhados | Visualizador Estrutural & Validador |
| :---: | :--- | :--- | :--- |
| **1** | **Arquivos CSV** | Estrutura tabular plana, linha de cabeçalho, conflito da vírgula decimal no Brasil (`,` vs `;`), qualificadores de texto (`"..."`), escape de aspas internas (`""`) e preservação de zeros à esquerda (`03400123`). | **Tabela de Registros e Colunas** + Validador automático de delimitador, contagem de colunas e fechamento de aspas. |
| **2** | **Arquivos Posicionais (CNAB)** | Largura fixa por posição, alinhamento alfanumérico (`A`, espaços `␣` à direita) vs. numérico (`N`, zeros `0` à esquerda), casas decimais implícitas (`N2`/`N1`), efeito cascata de deslocamento e arquitetura de lotes **CNAB 240/400** (Header/Detalhe/Trailer). | **Régua Posicional Interativa (49 e 24 posições)** + Diagrama de Lotes CNAB + Validador automático contra os layouts canônicos da apostila. |
| **3** | **Arquivos JSON** | Norma **RFC 8259**, objetos `{ }`, arrays `[ ]`, pares `"chave": valor`, tipos primitivos (`String`, `Number`, `Boolean`, `null`), aninhamento hierárquico e proibição de vírgula sobrando (*trailing comma*), aspas simples e comentários. | **Árvore Hierárquica de Nós e Tipos** + Validador/Formatador RFC 8259 com cálculo de profundidade e contagem de chaves. |
| **4** | **Arquivos XML** | Prólogo `<?xml ...?>`, elemento raiz único, atributos entre aspas vs. elementos filhos, elementos vazios (`<ativo/>`), comentários (`<!-- ... -->`), as 5 entidades oficiais (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&apos;`) e contexto de **NF-e / XSD**. | **Árvore Hierárquica DOM (`<tag>`, `@attr`, texto)** + Validador determinístico das **6 Regras de XML Bem Formado** + Formatador XML. |
| **5** | **Conversor 4 Formatos** | Tradução simultânea em tempo real do **mesmo conjunto de dados** (Seção 9 da apostila) para **CSV**, **Posicional (24 cols)**, **JSON** e **XML** lado a lado, com cenários de caracteres especiais (`;`, `"`, `&`, `<>`). | **Painel 2x2 Sincronizado** + Termômetro Ao Vivo de Bytes (UTF-8) + Ponte em 1 clique para os Validadores + **Quadro Comparativo (Seção 8)**. |

---

## 🏗️ Arquitetura e Estrutura do Projeto

O projeto é uma *Single-Page Application (SPA)* modular 100% *client-side*, construída com **JavaScript ES Modules**, **Vite**, **Tailwind CSS** e **Vitest**.

```text
arquivos-txt/
├── index.html                      # Ponto de entrada HTML5 Mobile-First
├── package.json                    # Scripts de desenvolvimento, build, lint e testes
├── vite.config.js                  # Configuração de build Vite + ambiente Vitest (JSDOM)
├── vercel.json                     # Configuração de deploy estático e headers de segurança na Vercel
├── src/
│   ├── main.js                     # App Shell Global, roteamento dos 5 módulos e atalhos de teclado
│   ├── styles/
│   │   └── main.css                # Estilos globais, scrollbars, animações e regras de impressão
│   ├── core/
│   │   ├── theme.js                # Gerenciador de Modo Claro (Projetor) e Modo Escuro
│   │   ├── audio.js                # Sintetizador sonoro pedagógico (Tone.js) com controle de Mute
│   │   └── sanitizer.js            # Sanitização rigorosa contra XSS (escapeHtmlText)
│   └── modules/
│       ├── csv/index.js            # Módulo 1: Construtor, 4 Armadilhas e Validador CSV
│       ├── positional/index.js     # Módulo 2: Régua Posicional, CNAB, 4 Armadilhas e Validador
│       ├── json/index.js           # Módulo 3: Objeto de Aprendizagem JSON (RFC 8259)
│       ├── xml/index.js            # Módulo 4: Construtor, Árvore DOM, 4 Armadilhas e Validador XML
│       └── converter/index.js      # Módulo 5: Tradutor em Tempo Real (4 Formatos) + Comparativo
├── public/
│   ├── favicon.svg                 # Ícone vetorial oficial do projeto (TXT)
│   └── NJ.png                      # Logomarca autoral
└── tests/
    ├── setup.test.js               # Smoke test de infraestrutura e sanitização
    ├── sprint1.test.js             # Testes de App Shell, Módulo JSON e Módulo CSV
    ├── sprint2.test.js             # Testes do Módulo Posicional (Layouts 49 e 24 cols + CNAB)
    ├── sprint3.test.js             # Testes do Módulo XML (Árvore DOM e 6 Regras de Boa Formação)
    └── sprint4.test.js             # Testes do Conversor em Tempo Real e Rodapé Institucional
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
* **Node.js** `>= 18.x` e **npm** `>= 9.x`

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```
Acesse no navegador o endereço exibido no terminal (por padrão `http://localhost:5173`).

---

## 🧪 Qualidade de Código, Testes e Build

O projeto conta com suíte automatizada de testes unitários e de integração em DOM virtual (`Vitest` + `JSDOM`), além de verificação estática (`ESLint`) e padronização de código (`Prettier`):

```bash
# Executar todos os testes automatizados (21 testes em 5 suítes)
npm run test:run

# Executar testes em modo interativo (watch mode)
npm test

# Verificar qualidade estática do código (ESLint)
npm run lint

# Formatar código automaticamente (Prettier)
npm run format

# Gerar build otimizado de produção na pasta dist/
npm run build

# Visualizar localmente o build de produção
npm run preview
```

---

## ☁️ Deploy na Vercel

O repositório já está configurado para deploy contínuo imediato na **Vercel** por meio do arquivo [`vercel.json`](./vercel.json):

1. Suba o repositório para o **GitHub**.
2. No painel da [Vercel](https://vercel.com/), clique em **Add New... → Project** e importe o repositório.
3. As configurações serão detectadas automaticamente:
   * **Framework Preset:** `Vite`
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
4. Clique em **Deploy**. Cada novo `git push` na branch principal atualizará automaticamente o ambiente em produção.

---

## 👨‍🏫 Autoria e Propósito Educacional

* **Coordenação e Desenvolvimento:** Prof. Nilton F. Junior ([Portfólio](https://professornilton.vercel.app/))
* **Público-Alvo:** Aberto a qualquer pessoa interessada no aprendizado prático de programação e estruturas de arquivos de texto.
* **Material Base:** *Arquivos de Texto na Programação (Conceitos, Formatos, Estruturas e Manipulação Prática)*


