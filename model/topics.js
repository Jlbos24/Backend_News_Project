const connection = require("../connection");

exports.selectAllTopics = () => {
  return connection("topics")
    .select("slug", "description")
    .returning("*");
};
