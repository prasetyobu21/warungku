const Product = require("../models/product");
const User = require("../models/user");
const Cart = require("../models/cart");
const session = require("express-session");

exports.showProducts = (req, res, next) => {
  Product.find({}, (err, products) => {
    if (err) {
      res.send(err);
    } else {
      res.send(products);
    }
  });
};

exports.addProducts = (req, res, next) => {
  if (session.login && session.id) {
    console.log(req.user);
    const { name, image, price } = req.body;
    const product = new Product({
      name: name,
      image: image,
      price: price,
      seller: session.userID
    });
    product.save((err, docs) => {
      if (err) {
        console.log(err);
      } else {
        console.log(docs);
      }
    });
    res.redirect("/warung");
  } else {
    res.redirect("/signin");
  }
};
