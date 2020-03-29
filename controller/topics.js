const { selectAllTopics, insertTopic } = require("../model/topics.js");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postTopics = (req, res, next) => {
  const newTopic = req.body;
  insertTopic(newTopic)
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
