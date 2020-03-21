# NC News
## What is it?

NC-News is an API written in JavaScript sinle page application with various endpoints that will display news articles, comments and topics. It will allow you to create a user, add comments and filter with queries.


# News App Back_end

The back-end handles all http requests the client can make to the server. The back-end will provide the client with all information related to news articles, comments and allow users to post new comments, vote for their favourtie article, and delete their own articles and comments.

# Getting Started

The NC-News app is currently hosted on herokuapp.com.

The code can be cloned from GitHub.

# Dependencies

To run this project, please install the following:

## Dependencies and versions
- dependencies
--chai-sorted: 0.2.0
--express: 4.17.1
--knex: 0.20.10
--pg: 7.18.2
--sams-chai-sorted: 1.0.2
--supertest: 4.0.2

- devDependencies
--chai: 4.2.0
--mocha: 7.1.0


### PostGresSQL

#### Mac
Run the following commands in your terminal:
  - `brew update`
  - `brew doctor`
  - `brew install postgresql`

#### Ubuntu

Run this command in your terminal:
  -`sudo apt-get update`

  -`sudo apt-get install postgresql postgresql-contrib

### Knex

_- npm install knex_

### Expressjs

_- npm install express_

### Mocha and Chai

_- npm install mocha chai -D_

### Supertest

_- npm supertest_

### Chai Sorted Queries

_- npm install sams-chai-sorted_

# Running the Project

## Add DB connection credentials to the Project

Create Knexfile.js

Add the following

const ENV = process.env.NODE_ENV || "development";
const { DB_URL } = process.env;

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfig = {
  development: {
    connection: {
      database: "nc_news",
      username: "username",
      password: "password"
    }
  },
  test: {
    connection: {
      database: "nc_news_test",
      username: "username",
      password: "password"
    }
  },
  production: {
    connection: `${DB_URL}?ssl=true`
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };

## Set Up Package.json

#### Add the following scripts

- "setup-dbs": "psql -f ./db/setup.sql",

- "seed": "NODE_ENV=test knex seed:run",

- "seed:prod": "NODE_ENV=production DB_URL=\$(heroku config:get DATABASE_URL) knex seed:run"

- "migrate-latest:prod": "NODE_ENV=production DB_URL=\$(heroku config:get DATABASE_URL) knex migrate:latest"

- "migrate-rollback:prod": "NODE_ENV=production DB_URL=\$(heroku config:get DATABASE_URL) knex migrate:rollback"

- "test-utils": "mocha spec/utils.spec.js",

- "test": "mocha spec/app.test.js",

- "start": "node listen.js"

#### Run the scripts

_- in the terminal - 
*npm run setup-dbs 
*npm run migrate-latest:prod

- this will setup the database and create the schema

*npm run seed:prod

- this will set the environment to run in production and seed the database with the development data set

*npm run start

- this will initiate the server to run and start receiving requests from the client.

## Testing

The project has two test specs created, to run project through tests enter the following into the terminal:

for endpoint testing:

*npm test 

for database manipulation:

*npm test-utils


### Endpoint Testing

Each endpoint has clearly documented test cases, each covering Invalid Methods, correct data entry and that the code works as intended.
All testing has been done with mocha chai, and chai packages for some of the sort by methods. SuperTest has been used to test HTTP methods.

#Version

Node : v13.2.0
PostgreSQL: v10.2

#Author
Justin Bosman
