# API de Clientes

API REST desenvolvida para cadastro e gerenciamento de clientes utilizando **Node.js, TypeScript, Express, MongoDB Atlas e Mongoose**.

O projeto foi desenvolvido como desafio técnico, com foco em organização de código, validação de dados, aplicação de regras de negócio, integração com banco de dados, tratamento de erros, documentação e testes da API.

## Tecnologias utilizadas

* Node.js 20+
* TypeScript
* Express
* MongoDB Atlas
* Mongoose
* Git
* GitHub
* Postman
* dotenv

## Funcionalidades

A API permite:

* Cadastrar clientes
* Listar clientes
* Consultar cliente por ID
* Atualizar dados do cliente
* Excluir clientes
* Validar CPF
* Impedir CPF duplicado
* Impedir e-mail duplicado
* Impedir alteração do CPF
* Validar telefone
* Validar data de nascimento
* Validar idade mínima de 18 anos
* Validar endereço
* Filtrar clientes por status
* Buscar clientes por nome
* Paginar a listagem
* Padronizar respostas de erro
* Registrar automaticamente `createdAt` e `updatedAt`

## Estrutura do projeto

```text
clientes-api/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   └── clienteController.ts
│   ├── models/
│   │   └── Cliente.ts
│   ├── routes/
│   │   └── clienteRoutes.ts
│   ├── services/
│   │   └── clienteService.ts
│   ├── validators/
│   │   └── clienteValidator.ts
│   └── server.ts
│
├── postman/
│   └── Clientes API.postman_collection.json
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

A aplicação utiliza separação de responsabilidades entre **routes, controllers, services, models, validators e config**.

## Configuração do ambiente

### Requisitos

* Node.js 20 ou superior
* npm
* Conta no MongoDB Atlas
* Banco de dados MongoDB Atlas configurado para conexão com a aplicação

### Instalação

Clone o repositório:

```bash
git clone https://github.com/AGHATAA/clientes-api.git
```

Entre na pasta:

```bash
cd clientes-api
```

Instale as dependências:

```bash
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto.

Utilize o `.env.example` como referência:

```env
PORT=3000
MONGODB_URI=
```

Preencha `MONGODB_URI` com a string de conexão do MongoDB Atlas.

O arquivo `.env` contém informações sensíveis e está incluído no `.gitignore`, não sendo publicado no GitHub.

## Execução

### Desenvolvimento

```bash
npm run dev
```

### Compilação

```bash
npm run build
```

### Execução da versão compilada

```bash
npm start
```

A API será disponibilizada, por padrão, em:

```text
http://localhost:3000
```

## Scripts disponíveis

```json
{
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

## Endpoints

### Cadastrar cliente

```http
POST /clientes
```

Exemplo de requisição:

```json
{
  "nome": "João da Silva",
  "cpf": "529.982.247-25",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999",
  "dataNascimento": "1995-05-10",
  "ativo": true,
  "endereco": {
    "cep": "01001-000",
    "logradouro": "Praça da Sé",
    "numero": "100",
    "complemento": "Apartamento 10",
    "bairro": "Sé",
    "cidade": "São Paulo",
    "estado": "sp"
  }
}
```

Resposta de sucesso:

```text
201 Created
```

### Listar clientes

```http
GET /clientes
```

A listagem possui paginação.

Exemplo:

```http
GET /clientes?page=1&limit=10
```

Exemplo de resposta:

```json
{
  "page": 1,
  "limit": 10,
  "total": 1,
  "totalPages": 1,
  "data": []
}
```

### Filtrar por status

```http
GET /clientes?ativo=true
```

Também é possível utilizar:

```http
GET /clientes?ativo=false
```

### Buscar por nome

```http
GET /clientes?nome=joao
```

A busca por nome não diferencia letras maiúsculas de minúsculas.

### Consultar cliente por ID

```http
GET /clientes/:id
```

Caso o cliente não seja encontrado:

```text
404 Not Found
```

### Atualizar cliente

```http
PUT /clientes/:id
```

Exemplo:

```json
{
  "nome": "João da Silva Atualizado"
}
```

Os dados enviados na atualização são novamente submetidos às regras de validação da API.

O CPF não pode ser alterado após o cadastro.

Caso seja enviada uma tentativa de alteração do CPF:

```json
{
  "cpf": "11144477735"
}
```

A API retorna:

```http
400 Bad Request
```

```json
{
  "error": "CPF_INVALID_UPDATE",
  "message": "O CPF do cliente não pode ser alterado."
}
```

### Excluir cliente

```http
DELETE /clientes/:id
```

A aplicação utiliza **exclusão física**, removendo definitivamente o documento do MongoDB.

Resposta de sucesso:

```text
204 No Content
```

## Regras de negócio

### CPF

* Obrigatório
* Deve possuir exatamente 11 números após a remoção da máscara
* Deve ser um CPF válido
* Aceita CPF com ou sem máscara
* É armazenado somente com números
* Não permite CPF duplicado
* Não pode ser alterado após o cadastro

Exemplos aceitos:

```text
52998224725
529.982.247-25
```

### Nome

* Obrigatório
* Deve possuir pelo menos 3 caracteres
* Não aceita valores contendo somente espaços
* Espaços no início e no final são removidos

### E-mail

* Obrigatório
* Deve possuir formato válido
* Não permite e-mails duplicados
* É armazenado em letras minúsculas

### Telefone

* Obrigatório
* Deve possuir DDD
* Deve possuir entre 10 e 13 números
* Aceita telefone com ou sem máscara
* É armazenado somente com números

### Data de nascimento

* Obrigatória
* Não pode ser uma data futura
* O cliente deve possuir pelo menos 18 anos

### Status

O campo `ativo` deve ser booleano.

Quando não informado, o valor padrão é:

```text
true
```

### Endereço

São obrigatórios:

* CEP
* Logradouro
* Número
* Bairro
* Cidade
* Estado

O estado deve possuir exatamente duas letras e é armazenado em letras maiúsculas.

O complemento é opcional.

## Auditoria

O model de cliente utiliza:

```text
timestamps: true
```

Com isso, o Mongoose registra automaticamente:

* `createdAt`
* `updatedAt`

O campo `updatedAt` é atualizado quando os dados do cliente são modificados.

## Respostas de erro

A API utiliza respostas padronizadas para erros.

### CPF ou e-mail duplicado

Exemplo:

```json
{
  "error": "EMAIL_ALREADY_EXISTS",
  "message": "Já existe um cliente cadastrado com este e-mail."
}
```

### Erro de validação

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Existem campos inválidos na requisição.",
  "details": [
    {
      "field": "email",
      "message": "Informe um e-mail válido."
    }
  ]
}
```

### Cliente não encontrado

```json
{
  "error": "CLIENT_NOT_FOUND",
  "message": "Cliente não encontrado."
}
```

### Erro interno

```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "Ocorreu um erro interno ao processar a solicitação."
}
```

A API não retorna credenciais, URI do MongoDB, stack trace ou outras informações sensíveis ao consumidor.

## Códigos HTTP utilizados

| Código | Descrição |
|---|---|
| 200    | Consulta ou atualização realizada com sucesso |
| 201    | Cliente criado com sucesso                    |
| 204    | Cliente excluído com sucesso                  |
| 400    | Erro de validação ou regra de negócio         |
| 404    | Cliente não encontrado                        |
| 409    | CPF ou e-mail já cadastrado                   |
| 500    | Erro interno do servidor                      |

## Postman

A API foi testada utilizando o **Postman**.

A Collection está disponível no diretório:

```text
postman/Clientes API.postman_collection.json
```

A Collection utiliza a variável:

```text
{{baseUrl}}
```

Com valor padrão para execução local:

```text
http://localhost:3000
```

### Cenários testados

* Cadastro de cliente válido
* Cadastro com CPF inválido
* Cadastro com CPF duplicado
* Cadastro com e-mail inválido
* Cadastro com e-mail duplicado
* Cadastro de cliente menor de 18 anos
* Cadastro com data de nascimento futura
* Listagem de clientes
* Listagem com paginação
* Listagem por status
* Busca por nome
* Consulta de cliente por ID
* Consulta de cliente inexistente
* Atualização de nome
* Atualização de e-mail
* Tentativa de alteração do CPF
* Exclusão de cliente
* Tentativa de exclusão de cliente inexistente

## Decisões técnicas

### Separação de responsabilidades

A aplicação foi organizada separando responsabilidades entre:

* `controllers`: recebem as requisições e retornam as respostas HTTP
* `services`: concentram as regras de negócio
* `validators`: realizam as validações dos dados
* `models`: representam os documentos do MongoDB
* `routes`: definem os endpoints
* `config`: concentra a configuração da conexão com o banco

### Banco de dados

Foi utilizado **MongoDB Atlas** como banco de dados da aplicação, com acesso realizado por meio do **Mongoose**.

### Exclusão

Foi adotada a **exclusão física**, removendo definitivamente o documento do MongoDB.

### Variáveis de ambiente

As credenciais e configurações sensíveis são armazenadas em variáveis de ambiente.

O arquivo `.env` está incluído no `.gitignore` e não é publicado no repositório.

## Git e versionamento

O projeto foi desenvolvido utilizando **Git e GitHub**, mantendo commits separados para registrar a evolução da aplicação.

Exemplos de alterações versionadas:

```text
feat: adiciona cadastro de clientes
fix: corrige collection do Postman
docs: adiciona exemplo de variáveis de ambiente
chore: remove arquivos vazios não utilizados
```

## Validação do projeto

A aplicação foi compilada com sucesso utilizando:

```bash
npm run build
```

A versão compilada também foi executada utilizando:

```bash
npm start
```

A conexão com o MongoDB Atlas foi validada e os endpoints foram testados utilizando o Postman.

## Melhorias futuras

Possíveis melhorias futuras:

* Documentação com Swagger/OpenAPI
* Testes automatizados
* Logs estruturados
* ESLint e Prettier
* Docker e Docker Compose
* Deploy da API em ambiente de nuvem
* Testes automatizados na Collection do Postman
* Middleware centralizado para tratamento de erros

## Status do projeto

**Concluído como desafio técnico.**

Projeto desenvolvido para demonstrar conhecimentos em desenvolvimento backend, API REST, TypeScript, Node.js, MongoDB Atlas, Mongoose, organização de código, validação de dados, regras de negócio, Git, GitHub e documentação técnica.
