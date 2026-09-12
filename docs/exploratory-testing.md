# Exploratory Testing Findings

## Objetivo

Registrar descobertas obtidas durante a exploração técnica da API e da interface web, incluindo comportamentos observados, riscos, defeitos conhecidos e decisões tomadas antes da automação definitiva.

Os resultados descritos neste documento foram reproduzidos durante a execução local dos testes e não representam suposições sobre o comportamento das aplicações.

---

## API - Marvel Developer API

### Contexto

A API originalmente indicada no desafio, Marvel Rivals API, apresentou indisponibilidade durante a execução.

Conforme orientação posterior recebida para o desafio, a camada de API passou a utilizar a Marvel Developer API no endpoint `https://api.marvelapp.com/graphql/`.

A API utiliza GraphQL sobre HTTP e autenticação Bearer Token.

A API e o frontend Marvel Rivals são tratados como alvos independentes de qualidade. Não é assumida integração funcional entre eles.

### API-EXP-01 - Autenticação válida

**Resultado:** requisição GraphQL autenticada retornou HTTP 200 e o objeto `data.user` corretamente.

**Decisão de automação:** cenário automatizado em Robot Framework.

### API-EXP-02 - Requisição sem autenticação

**Resultado:** consulta ao campo `user` sem token retornou HTTP 400 e informou utilização de schema público limitado.

**Decisão de automação:** comportamento incluído nos testes negativos de autenticação.

### API-EXP-03 - Token inválido

**Resultado:** requisição com token inválido retornou HTTP 401 com a mensagem `OAuth2 token expired or invalid`.

**Decisão de automação:** cenário automatizado utilizando token fictício, sem exposição da credencial real.

### API-EXP-04 - Coleção de projetos vazia

**Resultado:** consulta autenticada retornou sucesso, porém sem projetos cadastrados na conta utilizada.

Foram observados:

- `edges = []`
- `hasNextPage = false`
- `endCursor = null`

**Decisão de automação:** os testes aceitam dinamicamente coleções vazias ou preenchidas. Nenhum dado artificial foi criado apenas para fazer os testes passarem.

### API-EXP-05 - Metadata de rate limit

**Resultado:** a resposta GraphQL apresentou metadata em `extensions.ratelimit`, contendo informações de custo, quantidade restante e janela de reset.

**Decisão de automação:** estrutura incluída nas validações automatizadas como informação de observabilidade da API.

### API-EXP-06 - Erros GraphQL

Durante a exploração foram validados:

- sintaxe GraphQL inválida;
- campo inexistente;
- variável com tipo inválido.

As respostas apresentaram HTTP 400 e estrutura `errors`.

Foi observado que `locations` não está obrigatoriamente presente em todos os tipos de erro.

**Decisão de automação:** o contrato base exige `message`, mas não força `locations` globalmente.

Essa decisão evita assertion baseada em comportamento não garantido pela API.

---

## Performance

### PERF-EXP-01 - Smoke de performance da API

Foi executado teste não invasivo com k6 utilizando 1 VU e 3 iterações.

Resultados observados:

- 3 requisições executadas;
- 0 requisições HTTP com falha;
- 18 checks aprovados;
- `graphql_errors = 0%`;
- `http_req_duration p95 = 817.8 ms`;
- todas as thresholds aprovadas.

O limite de `p95 < 3000 ms` foi adotado como threshold de smoke para uma API pública externa e não representa SLA oficial do serviço.

---

## Frontend - Marvel Rivals Heroes

Alvo explorado: `https://www.marvelrivals.com/heroes/index.html`.

### UI-EXP-01 - Estrutura da seleção de heróis

Foram identificados 54 registros de heróis no DOM utilizando o seletor `li[data-id][data-index]`.

Os cards ficam inicialmente ocultos.

O controle `a.more-btn` abre o seletor e torna os cards disponíveis para interação.

Após selecionar um personagem, a URL passa a conter `?id=<hero-id>` e o conteúdo de `.hero-details` é atualizado.

**Decisão de automação:** os atributos `data-id` e `data-index` foram preferidos a seletores dependentes exclusivamente de estilo.

Foi implementado Page Object Model em `ui-tests/pages/HeroesPage.ts`.

### UI-EXP-02 - Controle animado

O controle `.more-btn` possui animação contínua.

Apesar de visualmente disponível, o Playwright não consegue atingir o estado `stable` necessário para o clique convencional.

**Decisão de automação:** foi utilizado `click({ force: true })` somente nesse controle específico.

O uso de `force` não foi generalizado para os demais elementos.

### UI-EXP-03 - Conteúdo carregado assincronamente

Durante uma execução paralela, `.hero-details` já estava visível, porém ainda sem conteúdo textual.

Isso provocou uma falha inicial no teste de detalhe.

**Decisão de automação:** não foi adicionada espera fixa.

Foi utilizada espera orientada por condição com `expect.poll`, aguardando o conteúdo textual ser efetivamente carregado.

Essa estratégia reduz risco de flaky tests.

---

## Defeitos e limitações encontrados

### A11Y-DEF-01 - Violações automatizadas de acessibilidade

**Tipo:** Acessibilidade  
**Ferramenta:** axe-core + Playwright  
**Status:** Known issue  
**Ambiente:** Chromium

A análise automatizada identificou:

| Regra | Impacto | Nós encontrados |
| --- | --- | ---: |
| `html-has-lang` | serious | 1 |
| `image-alt` | critical | 1 |
| `link-name` | serious | 6 |

A violação crítica `image-alt` foi observada no logo principal sem alternativa textual adequada.

#### Estratégia de Quality Gate

Como o frontend é uma aplicação externa e não pode ser corrigido neste projeto, `image-alt` foi registrado como baseline crítico conhecido.

O teste continua reportando todas as violações, mas bloqueia a execução caso seja identificada uma nova violação de impacto `critical` não cadastrada no baseline.

Isso não representa conformidade integral com WCAG.

Testes automatizados de acessibilidade complementam, mas não substituem avaliação manual.

### RESP-DEF-01 - Overflow horizontal em viewport mobile

**Tipo:** Responsividade  
**Status:** Known issue  
**Viewport:** 390 x 844

Durante a execução responsiva foram observados:

- `clientWidth = 390`
- `scrollWidth = 1400`
- posição horizontal aproximada do seletor: `x = 771 px`

O controle de seleção de heróis ficou fora da largura visível de 390 px.

#### Impacto

O conteúdo principal permanece disponível, porém o layout apresenta overflow horizontal significativo e o seletor de personagens não permanece adequadamente contido no viewport mobile.

#### Estratégia de automação

Foram implementados:

- teste positivo para disponibilidade do conteúdo principal;
- teste conhecido para overflow horizontal;
- teste conhecido para posicionamento do seletor de heróis.

Os dois defeitos conhecidos utilizam `test.fail()` do Playwright.

Assim, o comportamento atual é registrado sem mascarar o defeito e sem transformar uma limitação conhecida de uma aplicação externa em falha permanente da pipeline.

Caso o frontend seja corrigido, o baseline deverá ser revisado.

---

## Conclusão exploratória

A exploração foi utilizada antes e durante a automação para evitar assertions baseadas em suposições.

As principais decisões derivadas dessa atividade foram:

- adaptação da camada de API para GraphQL;
- tratamento dinâmico de coleções vazias;
- contrato de erro compatível com respostas reais;
- seleção de locators baseada na estrutura efetiva do DOM;
- espera por condições em vez de sleeps fixos;
- identificação de dívida conhecida de acessibilidade;
- identificação de limitações responsivas;
- uso de baseline explícito para problemas existentes em aplicação externa.

Essas descobertas serão consideradas na matriz de testes, no resumo de execução e na definição do Quality Gate do projeto.
