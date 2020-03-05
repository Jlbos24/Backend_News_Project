const articlesRouter = require("express").Router();
const {
  getArticlesByID,
  patchVotesByID,
  postCommentByArtID,
  getCommentsByArtID,
  getAllArticles
} = require("../controller/articles.js");

articlesRouter.get("/:article_id", getArticlesByID);
articlesRouter.get("/:article_id/comments", getCommentsByArtID);
articlesRouter.get("/", getAllArticles);
articlesRouter.patch("/:article_id", patchVotesByID);
articlesRouter.post("/:article_id/comments", postCommentByArtID);

module.exports = articlesRouter;
