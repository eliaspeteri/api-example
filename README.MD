[![CI to Docker Hub](https://github.com/eliaspeteri/api-example/actions/workflows/main.yml/badge.svg?branch=master)](https://github.com/eliaspeteri/api-example/actions/workflows/main.yml)

# Prerequisites

## Node.js project installation

After extracting the project from a remote source, run this command.

```node
npm install
```

to download the required dependencies outlined in package.json. The used dependencies are

-   express
-   sqlite3

Furthermore, if you have Docker installed, you can build the image for this project and spin up a container either through your preferred shell/terminal or through the VSCode extension.

## Database formatting and initialization

To drop all tables in the SQLite3 database and create a new one called _articles_ based on given sample data, run this command.

```bash
sqlite3 project.db < sql/drop.sql && sqlite3 project.db < sql/create.sql && sqlite3 project.db < sql/insert.sql
```

## Usage

Running the API can be done with **node server.js** or alternatively **npm start** which achieves the same thing.

## Environment variables

HOST = by default **localhost** or 127.0.0.1, currently not possible to alter.

PORT = by default **3001** or process.env.PORT if one is specified.

# API Features

## **NOTE**

A rest.http file is provided with example API calls if you have VSCode REST Client extension installed.

## GET

```http
GET HOST:PORT/api/articles
```

## GET BY USERID

```http
GET HOST:PORT/api/articles/:uid
```

## GET BY ID

```http
GET HOST:PORT/api/articles/:uid/:id
```

## POST

```http
POST HOST:PORT/api/articles
```

Request body should be a JSON with the following formatting:

```json
{
    "userId": 10,
    "title": "Lorem",
    "body": "Ipsum"
}
```

The ID value will be automatically generated.

## PATCH BY ID

```http
PATCH HOST:PORT/api/articles/:uid/:id
```

Request body should be a JSON with the following formatting. It is not necessary to fill in unchanged fields nor is it necessary to alter the ID.

```json
{
    "userId": 10,
    "title": "Lorem",
    "body": "Ipsem"
}
```

## DELETE BY ID

```http
DELETE HOST:PORT/api/articles/:uid/:id
```

No request body is necessary.

# Uninstallation

Simply remove the project folder from your hard drive.
