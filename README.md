# API de Clientes

API REST desenvolvida para cadastro e gerenciamento de clientes utilizando **Node.js, TypeScript, Express, MongoDB Atlas e Mongoose**.

O projeto foi desenvolvido como desafio técnico, com foco em organização de código, validação de dados, regras de negócio, integração com banco de dados, tratamento de erros e testes da API.

## Tecnologias utilizadas

* Node.js 20+
* TypeScript
* Express
* MongoDB Atlas
* Mongoose
* Git
* GitHub
* Postman

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

## Estrutura do projeto

```text
src/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── validators/
├── app.ts
└── server.ts

postman/
└── API de clientes.postman_collection.json

.env
.env.example
.gitignore
package.json
tsconfig.json
```

A aplicação utiliza separação de responsabilidades entre **routes, controllers, services, models, validators e middlewares**.

## Configuração do ambiente

### Requisitos

* Node.js 20 ou superior
* npm
* Conta no MongoDB Atlas
* Banco de dados MongoDB configurado para conexão com a aplicação

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

> O arquivo `.env` contém informações sensíveis e não deve ser publicado no GitHub.

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

## Endpoints

### Cadastrar cliente

```http
POST /clientes
```

Exemplo:

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
    "estado": "SP"
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

### Filtrar por status

```http
GET /clientes?ativo=true
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

Os campos permitidos podem ser atualizados respeitando as regras de validação da API.

O CPF não pode ser alterado após o cadastro.

### Excluir cliente

```http
DELETE /clientes/:id
```

A aplicação utiliza exclusão física do documento no MongoDB.

Resposta de sucesso:

```text
204 No Content
```

## Regras de negócio

### CPF

* Obrigatório
* Deve possuir 11 números
* Deve ser um CPF válido
* Aceita CPF com ou sem máscara
* É armazenado somente com números
* Não permite CPF duplicado
* Não pode ser alterado após o cadastro

### Nome

* Obrigatório
* Mínimo de 3 caracteres
* Não aceita somente espaços
* Espaços no início e no final são removidos

### E-mail

* Obrigatório
* Deve possuir formato válido
* Não permite e-mails duplicados
* É armazenado em letras minúsculas

### Telefone

* Obrigatório
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

```json
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

Exemplo de conflito:

```json
{
  "error": "EMAIL_ALREADY_EXISTS",
  "message": "Já existe um cliente cadastrado com este e-mail."
}
```

Exemplo de erro de validação:

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

A API não deve retornar informações sensíveis, como credenciais, URI do MongoDB ou stack trace.

## Códigos HTTP utilizados

| Código | Descrição                                     |
| ------ | --------------------------------------------- |
| 200    | Consulta ou atualização realizada com sucesso |
| 201    | Cliente criado com sucesso                    |
| 204    | Cliente excluído com sucesso                  |
| 400    | Erro de validação ou regra de negócio         |
| 404    | Cliente não encontrado                        |
| 409    | CPF ou e-mail já cadastrado                   |
| 500    | Erro interno do servidor                      |

## Postman

A API foi testada utilizando o **Postman**.

A Collection exportada está disponível no diretório:

```text
postman/API de clientes.postman_collection.json
```

Os principais cenários testados incluem:

* Cadastro de cliente válido
* CPF inválido
* CPF duplicado
* E-mail inválido
* E-mail duplicado
* Cliente menor de 18 anos
* Data de nascimento futura
* Listagem de clientes
* Paginação
* Filtro por status
* Consulta por ID
* Consulta de cliente inexistente
* Atualização de nome
* Atualização de e-mail
* Tentativa de alteração do CPF
* Exclusão de cliente
* Tentativa de exclusão de cliente inexistente

A Collection utiliza a variável:

```text
{{baseUrl}}
```

Com o seguinte valor no ambiente local:

```text
http://localhost:3000
```

## Decisões técnicas

### Separação de responsabilidades

A aplicação foi organizada separando responsabilidades entre:

* `controllers`: recebem as requisições e retornam as respostas HTTP
* `services`: concentram as regras de negócio
* `validators`: realizam as validações dos dados
* `models`: representam os documentos do MongoDB
* `routes`: definem os endpoints
* `middlewares`: realizam o tratamento de erros
* `config`: concentra as configurações da aplicação

### Exclusão

Foi adotada a exclusão física dos clientes, removendo o documento do MongoDB.

### Segurança

As credenciais do MongoDB são armazenadas em variáveis de ambiente.

O arquivo `.env` está incluído no `.gitignore` e não deve ser publicado no repositório.

## Validação do projeto

A aplicação foi compilada com sucesso utilizando:

```bash
npm run build
```

Também foram realizados testes dos endpoints utilizando o Postman, incluindo cenários de sucesso, validação, conflito e recursos não encontrados.

## Melhorias futuras

Possíveis melhorias futuras:

* Documentação com Swagger/OpenAPI
* Testes automatizados
* Logs estruturados
* ESLint e Prettier
* Docker e Docker Compose
* Deploy da API em ambiente de nuvem
* Testes automatizados na Collection do Postman

## Status do projeto

**Concluído como desafio técnico.**

Projeto desenvolvido para demonstrar conhecimentos em desenvolvimento backend, API REST, TypeScript, Node.js, MongoDB, organização de código, validação de dados e regras de negócio.
