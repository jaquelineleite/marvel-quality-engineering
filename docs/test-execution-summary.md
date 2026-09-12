# Test Execution Summary

## Visão geral

Este documento consolida os resultados obtidos durante a execução local e no pipeline CI/CD do projeto Marvel Quality Engineering.

Data de referência: 12/09/2026.

Os resultados abaixo representam execuções reais realizadas durante o desenvolvimento do desafio.

---

## API - Robot Framework

### Resultado geral

- Total de testes: 12
- Passed: 12
- Failed: 0
- Framework: Robot Framework 7.4.2
- Linguagem de apoio: Python 3.12
- API: Marvel Developer API / GraphQL

### Cobertura executada

Foram validados:

- autenticação com token válido;
- requisição sem autenticação;
- token inválido;
- consulta de projetos;
- estrutura da resposta;
- paginação e `pageInfo`;
- comportamento com coleção vazia;
- metadata de rate limit;
- query GraphQL com sintaxe inválida;
- campo inexistente;
- variável com tipo incompatível;
- contrato base do objeto `errors`.

### Resultado

**12/12 testes aprovados.**

---

## Performance - k6

### Estratégia

Foi executado smoke test de baixa carga contra uma query GraphQL prioritária.

Configuração:

- 1 Virtual User;
- 3 iterações;
- carga deliberadamente reduzida por se tratar de API pública externa.

### Thresholds

- `http_req_failed`: rate < 1%
- `http_req_duration`: p95 < 3000 ms
- `graphql_errors`: rate = 0
- `checks`: rate > 99%

### Resultado observado

- Requests: 3
- Requests com falha: 0
- Checks executados: 18
- Checks aprovados: 100%
- GraphQL errors: 0%
- HTTP request duration p95: 817.8 ms
- HTTP request duration média: 470.01 ms
- HTTP request duration máxima: 878.95 ms

### Resultado

**Todos os thresholds foram aprovados.**

O threshold de 3000 ms foi definido como critério de smoke para serviço externo não controlado e não representa SLA oficial da API.

---

## UI - Playwright

### Smoke

Cenários executados:

- UI-01 - carregamento da página de heróis;
- UI-02 - abertura e exibição do seletor de heróis;
- UI-03 - seleção de herói com atualização da URL e do detalhe.

Resultado:

- Total: 3
- Passed: 3
- Failed: 0

**Smoke: 3/3 aprovado.**

### Regressão

Cenários executados:

- UI-03 - seleção e navegação de personagem;
- UI-05 - informações funcionais no detalhe do herói.

Resultado:

- Total: 2
- Passed: 2
- Failed: 0

**Regressão: 2/2 aprovada.**

---

## Acessibilidade

Ferramentas:

- Playwright
- axe-core

A varredura automatizada identificou:

| Regra | Impacto | Nós |
| --- | --- | ---: |
| `html-has-lang` | serious | 1 |
| `image-alt` | critical | 1 |
| `link-name` | serious | 6 |

A violação crítica `image-alt` foi registrada como baseline conhecido da aplicação externa.

O Quality Gate de acessibilidade falha caso surja uma nova violação de impacto `critical` não registrada no baseline.

### Resultado

- Known critical violations: `image-alt`
- Unexpected critical violations: 0
- Execução automatizada: Passed

**A11Y-01 aprovado com baseline conhecido.**

Este resultado não representa certificação ou conformidade integral com WCAG.

---

## Responsividade

Viewport validado:

- Width: 390 px
- Height: 844 px

### RESP-01

O conteúdo principal permaneceu disponível no viewport mobile.

**Resultado: Passed.**

### RESP-02

Foi identificado overflow horizontal:

- `clientWidth = 390`
- `scrollWidth = 1400`

O cenário está registrado como `Known issue` utilizando expected failure do Playwright.

### RESP-03

O seletor de heróis foi localizado aproximadamente em:

- `x = 771 px`

em uma viewport de largura 390 px.

O cenário está registrado como `Known issue` utilizando expected failure do Playwright.

### Resultado geral

A execução Playwright reportou:

- 3 testes processados;
- RESP-01 aprovado;
- RESP-02 expected failure;
- RESP-03 expected failure;
- execução geral aprovada.

Os defeitos estão documentados como `RESP-DEF-01`.

---

## CI/CD - GitHub Actions

Workflow:

`Quality Gate`

Trigger validado:

`push` na branch `main`.

### Jobs executados

1. API - Robot Framework and k6
2. UI - Playwright
3. Quality Gate

### Resultado da primeira execução

- API - Robot Framework and k6: Success
- UI - Playwright: Success
- Quality Gate: Success
- Status geral: Success
- Duração aproximada: 1 minuto

### Evidências geradas no pipeline

Foram publicados dois artifacts:

- `robot-api-results`
- `playwright-results`

Os artifacts preservam evidências técnicas das execuções para análise e troubleshooting.

---

## Quality Gate

O job final depende do sucesso das duas camadas principais:

- API;
- UI.

O pipeline é bloqueado caso qualquer uma dessas camadas termine com resultado diferente de `success`.

Resultado da primeira execução:

**Quality Gate PASSED.**

---

## Resultado consolidado

| Camada | Resultado |
| --- | --- |
| Robot Framework API | 12/12 Passed |
| k6 Performance Smoke | Thresholds Passed |
| Playwright Smoke | 3/3 Passed |
| Playwright Regression | 2/2 Passed |
| Accessibility | Passed com baseline conhecido |
| Responsive | Passed com 2 known issues monitorados |
| GitHub Actions API Job | Success |
| GitHub Actions UI Job | Success |
| Quality Gate | PASSED |
| Pipeline artifacts | 2 gerados |

---

## Observações

Os resultados não ocultam limitações ou defeitos conhecidos.

Problemas encontrados durante a execução foram documentados em `docs/exploratory-testing.md` e refletidos em `docs/test-matrix.md`.

Cenários ainda não executados permanecem identificados como planejados, backlog, a validar ou fora do escopo, sem serem contabilizados como cobertura concluída.
