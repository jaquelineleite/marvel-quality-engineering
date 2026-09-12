# Postman / Newman API Smoke Tests

## Objetivo

Esta pasta contém uma collection Postman utilizada como camada complementar de smoke testing da Marvel Developer API.

A collection não substitui a cobertura principal implementada com Robot Framework.

Seu objetivo é fornecer:

- validação rápida de autenticação;
- execução manual no Postman;
- execução automatizada com Newman;
- integração com o GitHub Actions;
- portabilidade dos cenários prioritários de API.

---

## Arquivos

```text
postman/
├── marvel-developer-api.postman_collection.json
├── marvel-local.postman_environment.json
└── README.md
```

### Collection

`marvel-developer-api.postman_collection.json`

Contém os cenários automatizados.

### Environment local

`marvel-local.postman_environment.json`

Contém:

- URL da API;
- variável vazia para token.

Nenhuma credencial real é versionada.

---

## API utilizada

Endpoint:

`https://api.marvelapp.com/graphql/`

Protocolo:

- HTTP;
- GraphQL;
- JSON;
- autenticação Bearer Token.

---

## Cobertura atual

A collection possui três requests principais.

### AUTH-01 - Token válido

Valida:

- HTTP 200;
- presença de `data.user`;
- identificador de usuário válido;
- username preenchido;
- ausência de erros GraphQL.

### AUTH-02 - Sem autenticação

Valida:

- HTTP 400;
- presença de erros GraphQL.

### AUTH-03 - Token inválido

Valida:

- HTTP 401;
- mensagem indicando token inválido ou expirado.

O token utilizado nesse cenário negativo é fictício e existe apenas para validação do comportamento de erro.

---

## Execução manual no Postman

Para executar manualmente:

1. importar `marvel-developer-api.postman_collection.json`;
2. importar `marvel-local.postman_environment.json`;
3. configurar localmente o valor de `MARVEL_API_TOKEN`;
4. selecionar o environment;
5. executar a collection.

O token real não deve ser salvo no repositório.

---

## Execução local com Newman

Com `MARVEL_API_TOKEN` já definido de forma segura no ambiente do shell, executar a partir da raiz do repositório:

    npx --yes newman@6.2.2 run \
      postman/marvel-developer-api.postman_collection.json \
      --env-var "MARVEL_API_TOKEN=$MARVEL_API_TOKEN"

A versão `6.2.2` foi utilizada e validada durante o desenvolvimento deste projeto.

### Resultado local observado

- Iterações: 1;
- Requests: 3;
- Requests com falha: 0;
- Test scripts: 3;
- Assertions: 8;
- Assertions com falha: 0;
- tempo médio observado: 592 ms.

Resultado:

**3 requests / 8 assertions / 0 failures.**

---

## GitHub Actions

A collection também faz parte do Quality Gate automatizado.

O workflow executa Newman no job de API após a suíte Robot Framework e antes do smoke de performance com k6.

No CI, o token é obtido através do GitHub Actions Secret:

`MARVEL_API_TOKEN`

Nenhuma credencial real é armazenada na collection, no environment versionado ou no workflow.

A execução integrada ao GitHub Actions foi validada com status `Success`.

---

## Papel desta camada na estratégia

Robot Framework permanece como a camada principal de automação funcional da API.

Postman/Newman foi mantido como smoke complementar para:

- autenticação;
- rápida inspeção manual;
- portabilidade;
- execução via CLI;
- integração adicional com CI/CD.

Essa separação evita duplicar desnecessariamente toda a suíte de API em duas ferramentas.

---

## Segurança

As seguintes práticas foram adotadas:

- token real fora do repositório;
- environment versionado sem valor secreto;
- segredo fornecido em runtime;
- token inválido do cenário negativo é fictício;
- execução no CI através de GitHub Actions Secret.

O arquivo `.env` da raiz também permanece ignorado pelo Git.
