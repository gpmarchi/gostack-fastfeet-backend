# FastFeet back-end

<p align="center">
  <a href="https://github.com/gpmarchi/gostack-fastfeet-backend">Português</a> |
  <span>English</span>
</p>

Project developed for certification grading in [Rocketseat's](https://rocketseat.com.br/) Bootcamp Gostack 10. Node.js back-end API developed over Express for a themed shipping company called FastFeet. The API allows us to control parcels, deliverymen, recipients and delivery issues.

## Index

- [Technologies and libraries used](#-technologies-and-libraries-used)
- [Initial requirements](#-initial-requirements)
- [Installation](#-installation)
- [Configurations](#-configurations)

## 🤖️ Technologies and libraries used

The following technologies were used in the project:

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

## ✔️ Initial requirements

In order to run the project it is necessary for the items bellow to be installed:

- [Node.js](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm) or [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Redis](https://redis.io/)
- [git](https://git-scm.com/downloads)

### Optionals

- [Postbird](https://www.electronjs.org/apps/postbird) (or any other client for accessing the database)
- [Insomnia](https://insomnia.rest/download/) (or any other REST client which provides access to testing the API routes)
- [docker](https://www.docker.com/)

I strongly suggest the use of docker containers for the databases used by the application, PostgreSQL and Redis.

In case you opt for using the containers, you can run the following commands to install them on your machine:

```bash
docker run -d --name postgres -e POSTGRESQL_PASSWORD=<password> -p 5432:5432 postgres
```

```bash
docker run -d --name redis -p 6379:6379 redis:alpine
```

## 🔔️ Installation

In order to install the project on your machine, you must clone the repository:

```bash
$ git clone https://github.com/gpmarchi/gostack-fastfeet-backend.git && cd gostack-fastfeet-backend
```

Run the following command to install it's dependencies:

```bash
$ npm install
```

## ⚙️ Configurations

It will be necessary to configure environment variables to run the project. To do so, it's needed to create a file called `.env` inside the root folder of the project (you can use the `.env.example` file also present in the root folder as a guide).

These are the variables that need to be filled:

```env
# GENERAL VARIABLES
APP_URL=http://<ip address of the machine running the api>:<port number>
NODE_ENV=development

# EXPRESS PORT
EXPRESS_PORT=<port number>

# JSON WEB TOKEN SECRET
JWT_SECRET=<jwt secret for authentication token generation>

# DATABASE CONFIGS
DB_DIALECT=<database dialect>
DB_HOST=<ip address of the machine running the database>
DB_USER=<user with access permissions to the database>
DB_PASSWORD=<database user password>
DB_NAME=<database name>
DB_LOGGING=<true to enable query logging or false otherwise>

# REDIS
REDIS_HOST=<ip address of the machine running redis>
REDIS_PORT=<port number>

# MAIL SENDING CONFIGS
MAIL_HOST=<address of the smtp server for e-mail sending>
MAIL_PORT=<smpt server port>
MAIL_IS_SECURE=<true to enable ssl usage or false otherwise>
MAIL_AUTH_USER=<smpt server user>
MAIL_AUTH_PASSWORD=<smtp server user password>
MAIL_DEFAULT_FROM=FastFeet Team <noreply@fastfeet.com>

# SENTRY DSN
SENTRY_DSN=<sentry dsn in case you want to monitor exceptions>
```

It's important to notice that the database must be created with the same name that was filled in the environment variable called `DB_NAME`. As stated previoulsy, it was used Sequelize ORM to integrate the application with the database. The dialect configuration must follow one of the options present in the [sequelize](https://sequelize.org/v5/manual/dialects.html) docs.

### Executing migrations and seeds

In order to create the necessary database tables for the application to run, we are going to use `sequelize` to execute some commands. The creation of tables and relationships can be done through the following command:

```bash
$ npx sequelize db:migrate
```

And to create the admin user who will have access to the system's functionalities, it's needed to run a seed for the creation of this user in the database:

```bash
$ npx sequelize db:seed:all
```

## 🏃️🏃‍♀️️ Running the project

Going though all the previous steps prepared the project to be run. To start the server in development mode, use the command below:

```bash
$ npm run dev
```

The server will be running on live reload though nodemon. If needed it's possible to debbug the application by running the server in debbug mode with the following command:

```bash
$ npm run dev:debug
```

After it's running, connect to the debbuger though vscode by using the configuration made available:

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

It's also needed to start a second process (will keep running in the background), for e-mail sending queues notifying deliverymen of newly registered parcels and cancelled ones.

```bash
$ npm run queue
```

## 👨‍💻️ Testing the functionalities

The application functionalities can be tested with the help of Insomnia's workspace, the chosen REST client for supporting development of the API.

Through the button bellow it's possible to import the workspace to your machine, once you already have Insomia installed. Just click on this button and follow the steps to finish the importing process.

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Fastfeet%20API&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fgpmarchi%2Fgostack-fastfeet-backend%2Fmaster%2Finsomnia-workspace.json)

In order to test any other route you have to first log in the API by using the default user, though the `Create` route inside the `Sessions` folder:

```json
{
  "email": "admin@fastfeet.com",
  "password": "123456"
}
```

Once logged in, it's possible to access any protected route and start registering resources and testing out all the other API's functionalities.
