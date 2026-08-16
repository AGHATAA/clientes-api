# API de Clientes

API REST desenvolvida para cadastro e gerenciamento de clientes, utilizando Node.js, TypeScript, Express, MongoDB Atlas e Mongoose.

O projeto foi desenvolvido como desafio técnico, com foco em organização de código, validação de dados, regras de negócio, integração com banco de dados, tratamento de erros e documentação.

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
├── clientes-api.postman_collection.json
└── clientes-api.postman_environment.json

.env
.env.example
.gitignore
package.json
tsconfig.json
README.md
```

A aplicação utiliza separação de responsabilidades entre rotas, controllers, services, models, validators e middlewares.

## Configuração do ambiente

### Requisitos

* Node.js 20 ou superior
* npm
* Conta no MongoDB Atlas
* MongoDB Atlas configurado para permitir a conexão da aplicação

### Instalação

Clone o repositório e entre na pasta do projeto:

```bash
git clone URL_DO_REPOSITORIO
cd clientes-api
```

Instale as dependências:

```bash
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto.

Utilize como referência o arquivo `.env.example`:

```env
PORT=3000
MONGODB_URI=
```

Preencha `MONGODB_URI` com a string de conexão do MongoDB Atlas.

> O arquivo `.env` não deve ser publicado no GitHub.

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

```http
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

A busca por nome não diferencia letras maiúsculas e minúsculas.

### Consultar cliente por ID

```http
GET /clientes/:id
```

Caso o cliente não seja encontrado:

```http
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

Também é possível atualizar outros dados permitidos, respeitando as validações da API.

O CPF não pode ser alterado.

Caso seja enviada uma tentativa de alteração:

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

A aplicação utiliza exclusão física do documento no MongoDB.

Resposta de sucesso:

```http
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
* Espaços desnecessários no início e no fim são removidos

### E-mail

* Obrigatório
* Deve possuir formato válido
* Não permite e-mails duplicados
* É armazenado em letras minúsculas

### Telefone

* Obrigatório
* Deve possuir DDD
* Aceita entre 10 e 13 números
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

## Respostas de erro

A API utiliza um formato padronizado para erros.

Exemplo:

```json
{
  "error": "EMAIL_ALREADY_EXISTS",
  "message": "Já existe um cliente cadastrado com este e-mail."
}
```

Erro de validação:

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

Erro interno:

```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "Ocorreu um erro interno ao processar a solicitação."
}
```

A API não retorna stack trace, credenciais, URI do MongoDB ou outras informações sensíveis ao consumidor.

## Códigos HTTP utilizados

| Código | Utilização                                    |
| ------ | --------------------------------------------- |
| 200    | Consulta ou atualização realizada com sucesso |
| 201    | Cliente criado com sucesso                    |
| 204    | Cliente excluído com sucesso                  |
| 400    | Erro de validação ou regra de negócio         |
| 404    | Cliente não encontrado                        |
| 409    | CPF ou e-mail já cadastrado                   |
| 500    | Erro interno não previsto                     |

## Postman

O projeto possui uma Collection do Postman para testar os principais cenários da API.

A Collection utiliza a variável:

```text
{{baseUrl}}
```

Com o seguinte valor:

```text
http://localhost:3000
```

Os cenários contemplados incluem:

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

## Decisões técnicas

### Separação de responsabilidades

A aplicação foi organizada separando responsabilidades entre:

* `controllers`: recebem as requisições e retornam as respostas HTTP
* `services`: concentram as regras de negócio
* `validators`: realizam as validações dos dados
* `models`: representam os documentos do MongoDB
* `routes`: definem os endpoints
* `middlewares`: realizam o tratamento de erros
* `config`: concentra configurações da aplicação

### Exclusão

Foi adotada a exclusão física dos clientes, utilizando a remoção do documento no MongoDB.

### Segurança

As credenciais do MongoDB são armazenadas em variáveis de ambiente.

O arquivo `.env` está incluído no `.gitignore` e não deve ser publicado no repositório.

## Melhorias futuras

Como possíveis melhorias futuras:

* Documentação com Swagger/OpenAPI
* Testes automatizados
* Logs estruturados
* ESLint e Prettier
* Docker e Docker Compose
* Deploy da API em ambiente de nuvem
* Implementação de testes automatizados na Collection do Postman

## Status do projeto

Projeto desenvolvido como desafio técnico para avaliação de conhecimentos em desenvolvimento backend, API REST, TypeScript, MongoDB, organização de código e regras de negócio.
