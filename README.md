# Bookmarks API

Restful API with authentication and authorization to operate with users and bookmarks.
<br/>

There implemented all CRUD operations on bookmarks and e2e tests.
<br/>

To get access to posts, you should register or login.

## API:

### POST: /auth/sign-up
Register User

###### Example Input:
```json
{
  "email": "user@gmail.com",
  "password": "reallyStrongPassword"
}
```

###### Example Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoidXNlckBnbWFpbC5jb20iLCJpYXQiOjE2Njc2NTI1NTcsImV4cCI6MTY2NzY1NjE1N30.8iyDhevWXBHPfQRxrOOXbMTwzE4gRXXXEOIFXmlgjJA"
}
```

### POST: /auth/sign-in
Login User

###### Example Input:
```json
{
  "email": "user@gmail.com",
  "password": "reallyStrongPassword"
}
```

###### Example Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoidXNlckBnbWFpbC5jb20iLCJpYXQiOjE2Njc2NTI1NzMsImV4cCI6MTY2NzY1NjE3M30.2eBt9BD8zCoxy_CfwUpUM-WtfPaiBPGdJC2hJupuJyc"
}
```

### GET: /users
Get Current User

###### Example Response:
```json
{
  "id": 2,
  "createdAt": "2022-11-05T12:49:17.583Z",
  "updatedAt": "2022-11-05T12:49:17.583Z",
  "email": "user@gmail.com",
  "username": null
}
```

### PATCH: /users
Edit Current User

###### Example Input:
```json
{
  "username": "wintersakura"
}
```

###### Example Response:
```json
{
  "id": 2,
  "createdAt": "2022-11-05T12:49:17.583Z",
  "updatedAt": "2022-11-05T12:53:04.905Z",
  "email": "user@gmail.com",
  "username": "wintersakura"
}
```

### POST: /bookmarks
Create Bookmark

###### Example Input:
```json
{
  "title": "First Bookmark",
  "link": "https://github.com/WinterSakuraa"
}
```

###### Example Response:
```json
{
  "id": 1,
  "createdAt": "2022-11-05T12:55:33.624Z",
  "updatedAt": "2022-11-05T12:55:33.624Z",
  "title": "First Bookmark",
  "link": "https://github.com/WinterSakuraa",
  "description": null,
  "userId": 2
}
```

### GET: /bookmarks
Get All Bookmarks

###### Example Response:
```json
[
  {
    "id": 1,
    "createdAt": "2022-11-05T12:55:33.624Z",
    "updatedAt": "2022-11-05T12:55:33.624Z",
    "title": "First Bookmark",
    "link": "https://github.com/WinterSakuraa",
    "description": null,
    "userId": 2
  }
]
```

### GET: /bookmarks/:id
Get Bookmark By Id

###### Example Response:
```json
{
  "id": 1,
  "createdAt": "2022-11-05T12:55:33.624Z",
  "updatedAt": "2022-11-05T12:55:33.624Z",
  "title": "First Bookmark",
  "link": "https://github.com/WinterSakuraa",
  "description": null,
  "userId": 2
}
```

### PATCH: /bookmarks/:id
EDIT Bookmark

###### Example Input:
```json
{
  "description": "My GitHub Repo"
}
```

###### Example Response:
```json
{
  "id": 1,
  "createdAt": "2022-11-05T12:55:33.624Z",
  "updatedAt": "2022-11-05T12:59:21.822Z",
  "title": "First Bookmark",
  "link": "https://github.com/WinterSakuraa",
  "description": "My GitHub Repo",
  "userId": 2
}
```

### GET: /bookmarks:id
Delete Bookmark

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