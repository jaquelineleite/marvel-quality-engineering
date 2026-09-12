# Risk Analysis



## Objetivo



Este documento registra os principais riscos identificados para o desafio técnico, considerando:



- API externa;

- frontend público;

- autenticação;

- disponibilidade;

- dados dinâmicos;

- automação;

- CI/CD;

- sustentabilidade da suíte;

- segurança;

- dependência de terceiros.



A priorização será utilizada para orientar a seleção dos cenários automatizados e a distribuição dos testes por camada.



---



## Critérios de classificação



### Probabilidade



- **Alta**: risco com alta chance de ocorrer durante execução ou manutenção;

- **Média**: risco possível, mas não recorrente;

- **Baixa**: risco pouco provável no contexto atual.



### Impacto



- **Alto**: compromete execução, cobertura crítica ou confiabilidade da solução;

- **Médio**: afeta parte do fluxo, mas permite continuidade;

- **Baixo**: impacto limitado ou facilmente contornável.



### Nível de risco



A classificação final considera a combinação entre probabilidade e impacto.



- **Crítico**

- **Alto**

- **Médio**

- **Baixo**



---



## Matriz de riscos



| ID | Risco | Probabilidade | Impacto | Nível | Mitigação | Camada |

|---|---|---|---|---|---|---|

| RISK-01 | Indisponibilidade da API original Marvel Rivals | Alta | Alto | Crítico | Utilizar a API alternativa indicada pelos avaliadores e registrar a decisão no README | API |

| RISK-02 | Indisponibilidade temporária da Marvel Developer API | Média | Alto | Alto | Registrar dependência externa, distinguir falha de produto de falha de ambiente e preservar evidências de execução | API |

| RISK-03 | Token de autenticação inválido, ausente ou expirado | Média | Alto | Alto | Automatizar cenários positivos e negativos de autenticação e centralizar configuração | API |

| RISK-04 | Exposição de token ou segredo no GitHub | Média | Alto | Crítico | Utilizar `.env`, `.gitignore`, `.env.example` e GitHub Secrets; revisar staged files antes de commits | Segurança |

| RISK-05 | Mudança no schema ou contrato da API | Média | Alto | Alto | Criar validações estruturais e de contrato para campos relevantes | API / Contrato |

| RISK-06 | Query GraphQL inválida ou campo inexistente | Média | Médio | Médio | Cobrir cenários negativos e validar estrutura do objeto `errors` | API |

| RISK-07 | Dados retornados pela API serem dinâmicos | Alta | Médio | Alto | Evitar asserts excessivamente rígidos sobre valores mutáveis e validar estrutura e regras relevantes | API |

| RISK-08 | Paginação incorreta ou incompleta | Média | Médio | Médio | Validar comportamento de paginação quando disponível | API |

| RISK-09 | Tempo de resposta elevado | Média | Médio | Médio | Medir response time e aplicar validação de performance compatível com ambiente externo | API / Performance |

| RISK-10 | Rate limiting ou limitação de uso da API | Média | Médio | Médio | Manter suíte enxuta, evitar carga excessiva e documentar limites externos | API |

| RISK-11 | Mudança no DOM do portal Marvel Rivals | Média | Alto | Alto | Utilizar locators resilientes e evitar seletores frágeis | UI |

| RISK-12 | Falha no carregamento de imagens ou recursos CDN | Média | Médio | Médio | Validar estado das imagens e observar falhas de rede relevantes | UI |

| RISK-13 | Erros JavaScript no console | Média | Médio | Médio | Monitorar erros críticos de console durante testes selecionados | UI |

| RISK-14 | Flakiness por carregamento assíncrono | Média | Alto | Alto | Utilizar auto-wait do Playwright, condições explícitas e evitar sleeps fixos | UI |

| RISK-15 | Funcionalidades descritas no enunciado não existirem no frontend atual | Média | Alto | Alto | Executar discovery antes da automação e não implementar cenários fictícios | UI |

| RISK-16 | Falha de rede ou timeout em serviço externo | Média | Alto | Alto | Documentar limitações e utilizar interceptação/mocking apenas quando necessário e identificado como simulação | UI / API |

| RISK-17 | Divergência entre a API alternativa e o frontend Marvel Rivals | Alta | Alto | Alto | Tratar API e frontend como alvos independentes e não afirmar integração não comprovada | Estratégia |

| RISK-18 | Execução cross-browser elevar custo e tempo sem ganho proporcional | Média | Baixo | Baixo | Executar smoke cross-browser e concentrar regressão principal em Chromium | UI |

| RISK-19 | Testes de acessibilidade automatizados gerarem falsa sensação de conformidade | Média | Médio | Médio | Tratar axe-core como verificação básica e registrar necessidade de avaliação manual | Acessibilidade |

| RISK-20 | Pipeline falhar por dependência de serviço externo e não por regressão | Média | Alto | Alto | Preservar logs, relatórios e evidências para diferenciar falha funcional de falha ambiental | CI/CD |

| RISK-21 | Quality Gate excessivamente rígido bloquear por cenário não crítico | Média | Médio | Médio | Bloquear somente cenários críticos/P0 e definir critérios explícitos | CI/CD |

| RISK-22 | Excesso de automação tornar a solução difícil de manter | Média | Médio | Médio | Priorizar automação seletiva baseada em risco | Estratégia |

| RISK-23 | Falta de evidências dificultar investigação de falhas | Média | Médio | Médio | Gerar relatório, logs, screenshots e traces somente quando úteis | Observabilidade |

| RISK-24 | Uso de IA gerar conteúdo incorreto ou não validado | Média | Alto | Alto | Validar sugestões contra documentação, execução real e revisão manual | Processo |

| RISK-25 | Commits grandes ou pouco claros prejudicarem avaliação da evolução | Média | Médio | Médio | Manter commits incrementais, coesos e com mensagens descritivas | GitHub |



---



## Riscos prioritários



Os riscos de maior prioridade para a solução são:



1. indisponibilidade de serviços externos;

2. exposição de credenciais;

3. autenticação incorreta;

4. mudança de contrato da API;

5. flakiness na interface;

6. divergência entre documentação e comportamento real;

7. dependência de dados dinâmicos;

8. falhas de pipeline causadas por ambiente externo.



Esses riscos terão maior influência na estratégia de automação e nos Quality Gates.



---



## Abordagem baseada em risco



A automação será priorizada considerando:



- impacto no fluxo;

- probabilidade de falha;

- custo de execução;

- estabilidade do cenário;

- velocidade de feedback;

- capacidade de diagnóstico.



### Prioridade P0



Cenários críticos que comprometem a utilização básica ou a confiabilidade da solução.



Exemplos:



- autenticação válida;

- acesso à API;

- carregamento da página principal;

- navegação principal.



### Prioridade P1



Cenários relevantes para regressão e qualidade contínua.



Exemplos:



- contrato da API;

- autenticação inválida;

- paginação;

- detalhe;

- console sem erros críticos.



### Prioridade P2



Coberturas complementares.



Exemplos:



- responsividade;

- acessibilidade automatizada;

- cross-browser smoke;

- performance básica.



### Prioridade P3



Cenários de baixo risco ou baixo retorno de automação.



Poderão permanecer documentados ou ser executados manualmente.



---



## Riscos residuais



Mesmo após as mitigações, permanecerão riscos associados a:



- indisponibilidade de sistemas de terceiros;

- mudanças não controladas na API;

- alterações no frontend público;

- dados dinâmicos;

- limitações de conta ou autenticação;

- alterações futuras de contrato;

- dependência de rede.



Esses riscos serão registrados como limitações conhecidas e considerados durante a interpretação dos resultados da automação.

