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

exports.userList = function(req, res, next) {
  con.query("select * from userdata"),
    function(err, result) {
      if (result.length > 0) {
        var email = result[0].email;
        var status = result[0].status;
        var address = result[0].address;
        var phone = result[0].phoneNumber;
        var jenis = result[0].jenis;
      } else if (err) {
        console.log(err);
      }
    };
};

exports.changeUserStatus = function(req, res, next) {
  var email = req.body.email;
  con.query("update userdata set status = 'nonaktif' where email = ?", [email]);
};

exports.itemList = function(req, res, next) {
  var item = req.body.item;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("warungku");
    var query = { itemName: item };
    dbo
      .collection("catalog")
      .find()
      .toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
      });
  });
};

exports.transactionList = function(req, res, next) {
  var transaction = req.body.transaction;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("warungku");
    var query = { transactionID: transaction };
    dbo
      .collection("transaction")
      .find()
      .toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
      });
  });
};

exports.viewReport = function(req, res, next) {
  var reportID = req.body.reportID;
  con.query("select * from report where reportID = ?", [reportID], function(
    result,
    err
  ) {
    if (result.length > 0) {
      var reportSender = result[0].sender;
      var reportReciever = result[0].reciever;
      var reportMessage = result[0].message;
    }
  });
};
