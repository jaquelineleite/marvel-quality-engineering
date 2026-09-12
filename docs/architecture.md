# Architecture

## Objetivo

Este documento descreve a arquitetura de Quality Engineering adotada no desafio Marvel Quality Engineering.

A solução foi estruturada em camadas independentes de teste, com foco em:

- qualidade de API;
- qualidade de interface web;
- performance;
- acessibilidade;
- responsividade;
- compatibilidade entre browsers;
- execução contínua em CI/CD;
- rastreabilidade de riscos, cenários e evidências.

A arquitetura prioriza automação sustentável, separação de responsabilidades e execução baseada em risco.

---

## Contexto das aplicações avaliadas

### API

A API originalmente indicada no desafio, relacionada ao Marvel Rivals, apresentou indisponibilidade HTTP `502` durante a execução.

Após orientação recebida no processo seletivo, foi utilizada como alternativa autorizada a Marvel Developer API.

Endpoint utilizado:

`https://api.marvelapp.com/graphql/`

A API utiliza:

- GraphQL sobre HTTP;
- autenticação Bearer Token;
- respostas JSON;
- metadata de rate limit.

### Interface web

A camada de UI utiliza como alvo:

`https://www.marvelrivals.com/heroes/index.html`

A aplicação contém a experiência de navegação e seleção de heróis do Marvel Rivals.

### Separação dos domínios

A Marvel Developer API e a interface Marvel Rivals não representam uma integração funcional comprovada entre si.

Por esse motivo, elas são tratadas neste projeto como alvos independentes de qualidade.

Não foram criados testes end-to-end API → UI que pressupusessem uma relação de dados não demonstrada pelas aplicações.

---

## Camada de API

### Robot Framework

O Robot Framework foi utilizado como framework principal para automação funcional da API por permitir:

- cenários legíveis;
- separação entre testes, recursos e implementação;
- reutilização de keywords;
- relatórios nativos;
- integração com Python;
- boa aderência ao contexto da vaga.

A suíte cobre autenticação, consultas GraphQL, contratos, paginação, rate limit e cenários negativos.

### Python API Client

A comunicação HTTP foi encapsulada em:

`api-tests/libraries/marvel_api_client.py`

O client é responsável por:

- carregar configurações;
- criar e reutilizar a sessão HTTP;
- aplicar timeout;
- enviar autenticação;
- encapsular chamadas GraphQL.

O token não é passado como argumento explícito nos passos Robot, reduzindo risco de exposição acidental em logs.

### Postman / Newman

Postman foi utilizado como camada complementar de smoke de API.

A collection cobre:

- autenticação com token válido;
- ausência de token;
- token inválido.

O Newman executa essa collection no GitHub Actions.

A proposta não é duplicar toda a cobertura existente no Robot Framework, mas fornecer uma camada complementar e portátil de validação da API.

---

## Camada de UI

### Playwright + TypeScript

Playwright foi utilizado para automação web por oferecer:

- suporte a múltiplos browsers;
- auto-waiting;
- execução paralela;
- screenshots;
- vídeos;
- traces;
- integração com CI/CD;
- suporte nativo a TypeScript.

Foi aplicado Page Object Model para separar comportamento da página e cenários de teste.

Page Object principal:

`ui-tests/pages/HeroesPage.ts`

Os testes cobrem fluxos críticos de carregamento, seleção e visualização de detalhes dos heróis.

---

## Estratégia cross-browser

A execução cross-browser foi definida de forma seletiva e baseada em risco.

### Chromium

Executa a suíte principal de qualidade, incluindo:

- smoke;
- regressão;
- acessibilidade;
- responsividade.

### Firefox

Executa os cenários marcados com `@smoke`.

### WebKit

Executa os cenários marcados com `@smoke`.

Essa abordagem fornece cobertura entre diferentes engines sem triplicar desnecessariamente o custo da regressão completa.

A regressão completa nos três browsers permanece fora do escopo deste desafio.

---

## Acessibilidade

A camada automatizada utiliza:

- Playwright;
- `@axe-core/playwright`.

As verificações automatizadas consideram regras WCAG suportadas pelo axe-core.

Durante a execução foi identificada uma violação crítica conhecida:

`image-alt`

Essa violação pertence à aplicação externa e foi registrada como baseline conhecido.

O gate de acessibilidade continua falhando caso apareça uma nova violação com impacto `critical` que não esteja prevista no baseline.

Esse resultado não representa certificação ou conformidade integral com WCAG.

---

## Responsividade

Foi utilizada uma viewport mobile de:

`390 x 844`

A execução identificou:

- conteúdo principal disponível;
- overflow horizontal;
- seletor de heróis posicionado fora da área visível.

Os dois comportamentos problemáticos foram registrados como `expected failures` e documentados como known issues.

Essa estratégia evita tratar defeitos reproduzidos como funcionalidades aprovadas.

---

## Performance

k6 foi utilizado para executar um smoke test de performance contra uma operação GraphQL prioritária.

A execução utiliza:

- 1 Virtual User;
- 3 iterações;
- validação de falhas HTTP;
- threshold de tempo de resposta;
- validação de erros GraphQL;
- checks funcionais.

A carga foi deliberadamente reduzida porque o alvo é um serviço público externo sem ambiente dedicado ou autorização para carga intensiva.

O threshold de tempo utilizado serve como critério técnico do smoke test e não representa SLA oficial da API.

---

## CI/CD e Quality Gate

A integração contínua está implementada com GitHub Actions.

Workflow:

`.github/workflows/quality-gate.yml`

O pipeline é acionado em:

- push para `main`;
- pull request para `main`;
- execução manual por `workflow_dispatch`.

### Job de API

A camada de API executa:

1. checkout do repositório;
2. configuração do Python;
3. instalação das dependências;
4. Robot Framework;
5. publicação das evidências Robot;
6. configuração do Node.js;
7. Postman/Newman;
8. configuração do k6;
9. performance smoke.

Dessa forma, validações funcionais, smoke complementar e performance participam do fluxo automatizado de qualidade.

### Job de UI

A camada de UI executa:

1. checkout;
2. configuração do Node.js;
3. instalação das dependências;
4. instalação de Chromium, Firefox e WebKit;
5. validação TypeScript;
6. smoke em Firefox;
7. smoke em WebKit;
8. suíte principal em Chromium;
9. publicação das evidências Playwright.

### Quality Gate final

O job final depende do resultado dos jobs principais de API e UI.

Caso uma das camadas termine com resultado diferente de `success`, o Quality Gate é bloqueado.

Essa estratégia impede que uma falha relevante de qualidade seja ignorada pelo pipeline.

---

## Gestão de secrets

Credenciais reais não são armazenadas no código-fonte.

### Ambiente local

O token é carregado por variável de ambiente através do arquivo:

`.env`

Esse arquivo está protegido pelo `.gitignore`.

O repositório contém apenas:

`.env.example`

sem token real.

### GitHub Actions

No pipeline, o token é fornecido através do secret:

`MARVEL_API_TOKEN`

Esse valor é consumido em runtime pelos testes que necessitam de autenticação.

---

## Evidências técnicas

As diferentes camadas produzem evidências para análise e troubleshooting.

### Robot Framework

São gerados:

- `output.xml`;
- `log.html`;
- `report.html`.

### Playwright

A configuração permite gerar:

- HTML report;
- screenshots em falha;
- vídeos em falha;
- trace em retry;
- resultados de execução.

### GitHub Actions

São publicados artifacts:

- `robot-api-results`;
- `playwright-results`.

Os logs do pipeline também registram as execuções de:

- Newman;
- k6;
- Firefox;
- WebKit;
- Chromium.

---

## Princípios arquiteturais adotados

As principais decisões técnicas deste projeto foram:

- automação baseada em risco;
- separação entre responsabilidades das camadas;
- não criar integração artificial entre API e UI;
- Page Object Model para automação web;
- API client reutilizável em Python;
- autenticação fora do código-fonte;
- testes positivos e negativos;
- smoke cross-browser seletivo;
- regressão concentrada no navegador principal;
- performance de baixa carga em serviço externo;
- baseline explícito para problema conhecido de acessibilidade;
- expected failures para defeitos responsivos conhecidos;
- Quality Gate automatizado;
- documentação de riscos, limitações e resultados reais;
- preservação de evidências para troubleshooting.

---

## Evolução possível

A arquitetura foi estruturada para permitir evolução futura.

Possíveis extensões incluem:

- ampliação dos contratos GraphQL;
- novos cenários negativos;
- maior cobertura de paginação e dados;
- environments adicionais;
- execução distribuída;
- métricas históricas de qualidade;
- dashboards de resultados;
- publicação automática de relatórios;
- testes de performance mais amplos em ambiente autorizado;
- testes de integração caso exista relação funcional comprovada entre os sistemas;
- novos quality gates para segurança, contratos e performance;
- expansão de acessibilidade com validações manuais complementares.
