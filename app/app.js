const express = require("express");
const app = express();
const apiRouter = require("../router/apiRouter.js");
const { handle405s, handleCustomErrors } = require("../errors/errors");

app.use(express.json());
app.use("/api", apiRouter);

//app.use(handleCustomErrors);

app.use((req, res, next) => {
  res.status(404).send({ msg: "Path does not exist" });
});

app.use(handle405s);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else if (
    err.code === "42703" ||
    err.code === "23502" ||
    err.code === "23503" ||
    err.code === "42803" ||
    err.code === "22P02"
  ) {
    res.status(400).send({
      msg: "Bad Request"
    });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({
    msg: "Internal Server Error"
  });
});

module.exports = app;
