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
            session.cart = docs._id;
            res.send(docs);
            console.log(docs);
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
              res.send(docs);
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
  if (session.login && session.id) {
    if (session.cart == undefined) {
      res.redirect("/");
    } else {
      Cart.aggregate(
        [
          {
            $match: { $and: [{ _id: session.cart }] }
          },
          {
            $group: {
              _id: null,
              totalPrice: {
                $sum: "$price"
              }
            }
          }
        ],
        (err, result) => {
          if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
        }
      );
    }
  } else {
    res.redirect("/signin");
  }
};
