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
const { PORT = 9090 } = process.env;

app.use(express.json());
app.use("/api", apiRouter);
// app.get("/api/*", (req, res, next) => {
//   console.log(app._router.stack.handle);
//   // const x = json.stringify(app);
//   // console.log(x);
//   res.status(200).send(json.stringify(apiRouter.stack));
// });

app.use(handle404s);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle405s);
app.use(handleServerErrors);

module.exports = app;
