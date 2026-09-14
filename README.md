# Marvel Quality Engineering Challenge

Prova prática de Quality Engineering para a posição de Analista de Qualidade Pleno — Engenharia de Plataforma / SDLC.

O projeto demonstra uma estratégia de qualidade baseada em risco envolvendo API, UI, performance, acessibilidade, responsividade, cross-browser e CI/CD com Quality Gate automatizado.

---

## Contexto do desafio

A API Marvel Rivals originalmente indicada apresentou indisponibilidade HTTP `502` durante a execução.

Após orientação posterior recebida dos avaliadores, a camada de API foi implementada utilizando como alternativa autorizada a Marvel Developer API:

`https://api.marvelapp.com/graphql/`

O frontend avaliado permanece sendo a página de heróis do Marvel Rivals:

`https://www.marvelrivals.com/heroes/index.html`

A Marvel Developer API e a interface Marvel Rivals não possuem integração funcional comprovada neste desafio.

Por isso, API e UI são tratadas como **alvos independentes de qualidade**, sem criar testes end-to-end artificiais ou assumir relações de dados não demonstradas.

---

## Estratégia de Quality Engineering

A solução foi construída incrementalmente e orientada por risco.

As principais camadas são:

- análise e priorização de riscos;
- testes funcionais e negativos de API;
- validações GraphQL e contratos;
- smoke complementar com Postman/Newman;
- automação web com Playwright;
- regressão funcional;
- acessibilidade com axe-core;
- responsividade;
- cross-browser;
- performance smoke com k6;
- CI/CD com GitHub Actions;
- Quality Gate;
- evidências e rastreabilidade.

---

## Stack

| Camada | Tecnologia |
| --- | --- |
| API principal | Robot Framework + Python |
| HTTP / GraphQL | RequestsLibrary + client Python |
| API complementar | Postman + Newman |
| UI | Playwright + TypeScript |
| Acessibilidade | axe-core + Playwright |
| Performance | k6 |
| CI/CD | GitHub Actions |
| Browsers | Chromium, Firefox e WebKit |
| Versionamento | Git + GitHub |

---

## Instalação e execução local

### Pré-requisitos

Para executar todas as camadas localmente, é necessário ter instalado:

- Git;
- Python 3.12;
- Node.js 22;
- npm;
- k6;
- uma credencial válida para a Marvel Developer API.

As versões utilizadas no pipeline estão definidas em `.github/workflows/quality-gate.yml`.

---

### Clonar o repositório

```bash
git clone https://github.com/jaquelineleite/marvel-quality-engineering.git
cd marvel-quality-engineering
```

---

### Configuração da API

O repositório contém o arquivo:

```text
.env.example
```

Crie uma cópia local:

```bash
cp .env.example .env
```

Configure o token somente no arquivo `.env` local:

```env
MARVEL_API_URL=https://api.marvelapp.com/graphql/
MARVEL_API_TOKEN=SEU_TOKEN
```

> O arquivo `.env` não deve ser versionado. Apenas `.env.example`, sem credenciais reais, permanece no repositório.

Para ferramentas executadas diretamente pelo shell, disponibilize o token como variável de ambiente.

No Git Bash:

```bash
export MARVEL_API_TOKEN="SEU_TOKEN"
```

---

### API — Robot Framework

A partir da raiz do repositório, crie e ative um ambiente virtual.

#### Windows / Git Bash

```bash
python -m venv .venv
source .venv/Scripts/activate
```

#### Linux / macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Instale as dependências:

```bash
pip install -r api-tests/requirements.txt
```

Execute a suíte:

```bash
robot --outputdir api-tests/results api-tests/tests
```

Os relatórios do Robot Framework serão gerados em:

```text
api-tests/results/
```

---

### API Smoke — Postman / Newman

Com `MARVEL_API_TOKEN` disponível como variável de ambiente, execute a partir da raiz:

```bash
npx --yes newman@6.2.2 run \
  postman/marvel-developer-api.postman_collection.json \
  --env-var "MARVEL_API_TOKEN=$MARVEL_API_TOKEN"
```

A collection também pode ser importada e executada diretamente no Postman.

Mais detalhes estão disponíveis em:

```text
postman/README.md
```

---

### Performance Smoke — k6

Com o k6 instalado e o token configurado no ambiente:

```bash
k6 run performance/k6/smoke.js
```

O teste utiliza carga reduzida propositalmente, por se tratar de uma API externa sem autorização para execução de carga intensiva.

---

### UI — Playwright

Acesse a pasta:

```bash
cd ui-tests
```

Instale as dependências:

```bash
npm ci
```

Instale os browsers utilizados pela automação:

```bash
npx playwright install chromium firefox webkit
```

Execute a suíte principal:

```bash
npm test
```

#### Smoke

```bash
npm run test:smoke
```

#### Regressão

```bash
npm run test:regression
```

#### Execução visual

```bash
npm run test:headed
```

#### Relatório Playwright

```bash
npm run report
```

---

### Cross-browser

Smoke no Firefox:

```bash
npx playwright test --grep @smoke --project=firefox
```

Smoke no WebKit:

```bash
npx playwright test --grep @smoke --project=webkit
```

Suíte Chromium:

```bash
npx playwright test --project=chromium
```

---

### Execução via CI/CD

O workflow:

```text
.github/workflows/quality-gate.yml
```

é executado automaticamente em:

- `push` para `main`;
- `pull_request` para `main`;
- execução manual através de `workflow_dispatch`.

No GitHub Actions, a credencial da API deve ser configurada como:

```text
MARVEL_API_TOKEN
```

em **Repository Secrets**.

O Quality Gate somente é aprovado quando os jobs críticos de API e UI terminam com sucesso.

---

## Resultados executados

| Camada | Resultado |
| --- | --- |
| Robot Framework API | 12/12 Passed |
| Postman / Newman | 3 requests / 8 assertions / 0 failures |
| k6 Performance Smoke | Todos os thresholds aprovados |
| Playwright Smoke | 3/3 Passed |
| Playwright Regression | 2/2 Passed |
| Firefox Smoke | 3/3 Passed |
| WebKit Smoke | 3/3 Passed |
| Cross-browser CI | Success |
| Accessibility | Gate Passed com critical conhecido em baseline |
| Responsive | 1 Passed + 2 Expected Failures |
| GitHub Actions API Job | Success |
| GitHub Actions UI Job | Success |
| Quality Gate | PASSED |

Os resultados acima correspondem a execuções reais realizadas durante o desenvolvimento.

---

## Cobertura de API

A suíte Robot Framework cobre, entre outros cenários:

- autenticação válida;
- requisição sem autenticação;
- token inválido;
- consulta GraphQL;
- estrutura e contrato da resposta;
- paginação e `pageInfo`;
- coleção vazia;
- metadata de rate limit;
- sintaxe GraphQL inválida;
- campo inexistente;
- variável com tipo incompatível;
- contrato base de erros.

A conta utilizada retornou uma coleção de projetos vazia. A automação foi construída para aceitar tanto coleções vazias quanto populadas sem fabricar dados apenas para satisfazer os testes.

---

## Cobertura de UI

A automação web utiliza Playwright com TypeScript e Page Object Model.

Os principais fluxos automatizados incluem:

- carregamento da página de heróis;
- abertura do seletor de heróis;
- validação da lista de personagens;
- seleção de herói;
- atualização da URL;
- atualização do conteúdo de detalhes;
- validação de informações funcionais do personagem.

O Page Object principal está em:

`ui-tests/pages/HeroesPage.ts`

---

## Cross-browser

A estratégia cross-browser foi aplicada de forma seletiva e baseada em risco.

- Chromium: suíte principal de qualidade;
- Firefox: suíte `@smoke`;
- WebKit: suíte `@smoke`.

Resultados de smoke:

- Chromium: 3/3;
- Firefox: 3/3;
- WebKit: 3/3.

A regressão completa nos três engines foi mantida fora do escopo por custo de execução versus ganho esperado.

---

## Acessibilidade e responsividade

A camada de acessibilidade utiliza axe-core integrado ao Playwright.

Foram observadas violações reais na aplicação externa, incluindo:

- `html-has-lang`: serious;
- `image-alt`: critical;
- `link-name`: serious.

A violação crítica `image-alt` foi registrada como baseline conhecido. O gate continua detectando novas violações críticas inesperadas.

Na validação responsiva em viewport `390 x 844`, foram identificados:

- overflow horizontal (`clientWidth = 390`, `scrollWidth = 1400`);
- seletor de heróis fora da área visível, aproximadamente em `x = 771 px`.

Esses problemas permanecem documentados como known issues através de expected failures. Eles não são contabilizados como funcionalidades aprovadas.

---

## Performance

O smoke de performance utiliza k6 contra uma operação GraphQL prioritária.

Configuração executada:

- 1 Virtual User;
- 3 iterações;
- 3 requests;
- 18 checks;
- 100% dos checks aprovados;
- 0% de erros GraphQL;
- p95 observado de 817.8 ms.

A carga foi deliberadamente limitada porque a API é um serviço externo sem autorização para teste de carga intensivo.

---

## CI/CD e Quality Gate

O projeto possui pipeline automatizado em:

`.github/workflows/quality-gate.yml`

O workflow é executado em push e pull request para `main`, além de permitir execução manual.

### Job de API

Executa:

1. Robot Framework;
2. publicação das evidências Robot;
3. Postman/Newman;
4. k6.

### Job de UI

Executa:

1. validação TypeScript;
2. smoke Firefox;
3. smoke WebKit;
4. suíte principal Chromium;
5. publicação das evidências Playwright.

### Gate final

O Quality Gate depende do sucesso das camadas de API e UI.

A execução validada após a inclusão de Newman e cross-browser terminou com status:

**Success**

---

## Evidências

O GitHub Actions publica os artifacts:

- `robot-api-results`;
- `playwright-results`.

Os logs do pipeline também preservam os resultados de Newman, k6 e cross-browser.

A estratégia completa de evidências está documentada em:

`evidences/README.md`

---

## Documentação

| Documento | Conteúdo |
| --- | --- |
| `docs/test-plan.md` | Estratégia de testes |
| `docs/risk-analysis.md` | Análise e priorização de riscos |
| `docs/test-matrix.md` | Cenários, prioridades, status e evidências |
| `docs/exploratory-testing.md` | Exploração, achados e known issues |
| `docs/test-execution-summary.md` | Resultados consolidados |
| `docs/architecture.md` | Arquitetura de Quality Engineering |
| `docs/limitations.md` | Limitações e decisões de escopo |
| `docs/ai-usage.md` | Uso de IA e processo de validação |
| `postman/README.md` | Uso da collection e Newman |
| `evidences/README.md` | Estratégia de evidências |

---

## Segurança de credenciais

Credenciais reais não são versionadas.

Localmente, o token é carregado por variável de ambiente através de `.env`, que está protegido pelo `.gitignore`.

No GitHub Actions, a autenticação utiliza o secret:

`MARVEL_API_TOKEN`

O repositório contém apenas `.env.example` sem credencial real.

---

## Uso de Inteligência Artificial

A IA foi utilizada de forma intensiva como copiloto durante o desenvolvimento, inclusive para geração e revisão de código, cenários, comandos, pipeline e documentação.

As sugestões não foram tratadas como fonte de verdade.

Código e configurações executáveis foram validados através de execução real, análise de logs e inspeção dos resultados. Hipóteses que não correspondiam ao comportamento observado foram ajustadas ou descartadas.

A descrição completa do processo está em:

`docs/ai-usage.md`

---

## Princípios da entrega

A solução prioriza:

- risco sobre quantidade de testes;
- evidência real sobre cobertura artificial;
- testes negativos além do happy path;
- automação sustentável;
- secrets fora do código;
- transparência sobre defeitos conhecidos;
- uso seletivo de cross-browser;
- CI/CD com Quality Gate;
- rastreabilidade entre risco, cenário e resultado;
- documentação explícita das limitações.
