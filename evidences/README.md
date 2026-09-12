# Test Evidence

## Objetivo

Este diretório documenta a estratégia de evidências utilizada no projeto Marvel Quality Engineering.

Os resultados de execução não são tratados apenas como mensagens de sucesso ou falha.

A estratégia preserva informações úteis para:

- análise de falhas;
- troubleshooting;
- rastreabilidade;
- revisão do Quality Gate;
- investigação de regressões;
- comprovação das execuções realizadas.

---

## Princípio adotado

Arquivos temporários e relatórios gerados localmente não são versionados no Git.

Eles são produzidos durante a execução e, quando aplicável, publicados como artifacts do GitHub Actions.

Essa abordagem evita versionar arquivos derivados e mantém o repositório focado em código, configuração e documentação.

---

## Robot Framework

As execuções da camada de API geram evidências em:

`api-tests/results/`

Entre os arquivos produzidos estão:

- `output.xml`;
- `log.html`;
- `report.html`.

O diretório de resultados é ignorado pelo Git porque contém artefatos de execução.

No GitHub Actions, esses arquivos são publicados no artifact:

`robot-api-results`

---

## Playwright

A camada web utiliza os mecanismos de evidência do Playwright.

A configuração contempla:

- HTML report;
- screenshot em falha;
- vídeo retido em falha;
- trace em retry;
- resultados detalhados por teste.

Os diretórios de saída incluem:

- `playwright-report/`;
- `test-results/`.

Esses diretórios são ignorados pelo Git e recriados durante as execuções.

No GitHub Actions, os resultados são publicados no artifact:

`playwright-results`

---

## Postman / Newman

A execução da collection Postman através do Newman é registrada atualmente nos logs do GitHub Actions.

A execução validada apresentou:

- 3 requests;
- 3 test scripts;
- 8 assertions;
- 0 failures.

Nesta versão do projeto não existe artifact dedicado ao Newman.

---

## k6

O smoke de performance executado com k6 também possui seus resultados registrados nos logs do pipeline.

A execução observada apresentou:

- 3 requests;
- 0 falhas HTTP;
- 18 checks;
- 100% dos checks aprovados;
- 0% de erros GraphQL;
- todos os thresholds aprovados.

Nesta versão do projeto não existe artifact dedicado ao k6.

---

## Cross-browser

A compatibilidade entre engines também é registrada pelas execuções do Playwright.

Foram validados:

- Chromium: smoke 3/3;
- Firefox: smoke 3/3;
- WebKit: smoke 3/3.

No GitHub Actions:

- Firefox executa a suíte `@smoke`;
- WebKit executa a suíte `@smoke`;
- Chromium executa a suíte principal de qualidade.

Os resultados ficam disponíveis nos logs do job de UI e no relatório Playwright publicado como artifact.

---

## Acessibilidade

A execução automatizada com axe-core registrou:

- `html-has-lang`: serious;
- `image-alt`: critical;
- `link-name`: serious.

A violação crítica `image-alt` foi registrada como baseline conhecido da aplicação externa.

O resultado documentado diferencia:

- violações conhecidas;
- novas violações críticas inesperadas.

O baseline não representa correção do defeito nem conformidade integral com WCAG.

---

## Responsividade

A execução em viewport `390 x 844` produziu evidências de dois problemas conhecidos:

- overflow horizontal, com `clientWidth = 390` e `scrollWidth = 1400`;
- seletor de heróis aproximadamente em `x = 771 px`, fora da viewport.

Os cenários correspondentes são mantidos como expected failures.

Isso preserva evidência de que o defeito foi reproduzido sem classificá-lo como funcionalidade aprovada.

---

## GitHub Actions

O pipeline centraliza as principais evidências de execução.

Os jobs validados são:

1. API - Robot Framework, Newman e k6;
2. UI - Playwright;
3. Quality Gate.

A execução mais recente após a inclusão de cross-browser terminou com status `Success`.

Artifacts publicados:

- `robot-api-results`;
- `playwright-results`.

A retenção configurada é de 14 dias.

---

## Rastreabilidade

Os resultados consolidados podem ser consultados em:

`docs/test-execution-summary.md`

A relação entre cenários, prioridades, riscos, status e evidências está documentada em:

`docs/test-matrix.md`

Os achados exploratórios e known issues estão registrados em:

`docs/exploratory-testing.md`

Essa separação mantém no repositório a rastreabilidade permanente enquanto os artifacts temporários permanecem no pipeline.

---

## Evidência versus resultado

Neste projeto, uma execução geral com status `Passed` não é utilizada para esconder defeitos conhecidos.

Exemplos:

- responsividade contém 1 cenário aprovado e 2 expected failures;
- acessibilidade contém um critical conhecido em baseline;
- a collection vazia da API é tratada como comportamento observado, e não como dado fictício.

A documentação registra essas diferenças para que o resultado final represente o comportamento real observado.
