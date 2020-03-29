const topicsRouter = require("express").Router();
const { getAllTopics, postTopics } = require("../controller/topics.js");
const { handle405s } = require("../errors/errors");

topicsRouter
  .route("/")
  .get(getAllTopics)
  .post(postTopics)
  .all(handle405s);

module.exports = topicsRouter;
