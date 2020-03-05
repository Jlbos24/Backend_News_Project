const {
  patchCommentVotesByID,
  delete_CommentByID
} = require("../model/comments");

exports.patchComments_VoteByID = (req, res, next) => {
  const { comment_id } = req.params;
  const votes = req.body;

  patchCommentVotesByID(comment_id, votes)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(error => {
      next(error);
    });
};

exports.deleteCommentByID = (req, res, next) => {
  const { comment_id } = req.params;
  delete_CommentByID(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(error => {
      console.log(error, "error in ctrl");
      next(error);
    });
};
