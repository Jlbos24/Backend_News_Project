const topicsRouter = require("express").Router();
const { getAllTopics } = require("../controller/topics.js");

topicsRouter.get("/", getAllTopics);

module.exports = topicsRouter;
