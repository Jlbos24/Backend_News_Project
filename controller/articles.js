const {
  selectArticleByID,
  patchVoteByID,
  postCommentByID,
  selectCommentsByID,
  selectAllArticles
} = require("../model/articles.js");

exports.getArticlesByID = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleByID(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(error => {
      next(error);
    });
};

exports.patchVotesByID = (req, res, next) => {
  const { article_id } = req.params;
  const votes = req.body;

  patchVoteByID(article_id, votes)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(error => {
      next(error);
    });
};

exports.postCommentByArtID = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;

  postCommentByID(article_id, comment)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(error => {
      next(error);
    });
};

exports.getCommentsByArtID = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;

  selectCommentsByID(article_id, sort_by, order)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(error => {
      next(error);
    });
};

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;

  selectAllArticles(sort_by, order, author, topic)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
};
