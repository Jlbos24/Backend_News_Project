const connection = require("../connection");

exports.patchCommentVotesByID = (comment_id, votes) => {
  if (
    Object.keys(votes).length != 1 ||
    Number.isInteger(votes.inc_votes) === false
  ) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {
    return connection("comments")
      .where("comment_id", comment_id)
      .then(([rows]) => {
        if (!rows) {
          return Promise.reject({
            status: 422,
            msg: "ID Does Not Exist"
          });
        } else {
          return connection("comments")
            .select("*")
            .where("comment_id", "=", comment_id)
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

exports.delete_CommentByID = comment_id => {
  console.log(comment_id);
  return connection("comments")
    .select("*")
    .where("comment_id", "=", comment_id)
    .then(result => {
      if (result.length < 1) {
        return Promise.reject({
          status: 422,
          msg: "Delete Unsuccessful - ID not found"
        });
      } else return result;
    })
    .then(result => {
      return connection
        .from("comments")
        .where("comment_id", "=", comment_id)
        .del();
    })
    .then(row => {
      return connection
        .select("*")
        .from("comments")
        .where("comment_id", "=", comment_id)
        .then(row => {
          return row;
        });
    });
};
