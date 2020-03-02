const { articlesData } = require("../data/test-data/index.js");

exports.formatDates = list => {
  const formattedDates = list.map(article => {
    const newObject = { ...article };

    let newDate = new Date(newObject.created_at);
    newObject.created_at = newDate;
    return newObject;
  });

  return formattedDates;
};

exports.makeRefObj = list => {
  const refObject = {};

  list.forEach(article => {
    return (refObject[article.title] = article.article_id);
  });

  return refObject;
};

exports.formatComments = (comments, articleRef) => {
  const formattedComments = comments.map(comment => {
    let newObject = { ...comment };

    let newDate = new Date(newObject.created_at);
    newObject.created_at = newDate;

    newObject["author"] = newObject.created_by;
    delete newObject.created_by;

    for (let key in articleRef) {
      if (key === newObject.belongs_to) {
        newObject["article_id"] = articleRef.key;
        newObject.article_id = articleRef[key];
        delete newObject.belongs_to;
      }
    }
    return newObject;
  });

  return formattedComments;
};
