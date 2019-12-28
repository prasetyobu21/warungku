const express = require("express");
const router = express.Router();
const app = express();
const hbs = require("hbs");
const mongo = require("mongoose");
app.set("view engine", "hbs");
const mysql = require("mysql");
const db = require("../dbSql");
const session = require("express-session");
const userController = require("../controller/user");
/* GET home page. */

router.get("/signin", function(req, res, next) {
  res.render("signin");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", userController.signupUser);

router.get("/admin", function(req, res, next) {
  res.render("loginAdmin");
});

router.post("/signin", userController.loginUser);

router.post("/loginAdmin", userController.loginAdmin);
router.get("/auth", function(req, res, next) {
  if (session.status == "agen") {
    session.login = true;
    res.redirect("/agen");
  } else if (session.status == "warung") {
    session.login = true;
    res.redirect("/warung");
  } else {
    res.redirect("/", { message: "User not found!" });
  }
});

router.get("/warung", function(req, res, next) {
  if (session.login && session.status == "warung") {
    res.render("client/warung/dashboard");
  } else {
    res.redirect("/");
  }
});

router.get("/agen", function(req, res, next) {
  if (session.login && session.status == "agen") {
    res.render("client/agen/dashboard");
  } else {
    res.redirect("/");
  }
});

router.get("/adminPanel", function(req, res, next) {
  if (session.login && session.status == "admin") {
    res.render("admin/dashboard");
  } else {
    res.redirect("/admin");
  }
});

module.exports = router;
