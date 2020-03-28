const {
  selectArticleByID,
  patchVoteByID,
  postCommentByID,
  selectCommentsByID,
  selectAllArticles,
  verifyAuthor,
  verifyTopic,
  verifyArticleID,
  insertArticle
} = require("../model/articles.js");

exports.getArticlesByID = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleByID(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchVotesByID = (req, res, next) => {
  const { article_id } = req.params;

  patchVoteByID(article_id, req.body)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postCommentByArtID = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;

  const promiseArray = [];

  promiseArray.push(postCommentByID(article_id, comment));
  promiseArray.push(verifyArticleID(article_id));

  return Promise.all(promiseArray)
    .then(([[comment]]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getCommentsByArtID = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  const promiseArray = [];

  promiseArray.push(selectCommentsByID(article_id, sort_by, order));
  promiseArray.push(verifyArticleID(article_id));

  return Promise.all(promiseArray)
    .then(([comments]) => {
     
      res.status(200).send({ comments });
    })
    .catch(next);


exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;

  const promiseArticles = [];

  promiseArticles.push(selectAllArticles(sort_by, order, author, topic));

  if (author) {
    promiseArticles.push(verifyAuthor(author));
  }
  if (topic) {
    promiseArticles.push(verifyTopic(topic));
  }

  return Promise.all(promiseArticles)
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
exports.postArticle = (req, res, next) => {
  const newArticle = req.body;
  insertArticle(newArticle)
    .then(([article]) => {
      res.status(201).send({ article });
    })
    .catch(error => {});
};
