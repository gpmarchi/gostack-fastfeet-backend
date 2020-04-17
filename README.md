# FastFeet back-end

Projeto desenvolvido como exercício para certificação do Bootcamp Gostack 10 da Rocketseat. API desenvolvida em Node.js com Express para uma aplicação de transportadoras controlando as encomendas, entregadores, destinatários e problemas nas entregas.

## Índice

- [Tecnologias e libs utilizadas](#-tecnologias-e-libs-utilizadas)
- [Requisitos iniciais](#-requisitos-iniciais)
- [Instalação](#-instalação)
- [Configurações](#-configurações)

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

- [Node.js](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm) ou [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)
- [PostgreSQL](https://www.postgresql.org/download/)
- [git](https://git-scm.com/downloads)

### Opcionais

- [Postbird](https://www.electronjs.org/apps/postbird) (ou outro cliente para acesso ao banco de dados)
- [Insomnia](https://insomnia.rest/download/) (ou outro cliente REST para acesso às rotas da API)

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
