const express = require("express");
const router = express.Router();
const app = express();
const hbs = require("hbs");
const mongo = require("mongoose");
app.set("view engine", "hbs");
const mysql = require("mysql");
const db = require("../dbSql");
const session = require("express-session");
/* GET home page. */
// var userID;

var con = db.conn;
// var sess = req.session;

con.connect(function(err) {
  if (!err) {
    console.log("CONNECTED");
  } else {
    console.log("err");
  }
});

router.get("/", function(req, res, next) {
  // req.session.destroy();
  res.render("index");
});

router.post("/", function(req, res, next) {
  // sess = req.session;
  // sess.destroy();
  var email = req.body.email;
  var password = req.body.password;
  con.query(
    "select * from users where userEmail = ? and userPassword = ?",
    [email, password],
    function(err, result) {
      if (result.length > 0) {
        req.session.userID = result[0].userEmail;
        req.session.status = result[0].userStatus;
        console.log(req.session.userID);
        console.log(req.session.status);
        if (req.session.status == "agen") {
          req.session.login = true;
          res.redirect("/agen");
        } else if (req.session.status == "warung") {
          res.redirect("/warung");
        } else {
          console.log(err);
          console.log("User undefined !");
        }
      } else {
        console.log("Wrong Credentials");
        res.redirect("/");
        res.send("Incorrect Username and/or Password!");
      }
    }
  );
});

router.get("/warung", function(req, res, next) {
  sess = req.session;
  console.log("LOGGED!");
  console.log(sess.userID);
  console.log(sess.status);
  res.render("client/warung/dashboard");
});

router.get("/agen", function(req, res, next) {
  // res.render("client/agen/dashboard");
  // sess = req.session;

  if (req.session.login) {
    console.log("Success");
    res.send("asdasdasd");
    res.render("client/agen/dashboard");
  } else {
    res.redirect("/");
  }
});

module.exports = router;
