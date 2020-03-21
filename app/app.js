const express = require("express");
const app = express();
const apiRouter = require("../router/apiRouter.js");
const {
  handle405s,
  handle404s,
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors
} = require("../errors/errors");

app.use(express.json());
app.use("/api", apiRouter);

// app.all("/api/*", (req, res, next) => {
//   //console.log(routes);
// });

app.use(handle404s);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle405s);
app.use(handleServerErrors);

module.exports = app;
