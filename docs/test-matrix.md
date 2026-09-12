# Test Scenario Matrix



## Objetivo



Esta matriz apresenta os cenários identificados para o desafio, sua camada, prioridade, decisão de automação e justificativa baseada em risco.



A matriz será atualizada conforme o discovery técnico e a implementação evoluírem.



## Critérios



### Prioridade



- P0 — Crítica: falha compromete acesso ou funcionamento essencial.

- P1 — Alta: regressão relevante ou risco técnico significativo.

- P2 — Média: cobertura complementar com valor para qualidade.

- P3 — Baixa: baixo risco ou baixo retorno de automação.



### Decisão de automação



- Sim — cenário selecionado para automação.

- Parcial — parte será automatizada e parte permanecerá exploratória/manual.

- Não — cenário documentado, mas automação não se justifica no escopo atual.



---



## API — Autenticação



| ID | Cenário | Camada | Prioridade | Automatizar | Justificativa | Tipo | Risco | Status | Evidência |

|---|---|---|---|---|---|---|---|---|---|

| AUTH-01 | Realizar requisição autenticada com token válido | API | P0 | Sim | Confirma acesso básico à API e configuração correta da autenticação | Funcional / Positivo | RISK-03 | Planejado | - |

| AUTH-02 | Realizar requisição sem token | API | P0 | Sim | Valida proteção do recurso contra acesso não autenticado | Segurança / Negativo | RISK-03 | Planejado | - |

| AUTH-03 | Realizar requisição com token inválido | API | P1 | Sim | Garante tratamento consistente de credencial inválida | Segurança / Negativo | RISK-03 | Planejado | - |

| AUTH-04 | Validar que token não aparece em código ou logs | Segurança | P0 | Sim | Evita exposição de segredo no repositório e pipeline | Segurança | RISK-04 | Em andamento | git check-ignore / secret scan |

| AUTH-05 | Validar token expirado ou revogado | API | P2 | Parcial | Depende da possibilidade segura de revogação/expiração durante o desafio | Segurança / Negativo | RISK-03 | A validar | - |



---



## API — GraphQL



| ID | Cenário | Camada | Prioridade | Automatizar | Justificativa | Tipo | Risco | Status | Evidência |

|---|---|---|---|---|---|---|---|---|---|

| API-01 | Consultar identidade do usuário autenticado | API | P0 | Sim | Query simples e estável para confirmar acesso funcional à API | Funcional / Positivo | RISK-02 | Planejado | - |

| API-02 | Validar estrutura da resposta da identidade do usuário | API / Contrato | P0 | Sim | Detecta alteração estrutural ou ausência de campos essenciais | Contrato | RISK-05 | Planejado | - |

| API-03 | Consultar projetos acessíveis pelo usuário | API | P1 | Sim | Exercita recurso real documentado e retorno de coleção | Funcional / Positivo | RISK-07 | Planejado | - |

| API-04 | Validar estrutura da resposta de projetos | API / Contrato | P1 | Sim | Protege contra mudanças estruturais relevantes | Contrato | RISK-05 | Planejado | - |

| API-05 | Validar quantidade de registros retornados sem assumir valor fixo | API | P1 | Sim | Evita teste frágil sobre dados dinâmicos e valida consistência da coleção | Funcional | RISK-07 | Planejado | - |

| API-06 | Validar paginação da consulta de projetos | API | P1 | Sim | Paginação incorreta pode provocar perda ou duplicidade de dados | Integração | RISK-08 | Planejado | - |

| API-07 | Validar informações de pageInfo e cursor | API / Contrato | P1 | Sim | Confirma integridade dos metadados utilizados na paginação | Contrato | RISK-08 | Planejado | - |

| API-08 | Avaliar tempo de resposta de query prioritária | API / Performance | P2 | Sim | Identifica degradação básica sem gerar carga agressiva | Performance | RISK-09 | Planejado | - |



---



## API — Cenários negativos



| ID | Cenário | Camada | Prioridade | Automatizar | Justificativa | Tipo | Risco | Status | Evidência |

|---|---|---|---|---|---|---|---|---|---|

| NEG-01 | Executar query GraphQL sintaticamente inválida | API | P1 | Sim | Valida tratamento de erro de requisição inválida | Negativo | RISK-06 | Planejado | - |

| NEG-02 | Solicitar campo inexistente no schema | API | P1 | Sim | Garante retorno adequado de erro de validação GraphQL | Negativo / Contrato | RISK-06 | Planejado | - |

| NEG-03 | Enviar variável com tipo incompatível | API | P1 | Sim | Valida tratamento de tipo inválido | Negativo | RISK-06 | Planejado | - |

| NEG-04 | Enviar valor vazio em campo obrigatório quando aplicável | API | P2 | Sim | Exercita validação de entrada da API | Negativo | RISK-06 | A validar | - |

| NEG-05 | Consultar recurso inexistente quando suportado | API | P2 | Sim | Valida resposta para identificador sem correspondência | Negativo | RISK-07 | A validar | - |

| NEG-06 | Validar estrutura do objeto errors | API / Contrato | P1 | Sim | Assegura que falhas retornem informação estruturada para diagnóstico | Contrato / Negativo | RISK-06 | Planejado | - |



---



## Frontend — Smoke e regressão



| ID | Cenário | Camada | Prioridade | Automatizar | Justificativa | Tipo | Risco | Status | Evidência |

|---|---|---|---|---|---|---|---|---|---|

| UI-01 | Validar carregamento da página Marvel Rivals Heroes | UI | P0 | Sim | É o ponto de entrada da experiência avaliada | Smoke | RISK-11 | Planejado | - |

| UI-02 | Validar exibição da lista/cards de heróis | UI | P0 | Sim | Conteúdo principal deve estar disponível | Smoke | RISK-11 | Planejado | - |

| UI-03 | Validar presença de nome em heróis exibidos | UI | P1 | Sim | Garante informação essencial do card | Funcional | RISK-11 | Planejado | - |

| UI-04 | Validar navegação para detalhe de herói | UI | P0 | Sim | Fluxo principal de navegação do portal | Smoke / E2E | RISK-11 | Planejado | - |

| UI-05 | Validar informações essenciais no detalhe | UI | P1 | Sim | Confirma que a navegação leva a conteúdo utilizável | Regressão | RISK-11 | Planejado | - |

| UI-06 | Validar renderização das imagens principais | UI | P1 | Sim | Imagens são parte relevante da apresentação dos personagens | Regressão | RISK-12 | Planejado | - |

| UI-07 | Validar filtros existentes na aplicação | UI | P1 | Parcial | Somente será automatizado após confirmação dos filtros reais no discovery | Regressão | RISK-15 | A validar | - |

| UI-08 | Validar busca por nome | UI | P2 | Parcial | Somente será incluído se a funcionalidade existir no frontend atual | Regressão | RISK-15 | A validar | - |

| UI-09 | Validar comportamento sem resultado de busca/filtro | UI | P2 | Parcial | Depende da confirmação da funcionalidade real | Negativo | RISK-15 | A validar | - |

| UI-10 | Validar ausência de erros críticos no console em fluxo principal | UI | P1 | Sim | Erros JavaScript podem indicar regressão mesmo com UI aparentemente funcional | Observabilidade | RISK-13 | Planejado | - |

| UI-11 | Validar falhas HTTP relevantes durante fluxo principal | UI | P1 | Sim | Ajuda a detectar recursos essenciais indisponíveis | Observabilidade | RISK-12 | Planejado | - |



---



## Frontend — Responsividade e acessibilidade



| ID | Cenário | Camada | Prioridade | Automatizar | Justificativa | Tipo | Risco | Status | Evidência |

|---|---|---|---|---|---|---|---|---|---|

| RESP-01 | Validar fluxo principal em viewport desktop | UI | P1 | Sim | Representa execução principal da suíte | Responsive | RISK-11 | Planejado | - |

| RESP-02 | Validar fluxo principal em viewport mobile | UI | P2 | Sim | Identifica quebra funcional relevante em tela reduzida | Responsive | RISK-11 | Planejado | - |

| RESP-03 | Validar viewport tablet | UI | P3 | Não inicialmente | Retorno menor para o prazo disponível; poderá ser evolução | Responsive | RISK-18 | Backlog | - |

| A11Y-01 | Executar análise automatizada básica de acessibilidade | UI | P2 | Sim | Detecta violações automatizáveis com baixo custo | Accessibility | RISK-19 | Planejado | - |

| A11Y-02 | Avaliação manual completa de WCAG | UI | P3 | Não | Escopo e prazo não permitem declarar conformidade completa | Accessibility / Manual | RISK-19 | Fora do escopo | - |



---



## Cenários transversais



| ID | Cenário | Camada | Prioridade | Automatizar | Justificativa | Tipo | Risco | Status | Evidência |

|---|---|---|---|---|---|---|---|---|---|

| TRV-01 | Validar loading durante carregamento quando observável | UI | P2 | Parcial | Depende do comportamento real e tempo de carregamento | Resiliência | RISK-14 | A validar | - |

| TRV-02 | Validar comportamento diante de erro de rede | UI | P1 | Sim com mock quando aplicável | Falha externa deve resultar em comportamento previsível | Resiliência | RISK-16 | Planejado | - |

| TRV-03 | Validar timeout controlado | UI / API | P2 | Parcial | Será simulado somente se houver valor e comportamento testável | Resiliência | RISK-16 | A validar | - |

| TRV-04 | Validar múltiplos cliques em ação navegável | UI | P2 | Parcial | Relevante apenas em elementos suscetíveis a duplicidade de ação | Negativo | RISK-14 | A validar | - |

| TRV-05 | Validar indisponibilidade de dependência externa | UI / API | P1 | Parcial | Não provocar indisponibilidade real; utilizar mock quando tecnicamente adequado | Resiliência | RISK-16 | Planejado | - |

| TRV-06 | Preservar evidência suficiente em caso de falha | Automação / CI | P1 | Sim | Facilita root cause e diferencia defeito de ambiente | Observabilidade | RISK-23 | Planejado | - |



---



## Performance



| ID | Cenário | Camada | Prioridade | Automatizar | Justificativa | Tipo | Risco | Status | Evidência |

|---|---|---|---|---|---|---|---|---|---|

| PERF-01 | Medir tempo de resposta de query GraphQL prioritária | Performance | P2 | Sim | Validação simples, segura e relevante para API | Performance | RISK-09 | Planejado | - |

| PERF-02 | Executar smoke de performance com baixa carga | Performance | P2 | Sim | Demonstra estratégia sem sobrecarregar serviço público | Performance / k6 | RISK-09 | Planejado | - |

| PERF-03 | Executar stress/load agressivo contra API pública | Performance | P3 | Não | Risco operacional e baixo benefício para o desafio | Performance | RISK-10 | Fora do escopo | - |



---



## Cross-browser



| ID | Cenário | Camada | Prioridade | Automatizar | Justificativa | Tipo | Risco | Status | Evidência |

|---|---|---|---|---|---|---|---|---|---|

| BROWSER-01 | Executar smoke em Chromium | UI | P0 | Sim | Navegador principal da regressão | Compatibilidade | RISK-18 | Planejado | - |

| BROWSER-02 | Executar smoke em Firefox | UI | P2 | Sim | Cobertura complementar entre engines | Compatibilidade | RISK-18 | Planejado | - |

| BROWSER-03 | Executar smoke em WebKit | UI | P2 | Sim | Cobertura complementar similar ao ecossistema Safari | Compatibilidade | RISK-18 | Planejado | - |

| BROWSER-04 | Executar regressão completa nos três browsers | UI | P3 | Não | Custo elevado sem ganho proporcional para este escopo | Compatibilidade | RISK-18 | Fora do escopo | - |



---



## Testes exploratórios



| ID | Cenário | Camada | Prioridade | Automatizar | Justificativa | Tipo | Risco | Status | Evidência |

|---|---|---|---|---|---|---|---|---|---|

| EXP-01 | Explorar autenticação, queries e comportamento da Marvel Developer API | Exploratória | P0 | Não | Exploração direciona os cenários que serão automatizados posteriormente | Exploratório | RISK-02 | Em andamento | docs/exploratory-testing.md |

| EXP-02 | Explorar listagem, navegação e detalhes no Marvel Rivals Heroes | Exploratória | P0 | Não | Confirma comportamento real antes da automação | Exploratório | RISK-15 | Planejado | docs/exploratory-testing.md |

| EXP-03 | Explorar comportamento diante de falhas e carregamentos lentos | Exploratória | P1 | Não | Ajuda a identificar riscos transversais e oportunidades de mocks | Exploratório | RISK-16 | Planejado | docs/exploratory-testing.md |



---



## Observações



A matriz não representa uma obrigação de automatizar todos os cenários.



A prioridade está em:



1\. cobertura de maior risco;

2\. feedback rápido;

3\. asserts significativos;

4\. baixa fragilidade;

5\. manutenção sustentável;

6\. capacidade de investigação.



Cenários com status `A validar` somente serão promovidos para automação após confirmação do comportamento real da aplicação.



Cenários marcados como `Fora do escopo` permanecem documentados para demonstrar análise e decisão consciente de não automatização.

