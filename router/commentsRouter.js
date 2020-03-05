const commentsRouter = require("express").Router();
const {
  patchComments_VoteByID,
  deleteCommentByID
} = require("../controller/comments.js");

commentsRouter.patch("/:comment_id", patchComments_VoteByID);
commentsRouter.delete("/:comment_id", deleteCommentByID);

module.exports = commentsRouter;
