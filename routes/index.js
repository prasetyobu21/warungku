const express = require("express");
const router = express.Router();
const app = express();
const hbs = require("hbs");
const mongo = require("mongoose");
app.set("view engine", "hbs");
const mysql = require("mysql");
const db = require("../dbSql");
const session = require("express-session");
const loginUser = require("../controller/user");
/* GET home page. */

router.get("/", function(req, res, next) {
  req.session.destroy();
  res.render("index");
});

router.get("/admin", function(req, res, next) {
  req.session.destroy();
  res.render("loginAdmin");
});

router.post("/", loginUser.loginUser);

router.post("/loginAdmin", loginUser.loginAdmin);
router.get("/auth", function(req, res, next) {
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
});

router.get("/warung", function(req, res, next) {
  if (req.session.login && req.session.status == "warung") {
    console.log("welcome " + req.session.userID);
    res.render("client/warung/dashboard");
  } else {
    res.redirect("/");
  }
});

router.get("/agen", function(req, res, next) {
  if (req.session.login && req.session.status == "agen") {
    console.log("welcome " + req.session.userID);
    res.render("client/agen/dashboard");
  } else {
    res.redirect("/");
  }
});

router.get("/adminPanel", function(req, res, next) {
  if (req.session.login && req.session.status == "admin") {
    console.log("welcome " + req.session.userID);
    res.render("admin/dashboard");
  } else {
    res.redirect("/admin");
  }
});

module.exports = router;
