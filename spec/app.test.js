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
      it("Status 200: Return a topic with passed request", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(res => {
            expect(res.body.topics).to.be.an("Array");
            expect(res.body.topics[0]).to.contain.keys("slug", "description");
          });
      });
      it("Status 404: Path Not Found for Get Request", () => {
        return request(app)
          .get("/api/topics/invalid")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Path does not exist");
          });
      });
    });
  });
  describe("/users", () => {
    describe("GET", () => {
      it("Status 200: Get Request responds with a selected user when passed a username", () => {
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
      it("Status 404: Invalid Username", () => {
        return request(app)
          .get("/api/users/invalid_username")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Path does not exist");
          });
      });
    });
  });

  describe("/articles", () => {
    describe("GET", () => {
      it("Status 200 - Returns an array of article objects", () => {
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
      it("status: 200 - Sort by created_at as default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.be.sorted("created_at");
          });
      });
      it("status: 200 - Sort Descending", () => {
        return request(app)
          .get("/api/articles?order=desc")
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.be.descending;
          });
      });
      it("status: 200 - Sort by votes Descending", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=desc")
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.be.descendingBy("votes");
          });
      });
      it("status: 200 - Sort Ascending", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.be.ascending;
          });
      });
      it("status: 200 - Filter by Author", () => {
        return request(app)
          .get("/api/articles?author=rogersop")
          .expect(200)
          .then(res => {
            expect(res.body.articles.length).to.eql(3);
          });
      });
      it("status: 200 - Filter by Topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(res => {
            expect(res.body.articles.length).to.eql(11);
          });
      });
      xit("status: 400 - Sort By Column Doesnt Exist sort_by = 'house_name etc - this in model", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(res => {
            expect(res.body.articles.length).to.eql(12);
          });
      });
    });
    describe("/:articles_id", () => {
      describe("GET", () => {
        it("Status 200: Get Request responds with articles object", () => {
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
                comment_count: 13
              });
            });
        });
        it("Status 400: Invalid Username - Bad Article_ID", () => {
          return request(app)
            .get("/api/articles/animal")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
        it("Status 404: Invalid Username - Good Article ID - Does Not Exist", () => {
          return request(app)
            .get("/api/articles/99999")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("ID Does Not Exist");
            });
        });
      });
      describe("Patch", () => {
        it("Status 200 - Decrement votes", () => {
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
        it("Status 200 - Increment votes", () => {
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
        it("Status 400: Invalid Article ID - Bad Article_ID", () => {
          return request(app)
            .patch("/api/articles/animal")
            .send({ inc_votes: -50 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
        it("Status 404: Invalid Article ID - Good Article ID - Does Not Exist", () => {
          return request(app)
            .patch("/api/articles/99999")
            .send({ inc_votes: -50 })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("ID Does Not Exist");
            });
        });
        it("Status 400 : No inc_votes passed", () => {
          return request(app)
            .patch("/api/articles/1")
            .send()
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
        it("Status 400 : Incorrect data type", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: "cat" })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
        it("Status 400 : Incorrect key/value pairs for inc_votes", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 1, name: "Mitch" })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
      });
    });
    describe("/comments", () => {
      describe("POST", () => {
        it("Status: 201 - Respond with a posted comment when requested ", () => {
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
        xit("Status - to be done for invalid ids", () => {});
        it("Status 400 : No data passed in body", () => {
          return request(app)
            .post("/api/articles/1/comments")
            .send()
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
        it("Status 400 : When Passed Missing Key/Value Pair", () => {
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
        it("Status 400 : Incorrect data types passed in body", () => {
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
        it("Status 400 : Incorrect Keys Passed from Client", () => {
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
      });
      describe("GET", () => {
        it("Status 200 - Retrieve Comments by Article ID", () => {
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
        it("status: 200 - Sort by created_at as default", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.sorted("created_at");
            });
        });
        it("status: 200 - Sort Descending", () => {
          return request(app)
            .get("/api/articles/1/comments?order=desc")
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.descending;
            });
        });
        it("status: 200 - Sort by Author descending", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=author")
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.sorted("author");
            });
        });
        it("status: 200 - Sort Ascending", () => {
          return request(app)
            .get("/api/articles/1/comments?order=asc")
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.ascending;
            });
        });
        it("Test 400: Bad Request for an Invalid Column ", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=invalid_column")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
        it("Test 400: Resource file Not Found ", () => {
          return request(app)
            .get("/api/articles/test/comments?sort_by=author")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
        xit("STILL TO DO FOR OTHER SECTIONS ON Invalid IDTest 400: Invalid ID ", () => {
          return request(app)
            .get("/api/articles/9999/comments?sort_by=author")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
        xit("WHAT OTHER TESTS FOR THIS?", () => {});
      });
    });
  });

  describe("/comments", () => {
    describe("/:comment_id", () => {
      describe("PATCH", () => {
        it("Status 200 - Increment votes", () => {
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
        it("Status 200 - Decrement votes", () => {
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
        it("Status 400: Invalid Article ID - Bad Article_ID", () => {
          return request(app)
            .patch("/api/comments/animal")
            .send({ inc_votes: -50 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
        it("Status 404: Invalid Article ID - Good Article ID - Does Not Exist", () => {
          return request(app)
            .patch("/api/comments/99999")
            .send({ inc_votes: -50 })
            .expect(422)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("ID Does Not Exist");
            });
        });
        it("Status 400 : No inc_votes passed", () => {
          return request(app)
            .patch("/api/comments/1")
            .send()
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
        it("Status 400 : Incorrect data type", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: "cat" })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
        it("Status 400 : Incorrect key/value pairs for inc_votes", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 1, name: "Mitch" })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request");
            });
        });
      });
      describe("DELETE", () => {
        it("status:204 no content for successful deletion", () => {
          return request(app)
            .delete("/api/comments/1")
            .expect(204);
        });
        it("Status 404: Treasure ID does not exist", () => {
          return request(app)
            .delete("/api/comments/9999")
            .expect(422)
            .then(({ body: { msg } }) => {
              expect(msg).to.eql("Delete Unsuccessful - ID not found");
            });
        });
        it("Status 400: Invalid Data Type on Path", () => {
          return request(app)
            .delete("/api/comments/Invalid_string")
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.eql("Bad Request");
            });
        });
      });
    });
  });

  after(() => connection.destroy());
});

// describe("INVALID METHOD", () => {
//   it('Status 405: Invalid Method', () =>{
      const invalidMEthods = ['delete', 'patch', 'put', 'post', 'get'];
       const prmiseArr = invalidMEthods.map((method) => {
        return request(app)
        [method]('/api/XXX/XXX')
//     .expect(405)
//     .then(({body: {msg}}) => {
//       expect(msg).to.eql('method not allowed');
//     })
//   })
// return Promise.all(peomiseArr)
//})


/// promise all per describe - see notes

// router.delete((req, res, next) => {
//   res.status(405).send({ msg: "Method Not Allowed" });
//.path()
// use in articles.router.js
// router.all(handle405s)
// });
// indexedDB.js
// exports.handle405
//
// in app
// app.use(handle405s)


