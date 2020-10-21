# FastFeet back-end

<p align="center">
  <span>Português</span> |
  <a href="https://github.com/gpmarchi/gostack-fastfeet-backend/blob/master/lang/english/README.md#fastfeet-back-end">English</a>
</p>

Projeto desenvolvido como exercício para certificação do Bootcamp Gostack 10 da Rocketseat. API desenvolvida em Node.js com Express para uma aplicação de transportadoras controlando as encomendas, entregadores, destinatários e problemas nas entregas.

## Índice

- [Tecnologias e libs utilizadas](#-tecnologias-e-libs-utilizadas)
- [Requisitos iniciais](#-requisitos-iniciais)
- [Instalação](#-instalação)
- [Configurações](#-configurações)
- [Rotas da aplicação](#-rotas-da-aplicação)

## 🤖️ Tecnologias e libs utilizadas

Abaixo seguem as tecnologias utilizadas no desenvolvimento do projeto:

- [Node.js](https://nodejs.org/en/download/)
- [Express](https://expressjs.com/pt-br/)
- [Sequelize](https://sequelize.org/)
- [Postgres](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [multer](https://github.com/expressjs/multer)
- [bee-queue](https://github.com/bee-queue/bee-queue)
- [date-fns](https://date-fns.org/)
- [handlebars](https://handlebarsjs.com/)
- [jsonwebtoken](https://jwt.io/)
- [nodemailer](https://nodemailer.com/about/)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js#readme)
- [nodemon](https://nodemon.io/)
- [sequelize-cli](https://github.com/sequelize/cli)

## ✔️ Requisitos iniciais

Para poder rodar o projeto, é necessário que os itens abaixo estejam instalados:

- [Node.js](https://nodejs.org/en/download/) (v12.x.x)
- [npm](https://www.npmjs.com/get-npm) ou [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Redis](https://redis.io/)
- [git](https://git-scm.com/downloads)

### Opcionais

- [Postbird](https://www.electronjs.org/apps/postbird) (ou outro cliente para acesso ao banco de dados)
- [Insomnia](https://insomnia.rest/download/) (ou outro cliente REST para acesso às rotas da API)
- [docker](https://www.docker.com/)

Sugiro a instalação do docker com containeres para os bancos de dados utilizados na aplicação, PostgreSQL e Redis.

Caso opte pela utilização dos containeres, você pode rodar os comandos abaixo para instalá-los:

```bash
docker run -d --name postgres -e POSTGRESQL_PASSWORD=<password> -p 5432:5432 postgres
```

```bash
docker run -d --name redis -p 6379:6379 redis:alpine
```

## 🔔️ Instalação

Para instalar o projeto localmente na sua máquina, clonar o repositório (caso tenha clonado o projeto agregador `gostack-fastfeet`, não será necessário rodar o comando abaixo pois os arquivos já estarão em sua máquina dentro da pasta backend):

```bash
$ git clone https://github.com/gpmarchi/gostack-fastfeet-backend.git && cd gostack-fastfeet-backend
```

Rodar o comando abaixo para instalar as dependências:

```bash
$ npm install
```

## ⚙️ Configurações

Será necessário configurar as variáveis de ambiente necessárias para rodar o projeto. Para isso criar um arquivo chamado `.env` na raiz do projeto (utilizar como exemplo o arquivo `.env.example` também presente na raiz do projeto).

As informações que deverão ser preenchidas:

```env
# GENERAL VARIABLES
APP_URL=http://<endereço de ip da máquina rodando a api>:<porta>
NODE_ENV=development

# EXPRESS PORT
EXPRESS_PORT=<porta>

# JSON WEB TOKEN SECRET
JWT_SECRET=<sua senha jwt para geração do token de autenticação>

# DATABASE CONFIGS
DB_DIALECT=<dialeto da base de dados>
DB_HOST=<endereço de ip da máquina rodando o banco>
DB_USER=<usuário com acesso à base de dados>
DB_PASSWORD=<senha do usuário>
DB_NAME=<nome da base de dados>
DB_LOGGING=<true ou false para habilitar o logging das queries>

# REDIS
REDIS_HOST=<endereço de ip da máquina rodando o redis>
REDIS_PORT=<porta do redis>

# MAIL SENDING CONFIGS
MAIL_HOST=<endereço do servidor smtp para envio de e-mails>
MAIL_PORT=<porta do servidor de e-mails>
MAIL_IS_SECURE=<true ou false indicando o uso de segurança ssl>
MAIL_AUTH_USER=<usuário no servidor de e-mails>
MAIL_AUTH_PASSWORD=<senha do usuário>
MAIL_DEFAULT_FROM=Equipe FastFeet <noreply@fastfeet.com>

# SENTRY DSN
SENTRY_DSN=<dsn do sentry caso queira fazer o monitoramento de exceções>
```

É importante frisar que a base de dados deve ser criada com o mesmo nome preenchido na variável `DB_NAME`. Conforme citado anteriormente, foi utilizado o ORM Sequelize para fazer a integração com o banco de dados. As configurações de dialeto devem seguir as opções presentes na documentação do [sequelize](https://sequelize.org/v5/manual/dialects.html).

### Rodando migrations e seeds

Para criar as tabelas necessárias ao funcionamento da aplicação, utilizaremos o `sequelize` para rodar os comandos necessários. A criação das tabelas e relacionamentos será feita através do comando:

```bash
$ npx sequelize db:migrate
```

E para criar o usuário principal que fará acesso às funcionalidades do sistema, precisaremos rodar um seed de criação deste usuário:

```bash
$ npx sequelize db:seed:all
```

## 🏃️🏃‍♀️️ Rodando o projeto

A partir desse momento o ambiente já está preparado para rodarmos a API. Para iniciar o servidor em modo de desenvolvimento rodar o comando:

```bash
$ npm run dev
```

O servidor ficará rodando com live reload, habilitado através do nodemon. Caso seja necessário, é possível debugar a aplicação rodando o comando abaixo e conectando ao debugger através do vscode com as configurações disponibilizadas na sequência:

```bash
$ npm run dev:debug
```

Configurações do debugger do vscode:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "restart": true
    }
  ]
}
```

Também será necessário iniciar um processo paralelo ao servidor que fará o processamento das filas de envio de e-mails de notificação de novas encomendas e cancelamentos aos entregadores:

```bash
$ npm run queue
```

## 👨‍💻️ Testando as funcionalidades

As funcionalidades da aplicação poderão ser testadas através do workspace do Insomnia, cliente REST escolhido como apoio para o desenvolvimento da API .

Através do botão abaixo é possível importar esse workspace em sua máquina caso já tenha o Insomnia instalado. Basta clicar no botão e seguir os passos para finalizar a importação.

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Fastfeet%20API&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fgpmarchi%2Fgostack-fastfeet-backend%2Fmaster%2Finsomnia-workspace.json)

Para testar será necessário logar na API com o usuário padrão de testes utilizando a rota `Create` na pasta `Sessions`:

```json
{
  "email": "admin@fastfeet.com",
  "password": "123456"
}
```

Após feito o login será possível acessar qualquer rota protegida para fazer os cadastros e testar as demais funcionalidades da API.

## 🛣 Rotas da aplicação

Abaixo temos uma breve descrição com o funcionamento das rotas da aplicação. As rotas estão agrupadas de acordo com o recurso representado dentro da aplicação:

- [Sessions](#-sessions)
- [Recipients](#-recipients)
- [Deliverymen](#-deliverymen)
- [Files](#-files)
- [Parcels](#-parcels)
- [Pickups](#-pickups)
- [Delivery problems](#-delivery-problems)
- [Deliveries](#-deliveries)

### Sessions

- `POST /sessions`: Essa rota é responsável por logar o usuário administrador na aplicação. Ela recebe dentro do corpo da requisição o `email` e `password` para realizar a autenticação, e retorna uma resposta contendo um objeto `user` com os dados do usuário logado e o `token` no formato JWT que deverá ser utilizado nas demais requisições a rotas protegidas.

```json
{
  "user": {
    "id": 1,
    "name": "Distribuidora FastFeet",
    "email": "admin@fastfeet.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjAzMjI0OTMyLCJleHAiOjE2MDM4Mjk3MzJ9.eKBx8Bea79DwxE9TfC4QJFUYuE_FPj5IVTRSg_Mvw70"
}
```

### Recipients

- `POST /recipients`: Essa rota é responsável por cadastrar um destinatário na aplicação. Ela recebe dentro do corpo da requisição os campos `name`, `street`, `number`, `complement`, `state`, `city` e `zipcode`. Ao cadastrar corretamente o destinatário, um objeto contendo os dados registrados é retornado.

```json
{
  "id": 1,
  "name": "Recipient",
  "street": "Street address",
  "number": "123",
  "complement": "apt 34",
  "state": "São Paulo",
  "city": "São Paulo",
  "zipcode": "00000-000"
}
```

- `PATCH /recipients/:id`: Essa rota é responsável por atualizar os dados de um destinatário. Ela recebe como parâmetro da rota o id do destinatário a ser atualizado e dentro do corpo da requisição qualquer um dos campos `name`, `street`, `number`, `complement`, `state`, `city` e `zipcode` para atualização (ou todos, caso o recurso necessite ser atualizado por completo). Ao atualizar corretamente o destinatário, um objeto contendo os dados atualizados é retornado.

```json
{
  "id": 1,
  "name": "Recipient",
  "street": "Street address",
  "number": "123",
  "complement": "apt 34",
  "state": "São Paulo",
  "city": "São Paulo",
  "zipcode": "05435-902"
}
```

- `DELETE /recipients/:id`: Essa rota é responsável por excluir um destinatário. Ela recebe como parâmetro da rota o id do destinatário a ser excluído. Ao excluir corretamente o recurso, o servidor retorna uma resposta `200` sem conteúdo.

- `GET /recipients`: Essa rota é responsável por listar os destinatários cadastrados. O sistema está preparado para retornar a resposta paginada, para isso é necessário enviar os parâmetros de query `page` e `limit` indicando qual página dos dados deve ser recuperada e o limite de registros por página, respectivamente. Caso não sejam especificados os parâmetros, a resposta conterá todos os destinatários cadastrados. Nas respostas paginadas, além dos dados dos destinatários é retornado o total de páginas geradas (considerando os valores informados nos parâmetros `page` e `limit`).

  Exemplo de resposta paginada utilizando os parâmetros `page` com valor `1` e `limit` com valor `2`:

```json
{
  "recipients": [
    {
      "id": 3,
      "name": "Recipient",
      "street": "Street address",
      "number": "123",
      "complement": "apt 34",
      "state": "São Paulo",
      "city": "São Paulo",
      "zipcode": "00000-000"
    },
    {
      "id": 1,
      "name": "Recipient",
      "street": "Street address",
      "number": "123",
      "complement": "apt 34",
      "state": "São Paulo",
      "city": "São Paulo",
      "zipcode": "05435-902"
    }
  ],
  "totalPages": 3
}
```

- `GET /recipients/:id`: Essa rota é responsável por exibir um destinatário cadastrado. Ela recebe como parâmetro da rota o id do destinatário a ser exibido. Ao encontrar o recurso um objeto contendo seus dados é retornado.

```json
{
  "id": 1,
  "name": "Recipient",
  "street": "Street address",
  "number": "123",
  "complement": "apt 34",
  "state": "São Paulo",
  "city": "São Paulo",
  "zipcode": "05435-902"
}
```

### Deliverymen

- `POST /deliverymen`: Essa rota é responsável por cadastrar um entregador na aplicação. Ela recebe dentro do corpo da requisição os campos `name`, `email`, e `avatar_id`. Ao cadastrar corretamente o entregador, um objeto contendo os dados registrados é retornado.

```json
{
  "id": 2,
  "name": "Deliveryman",
  "email": "deliveryman@gmail.com",
  "avatar_id": 1,
  "createdAt": "2020-10-20T20:18:06.648Z"
}
```

- `PATCH /deliverymen/:id`: Essa rota é responsável por atualizar os dados de um entregador. Ela recebe como parâmetro da rota o id do entregador a ser atualizado e dentro do corpo da requisição qualquer um dos campos `name`, `email`, ou `avatar_id` para atualização (ou todos, caso o recurso necessite ser atualizado por completo). Ao atualizar corretamente o entregador, um objeto contendo os dados atualizados é retornado.

```json
{
  "id": 2,
  "name": "Deliveryman one",
  "email": "deliverymanone@gmail.com",
  "createdAt": "2020-10-20T20:18:06.648Z",
  "avatar_id": 1
}
```

- `DELETE /deliverymen/:id`: Essa rota é responsável por excluir um entregador. Ela recebe como parâmetro da rota o id do entregador a ser excluído. Ao excluir corretamente o recurso, o servidor retorna uma resposta `200` sem conteúdo.

- `GET /deliverymen`: Essa rota é responsável por listar os entregadores cadastrados. O sistema está preparado para retornar a resposta paginada, para isso é necessário enviar os parâmetros de query `page` e `limit` indicando qual página dos dados deve ser recuperada e o limite de registros por página, respectivamente. Caso não sejam especificados os parâmetros, a resposta conterá todos os entregadores cadastrados. Nas respostas paginadas, além dos dados dos entregadores é retornado o total de páginas geradas (considerando os valores informados nos parâmetros `page` e `limit`).

  Exemplo de resposta paginada utilizando os parâmetros `page` com valor `1` e `limit` com valor `2`:

```json
{
  "deliverymen": [
    {
      "id": 4,
      "name": "Deliveryman 2",
      "email": "deliveryman2@gmail.com",
      "avatar": null
    },
    {
      "id": 2,
      "name": "Deliveryman one",
      "email": "deliverymanone@gmail.com",
      "avatar": {
        "url": "http://localhost:3333/files/a64cf4128ac76c8b194250a07397aae5.png",
        "id": 1,
        "filename": "a64cf4128ac76c8b194250a07397aae5.png"
      }
    }
  ],
  "totalPages": 1
}
```

- `GET /deliverymen/:id`: Essa rota é responsável por exibir um entregador cadastrado. Ela recebe como parâmetro da rota o id do entregador a ser exibido. Ao encontrar o recurso um objeto contendo seus dados é retornado.

```json
{
  "id": 2,
  "name": "Deliveryman one",
  "email": "deliverymanone@gmail.com",
  "createdAt": "2020-10-20T20:18:06.648Z",
  "avatar": {
    "url": "http://localhost:3333/files/a64cf4128ac76c8b194250a07397aae5.png",
    "id": 1,
    "filename": "a64cf4128ac76c8b194250a07397aae5.png"
  }
}
```

### Files

- `POST /files`: Essa rota é responsável por fazer upload de arquivos dentro da aplicação. Ela é utilizada para enviar ao servidor as imagens que serão utilizadas como avatar pelos entregadores. Para utilizar essa rota é necessário enviar um corpo do tipo `multipart` contendo um parâmetro chamado `file`, que deve conter o caminho para o arquivo que se deseja enviar ao servidor. Sendo a imagem recebida com sucesso pela aplicação, uma resposta contendo os detalhes do arquivo e a url de acesso da imagem será retornada.

```json
{
  "url": "http://localhost:3333/files/a64cf4128ac76c8b194250a07397aae5.png",
  "id": 1,
  "original_name": "avatar-0.png",
  "filename": "a64cf4128ac76c8b194250a07397aae5.png",
  "updatedAt": "2020-10-20T20:17:30.948Z",
  "createdAt": "2020-10-20T20:17:30.948Z"
}
```

### Parcels

- `POST /parcels`: Essa rota é responsável por cadastrar uma encomenda na aplicação. Ela recebe dentro do corpo da requisição os campos `recipient_id`, `deliveryman_id` e `product`. Ao cadastrar corretamente a encomenda, um objeto contendo os dados registrados é retornado.

```json
{
  "id": 2,
  "recipient_id": 1,
  "deliveryman_id": 2,
  "product": "Some other product",
  "signature_id": null,
  "cancelled_at": null,
  "start_date": null,
  "end_date": null
}
```

- `PATCH /parcels/:id`: Essa rota é responsável por atualizar os dados de uma encomenda. Ela recebe como parâmetro da rota o id da encomenda a ser atualizada e dentro do corpo da requisição qualquer um dos campos `recipient_id`, `deliveryman_id` ou `product` para atualização (ou todos, caso o recurso necessite ser atualizado por completo). Ao atualizar corretamente a encomenda, um objeto contendo os dados atualizados é retornado.

```json
{
  "id": 2,
  "product": "Updated product",
  "cancelled_at": null,
  "start_date": null,
  "end_date": null,
  "recipient_id": "3",
  "deliveryman_id": "4",
  "signature_id": null
}
```

- `DELETE /parcels/:id`: Essa rota é responsável por excluir uma encomenda. Ela recebe como parâmetro da rota o id da encomenda a ser excluído. Ao excluir corretamente o recurso, o servidor retorna uma resposta `200` sem conteúdo.

- `GET /parcels`: Essa rota é responsável por listar as encomendas cadastradas. O sistema está preparado para retornar a resposta paginada, para isso é necessário enviar os parâmetros de query `page` e `limit` indicando qual página dos dados deve ser recuperada e o limite de registros por página, respectivamente. Caso não sejam especificados os parâmetros, a resposta conterá todas as encomendas cadastradas. Nas respostas paginadas, além dos dados das encomendas é retornado o total de páginas geradas (considerando os valores informados nos parâmetros `page` e `limit`).

  Exemplo de resposta paginada utilizando os parâmetros `page` com valor `1` e `limit` com valor `2`:

```json
{
  "parcels": [
    {
      "id": 2,
      "product": "Updated product",
      "cancelled_at": null,
      "start_date": null,
      "end_date": null,
      "recipient": {
        "id": 3,
        "name": "Recipient",
        "street": "Street address",
        "number": "123",
        "zipcode": "00000-000",
        "state": "São Paulo",
        "city": "São Paulo"
      },
      "deliveryman": {
        "id": 4,
        "name": "Deliveryman 2",
        "avatar": null
      },
      "signature": null
    },
    {
      "id": 1,
      "product": "Algum produto",
      "cancelled_at": null,
      "start_date": "2020-10-20T20:20:46.006Z",
      "end_date": null,
      "recipient": {
        "id": 1,
        "name": "Recipient",
        "street": "Street address",
        "number": "123",
        "zipcode": "05435-902",
        "state": "São Paulo",
        "city": "São Paulo"
      },
      "deliveryman": {
        "id": 2,
        "name": "Deliveryman one",
        "avatar": {
          "url": "http://localhost:3333/files/a64cf4128ac76c8b194250a07397aae5.png",
          "id": 1,
          "filename": "a64cf4128ac76c8b194250a07397aae5.png"
        }
      },
      "signature": null
    }
  ],
  "totalPages": 1
}
```

- `GET /parcels/:id`: Essa rota é responsável por exibir uma encomenda cadastrada. Ela recebe como parâmetro da rota o id da encomenda a ser exibida. Ao encontrar o recurso um objeto contendo seus dados é retornado.

```json
{
  "id": 2,
  "product": "Updated product",
  "cancelled_at": null,
  "start_date": null,
  "end_date": null,
  "recipient_id": 3,
  "deliveryman_id": 4,
  "signature_id": null
}
```

### Pickups

- `POST /deliveryman/:deliverymanId/pickups/:parcelId`: Essa rota é responsável indicar a retirada de uma encomenda por um entregador. Ela recebe como parâmetros da rota o id do entregador e o id da encomenda. O resultado dessa rota é a atualização do campo `start_date` da tabela `parcels`, indicando a data de retirada da encomenda.

```json
{
  "id": 2,
  "product": "Updated product",
  "cancelled_at": null,
  "start_date": "2020-10-21T15:41:56.801Z",
  "end_date": null,
  "recipient_id": 3,
  "deliveryman_id": 4,
  "signature_id": null
}
```

### Delivery problems

- `POST /delivery/:parcelId/problems`: Essa rota é responsável por cadastrar eventuais problemas que possam ocorrer durante uma entrega. Ela recebe como parâmetro da rota o id da encomenda sendo entregue. O resultado dessa rota é o cadastramento de um problema referente à tentativa de entrega.

```json
{
  "id": 1,
  "parcel_id": 2,
  "description": "Recipient was not at home.",
  "createdAt": "2020-10-21T15:47:44.082Z"
}
```

- `GET /delivery/problems`: Essa rota é responsável por listar todos os problemas ocorridos com as encomendas em processo de entrega. O sistema está preparado para retornar a resposta paginada, para isso é necessário enviar os parâmetros de query `page` e `limit` indicando qual página dos dados deve ser recuperada e o limite de registros por página, respectivamente. Caso não sejam especificados os parâmetros, a resposta conterá todos os problemas cadastrados. Nas respostas paginadas, além dos dados dos problemas é retornado o total de páginas geradas (considerando os valores informados nos parâmetros `page` e `limit`).

  Exemplo de resposta paginada utilizando os parâmetros `page` com valor `1` e `limit` com valor `2`:

```json
{
  "problems": [
    {
      "id": 1,
      "description": "Recipient was not at home.",
      "createdAt": "2020-10-21T15:47:44.082Z",
      "parcel_id": 2,
      "parcel": {
        "product": "Updated product",
        "start_date": "2020-10-21T15:41:56.801Z",
        "deliveryman": {
          "name": "Deliveryman 2"
        }
      }
    }
  ],
  "totalPages": 1
}
```

- `GET /delivery/2/problems`: Essa rota é responsável por listar todos os problemas ocorridos com uma encomenda em específico. Ela recebe como parâmetro da rota o id da encomenda. O resultado dessa rota é uma listagem com todos os problema ocorridos na entrega da encomenda pesquisada.

```json
[
  {
    "id": 1,
    "description": "Recipient was not at home.",
    "createdAt": "2020-10-21T15:47:44.082Z",
    "parcel_id": 2
  }
]
```

- `DELETE /problems/:problemId/delivery`: Essa rota é responsável por cancelar a entrega de uma encomenda. Ela recebe como parâmetro da rota o id do problema através do qual será cancelada a encomenda associada. Dependendo do tipo de problema enfrentado pelo entregador durante as tentativas de entrega, a encomenda pode ter sua entrega cancelada. O que essa rota faz é atualizar o campo `cancelled_at` da tabela `parcels` para a encomenda associada ao problema reportado. Ao atualizar corretamente o recurso, o servidor retorna uma resposta `200` sem conteúdo.

### Deliveries

- `POST /deliveryman/:deliverymanId/deliveries/:parcelId`: Essa rota é responsável por finalizar a entrega de uma encomenda e também fazer o upload do comprovante de entrega com a assinatura do destinatário. Ela recebe como parâmetros da rota o id do entregador e o id da encomenda. Também é necessário enviar um corpo do tipo `multipart` contendo um parâmetro chamado `file`, que deve conter o caminho para o arquivo com a imagem do comprovante. Sendo a entrega processada com sucesso pela aplicação, uma resposta contendo os detalhes da encomenda entregue será retornada com o campo `end_date` atualizado com a data da entrega. Também será preenchido o campo `signature_id` com o id da imagem enviada ao servidor como comprovante.

```json
{
  "id": 1,
  "product": "Algum produto",
  "cancelled_at": null,
  "start_date": "2020-10-20T20:20:46.006Z",
  "end_date": "2020-10-21T16:30:38.449Z",
  "recipient_id": 1,
  "deliveryman_id": 2,
  "signature_id": 2
}
```

- `GET /deliveryman/:id/deliveries`: Essa rota é responsável por listar todas as entregas feitas por um entregador. Ela recebe como parâmetro da rota o id do entregador sendo pesquisado. Como resposta a essa requisição, é retornada uma listagem com todas as entregas feitas, o destinatário que recebeu a encomenda e uma representação da assinatura comprovando a entrega, onde é possível acessar a url da imagem com a assinatura do destinatário.

```json
[
  {
    "id": 1,
    "product": "Algum produto",
    "start_date": "2020-10-20T20:20:46.006Z",
    "end_date": "2020-10-21T16:30:38.449Z",
    "created_at": "2020-10-20T20:19:17.025Z",
    "recipient": {
      "id": 1,
      "name": "Recipient",
      "street": "Street address",
      "number": "123",
      "state": "São Paulo",
      "city": "São Paulo",
      "zipcode": "05435-902"
    },
    "signature": {
      "url": "http://localhost:3333/files/d467132e4679d05d11d4ed119f8a9f6f.png",
      "id": 2,
      "filename": "d467132e4679d05d11d4ed119f8a9f6f.png"
    }
  }
]
```
