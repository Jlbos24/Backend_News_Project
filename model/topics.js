const connection = require("../connection");

exports.selectAllTopics = () => {
  //   console.log("are we in the model?");

  return connection("topics")
    .select("slug", "description")

    .returning("*");

  // .then(res => {
  //   console.log(res);
  //   return res;
  // });
};
