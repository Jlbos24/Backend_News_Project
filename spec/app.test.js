process.env.NODE_ENV = "test";

const app = require("../app/app.js");
const chai = require("chai");
const { expect } = chai;
const request = require("supertest");
const connection = require("../connection");
chai.use(require("sams-chai-sorted"));
const chaiSorted = require("chai-sorted");
chai.use(chaiSorted);

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  describe("/topics", () => {
    describe("GET", () => {
      it("Status: 200 Return a topic with passed request", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(res => {
            expect(res.body.topics).to.be.an("Array");
            expect(res.body.topics[0]).to.contain.keys("slug", "description");
          });
      });
      it("Status: 404 Path Not Found for Get Request", () => {
        return request(app)
          .get("/api/topics/invalid")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Path does not exist");
          });
      });
      it("Status: 404 Path Not Found for Get Request #2", () => {
        return request(app)
          .get("/api/topic")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Path does not exist");
          });
      });
    });
    describe("INVALID METHOD", () => {
      it("Status: 405 Invalid Method", () => {
        const invalidMethods = ["delete", "patch", "put", "post"];
        const promiseArray = invalidMethods.map(method => {
          return request(app)
            [method]("/api/topics")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Method Not Allowed");
            });
        });
        return Promise.all(promiseArray);
      });
    });
  });
  describe("/users", () => {
    describe("/", () => {
      describe("GET", () => {
        it("Status: 200 Get Request responds with all users", () => {
          return request(app)
            .get("/api/users")
            .expect(200)
            .then(res => {
              expect(res.body.users).to.be.an("Array");
              expect(res.body.users[0]).to.contain.keys(
                "username",
                "avatar_url",
                "name"
              );
            });
        });
        it("Status: 200 - Sort by Name Descending", () => {
          return request(app)
            .get("/api/users")
            .expect(200)
            .then(res => {
              expect(res.body.users).to.be.sorted("name");
              expect(res.body.users).to.be.an("Array");
              expect(res.body.users).to.be.descending;
            });
        });
        it("Status: 404 Path Not Found for Get Request", () => {
          return request(app)
            .get("/api/user")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Path does not exist");
            });
        });
      });
      describe("POST", () => {
        it("Status: 201 New User Successfully Created", () => {
          return request(app)
            .post("/api/users")
            .send({ username: "jlbos", name: "Justin", avatar_url: "" })
            .expect(201)
            .then(res => {
              expect(res.body.user).to.be.an("Object");
              expect(res.body.user).to.contain.keys(
                "username",
                "name",
                "avatar_url"
              );
              expect(res.body.user.name).to.eql("Justin");
            });
        });
        it("Status: 400 No Data Passed in Body", () => {
          return request(app)
            .post("/api/users")
            .send()
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
        it("Status: 400 When Passed Missing Key/Value Pair", () => {
          return request(app)
            .post("/api/users")
            .send({
              username: "ayyup",
              avatar_url: ""
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
        it("Status: 400 Not Null Values", () => {
          return request(app)
            .post("/api/users")
            .send({
              username: "editor05",
              name: "Justin",
              avatar_url: null
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
        it("Status: 400 Post on Incorrect Key Names", () => {
          return request(app)
            .post("/api/users")
            .send({
              user: "123writer",
              name: "mitch",
              avatar_url: "www.facebook.com"
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
      });
      describe("INVALID METHOD", () => {
        it("Status: 405 Invalid Method", () => {
          const invalidMethods = ["delete", "patch", "put"];
          const promiseArray = invalidMethods.map(method => {
            return request(app)
              [method]("/api/users")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Method Not Allowed");
              });
          });
          return Promise.all(promiseArray);
        });
      });
    });
    describe("/username", () => {
      describe("GET", () => {
        it("Status: 200 Get Request responds with a selected user when passed a username", () => {
          return request(app)
            .get("/api/users/butter_bridge")
            .expect(200)
            .then(res => {
              expect(res.body.user).to.be.an("Object");
              expect(res.body.user).to.contain.keys(
                "username",
                "avatar_url",
                "name"
              );
            });
        });
        it("Status: 404 Good ID that does not yet exist", () => {
          return request(app)
            .get("/api/users/invalid_username")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Username Does Not Exist");
            });
        });
        it("Status: 404 Bad ID - Incorrect data type ", () => {
          return request(app)
            .get("/api/users/999")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Username Does Not Exist");
            });
        });
      });
      describe("INVALID METHOD", () => {
        it("Status: 405 Invalid Method", () => {
          const invalidMethods = ["delete", "patch", "put", "post"];
          const promiseArray = invalidMethods.map(method => {
            return request(app)
              [method]("/api/users/:username")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Method Not Allowed");
              });
          });
          return Promise.all(promiseArray);
        });
      });
    });
  });

  describe("/articles", () => {
    describe("GET", () => {
      it("Status: 200 - Returns an array of article objects", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.be.an("Array");
            expect(res.body.articles[0]).to.contain.keys(
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
            expect(res.body.articles[0]).to.eql({
              article_id: 1,
              author: "butter_bridge",
              body: "I find this existence challenging",
              votes: 100,
              comment_count: "13",
              topic: "mitch",
              created_at: "2018-11-15T12:21:54.171Z",
              title: "Living in the shadow of a great man"
            });
          });
      });
      it("Status: 200 - Sort by created_at as default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.be.sorted("created_at");
            expect(res.body.articles).to.be.an("Array");
            expect(res.body.articles[0]).to.contain.keys(
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
          });
      });
      it("Status: 200 - Sort Descending", () => {
        return request(app)
          .get("/api/articles?order=desc")
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.be.descending;
          });
      });
      it("Status: 200 - Sort by votes Descending", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=desc")
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.be.descendingBy("votes");
          });
      });
      it("Status: 200 - Sort Ascending", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.be.ascending;
          });
      });
      it("Status: 200 - Filter by Author", () => {
        return request(app)
          .get("/api/articles?author=rogersop")
          .expect(200)
          .then(res => {
            expect(res.body.articles.length).to.eql(3);
          });
      });
      it("Status: 200 - Filter by Topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(res => {
            expect(res.body.articles.length).to.eql(11);
          });
      });
      it("Status: 400 - Bad Request for an Invalid Column ", () => {
        return request(app)
          .get("/api/articles/sort_by=invalid_column")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad Request");
          });
      });
      it("Status: 404 - Check Topic Filter Exists", () => {
        return request(app)
          .get("/api/articles?topic=does_not_exist")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad Request on Query");
          });
      });
      it("Status: 404 - Check Author Filter Exists", () => {
        return request(app)
          .get("/api/articles?author=does_not_exist")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad Request on Query");
          });
      });
    });
    describe("POST", () => {
      it("Status: 201 - Post a new article", () => {
        return request(app)
          .post("/api/articles/")
          .send({
            title: "Creating Articles",
            body:
              "Its harder than you think on Tuesday. Day two of my review, debating whether the extra endpoints will help, although based on the requirements of the front end review its seems necessary!!! Oh what to do, guess we already know.",
            topic: "mitch",
            author: "lurker"
          })
          .expect(201)
          .then(res => {
            expect(res.body.article).to.be.an("Object");
            expect(res.body.article).to.contain.keys(
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at"
            );
            expect(res.body.article.title).to.eql("Creating Articles");
          });
      });
      xit("Status: 404 - Topic Does Not Exist", () => {
        return request(app)
          .post("/api/articles")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad Request on Query");
          });
      });
    });
    describe("INVALID METHOD", () => {
      it("Status: 405 Invalid Method", () => {
        const invalidMethods = ["delete", "patch", "put"];
        const promiseArray = invalidMethods.map(method => {
          return request(app)
            [method]("/api/articles")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Method Not Allowed");
            });
        });
        return Promise.all(promiseArray);
      });
    });
    describe("/:articles_id", () => {
      describe("GET", () => {
        it("Status: 200 Get Request responds with articles object", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(res => {
              expect(res.body.article).to.be.an("Object");
              expect(res.body.article).to.contain.keys(
                "article_id",
                "title",
                "body",
                "votes",
                "topic",
                "author",
                "created_at",
                "comment_count"
              );
              expect(res.body.article).to.eql({
                article_id: 1,
                title: "Living in the shadow of a great man",
                body: "I find this existence challenging",
                votes: 100,
                topic: "mitch",
                author: "butter_bridge",
                created_at: "2018-11-15T12:21:54.171Z",
                comment_count: "13"
              });
            });
        });
        it("Status: 400 Invalid Username - Bad Article_ID", () => {
          return request(app)
            .get("/api/articles/animal")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
        it("Status: 404 Invalid Username - Good Article ID - Does Not Exist", () => {
          return request(app)
            .get("/api/articles/99999")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Article ID Does Not Exist");
            });
        });
      });
      describe("Patch", () => {
        it("Status: 200 Decrement votes", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: -50 })
            .expect(200)
            .then(res => {
              expect(res.body.article).to.be.an("Object");
              expect(res.body.article.votes).to.eql(50);
              expect(res.body.article).to.eql({
                article_id: 1,
                title: "Living in the shadow of a great man",
                body: "I find this existence challenging",
                votes: 50,
                topic: "mitch",
                author: "butter_bridge",
                created_at: "2018-11-15T12:21:54.171Z"
              });
            });
        });
        it("Status: 200 Increment votes", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 50 })
            .expect(200)
            .then(res => {
              expect(res.body.article).to.be.an("Object");
              expect(res.body.article.votes).to.eql(150);
              expect(res.body.article).to.eql({
                article_id: 1,
                title: "Living in the shadow of a great man",
                body: "I find this existence challenging",
                votes: 150,
                topic: "mitch",
                author: "butter_bridge",
                created_at: "2018-11-15T12:21:54.171Z"
              });
            });
        });
        it("Status: 200 When no data passed through", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({})
            .expect(200)
            .then(res => {
              expect(res.body.article).to.be.an("Object");
              expect(res.body.article.votes).to.eql(100);
              expect(res.body.article).to.eql({
                article_id: 1,
                title: "Living in the shadow of a great man",
                body: "I find this existence challenging",
                votes: 100,
                topic: "mitch",
                author: "butter_bridge",
                created_at: "2018-11-15T12:21:54.171Z"
              });
            });
        });
        it("Status: 400 Invalid Article ID - Bad Article_ID", () => {
          return request(app)
            .patch("/api/articles/animal")
            .send({ inc_votes: -50 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
        it("Status: 400 Incorrect data type", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: "cat" })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
        it("Status: 400 Incorrect key/value pairs", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ name: "Mitch" })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
        it("Status: 404 Invalid Article ID - Good Article ID - Does Not Exist", () => {
          return request(app)
            .patch("/api/articles/99999")
            .send({ inc_votes: -50 })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("ID Does Not Exist");
            });
        });
      });
      describe("INVALID METHOD", () => {
        it("Status: 405 Invalid Method", () => {
          const invalidMethods = ["delete", "put", "post"];
          const promiseArray = invalidMethods.map(method => {
            return request(app)
              [method]("/api/articles/:articles_id")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Method Not Allowed");
              });
          });
          return Promise.all(promiseArray);
        });
      });
    });
    describe("/:articles_id", () => {
      describe("/comments", () => {
        describe("POST", () => {
          it("Status: 201 Respond with a posted comment when requested ", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                username: "butter_bridge",
                body: "This is a fantastic article"
              })
              .expect(201)
              .then(res => {
                expect(res.body.comment).to.be.an("Object");
                expect(res.body.comment).to.contain.keys(
                  "comment_id",
                  "author",
                  "article_id",
                  "votes",
                  "created_at",
                  "body"
                );
                expect(res.body.comment.body).to.eql(
                  "This is a fantastic article"
                );
              });
          });
          it("Status: 400 No data passed in body", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send()
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
          it("Status: 400 When Passed Missing Key/Value Pair", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                body: "What an awesome article"
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
          it("Status: 400 Incorrect data types passed in body", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                username: 5,
                body: 99999
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
          it("Status: 400 Incorrect keys passed from client", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                topic: "mitch",
                body: "nice article"
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
          it("Status: 400 Bad Article ID - PSQL ERROR", () => {
            return request(app)
              .post("/api/articles/invalid_type_id/comments")
              .send({
                username: "butter_bridge",
                body: "This is a fantastic article"
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
          it("Status: 404 Good Article ID = ID Does Not Yet Exist", () => {
            return request(app)
              .post("/api/articles/9999/comments")
              .send({
                username: "butter_bridge",
                body: "This is a fantastic article"
              })
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Article Does Not Exist");
              });
          });
        });
        describe.only("GET", () => {
          it("Status: 200 - Retrieve Comments by Article ID", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(res => {
                expect(res.body.comments).to.be.an("Array");
                expect(res.body.comments[0]).to.contain.keys(
                  "comment_id",
                  "author",
                  "article_id",
                  "votes",
                  "created_at",
                  "body"
                );
              });
          });
          it("Status: 200 - Sort by created_at as default", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(res => {
                expect(res.body.comments).to.be.sorted("created_at");
                expect(res.body.comments).to.be.an("Array");
                expect(res.body.comments[0]).to.contain.keys(
                  "comment_id",
                  "author",
                  "article_id",
                  "votes",
                  "created_at",
                  "body"
                );
              });
          });
          it("Status: 200 - Sort Descending", () => {
            return request(app)
              .get("/api/articles/1/comments?order=desc")
              .expect(200)
              .then(res => {
                expect(res.body.comments).to.be.descending;
              });
          });
          it("Status: 200 - Sort by Author descending", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=author")
              .expect(200)
              .then(res => {
                expect(res.body.comments).to.be.sorted("author");
                expect(res.body.comments).to.be.descending;
              });
          });
          it("Status: 200 - Sort Ascending", () => {
            return request(app)
              .get("/api/articles/1/comments?order=asc")
              .expect(200)
              .then(res => {
                expect(res.body.comments).to.be.ascending;
              });
          });
          it("Status: 400 - Bad Request for an Invalid Column ", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=invalid_column")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
          it("Status: 400 - Bad Article ID ", () => {
            return request(app)
              .get("/api/articles/test/comments")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad Request");
              });
          });
          it("Status: 404 - Good Article ID - Does Not Exist", () => {
            return request(app)
              .get("/api/articles/9999/comments")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Article Does Not Exist");
              });
          });

          describe("INVALID METHOD", () => {
            it("Status: 405 Invalid Method", () => {
              const invalidMethods = ["delete", "patch"];
              const promiseArray = invalidMethods.map(method => {
                return request(app)
                  [method]("/api/articles/:articles_id/comments")
                  .expect(405)
                  .then(({ body: { msg } }) => {
                    expect(msg).to.equal("Method Not Allowed");
                  });
              });
              return Promise.all(promiseArray);
            });
          });
        });
      });
    });
  });

  describe("/comments", () => {
    describe("/:comment_id", () => {
      describe("PATCH", () => {
        it("Status: 200 Increment votes", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 50 })
            .expect(200)
            .then(res => {
              expect(res.body.comment).to.be.an("Object");
              expect(res.body.comment.votes).to.eql(66);
              expect(res.body.comment).to.eql({
                comment_id: 1,
                author: "butter_bridge",
                article_id: 9,
                votes: 66,
                created_at: "2017-11-22T12:36:03.389Z",
                body:
                  "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
              });
            });
        });
        it("Status: 200 Decrement votes", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: -10 })
            .expect(200)
            .then(res => {
              expect(res.body.comment).to.be.an("Object");
              expect(res.body.comment.votes).to.eql(6);
              expect(res.body.comment).to.eql({
                comment_id: 1,
                author: "butter_bridge",
                article_id: 9,
                votes: 6,
                created_at: "2017-11-22T12:36:03.389Z",
                body:
                  "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
              });
            });
        });
        it("Status: 200 When no data passed through", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({})
            .expect(200)
            .then(res => {
              expect(res.body.comment).to.be.an("Object");
              expect(res.body.comment.votes).to.eql(16);
              expect(res.body.comment).to.eql({
                comment_id: 1,
                author: "butter_bridge",
                article_id: 9,
                votes: 16,
                created_at: "2017-11-22T12:36:03.389Z",
                body:
                  "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
              });
            });
        });
        it("Status: 400 Invalid Article ID - Bad Article_ID", () => {
          return request(app)
            .patch("/api/comments/animal")
            .send({ inc_votes: -50 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
        it("Status: 400 Incorrect data type", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: "cat" })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
        it("Status: 400 Incorrect key/value pairs for inc_votes", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 1, name: "Mitch" })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
        it("Status: 404 Invalid Article ID - Good Article ID - Does Not Exist", () => {
          return request(app)
            .patch("/api/comments/99999")
            .send({ inc_votes: -50 })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("ID Does Not Exist");
            });
        });
      });
      describe("DELETE", () => {
        it("Status: 204 No content for successful deletion", () => {
          return request(app)
            .delete("/api/comments/1")
            .expect(204);
        });
        it("Status: 404 Comment ID does not exist", () => {
          return request(app)
            .delete("/api/comments/9999")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.eql("Delete Unsuccessful - ID Not Found");
            });
        });
        it("Status: 400 Invalid Data Type on Path", () => {
          return request(app)
            .delete("/api/comments/Invalid_string")
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.eql("Bad Request");
            });
        });
      });
      describe("INVALID METHOD", () => {
        it("Status: 405 Invalid Method", () => {
          const invalidMethods = ["get", "post"];
          const promiseArray = invalidMethods.map(method => {
            return request(app)
              [method]("/api/comments/:comment_id")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Method Not Allowed");
              });
          });
          return Promise.all(promiseArray);
        });
      });
    });
  });

  describe("GET API", () => {
    it("Status:  200 when passing endpoints to api", () => {
      return request(app)
        .get("/api/")
        .expect(200)
        .then(res => {
          expect(res.status).to.equal(200);
        });
    });
  });

  after(() => connection.destroy());
});
