const connection = require("../connection");

exports.selectAllTopics = () => {
  return connection("topics")
    .select("slug", "description")
    .returning("*");
};
exports.insertTopic = newTopic => {
  return connection("topics")
    .insert(newTopic)
    .returning("*");
};
