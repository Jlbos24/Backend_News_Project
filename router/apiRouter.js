const apiRouter = require("express").Router();
const topicsRouter = require("./topicsRouter.js");
const usersRouter = require("./usersRouter.js");
const articlesRouter = require("./articlesRouter.js");
const commentsRouter = require("./commentsRouter.js");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

apiRouter.get("/", (req, res, next) => {
  // const pathsArray = [];
  // apiRouter.stack.forEach(stack => {
  //   pathsArray.push(stack);
  // });
  // //console.log(apiRouter.stack);
  // console.log(pathsArray[0].regexp, pathsArray[0].keys);
});

module.exports = apiRouter;
