const connection = require("../connection");

exports.selectArticleByID = article_id => {
  return connection("articles")
    .select("articles.*")
    .count("comments.comment_id AS comment_count")
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .where("articles.article_id", "=", article_id)
    .groupBy("articles.article_id")
    .then(([article]) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "Article ID Does Not Exist"
        });
      }
      return article;
    });
};

exports.patchVoteByID = (article_id, votes) => {
  if (votes.inc_votes == undefined) votes.inc_votes = 0;

  if (
    Object.keys(votes).length > 1 ||
    Number.isInteger(votes.inc_votes) === false
  ) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {
    return connection("articles")
      .where("article_id", article_id)
      .increment("votes", votes.inc_votes)
      .returning("*")
      .then(([rows]) => {
        if (!rows) {
          return Promise.reject({
            status: 404,
            msg: "ID Does Not Exist"
          });
        } else return rows;
      });
  }
};

exports.postCommentByID = (article_id, comment) => {
  const newCommentObj = {};

  newCommentObj.author = comment.username;
  newCommentObj.body = comment.body;
  newCommentObj.article_id = article_id;

  return connection("comments")
    .insert([newCommentObj])
    .where("article_id", "=", article_id)
    .returning("*");
};

exports.verifyArticleID = article_id => {
  return connection
    .select("*")
    .from("articles")
    .where("article_id", "=", article_id)
    .returning("*")
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article Does Not Exist"
        });
      }
    });
};

exports.selectCommentsByID = (article_id, sort_by, order) => {
  return connection("comments")
    .select("*")
    .where("article_id", "=", article_id)
    .orderBy(sort_by || "created_at", order || "desc")
    .then(row => {
      if (row.length == 0) {
        return Promise.reject({ status: 404, msg: "ID Does Not Exist" });
      } else return row;
    });
};

exports.selectAllArticles = (sort_by, order, author, topic) => {
  return connection("articles")
    .select("articles.*")
    .count("comment_id AS comment_count")
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by || "created_at", order || "desc")
    .modify(query => {
      if (author) query.where("articles.author", author);
      if (topic) query.where("articles.topic", topic);
    })
    .then(row => {
      if (!row) {
        return Promise.reject({ status: 404, msg: "Bad Request on Query" });
      } else return row;
    });
};

exports.verifyTopic = topic => {
  return connection("topics")
    .select("*")
    .where("slug", topic)
    .returning("*")
    .then(([row]) => {
      if (!row) {
        return Promise.reject({ status: 404, msg: "Bad Request on Query" });
      }
    });
};

exports.verifyAuthor = author => {
  return connection("users")
    .select("*")
    .where("username", author)
    .returning("*")
    .then(([row]) => {
      if (!row) {
        return Promise.reject({ status: 404, msg: "Bad Request on Query" });
      }
    });
};
