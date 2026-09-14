# Test Plan



## 1. Objetivo



Este plano define a estratégia de qualidade para o desafio técnico de Analista de Qualidade Pleno, considerando testes de API, frontend, contrato, performance, acessibilidade e execução contínua.



A abordagem é orientada por risco, priorizando cenários de maior impacto e maior capacidade de fornecer feedback rápido.



O objetivo não é automatizar todos os cenários possíveis, mas construir uma solução sustentável, rastreável e tecnicamente justificável.



---



## 2. Contexto



O desafio original previa:



- Marvel Rivals API para testes de backend;

- Marvel Rivals Heroes para testes de frontend.



Durante o processo seletivo, a API Marvel Rivals originalmente indicada apresentou indisponibilidade HTTP 502.



Conforme orientação posterior dos avaliadores, a camada de API foi executada utilizando a Marvel Developer API indicada no segundo comunicado.



A API alternativa utiliza GraphQL e possui domínio funcional diferente do portal Marvel Rivals Heroes.



Por esse motivo:



- a API e o frontend são tratados como alvos independentes;

- não foi assumida integração direta entre eles;

- os cenários de API foram adaptados aos recursos realmente disponíveis;

- não foram criados cenários fictícios de heróis na API alternativa.



---



## 3. Escopo



### 3.1 API



Cobertura definida para a Marvel Developer API:



- autenticação;

- queries GraphQL;

- validação de respostas;

- cenários positivos;

- cenários negativos;

- campos obrigatórios;

- tipos de dados;

- tratamento de erros;

- paginação, quando aplicável;

- tempo de resposta;

- validação estrutural e de contrato;

- proteção de credenciais.



### 3.2 Frontend



Cobertura definida para Marvel Rivals Heroes:



- carregamento da página;

- exibição de heróis;

- navegação;

- detalhes;

- imagens;

- filtros realmente disponíveis;

- responsividade;

- acessibilidade básica;

- erros de console;

- falhas relevantes de rede;

- comportamento assíncrono.



### 3.3 Testes exploratórios



Foram realizadas sessões exploratórias para:



- descobrir comportamentos reais;

- identificar riscos adicionais;

- validar premissas;

- identificar oportunidades de automação;

- registrar defeitos reais, caso encontrados.



### 3.4 Performance



Foi realizada avaliação pontual e não invasiva de performance.



O objetivo foi validar:



- tempo de resposta;

- estabilidade básica;

- taxa de erro;

- comportamento em pequena carga controlada.



Não foi executado teste agressivo de carga contra serviços públicos de terceiros.



---



## 4. Fora de Escopo



Não fazem parte da implementação principal:



- desenvolvimento de frontend próprio;

- alteração dos sistemas externos;

- testes destrutivos;

- carga agressiva contra serviços públicos;

- Kafka sem fluxo de eventos disponível;

- banco de dados não fornecido;

- AWS sem recurso disponível no desafio;

- React Native;

- integração artificial entre Marvel Developer API e Marvel Rivals Heroes;

- conformidade completa de acessibilidade;

- validação pixel-perfect;

- testes exaustivos em todas as combinações possíveis.



Conhecimentos não aplicáveis ao ambiente poderão ser citados como possíveis evoluções, mas não serão implementados artificialmente.



---



## 5. Premissas



A estratégia considera as seguintes premissas:



- os serviços públicos podem sofrer alterações;

- os dados podem ser dinâmicos;

- a API pode possuir limites de utilização;

- o frontend pode sofrer alterações sem aviso;

- a conexão com a internet influencia a execução;

- credenciais serão fornecidas por variável de ambiente;

- nenhuma credencial real será versionada;

- apenas funcionalidades comprovadamente existentes serão automatizadas;

- falhas de terceiros deverão ser diferenciadas de regressões da solução.



---



## 6. Dependências



A solução depende de:



- acesso à internet;

- disponibilidade da Marvel Developer API;

- disponibilidade do portal Marvel Rivals Heroes;

- token válido para a Marvel Developer API;

- Python;

- Robot Framework;

- Node.js;

- Playwright;

- navegador suportado;

- GitHub Actions para CI/CD;

- k6 para testes de performance, quando utilizado.



---



## 7. Estratégia de Testes



A estratégia segue os princípios da Pirâmide de Testes e uma abordagem em camadas, concentrando maior cobertura em API e contrato e mantendo a automação de UI seletiva e orientada a risco.



### Camada 1 — API



Ferramentas principais:



- Robot Framework;

- Python;

- Python requests encapsulado em client reutilizável para chamadas GraphQL.



Esta camada concentra maior quantidade de cenários automatizados por apresentar:



- execução rápida;

- baixo custo;

- feedback mais direto;

- facilidade de diagnóstico;

- boa cobertura de regras e contratos.



### Camada 2 — Contrato



Foram realizadas validações estruturais sobre respostas da API.



Foram avaliados, quando aplicável:



- presença de `data`;

- presença de `errors`;

- campos obrigatórios;

- tipos;

- nullability;

- arrays;

- objetos;

- estrutura das respostas.



A validação de contrato será separada de regras específicas de negócio sempre que possível.



### Camada 3 — Frontend



Ferramentas principais:



- Playwright;

- TypeScript.



A automação de interface foi implementada de forma seletiva e orientada a risco.



Foram priorizados:



- carregamento;

- navegação;

- conteúdo principal;

- detalhes;

- cenários críticos de apresentação;

- erros críticos do navegador;

- comportamento responsivo básico.



### Camada 4 — Acessibilidade



Foi utilizada automação básica com axe-core.



A análise automatizada foi tratada como apoio.



Não é declarada conformidade completa com WCAG apenas com base em ferramenta automatizada.



### Camada 5 — Performance



Foi utilizada validação leve de performance.



A implementação envolveu:



- assertions de tempo de resposta;

- k6 para smoke performance.



O objetivo foi identificar riscos e demonstrar abordagem técnica sem causar impacto relevante em sistemas públicos.



### Camada 6 — Exploratória



Sessões exploratórias foram utilizadas antes e durante a automação.



Os resultados poderão gerar:



- novos riscos;

- novos cenários;

- defeitos;

- mudanças de prioridade;

- decisões de não automatização.



---



## 8. Priorização



A priorização foi baseada em:



- impacto;

- probabilidade;

- criticidade;

- frequência de execução;

- custo de manutenção;

- velocidade de feedback;

- capacidade de diagnóstico.



### P0 — Crítica



Cenários cuja falha compromete acesso ou funcionamento básico.



Exemplos:



- acesso autenticado à API;

- disponibilidade da API;

- carregamento do frontend;

- navegação essencial.



Falhas P0 são obrigatoriamente bloqueadoras. Na implementação atual do pipeline, qualquer falha não esperada em uma validação automatizada executada pelo Quality Gate também poderá bloquear a execução.



### P1 — Alta



Cenários importantes para regressão.



Exemplos:



- contrato da API;

- autenticação inválida;

- queries principais;

- detalhes;

- erros críticos de console.



Falhas P1 são priorizadas pela criticidade e, quando fazem parte das suítes executadas no pipeline, falhas não esperadas bloqueiam o Quality Gate.



### P2 — Média



Coberturas complementares.



Exemplos:



- responsividade;

- acessibilidade automatizada;

- cross-browser smoke;

- performance básica.



### P3 — Baixa



Cenários de baixo impacto ou baixo retorno de automação.



Podem permanecer documentados e ser executados manualmente.



---



## 9. Critérios para Automação



Um cenário será candidato à automação quando apresentar uma ou mais das seguintes características:



- alto risco;

- alta frequência de execução;

- comportamento determinístico;

- valor para regressão;

- execução repetitiva;

- necessidade de feedback rápido;

- capacidade de detectar regressões relevantes.



Um cenário poderá permanecer manual quando:



- possuir baixo risco;

- sofrer alterações frequentes;

- depender de avaliação subjetiva;

- possuir baixo retorno de automação;

- exigir condições não reproduzíveis de forma segura;

- gerar manutenção superior ao benefício.



---



## 10. Estratégia de API



A suíte de API foi organizada em grupos.



### Autenticação



Cobrir:



- token válido;

- ausência de token;

- token inválido;

- proteção de credenciais.



### Queries válidas



Cobrir:



- query principal;

- estrutura da resposta;

- campos obrigatórios;

- parâmetros;

- paginação quando disponível.



### Cenários negativos



Cobrir:



- query inválida;

- campo inexistente;

- variável inválida;

- recurso inexistente;

- estrutura de erros.



### Contrato



Validar:



- estrutura;

- tipos;

- campos;

- nullability;

- consistência mínima.



### Performance básica



Validar:



- tempo de resposta;

- ausência de falhas inesperadas;

- comportamento básico sob pequena execução repetida.



---



## 11. Estratégia de Frontend



A suíte frontend foi dividida principalmente entre:



- smoke;

- regression;

- accessibility;

- responsive.



### Smoke



Executado com maior frequência.



Objetivo:



validar rapidamente se os fluxos principais estão disponíveis.



### Regression



Cobertura de comportamentos relevantes além do smoke.



### Accessibility



Validação automatizada básica.



### Responsive



Validação funcional em diferentes viewports.



---



## 12. Estratégia Cross-Browser



A regressão principal é executada prioritariamente em Chromium.



O smoke cross-browser é executado em:



- Chromium;

- Firefox;

- WebKit.



A decisão reduz tempo de execução mantendo cobertura básica entre motores de navegador.



---



## 13. Dados de Teste



A estratégia deverá evitar dependência excessiva de dados fixos.



Quando dados conhecidos forem utilizados:



- deverão ser centralizados;

- deverão possuir justificativa;

- não deverão ser repetidos em múltiplos arquivos sem necessidade.



Quando possível, dados válidos poderão ser descobertos dinamicamente pela própria API.



Credenciais jamais serão tratadas como dados de teste versionáveis.



---



## 14. Segurança



Credenciais são armazenadas apenas em:



- `.env` local;

- GitHub Secrets no CI/CD.



O projeto possui:



- `.env.example`;

- `.gitignore`.



Antes de commits e push serão verificadas ocorrências de:



- token;

- secret;

- password;

- private key;

- authorization.



Nenhum valor real deverá ser versionado.



---



## 15. Estratégia de Espera e Estabilidade



Na automação frontend são evitados:



- sleeps fixos;

- waits arbitrários;

- seletores frágeis;

- dependência desnecessária de ordem.



O Playwright utiliza:



- auto-wait;

- assertions com espera;

- locators resilientes;

- condições baseadas em estado real da aplicação.



Retries não serão utilizados para esconder defeitos.



Quando configurados, deverão servir para diagnóstico de instabilidade.



---



## 16. Investigação de Falhas



Falhas deverão possuir informação suficiente para diagnóstico.



Poderão ser coletados:



- logs;

- relatório Robot Framework;

- relatório Playwright;

- screenshot;

- trace;

- erro de console;

- falha de rede;

- resposta HTTP;

- resultado da pipeline.



O objetivo é diferenciar:



- falha funcional;

- falha de automação;

- falha de ambiente;

- indisponibilidade externa.



---



## 17. CI/CD



A execução contínua foi implementada com GitHub Actions.



A pipeline executa:



1\. checkout;

2\. configuração do ambiente;

3\. instalação das dependências;

4\. configuração segura de secrets;

5\. testes de API;

6\. UI smoke;

7\. testes adicionais selecionados;

8\. geração de relatórios;

9\. preservação de artifacts;

10\. avaliação do Quality Gate.



---



## 18. Quality Gate



O Quality Gate combina priorização por criticidade com o resultado técnico das suítes automatizadas executadas no pipeline.



Na implementação atual, o gate final depende do sucesso integral dos jobs de API e UI.



O job de API executa:

- Robot Framework;

- Postman/Newman;

- performance smoke com k6.



O job de UI executa:

- smoke em Firefox;

- smoke em WebKit;

- suíte de qualidade em Chromium.



Critérios adotados:

- falhas P0 são obrigatoriamente bloqueadoras;

- falhas não esperadas nas validações automatizadas executadas pelo pipeline tornam o respectivo job não aprovado;

- falha em qualquer job obrigatório de API ou UI bloqueia o Quality Gate final;

- quebras críticas de contrato bloqueiam;

- criticidades P1, P2 e P3 continuam sendo utilizadas para priorização, análise de risco e decisão de cobertura;

- problemas conhecidos deverão ser explicitamente documentados e tratados de forma transparente, sem mascarar novas regressões.



O gate poderá evoluir conforme a suíte, os riscos e as necessidades de qualidade do projeto evoluam.



---



## 19. Critérios de Entrada



A execução de uma camada poderá iniciar quando:



- ambiente estiver disponível;

- dependências estiverem instaladas;

- credenciais necessárias estiverem configuradas;

- documentação mínima estiver compreendida;

- cenário estiver definido;

- dados necessários estiverem disponíveis.



---



## 20. Critérios de Saída



A entrega será considerada tecnicamente concluída quando:



- cenários prioritários estiverem documentados;

- automações selecionadas estiverem executáveis;

- testes críticos estiverem passando ou possuírem falha documentada;

- evidências estiverem disponíveis;

- riscos residuais estiverem registrados;

- README possuir instruções suficientes;

- nenhuma credencial estiver versionada;

- pipeline principal estiver funcional;

- limitações conhecidas estiverem documentadas.



---



## 21. Critérios de Aprovação



A execução será considerada aprovada quando:



- os jobs obrigatórios de API e UI executados no pipeline estiverem aprovados;

- todos os testes P0 automatizados estiverem passando;

- não houver quebra crítica de contrato;

- não houver falha bloqueadora conhecida sem documentação;

- o Quality Gate final estiver aprovado.



---



## 22. Critérios de Falha



A execução será considerada não aprovada quando ocorrer:



- falha P0;

- falha não esperada em validação automatizada obrigatória executada pelo pipeline;

- falha em qualquer job obrigatório de API ou UI;

- autenticação crítica indisponível;

- quebra de contrato crítico;

- indisponibilidade comprovadamente causada pela aplicação alvo em cenário crítico;

- falha do Quality Gate final.



Falhas externas deverão ser classificadas separadamente antes de concluir regressão.



---



## 23. Estratégia de Regressão



A regressão é dividida em níveis.



### Smoke



Feedback rápido e obrigatório.



### Regression



Cobertura mais ampla de API e UI.



### Cross-browser Smoke



Executado em motores adicionais quando aplicável.



### Performance Smoke



Executado de forma controlada.



A separação permite equilibrar cobertura, velocidade e custo.



---



## 24. Testes Exploratórios



Os testes exploratórios utilizaram charters simples.



Cada sessão poderá registrar:



- objetivo;

- área explorada;

- riscos;

- comportamento observado;

- evidências;

- bugs;

- cenários adicionais;

- decisão de automação.



A exploração complementou a automação e ajudou a evitar testes baseados apenas no enunciado.



---



## 25. Limitações



A solução possui limitações relacionadas a:



- sistemas externos;

- disponibilidade;

- dados dinâmicos;

- alterações não controladas;

- rede;

- permissões da conta;

- diferenças entre API alternativa e frontend.



Essas limitações estão registradas na documentação do projeto.



---



## 26. Uso de Inteligência Artificial



IA foi utilizada como ferramenta de apoio.



Usos registrados:



- brainstorming de riscos;

- revisão de estratégia;

- apoio na documentação;

- sugestões de implementação;

- revisão de código.



Todo conteúdo utilizado deverá ser:



- revisado;

- executado;

- validado contra documentação oficial;

- ajustado quando necessário.



As decisões finais de:



- arquitetura;

- estratégia;

- risco;

- prioridade;

- seleção de cenários;

- automação;

- assertions;



foram validadas e assumidas pela candidata.



---



## 27. Sustentabilidade da Suíte



A solução foi estruturada para favorecer:



- separação de responsabilidades;

- reutilização;

- legibilidade;

- baixo acoplamento;

- dados centralizados;

- configuration management;

- execução seletiva;

- relatórios úteis;

- diagnóstico rápido.



A quantidade de testes não foi utilizada como principal indicador de qualidade.



O foco é cobertura relevante com manutenção sustentável.



---



## 28. Conclusão



A estratégia proposta prioriza qualidade contínua e prevenção de defeitos dentro do SDLC.



A automação foi utilizada como mecanismo de feedback e controle de risco, e não como objetivo isolado.



As decisões técnicas permanecem rastreáveis por documentação, código, evidências e histórico de versionamento.

