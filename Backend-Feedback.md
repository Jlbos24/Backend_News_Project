TO DO

- tests on promis alls
- tests on user endpointS
- error handles

next stages

- get(/apis)
- hosting
- readmeS

## Test Output

Read through all errors. Note that any failing test could be caused by a problem uncovered in a previous test on the same endpoint.

XXXXX DONE GET `/api/articles?topic=not-a-topic`

Assertion: expected 200 to equal 404

Hints:

- use a 404 status code, when provided a non-existent topic
- use a separate model to check whether the topic exists

XXXXXX DONE GET `/api/articles?author=not-an-author`

Assertion: expected 200 to equal 404

Hints:

- use a 404 status code, when provided a non-existent author
- use a separate model to check whether the author exists

XXXXX DONE GET `/api/articles/1000`

Assertion: expected 422 to equal 404

Hints:

- if an article is not found with a valid `article_id`, use a 404: Not Found status code

XXXXX DONE GET `/api/articles/1000/comments`

DONE --- Assertion: expected 200 to equal 404

Hints:

- return 404: Not Found when given a valid `article_id` that does not exist

XXXXX DONE NEEDS CHECKING POST `/api/articles/10000/comments`

Assertion: expected 400 to be one of [ 404, 422 ]

Hints:

- use a 404: Not Found _OR_ 422: Unprocessable Entity status code when `POST` contains a valid article ID that does not exist

XXXXX DONE PATCH `/api/comments/1000`

Assertion: expected 422 to equal 404

Hints:

- use a 404: Not Found when `PATCH` contains a valid comment_id that does not exist

DONE XXXX DELETE `/api/comments/1000`

Assertion: expected 422 to equal 404

Hints:

- use a 404: Not Found when `DELETE` contains a valid comment_id that does not exist

Done XXXXX GET `/api/users/not-a-username`

Assertion: expected 422 to equal 404

Hints:

- if a user is not found with a valid `user_id`, use a 404: Not Found status code

### DELETE `/api`

Assertion: expected 404 to equal 405

Hints:

- use `.all()` on each route, to serve a 405: Method Not Found status code

---

## Seed

- Seed file looks good
- If I'm being picky

  - Your `topicsInsertions` and `usersInsertions` can be declared inside the `then` block they are used in so they are not stored in a higher scope than necessary
  - Always use `const` when declaring an array

- Can move some functionality as to not nest `.then()` blocks

## Migrations 👍

## Routers

- Routers look great
- Just need to add functionality for GET '/api' and add 405s

## Controllers

- Topics

  - Stray comment to be removed

- Users 👍

- Articles

  - Stray comment
  - Great consistency in destructuring and how your responses are structured!
  - Not too keen on declaring a variable set to another object
    - If you would like to handle this way, just pass `req.body` straight to the model

- Comments 👍

- Some inconsistencies between

```js
.catch(next)
// and
.catch(error => {
  next(error)
});
```

Either is fine, just stick to one

## Models

- Topics

  - Some comments to be removed

- Users

  - Rejecting with a 422 rather than a 404

- Articles

  - Similar error 422 rather than 404
  - Instead of

  ```js
  if (votes.inc_votes == undefined) votes.inc_votes = 0;
  // we can set a default value to the parameter
  exports.patchVoteByID = (article_id, votes = 0) => {};
  ```

  - Instead of your checks for a votes key or not being a number, you can try and put it in the database and let psql give us an error code if there is a problem

  - When you patch a vote, are you actually updating the database?

- Comments
  - Similar things to tidy up

## Errors

- Error handlers look good
  - You have some directly inside of `app.js` and `handle405s` in your errors file
    - Consider extracting all of these

## Utils

- Good avoidance of mutation

- makeRefObj

  - Remember that the function passed to `.forEach` doesn't have a return value

  ```js
  return (refObject[article.title] = article.article_id);
  // should just be
  refObject[article.title] = article.article_id;
  ```

- formatComments

  - If you already know the key `belongs_to` is the one to target, do you need to use a for...in loop?

- Good tests for mutation and new references

## app.spec

- Tests look great!
  - Mentioned above - some tests expecting a 422 should be expecting a 404

---

## Readme

- [ ] Link to hosted version
- [ ] Write a summary of what the project is
- [ ] Provide clear instructions of how to clone, install dependencies, seed local database, and run tests
- [ ] Include information about how to create `knexfile.js`
- [ ] Specify minimum versions of `Node.js` and `Postgres` needed to run the project

## General

- [ ] Remove any unnecessary `console.logs` and comments
- [ ] Remove all unnecessary files (e.g. old `README.md`, `error-handling.md`, `hosting.md`, `./db/utils/README.md` etc.)

## Migrations

- ✅ Use `notNullable` on required fields
- ✅ Default `created_at` in articles and comments tables to the current date:`.defaultTo(knex.fn.now());`
- ✅ Delete all comments when the article they are related to is deleted: Add `.onDelete("CASCADE");` to `article_id` column in `comments` table.
  - You have done this! There is no DELETE articles endpoint to put this into practice

## Seeding

- ✅ Make sure util functions do not mutate data
- ✅ Make util functions easy to follow with well named functions and variables
- ✅ Test util functions
- ✅ Migrate rollback and migrate latest in seed function

## Routing

- ✅ Split into api, topics, users, comments and articles routers
- ✅ Use `.route` for endpoints that share the same path
- ✅ Use `.all` for 405 errors

## Controllers

- ✅ Name functions and variables well
- [ ] Add catch blocks to all model invocations (and don't mix use of`.catch(next);` and `.catch(err => next(err))`)

## Models

- ✅ Consistently use either single object argument _**or**_ multiple arguments in model functions
- ✅ No unnecessary use of `.modify()` (i.e. only for author and topic queries)
- ✅ Use `leftJoin` for comment counts

## Errors

- [ ] Use error handling middleware functions in app and extracted to separate directory/file
- ✅ Consistently use `Promise.reject` in either models _**OR**_ controllers

Well Done!
