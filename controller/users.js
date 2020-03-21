const {
  selectUserByID,
  fetchAllUsers,
  insertUser
} = require("../model/users.js");

exports.getUserByID = (req, res, next) => {
  const { username } = req.params;

  selectUserByID(username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.createUser = (req, res, next) => {
  const user = req.body;

  insertUser(user)
    .then(([user]) => {
      res.status(201).send({ user });
    })
    .catch(next);
};
