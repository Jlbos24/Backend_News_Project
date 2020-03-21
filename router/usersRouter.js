const usersRouter = require("express").Router();
const {
  getUserByID,
  getAllUsers,
  createUser
} = require("../controller/users.js");
const { handle405s } = require("../errors/errors.js");

usersRouter
  .route("/")
  .get(getAllUsers)
  .post(createUser)
  .all(handle405s);

usersRouter
  .route("/:username")
  .get(getUserByID)
  .all(handle405s);

module.exports = usersRouter;
