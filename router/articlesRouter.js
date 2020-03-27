const articlesRouter = require("express").Router();
const {
  getArticlesByID,
  patchVotesByID,
  postCommentByArtID,
  getCommentsByArtID,
  getAllArticles,
  postArticle
} = require("../controller/articles.js");
const { handle405s } = require("../errors/errors.js");

articlesRouter
  .route("/:article_id")
  .get(getArticlesByID)
  .patch(patchVotesByID)
  .all(handle405s);

articlesRouter
  .route("/")
  .get(getAllArticles)
  .post(postArticle)
  .all(handle405s);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArtID)
  .post(postCommentByArtID)
  .all(handle405s);

module.exports = articlesRouter;
