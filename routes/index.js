const express = require("express");
const router = express.Router();
const app = express();
const hbs = require("hbs");
app.set("view engine", "hbs");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/home", function(req, res, next) {
  res.render("dashboard");
});
module.exports = router;
