# AI Usage

## Objetivo

Este documento registra de forma transparente como ferramentas de Inteligência Artificial foram utilizadas durante o desenvolvimento do desafio Marvel Quality Engineering.

A IA foi utilizada como ferramenta de apoio para:

- brainstorming técnico;
- estruturação inicial da estratégia;
- revisão de cenários;
- sugestões de organização do repositório;
- apoio na elaboração de comandos e configurações;
- revisão de documentação;
- análise de possíveis riscos;
- troubleshooting durante a evolução da automação.

Nenhum resultado de teste foi considerado válido apenas porque foi sugerido ou produzido com auxílio de IA.

As decisões e entregas foram submetidas a validação por execução real, inspeção dos resultados e ajustes manuais.

---

## Princípio adotado

A IA foi tratada como um acelerador de engenharia, e não como fonte de verdade.

O fluxo utilizado foi:

1. obter uma sugestão ou hipótese;
2. analisar se a proposta fazia sentido para o contexto;
3. implementar ou experimentar;
4. executar localmente;
5. analisar logs e resultados;
6. ajustar quando necessário;
7. somente então registrar o comportamento como evidência.

Quando uma sugestão não correspondia ao comportamento real do sistema, prevalecia o resultado observado na execução.

---

## Onde a IA foi utilizada

### Estratégia de testes

A IA auxiliou na organização inicial das possíveis camadas de qualidade, incluindo:

- testes funcionais de API;
- cenários negativos;
- automação web;
- performance;
- acessibilidade;
- responsividade;
- cross-browser;
- CI/CD;
- Quality Gate.

A priorização final foi organizada com base em risco, valor para o desafio e custo de execução.

### Análise de riscos

A IA foi utilizada como apoio para levantar riscos potenciais.

Os riscos somente foram mantidos na documentação quando eram coerentes com:

- o escopo do desafio;
- a arquitetura encontrada;
- o comportamento observado durante as execuções;
- as limitações dos sistemas externos utilizados.

A matriz de riscos foi refinada ao longo do desenvolvimento conforme novos comportamentos reais eram encontrados.

### Automação de API

A IA foi utilizada como apoio na estruturação de cenários e na revisão de possibilidades de validação para a API GraphQL.

As sugestões foram verificadas diretamente contra o comportamento real da Marvel Developer API.

Exemplos de validações realizadas:

- autenticação com token válido;
- ausência de autenticação;
- token inválido;
- estrutura de respostas GraphQL;
- paginação;
- metadata de rate limit;
- sintaxe GraphQL inválida;
- campo inexistente;
- tipo de variável incompatível.

Nem todas as hipóteses iniciais foram mantidas.

Por exemplo, durante a investigação dos erros GraphQL foi observado que nem todas as respostas de erro possuem a mesma estrutura. A validação do contrato foi ajustada para refletir o comportamento realmente observado, evitando impor uma propriedade que não era garantida em todos os casos.

### Automação de UI

A IA apoiou:

- sugestões de locators;
- organização do Page Object Model;
- revisão dos cenários de smoke e regressão;
- investigação de problemas de estabilidade;
- estruturação da estratégia cross-browser.

Os locators e fluxos não foram aceitos sem inspeção da aplicação e execução real.

Durante a automação foi identificado que o botão utilizado para abrir o seletor de heróis permanecia em animação contínua e não atingia estabilidade suficiente para o clique padrão do Playwright.

Após investigação do comportamento da página, foi adotado `force: true` exclusivamente nesse controle conhecido.

A decisão foi localizada e documentada, em vez de utilizar clique forçado indiscriminadamente na suíte.

### Troubleshooting de flakiness

Durante a execução paralela foi identificado comportamento instável na leitura dos detalhes do herói.

A solução foi ajustada utilizando espera baseada em condição com `expect.poll`, verificando que o conteúdo estivesse realmente disponível.

Não foram adicionados sleeps arbitrários para mascarar o problema.

A alteração somente foi mantida após nova execução da suíte e confirmação de estabilidade.

### Responsividade

A IA auxiliou na elaboração das hipóteses de validação para viewport mobile.

A execução real mostrou:

- `clientWidth = 390`;
- `scrollWidth = 1400`;
- seletor de heróis aproximadamente em `x = 771 px`.

Com base nesses dados, os cenários foram registrados como known issues e expected failures.

A IA não foi utilizada para declarar sucesso onde a aplicação apresentava comportamento defeituoso.

### Acessibilidade

A IA ajudou na organização da estratégia de integração com axe-core e na interpretação inicial dos resultados.

A execução automatizada identificou violações reais, incluindo:

- `html-has-lang`;
- `image-alt`;
- `link-name`.

A violação crítica `image-alt` foi mantida como baseline conhecido porque pertence à aplicação externa avaliada.

O gate foi configurado para continuar detectando novas violações críticas inesperadas.

### CI/CD

A IA foi utilizada como apoio na estruturação e revisão do workflow do GitHub Actions.

Cada evolução do pipeline foi realizada incrementalmente e validada através de execuções reais.

Foram confirmadas no CI:

- suíte Robot Framework;
- collection Postman executada com Newman;
- performance smoke com k6;
- smoke em Firefox;
- smoke em WebKit;
- suíte principal em Chromium;
- Quality Gate final.

Uma alteração somente foi considerada concluída após o pipeline correspondente terminar com sucesso.

---

## Segurança e uso de credenciais

Sugestões relacionadas a autenticação foram revisadas para evitar armazenamento de credenciais no repositório.

Foram adotadas as seguintes práticas:

- `.env` ignorado pelo Git;
- `.env.example` sem credencial real;
- token carregado por variável de ambiente;
- GitHub Actions Secret para execução no CI;
- verificações no working tree e histórico Git;
- revisão de arquivos antes dos commits;
- ausência de credenciais reais nas collections versionadas.

A automação foi estruturada para reduzir também a exposição do token em logs de execução.

---

## Ajustes manuais realizados

O conteúdo sugerido com apoio de IA passou por ajustes conforme o comportamento real encontrado.

Entre os principais exemplos estão:

- adaptação da estratégia após indisponibilidade da API originalmente indicada;
- utilização da API alternativa autorizada;
- tratamento da API e da UI como alvos independentes;
- adequação do contrato de erros GraphQL aos diferentes formatos observados;
- suporte a conta sem projetos cadastrados;
- tratamento específico do botão continuamente animado;
- substituição de sincronização instável por espera baseada em condição;
- criação do baseline de acessibilidade somente após execução real;
- registro dos problemas responsivos como expected failures;
- definição de cross-browser seletivo em vez de regressão completa em três engines;
- limitação deliberada da carga de performance em serviço externo;
- evolução incremental do Quality Gate.

Esses ajustes foram decisões técnicas tomadas a partir de evidências obtidas durante o desenvolvimento.

---

## Decisões de engenharia

A IA forneceu possibilidades, mas não determinou automaticamente a arquitetura final.

Entre as decisões técnicas mantidas sob responsabilidade da autora do projeto estão:

- adoção de Robot Framework e Python para a camada principal de API;
- uso complementar de Postman/Newman sem duplicar toda a cobertura;
- utilização de Playwright com TypeScript para UI;
- aplicação de Page Object Model;
- uso de k6 para performance;
- priorização dos testes por risco;
- separação entre API e UI por ausência de integração comprovada;
- escolha do Chromium para a suíte principal;
- smoke complementar em Firefox e WebKit;
- tratamento explícito de known issues;
- critérios utilizados no Quality Gate;
- definição do que automatizar e do que manter fora do escopo.

---

## Critério para aceitar sugestões de IA

Uma sugestão somente foi incorporada quando atendia pelo menos aos seguintes critérios:

1. era compatível com o contexto real do projeto;
2. não criava comportamento ou integração inexistente;
3. podia ser validada tecnicamente;
4. não expunha credenciais;
5. mantinha a legibilidade e sustentabilidade da solução;
6. apresentava benefício proporcional ao custo;
7. era confirmada por execução, inspeção ou documentação disponível.

Sugestões que não atendiam a esses critérios eram ajustadas ou descartadas.

---

## Limitações do uso de IA

A utilização de IA não substituiu:

- exploração manual da aplicação;
- execução dos testes;
- leitura de logs;
- inspeção do DOM;
- análise das respostas HTTP e GraphQL;
- análise dos relatórios;
- revisão do pipeline;
- investigação de falhas;
- tomada de decisão técnica.

Também não foram utilizados resultados fictícios para preencher documentação.

Métricas, falhas, known issues e resultados registrados neste repositório correspondem às execuções realizadas durante o desenvolvimento.

---

## Conclusão

A Inteligência Artificial foi utilizada como ferramenta de produtividade e apoio ao raciocínio durante o desafio.

O objetivo foi acelerar atividades de análise, estruturação, revisão e troubleshooting sem transferir para a ferramenta a responsabilidade pela qualidade da solução.

O processo adotado pode ser resumido como:

**sugestão → análise → implementação → execução → validação → ajuste → evidência**

A entrega final representa decisões técnicas verificadas através do comportamento real dos sistemas e das execuções automatizadas.
