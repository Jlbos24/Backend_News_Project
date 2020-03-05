const { selectUserByID } = require("../model/users.js");

exports.getUserByID = (req, res, next) => {
  const { username } = req.params;

  selectUserByID(username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};
