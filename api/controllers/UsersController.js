/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  signup: function (req, res) {

    console.log("signup procedure started");

    var username = req.param("username");
    var password = req.param("password");

    console.log("username", username, "pwd", password);

    Users.findOne({
      username:username
    }).exec(function (err, usr){

      console.log("something found", usr);

      if (err) {
        console.log("500");
        res.send(500, { error: "DB Error" });
      } else if (usr) {
        console.log("400");
        res.send(400, {error: "Username already Taken"});
      } else {
        //var hasher = require("password-hash");
        //password = hasher.generate(password);
        console.log("creating new user");

        Users.create({username: username, password: password}).exec(function(error, user) {
          console.log("creating results", error, user);
          if (error) {
            res.send(500, {error: "DB Error"});
          } else {
            req.session.user = user;
            res.send(user);
          }
        });
      }
    });
  },

  login: function (req, res) {

    console.log("incoming login request");

    var username = req.param("username");
    var password = req.param("password");

    Users.findOne({
      username:username
    }).exec(function (err, usr){

      console.log("something found", err, usr);

      if (err) {
        console.log("500");
        res.send(500, { error: "DB Error" });
      } else {
        if (usr) {
          ////var hasher = require("password-hash");
          //if (hasher.verify(password, usr.password)) {
          if (password == usr.password) {

            console.log("pwd ok", password, usr.password);

            req.session.user = usr;
            res.send(200, usr);
          } else {

            console.log("pwd wrong", password, usr.password);

            res.send(400, { error: "Wrong Password" });
          }
        } else {

          console.log("user not found", username);

          res.send(404, { error: "User not Found" });
        }
      }
    });
  }

};

