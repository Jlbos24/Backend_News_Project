const commentsRouter = require("express").Router();
const {
  patchComments_VoteByID,
  deleteCommentByID
} = require("../controller/comments.js");
const { handle405s } = require("../errors/errors.js");

commentsRouter
  .route("/:comment_id")
  .patch(patchComments_VoteByID)
  .delete(deleteCommentByID)
  .all(handle405s);

module.exports = commentsRouter;
