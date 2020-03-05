const { selectAllTopics } = require("../model/topics.js");

exports.getAllTopics = (req, res, next) => {
  //   console.log("Are in Controller?");
  selectAllTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
