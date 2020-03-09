exports.handle404s = (req, res, next) => {
  res.status(404).send({ msg: "Path does not exist" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  const psqlBadRequestCodes = ["22P02", "42803", "23503", "23502", "42703"];
  if (psqlBadRequestCodes.includes(err.code))
    res.status(400).send({ msg: "Bad Request" });
  else next(err);
};

exports.handle405s = (req, res, next) => {
  res.status(405).send({ msg: "Method Not Allowed" });
};
exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
