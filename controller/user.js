const db = require("../dbSql");
const session = require("express-session");
const User = require("../models/user");

var con = db.conn;

exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;
  con.query(
    "select * from users where userEmail = ? and userPassword = ?",
    [email, password],
    function(err, result) {
      if (result.length > 0) {
        session.userID = result[0].userEmail;
        session.type = result[0].userType;
        User.findOne({ email: session.userID }, (err, docs) => {
          // console.log(docs._id);
          session.id = docs._id;
        });
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
        session.userType = result[0].userType;
        if (session.userType == "admin") {
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
  const { email, password, userStatus } = req.body;
  const userData = [email, password, userStatus];
  console.log(userData);
  con.query(
    "INSERT INTO users ( userEmail, userPassword, userType, userStatus) VALUES (?,?,?, 'aktif')",
    userData,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const instance = new User();
        instance.email = email;
        instance.save((err, docs) => {
          if (err) {
            console.log("Error");
          } else {
            console.log(docs);
          }
        });
        res.redirect("/signin");
      }
    }
  );
};
