const db = require("../dbSql");
const Product = require("../models/product");
const Cart = require("../models/cart");
const session = require("express-session");

var con = db.conn;

exports.adminDashboard = async (req, res, next) => {
  if (session.login && session.userType == "admin") {
    await Cart.find({}, (err, cart) => {
      if (err) {
        console.log(err);
      } else {
        session.totalTransaksiHarian = cart.length;
      }
    });

    await Product.find({}, (err, product) => {
      if (err) {
        console.log(err);
      } else {
        session.totalItem = product.length;
      }
    });

    con.query(
      "select count(userEmail) as totalUser from users",
      (err, result, field) => {
        if (err) {
          res.send("Hilang");
        } else {
          // res.render("admin/userlist", { totalUser: result[0].totalUser });
          session.totalUserAktif = result[0].totalUser;
          console.log(session.totalUserAktif);
          // console.log(result[0].totalUser);
        }
      }
    );

    res.render("admin/dashboard", {
      cart: session.totalTransaksiHarian,
      totalUser: session.totalUserAktif,
      totalItem: session.totalItem
    });
    console.log(session.totalUserAktif);
  } else {
    res.redirect("/admin");
  }
};

exports.userList = function(req, res, next) {
  con.query("select * from users", (err, result, field) => {
    if (err) {
      res.send("Hilang");
    } else {
      res.render("admin/userlist", { result: result });
    }
  });
};

exports.changeUserStatus = function(req, res, next) {
  var email = req.body.email;
  var information = req.body.information;
  con.query("update users set userStatus = 'nonaktif' where email = ?", [
    email
  ]);

  con.query("update users set information = ? where email = ?", [
    email,
    information
  ]);
};

exports.itemList = async (req, res, next) => {
  await Product.find({}, (err, products) => {
    if (err) {
      res.send(err);
    } else {
      res.render("admin/itemList", { products: products });
    }
  });
};

exports.cart = async (req, res, next) => {
  const cartId = "";
  await Cart.findById(cartId, (err, cart) => {
    if (err) {
      console.log(err);
    } else {
      res.render("admin/cart", { cart: cart });
    }
  });
};

exports.totalTransaction = function(req, res, next) {
  con.query("select count (userEmail) as totalUser from users"),
    function(err, result) {
      if (result.length > 0) {
        var totalUser = result[0].totalUser;
      } else if (err) {
        throw err;
      }
    };
};

exports.viewComplain = function(req, res, next) {
  var reportID = req.body.reportID;
  con.query("select * from complain where complainID = ?", [reportID], function(
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

exports.updateCart = async (req, res, next) => {
  const cartId = "";
  await Cart.findById(cartId, async (err, cart) => {
    const shippingPartner = cart.shipping.shippingPartner;
    const contactShipping = cart.shipping.shippingPartner.contact;
    shipping.shippingStatus = "";
    shippingPartner.resiNumber = "";
    shippingPartner.estimationTime = "";
    contactShipping.name = "";
    contactShipping.phoneNumber = "";
    await cart.save((err, cart) => {
      if (err) {
        console.log(err);
      } else {
        res.render("admin/cart", { cart: cart });
      }
    });
  });
};

exports.dataTransaction = async (req, res, next) => {
  await Cart.find({ status: "finish" }, async (err, cart) => {
    if (err) {
    } else {
      let cartLength = cart.length;
      for (let i = 0; i <= cartLength; i++) {
        totalRevenue += cart[i].totalPrice;
        totalOrder += cart[i].qty;
      }
      await Product.find({}, async (err, product) => {
        let productLength = product.length;
        for (let i = 0; i <= productLength; i++) {
          totalProduct += product[i].qty;
        }
      });
      res.send({
        totalRevenue: totalRevenue,
        totalOrder: totalOrder,
        totalProduct: totalProduct
      });
    }
  });
};

exports.transaction = async (req, res, next) => {
  await Cart.find({}, (err, cart) => {
    if (err) {
      console.log(err);
    } else {
      res.render("admin/transactionList", { cart: cart });
      // res.send(cart);
    }
  });
};
