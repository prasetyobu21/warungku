const express = require("express");
const router = express.Router();
const app = express();
const hbs = require("hbs");
const mongo = require("mongoose");
app.set("view engine", "hbs");
const mysql = require("mysql");
const db = require("../dbSql");
const session = require("express-session");

var con = db.conn;

exports.loginUser = function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  con.query(
    "select * from users where userEmail = ? and userPassword = ?",
    [email, password],
    function(err, result) {
      if (result.length > 0) {
        req.session.userID = result[0].userEmail;
        req.session.status = result[0].userStatus;
        if (req.session.status == "agen") {
          req.session.login = true;
          res.redirect("/agen");
        } else if (req.session.status == "warung") {
          req.session.login = true;
          res.redirect("/warung");
        } else {
          console.log(err);
          console.log("User undefined !");
        }
      } else if (err) {
        console.log("Wrong Credentials");
        res.redirect("/");
        res.send("Incorrect Username and/or Password!");
      }
    }
  );
};
