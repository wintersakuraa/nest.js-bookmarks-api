# Bookmarks API

Restful API with authentication and authorization to operate with users and bookmarks.
<br/>

There implemented all CRUD operations on bookmarks and e2e tests.
<br/>

To get access to posts, you should register or login.

## Stack

* TypeScript
* Nest js
* Prisma
* PostgreSQL
* Docker
* e2e testing

## Running the app

```bash
# development
$ npm run start:dev

# dev docker rm and up and add prisma migrations
$ npm run db:dev:restart 

# test docker rm and up and add prisma migrations
$ npm run db:test:restart

# start testing
$ npm run test:e2e

# production mode
$ npm run start:prod
```