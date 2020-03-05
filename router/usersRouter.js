const usersRouter = require("express").Router();
const { getUserByID } = require("../controller/users.js");

usersRouter.get("/:username", getUserByID);

module.exports = usersRouter;
