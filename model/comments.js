const connection = require("../connection");

exports.patchCommentVotesByID = (comment_id, votes) => {
  if (votes.inc_votes == undefined) votes.inc_votes = 0;

  if (
    Object.keys(votes).length > 1 ||
    Number.isInteger(votes.inc_votes) === false
  ) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {
    return connection("comments")
      .where("comment_id", comment_id)
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

exports.delete_CommentByID = comment_id => {
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .del()
    .then(delCount => {
      if (delCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Delete Unsuccessful - ID Not Found"
        });
      }
    });
};
