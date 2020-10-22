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
- [Running the project](#-running-the-project)
- [Testing functionalities](#-testing-functionalities)
- [Application routes](#-application-routes)

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

- [Node.js](https://nodejs.org/en/download/) (v12.x.x)
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

## 👨‍💻️ Testing functionalities

The application functionalities can be tested with the help of Insomnia's workspace, the chosen REST client for supporting development of the API.

Through the button bellow it's possible to import the workspace to your machine, once you already have Insomia installed. Just click on this button and follow the steps to finish the importing process.

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Fastfeet%20API&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fgpmarchi%2Fgostack-fastfeet-backend%2Fmaster%2Finsomnia-workspace.json)

In order to test any other route you have to first log in the API by using the default user, through the `Create` route inside the `Sessions` folder:

```json
{
  "email": "admin@fastfeet.com",
  "password": "123456"
}
```

Once logged in, it's possible to access any protected route and start registering resources and testing out all the other API's functionalities.

## 🛣 Application routes

In this section we have a brief description about the functionalities of each route in the application. The routes are grouped by each resource represented in the application:

- [Sessions](#sessions)
- [Recipients](#recipients)
- [Deliverymen](#deliverymen)
- [Files](#files)
- [Parcels](#parcels)
- [Pickups](#pickups)
- [Delivery problems](#delivery-problems)
- [Deliveries](#deliveries)

### Sessions

- `POST /sessions`: This route is responsible for logging in the administrator user in the application. It receives as request body the `email` and `password` in order to perform the authentication, and in return it sends back a response containing the `user` object with data belonging to the logged in user and the `token` in JWT format, which from this point on must be used in all other protected route requests.

```json
{
  "user": {
    "id": 1,
    "name": "FastFeet Distributor",
    "email": "admin@fastfeet.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjAzMjI0OTMyLCJleHAiOjE2MDM4Mjk3MzJ9.eKBx8Bea79DwxE9TfC4QJFUYuE_FPj5IVTRSg_Mvw70"
}
```

### Recipients

- `POST /recipients`: This route is responsible for recipient registration in the application. It receives as request body the fields `name`, `street`, `number`, `complement`, `state`, `city` and `zipcode`. By correctly registering the recipient, an object containing the registered data is returned.

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

- `PATCH /recipients/:id`: This route is responsible for updating a recipient's data. It receives as route parameter the recipient's id to be updated an in the request body any of the fields `name`, `street`, `number`, `complement`, `state`, `city` e `zipcode` (or all of them, in case the resource needs to be fully updated). By correctly updating the recipient, and object containing the updated data is returned.

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

- `DELETE /recipients/:id`: This route is responsible for deleting a recipient. It receives as route parameter the recipient's id to be deleted. By correctly deleting the resource, the server returns an empty response with the status code `200`.

- `GET /recipients`: This route is responsiblle for listing all registered recipients. The API is prepared to return a paginated response, but for that to happen it's necessary to send two additional query parameters, `page` and `limit`. They are used to indicate which page must be retrieved and the limit of resources per page, respectively. In case these parameters are not used, the response will contain all of the recipients registered. In paginated responses, besides the recipient's data it's also returned the total number of generated pages (considering the values of the parameters `page` and `limit`).

  Paginated response example using the `page` parameter with a value of `1` and `limit` with a value of `2`:

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

- `GET /recipients/:id`: This route is responsible for showing a registered recipient's data. It receives as route parameter the recipient's id to be showed. By finding the resource an object containing it's data is returned.

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

- `POST /deliverymen`: This route is responsible for registering a deliveryman in the application. It receives as a request body the fields `name`, `email`, e `avatar_id`. By correctly registering the deliveryman, an object containing the registered data is returned.

```json
{
  "id": 2,
  "name": "Deliveryman",
  "email": "deliveryman@gmail.com",
  "avatar_id": 1,
  "createdAt": "2020-10-20T20:18:06.648Z"
}
```

- `PATCH /deliverymen/:id`: This route is responsible for updating a deliveryman's data. It receives as route parameter the deliveryman's id to be updated and in the request body any of the fields `name`, `email`, ou `avatar_id` (or all of them, in case the resource needs to be fully updated). By correctly updating the deliveryman, an object containing the updated data is returned.

```json
{
  "id": 2,
  "name": "Deliveryman one",
  "email": "deliverymanone@gmail.com",
  "createdAt": "2020-10-20T20:18:06.648Z",
  "avatar_id": 1
}
```

- `DELETE /deliverymen/:id`: This route is responsible for deleting a deliveryman. It receives as route parameter the deliveryman's id to be deleted. By correctly deleting the resource, the API returns an empty response with status code `200`.

- `GET /deliverymen`: This route is responsiblle for listing all registered deliverymen. The API is prepared to return a paginated response, but for that to happen it's necessary to send two additional query parameters, `page` and `limit`. They are used to indicate which page must be retrieved and the limit of resources per page, respectively. In case these parameters are not used, the response will contain all of the deliverymen registered. In paginated responses, besides the deliverymen's data it's also returned the total number of generated pages (considering the values of the parameters `page` and `limit`).

  Paginated response example using the `page` parameter with a value of `1` and `limit` with a value of `2`:

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

- `GET /deliverymen/:id`: This route is responsible for showing a registered deliveryman. It receives as route parameter the deliveryman's id to be shown. By finding the searched resource an object containing it's data is returned.

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

- `POST /files`: This route is responsible for uploading files in the application. It's use is for sending to the server images which will be used as deliverymen's avatar. This route receives a `multipart` request body with a parameter named `file`, which must hold the path to the file needed to be uploaded to the server. By successfully receiving the image, a response containing the file details including the url for accessing the image is sent back.

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

- `POST /parcels`: This route is responsible for registering a parcel. It receives in the request body the fields `recipient_id`, `deliveryman_id` and `product`. By correctly registering the parcel, an object containing the registered data is returned.

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

- `PATCH /parcels/:id`: This route is responsible for updating a parcel's data. It receives as route parameter the parcel's id to be updated and in the request body any of the fields `recipient_id`, `deliveryman_id` or `product` (or all of them, in case the resource needs to be fully updated). By correctly updating the parcel, an object containing the updated data is returned.

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

- `DELETE /parcels/:id`: This route is responsible for deleting a parcel. It receives as route parameter the parcel's id to be deleted. By correctly deleting the resource, the API returns an empty response with status code `200`.

- `GET /parcels`: This route is responsible for listing all registered parcels. The API is prepared to return a paginated response, but for that to happen it's necessary to send two additional query parameters, `page` and `limit`. They are used to indicate which page must be retrieved and the limit of resources per page, respectively. In case these parameters are not used, the response will contain all of the parcels registered. In paginated responses, besides the parcel's data it's also returned the total number of generated pages (considering the values of the parameters `page` and `limit`).

  Paginated response example using the `page` parameter with a value of `1` and `limit` with a value of `2`:


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

- `GET /parcels/:id`: This route is responsible for showing a registered parcel. It receives as route parameter the parcel's id to be shown. By correctly finding the resource an object containing it's data is returned.

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

- `POST /deliveryman/:deliverymanId/pickups/:parcelId`: This route is responsible for signaling the retrieval of a parcel by a deliveryman. It receives as route parameters the deliveryman's id and the parcel's id. The execution result of this route is the update of `start_date` field from `parcels` table, hence registering the parcel retrieval date.

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

- `POST /delivery/:parcelId/problems`: This route is responsible for registering an eventual problem a deliveryman might face during delivery of a parcel. It receives as route parameter the parcel's id being delivered. The execution result of this route is the registration of a problem refering to a delivery attempt.

```json
{
  "id": 1,
  "parcel_id": 2,
  "description": "Recipient was not at home.",
  "createdAt": "2020-10-21T15:47:44.082Z"
}
```

- `GET /delivery/problems`: This route is responsible for listing all parcel occurences's in delivery process. The API is prepared to return a paginated response, but for that to happen it's necessary to send two additional query parameters, `page` and `limit`. They are used to indicate which page must be retrieved and the limit of resources per page, respectively. In case these parameters are not used, the response will contain all of the occurences registered. In paginated responses, besides the occurences's data it's also returned the total number of generated pages (considering the values of the parameters `page` and `limit`).

  Paginated response example using the `page` parameter with a value of `1` and `limit` with a value of `2`:

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

- `GET /delivery/2/problems`: This route is responsible for listing all occurences that happened during the delivery of a particular parcel. It receives as route parameter the parcel's id. The execution result of this route is a listing with all occurrences that happened in the delivery process of the queried parcel.

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

- `DELETE /problems/:problemId/delivery`: This route is responsible for cancelling a parcel's delivery. It receives as route parameter the problem's id through which the parcel's delivery will be cancelled. Depending on the type of problem faced by the deliveryman during delivery attempts, the parcel can have it's delivery cancelled. What this route does is update the `cancelled_at` field of `parcels` table considering the parcel associated with the reported problem. By correctly updating the resource, the API returns an empty response with status code `200`.

### Deliveries

- `POST /deliveryman/:deliverymanId/deliveries/:parcelId`: This route is responsible for ending a parcel's delivery process, and also for uploading a delivery receipt image with the recipient's signature. It receives as route parameters the deliveryman's id and the parcel's id. It's also needed to send a `multipart` request body with the `file` parameter containing the path to the receipt's image file. By successfully processing the delivery, a response is sent back containing the details of the delivered parcel, now having the `end_date` field updated with the delivery date. There will also be in the `signature_id` field, the id of the uploaded delivery receipt image.

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

- `GET /deliveryman/:id/deliveries`: This route is responsible for listing all the deliveries made by a particular deliveryman. It receives as route parameter the deliveryman's id being queried. As response to this request, a listing with all the deliveries made is returned, containing the recipient who received the parcel and a representation of the delivery receipt's signature, being possible to access the delivery receipt's image url.

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
