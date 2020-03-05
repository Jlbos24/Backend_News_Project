const connection = require("../connection");

exports.selectArticleByID = article_id => {
  return connection("articles")
    .count("comments.comment_id AS comment_count")
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .where("articles.article_id", "=", article_id)
    .groupBy("articles.article_id")
    .then(([article]) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "ID Does Not Exist"
        });
      } else article.comment_count = Number(article.comment_count);
      return connection("articles")
        .select("*")
        .where("article_id ", "=", article_id)
        .returning("*")
        .then(rows => {
          let newArticle = rows.map(row => {
            const newObject = { ...row };
            newObject.comment_count = article.comment_count;
            return newObject;
          });
          return newArticle[0];
        });
    });
};

exports.patchVoteByID = (article_id, votes) => {
  if (
    Object.keys(votes).length != 1 ||
    Number.isInteger(votes.inc_votes) === false
  ) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {
    return connection("articles")
      .where("article_id", article_id)
      .then(([rows]) => {
        if (!rows) {
          return Promise.reject({
            status: 404,
            msg: "ID Does Not Exist"
          });
        } else {
          return connection("articles")
            .select("*")
            .where("article_id", "=", article_id)
            .returning("*")
            .then(rows => {
              const updateArray = rows.map(row => {
                let newPatchObj = { ...row };
                let newTally = newPatchObj.votes + votes.inc_votes;
                newPatchObj.votes = newTally;

                return newPatchObj;
              });

              return updateArray[0];
            });
        }
      });
  }
};

exports.postCommentByID = (article_id, comment) => {
  const newCommentObj = {};

  newCommentObj.author = comment.username;
  newCommentObj.body = comment.body;
  newCommentObj.article_id = article_id;

  return connection("comments")
    .insert(newCommentObj)
    .returning("*")
    .then(([rows]) => {
      return rows;
    });
};

exports.selectCommentsByID = (article_id, sort_by, order) => {
  return connection("comments")
    .select("*")
    .where("article_id", "=", article_id)
    .orderBy(sort_by || "created_at", order || "desc");
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
    });
};
