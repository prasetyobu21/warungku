const Product = require("../models/product");
const User = require("../models/user");
const Cart = require("../models/cart");
const session = require("express-session");

exports.showProducts = (req, res, next) => {
  Cart.find({}, (req, products) => {
    res.send(products);
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

exports.addToCart = (req, res, next) => {
  if (session.login && session.id) {
    if (session.cart == undefined) {
      const productId = req.body.productId;
      Product.findOne({ _id: productId }, (req, product) => {
        const cart = new Cart({
          buyer: session.id,
          product: [
            {
              _id: productId,
              name: product.name,
              seller: product.seller,
              price: product.price
            }
          ]
        });
        cart.save((err, docs) => {
          if (err) {
            console.log(err);
          } else {
            session.cart = docs;
            res.send(session.cart._id);
          }
        });
      });
    } else {
      const productId = req.body.productId;
      Product.findOne({ _id: productId }, (req, product) => {
        Cart.findOneAndUpdate(
          { _id: session.cart },
          {
            $push: {
              product: {
                _id: productId,
                name: product.name,
                seller: product.seller,
                price: product.price
              }
            }
          },
          (err, docs) => {
            if (err) {
              res.send(err);
            } else {
              res.send(docs._id);
            }
          }
        );
      });
    }
  } else {
    res.redirect("/signin");
  }
};

exports.checkout = (req, res, next) => {
  Cart.findOne({ _id: session.cart._id }, (err, cart) => {
    if (err) {
      res.send(err);
    } else {
      const totalProduct = cart.product.length;
      var totalPrice = 0;
      for (var i = 0; i < totalProduct; i++) {
        totalPrice += cart.product[i].price;
      }
      res.send(cart + "\n" + "Total Price : " + JSON.stringify(totalPrice));
    }
  });
};
