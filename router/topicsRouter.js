const topicsRouter = require("express").Router();
const { getAllTopics } = require("../controller/topics.js");
const { handle405s } = require("../errors/errors");

topicsRouter
  .route("/")
  .get(getAllTopics)
  .all(handle405s);

module.exports = topicsRouter;
