const Product = require("../models/product");
const User = require("../models/user");
const Cart = require("../models/cart");
const session = require("express-session");

exports.carts = (req, res, next) => {
  Cart.find({}, (err, docs) => {
    res.send(docs);
  });
};

exports.cart = (req, res, next) => {};

exports.addToCart = (req, res, next) => {
  let productId = "5e171e0b9a469b17e898086f";
  let userId = "5e0762e77aa0601a8c7d575e";
  let cartId = "5e1c207eb9873b4824472471";
  Product.findById(productId, (err, product) => {
    if (err) {
      res.send(err);
    } else {
      Cart.findById(cartId, (err, cart) => {
        if (err) {
          let cart = new Cart({
            user: userId,
            order: {
              _id: productId,
              product: productId
            },
            totalPrice: product.price
          });
          cart.save((err, cart) => {
            if (err) {
              res.send(err);
            } else {
              res.send(cart);
            }
          });
        } else {
          let item = cart.order.id(productId);
          item.qty += 1;
          cart.totalPrice += product.price;
          cart.save((err, cart) => {
            if (err) {
              console.log(err);
            } else {
              console.log(cart);
            }
          });
        }
      });
    }
  });
};

exports.removeFromCart = (req, res, next) => {
  let cartId = "5e1c207eb9873b4824472471";
  let productId = "5e171e0b9a469b17e898086f";
  Cart.findById(cartId, (err, cart) => {
    if (err) {
      console.log(err);
    } else {
      if (cart.order.length < 1) {
        // res.redirect("/removeCart");
        console.log("Product not in cart");
      } else {
        let item = cart.order.id(productId);
        Product.findById(item._id, (err, product) => {
          if (err) {
            console.log(err);
          } else {
            cart.order.pull({ _id: item._id });
            cart.totalPrice -= product.price * item.qty;
            console.log(cart);
            cart.save((err, cart) => {
              if (err) {
                console.log(err);
              } else {
                console.log(cart);
              }
            });
          }
        });
      }
    }
  });
};

exports.removeCart = (req, res, next) => {
  Cart.deleteOne({ _id: cartId }, (err, cart) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Deleted cart:\n" + cart);
    }
  });
};

exports.checkout = (req, res, next) => {
  let cartId = "5e1c207eb9873b4824472471";
  const stripe = require("stripe")(
    "sk_test_uDIFUkLi6pqMa1M4iG78eAKq004N78CImt"
  );

  Cart.findById(cartId, (err, cart) => {
    if (err) {
      console.log("Cart not found");
    } else {
      stripe.charges.create(
        {
          amount: cart.totalPrice * 100,
          currency: "idr",
          source: "tok_mastercard",
          description: "Test Charge"
        },
        (err, charge) => {
          if (err) {
            console.log(err);
          } else {
            cart.paymentId = charge.id;
            cart.statusPayment = "Sudah Bayar";
            cart.save((err, cart) => {
              if (err) {
                console.log(err);
              } else {
                console.log(cart);
              }
            });
          }
        }
      );
    }
  });
};
