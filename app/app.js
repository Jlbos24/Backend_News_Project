const express = require("express");
const app = express();
const apiRouter = require("../router/apiRouter.js");
const cors = require("cors");
const {
  handle405s,
  handle404s,
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors
} = require("../errors/errors");

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.post("/api/articles/:article_id/comments", cors(), function(
  req,
  res,
  next
) {
  res.json({ msg: "This is CORS Enabled Articles POST" });
});

app.options("/api/comments/:comment_id", cors());

app.delete("/api/comments/:comment_id", cors(), function(req, res, next) {
  res.json({ msg: "This is CORS Enabled Comment DELETE" });
});
app.listen(9090, function() {
  console.log("CORS ENABLED ON 9090");
});

app.use(handle404s);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle405s);
app.use(handleServerErrors);

module.exports = app;
