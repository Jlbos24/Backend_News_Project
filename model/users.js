const connection = require("../connection");

exports.selectUserByID = username => {
  return connection("users")
    .select("username", "avatar_url", "name")
    .where("username", username)
    .then(([user]) => {
      if (!user) {
        return Promise.reject({ status: 404, msg: "Username Does Not Exist" });
      } else return user;
    });
};

exports.fetchAllUsers = () => {
  return connection("users")
    .select("username", "avatar_url", "name")
    .orderBy("name", "desc")
    .returning("*");
};

exports.insertUser = user => {
  return connection("users")
    .insert([user])
    .returning("*");
};
