const express = require("express");
const app = express();
app.set("view engine", "hbs");
const db = require("../dbSql");
const session = require("express-session");

var con = db.conn;

exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;
  con.query(
    "select * from users where userEmail = ? and userPassword = ?",
    [email, password],
    function(err, result) {
      if (result.length > 0) {
        session.userID = result[0].userEmail;
        session.status = result[0].userStatus;
        res.redirect("/auth");
      } else if (err) {
        res.redirect("/signin", { message: "Check your account again!" });
      }
    }
  );
};

exports.loginAdmin = (req, res, next) => {
  const { email, password } = req.body;
  con.query(
    "select * from users where userEmail = ? and userPassword = ?",
    [email, password],
    function(err, result) {
      if (result.length > 0) {
        session.userID = result[0].userEmail;
        session.status = result[0].userStatus;
        if (session.status == "admin") {
          session.login = true;
          res.redirect("/adminPanel");
        } else {
          res.redirect("/admin", { message: "Check your account again!" });
        }
      } else if (err) {
        res.redirect("/signin", { message: "You are not admin!" });
      }
    }
  );
};

exports.signupUser = (req, res, next) => {
  const { username, email, password, userStatus } = req.body;
  const userData = [username, email, password, userStatus];
  console.log(userData);
  con.query(
    "INSERT INTO users (userName, userEmail, userPassword, userStatus) VALUES (?,?,?,?)",
    userData,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/signin");
      }
    }
  );
};
