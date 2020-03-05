const usersRouter = require("express").Router();
const { getUserByID } = require("../controller/users.js");
const { handle405s } = require("../errors/errors.js");

usersRouter
  .route("/:username")
  .get(getUserByID)
  .all(handle405s);

module.exports = usersRouter;
