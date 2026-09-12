# Limitations and Constraints

## Objetivo

Este documento registra limitações, restrições e decisões de escopo identificadas durante o desenvolvimento do projeto Marvel Quality Engineering.

O objetivo não é ocultar lacunas, mas tornar explícito:

- o que foi possível validar;
- o que depende de sistemas externos;
- o que não possui evidência suficiente para ser afirmado;
- quais decisões foram tomadas para evitar testes artificiais ou potencialmente inadequados.

---

## API originalmente indicada

A API originalmente relacionada ao Marvel Rivals apresentou indisponibilidade HTTP `502` durante a execução do desafio.

Por esse motivo, não foi possível construir uma suíte confiável utilizando o endpoint originalmente previsto.

Após orientação recebida no processo seletivo, foi utilizada como alternativa autorizada a Marvel Developer API:

`https://api.marvelapp.com/graphql/`

Essa alteração está documentada no projeto e não é apresentada como se a API alternativa fosse a API do Marvel Rivals.

---

## API e UI pertencem a domínios distintos

A Marvel Developer API e a página de heróis do Marvel Rivals não apresentaram uma relação funcional comprovada durante o desafio.

Por esse motivo:

- API e UI foram tratadas como alvos independentes de qualidade;
- não foi criado teste end-to-end API → UI artificial;
- não foi feita comparação de dados entre os dois sistemas;
- nenhuma integração inexistente foi assumida para aumentar artificialmente a cobertura.

Caso uma integração oficial entre esses sistemas seja disponibilizada, essa estratégia poderá ser revisada.

---

## Dados disponíveis na conta da API

A conta utilizada durante os testes retornou uma coleção de projetos vazia.

O comportamento observado foi válido e consistente:

- requisição autenticada com sucesso;
- estrutura GraphQL válida;
- `edges` vazio;
- `hasNextPage` falso;
- ausência de próximo cursor.

A automação foi construída para aceitar tanto coleções vazias quanto coleções populadas sem fabricar dados apenas para satisfazer o teste.

Não foram criados projetos ou outros dados via operação de escrita exclusivamente para aumentar a cobertura do desafio.

---

## Permissões e princípio de menor privilégio

A autenticação foi configurada somente com as permissões necessárias para as consultas executadas.

Foram utilizadas permissões de leitura compatíveis com o escopo testado.

Operações destrutivas ou de escrita não foram adicionadas apenas para demonstrar cobertura.

Essa decisão reduz risco sobre uma conta e um serviço externos que não são controlados pelo projeto.

---

## Aplicação web externa

A interface Marvel Rivals utilizada nos testes é uma aplicação externa, fora do controle deste projeto.

Isso significa que mudanças em:

- DOM;
- classes CSS;
- conteúdo;
- animações;
- disponibilidade;
- CDN;
- comportamento de componentes;

podem impactar a estabilidade da suíte sem que exista alteração no código deste repositório.

Os testes foram construídos buscando reduzir acoplamento desnecessário, mas essa dependência externa continua existindo.

---

## Comportamento do seletor de heróis

O controle utilizado para abrir o seletor de heróis apresenta animação contínua.

Durante a execução, o Playwright não considerava o elemento estável para clique padrão.

Foi utilizado `force: true` apenas nesse ponto específico após reprodução e análise do comportamento.

Essa solução é intencionalmente localizada e não deve ser interpretada como padrão para outros elementos.

Caso a aplicação altere esse componente, essa decisão deverá ser reavaliada.

---

## Performance

Os testes de performance foram deliberadamente limitados.

A Marvel Developer API é um serviço externo e não existe autorização conhecida para geração de carga elevada.

Por esse motivo, foi executado somente um smoke test de baixa carga:

- 1 Virtual User;
- 3 iterações.

Não foram executados testes agressivos de:

- stress;
- spike;
- endurance;
- soak;
- volume elevado.

O threshold de resposta utilizado no smoke é um critério do projeto e não representa SLA oficial do serviço.

Testes de carga mais amplos devem ser executados apenas em ambiente controlado e autorizado.

---

## Cross-browser

A cobertura cross-browser foi aplicada de maneira seletiva.

Foram executados smoke tests em:

- Chromium;
- Firefox;
- WebKit.

A suíte principal de qualidade permanece concentrada em Chromium.

A regressão completa em três engines foi mantida fora do escopo porque aumentaria significativamente o tempo e o custo de execução sem ganho proporcional para o objetivo atual.

Essa decisão pode ser revisada em um produto real conforme dados de uso dos navegadores, criticidade e histórico de defeitos.

---

## Acessibilidade

A validação automatizada de acessibilidade utiliza axe-core e cobre apenas regras que podem ser avaliadas automaticamente.

Foram identificadas violações reais na aplicação externa, incluindo uma ocorrência crítica de `image-alt`.

Essa violação foi registrada como baseline conhecido para permitir que o pipeline continue identificando novas violações críticas inesperadas.

Esse baseline:

- não significa que o problema esteja resolvido;
- não transforma a violação em comportamento aceitável;
- não representa certificação de acessibilidade;
- não substitui avaliação manual.

Validações manuais de teclado, leitor de tela, foco, conteúdo e experiência assistiva permanecem fora do escopo atual.

---

## Responsividade

A avaliação mobile foi concentrada em uma viewport de:

`390 x 844`

Foram observados:

- overflow horizontal;
- seletor de heróis fora da área visível.

Esses comportamentos foram registrados como known issues utilizando expected failures.

A utilização de expected failure significa que o defeito é esperado e monitorado, e não que o comportamento esteja funcionalmente correto.

Não foi realizada uma matriz completa de dispositivos, orientações, resoluções e densidades de tela.

A cobertura responsiva pode ser expandida para tablets e outras dimensões em uma evolução futura.

---

## Dependência de serviços externos

Tanto a API quanto a aplicação web utilizadas pertencem a terceiros.

Consequentemente, uma execução pode ser impactada por fatores externos ao código deste projeto, como:

- indisponibilidade temporária;
- latência;
- rate limiting;
- alterações de contrato;
- mudanças no DOM;
- CDN;
- bloqueios de rede;
- alterações de autenticação.

Uma falha desse tipo deve ser investigada antes de ser classificada automaticamente como regressão do produto.

---

## CI/CD

O GitHub Actions valida automaticamente as principais camadas implementadas:

- Robot Framework;
- Postman/Newman;
- k6;
- Playwright;
- cross-browser;
- Quality Gate final.

Entretanto, o pipeline depende da disponibilidade dos serviços externos testados.

Uma indisponibilidade da API ou do site pode causar falha no pipeline mesmo quando não existe alteração defeituosa no código de testes.

Por esse motivo, o troubleshooting deve diferenciar:

- falha da automação;
- falha funcional do alvo;
- problema de infraestrutura;
- indisponibilidade externa.

---

## Evidências e retenção

Os artifacts do GitHub Actions são configurados com retenção limitada.

Atualmente são publicados:

- `robot-api-results`;
- `playwright-results`.

A retenção configurada no workflow é de 14 dias.

Newman, k6 e as execuções cross-browser possuem evidência nos logs do pipeline, mas não possuem artifacts dedicados nesta versão do projeto.

Em um ambiente corporativo, os resultados poderiam ser enviados para armazenamento persistente, dashboards ou ferramentas de observabilidade.

---

## Cobertura de API

A cobertura de API priorizou consultas de leitura, autenticação, erros, contratos e paginação.

Não foram incluídas operações completas de criação, atualização e exclusão porque:

- o escopo utilizado possui foco em leitura;
- foi aplicado princípio de menor privilégio;
- não houve necessidade de modificar dados externos para demonstrar a estratégia.

Também não existe neste desafio uma interface assíncrona disponibilizada para validação.

Por isso, testes envolvendo mensageria, Kafka ou eventos assíncronos não foram simulados artificialmente.

---

## Segurança

Foram adotadas práticas preventivas relacionadas a secrets e autenticação, mas este projeto não representa um assessment completo de segurança.

Não foram realizados:

- penetration tests;
- fuzzing intensivo;
- DAST completo;
- análise de infraestrutura;
- varredura autenticada de vulnerabilidades;
- exploração ofensiva.

Qualquer avaliação desse nível deveria ocorrer somente com autorização explícita e ambiente apropriado.

---

## Escopo de UI

A automação está concentrada nos fluxos prioritários da página de heróis.

Não foi objetivo automatizar todas as páginas e interações existentes no site Marvel Rivals.

A seleção dos cenários considerou:

- risco;
- relevância funcional;
- estabilidade;
- tempo disponível;
- valor da automação.

Isso evita aumentar a quantidade de testes sem benefício proporcional de qualidade.

---

## Dispositivos móveis

A responsividade foi validada por viewport através do Playwright.

Não foram utilizados dispositivos físicos Android ou iOS.

Também não foram realizados testes nativos com Appium porque o alvo deste desafio é uma aplicação web.

Em um produto real, dispositivos físicos ou device farms poderiam complementar a cobertura quando houver risco relevante.

---

## Limitações de ambiente

Os resultados registrados representam as condições observadas durante as execuções realizadas neste projeto.

Eles não garantem comportamento idêntico em:

- outras regiões;
- outras redes;
- outros sistemas operacionais;
- outros perfis de usuário;
- contas com dados diferentes;
- versões futuras das aplicações.

A suíte foi construída para ser reexecutável, permitindo detectar mudanças futuras nessas condições.

---

## Itens deliberadamente não simulados

Para preservar a credibilidade técnica da entrega, não foram criadas implementações fictícias apenas para aumentar a quantidade de tecnologias demonstradas.

Não foram simulados sem necessidade real:

- Kafka;
- mensageria;
- AWS;
- aplicações mobile nativas;
- integrações inexistentes entre API e UI;
- grandes volumes de carga contra serviço externo;
- dados artificiais apresentados como resposta real do sistema.

A ausência desses itens é uma decisão consciente de escopo.

---

## Conclusão

As limitações deste projeto são explicitadas para diferenciar claramente:

- cobertura implementada;
- defeitos conhecidos;
- restrições externas;
- decisões de escopo;
- possibilidades futuras.

O objetivo foi priorizar profundidade e evidência real em vez de apresentar uma cobertura artificialmente ampla.

As limitações documentadas podem orientar futuras evoluções da estratégia caso o projeto seja executado em um ambiente controlado, com acesso ampliado e requisitos adicionais.
