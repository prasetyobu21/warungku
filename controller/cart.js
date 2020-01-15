const Product = require("../models/product");
const User = require("../models/user");
const Cart = require("../models/cart");
const session = require("express-session");

exports.carts = async (req, res, next) => {
  await Cart.find({}, (err, docs) => {
    if (err) {
      res.send(err);
    } else {
      res.send(docs);
    }
  });
};

exports.cart = async (req, res, next) => {
  let cartId = "";
  await Cart.findById(cartId, (err, cart) => {
    if (err) {
      res.send(err);
    } else {
      res.send(cart);
    }
  });
};

exports.addToCart = async (req, res, next) => {
  let productId = "5e077056856fca2084ccd7e1";
  let userId = "5e0762e77aa0601a8c7d575e";
  let cartId = "5e1c207eb9873b4824472471";
  await Product.findById(productId, async (err, product) => {
    if (err) {
      res.send(err);
    } else {
      await Cart.findById(cartId, async (err, cart) => {
        if (err) {
          let cart = new Cart({
            user: userId,
            order: {
              _id: productId,
              product: productId
            },
            totalPrice: product.price
          });
          await cart.save(async (err, cart) => {
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
          await cart.save((err, cart) => {
            if (err) {
              res.send(err);
            } else {
              res.send(cart);
            }
          });
        }
      });
    }
  });
};

exports.removeFromCart = async (req, res, next) => {
  let cartId = "5e1c207eb9873b4824472471";
  let productId = "5e171e0b9a469b17e898086f";
  await Cart.findById(cartId, async (err, cart) => {
    if (err) {
      res.send(err);
    } else {
      if (cart.order.length < 1) {
        // res.redirect("/removeCart");
        res.send("Product not in cart");
      } else {
        let item = cart.order.id(productId);
        await Product.findById(item._id, async (err, product) => {
          if (err) {
            res.send(err);
          } else {
            cart.order.pull({ _id: item._id });
            cart.totalPrice -= product.price * item.qty;
            await cart.save((err, cart) => {
              if (err) {
                res.send(err);
              } else {
                res.send(cart);
              }
            });
          }
        });
      }
    }
  });
};

exports.removeCart = async (req, res, next) => {
  await Cart.deleteOne({ _id: cartId }, (err, cart) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Deleted cart:\n" + cart);
    }
  });
};

exports.checkout = async (req, res, next) => {
  let cartId = "5e1c207eb9873b4824472471";
  const stripe = require("stripe")(
    "sk_test_uDIFUkLi6pqMa1M4iG78eAKq004N78CImt"
  );

  await Cart.findById(cartId, (err, cart) => {
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
        async (err, charge) => {
          if (err) {
            res.send(err);
          } else {
            cart.paymentId = charge.id;
            cart.statusPayment = "Sudah Bayar";
            await cart.save((err, cart) => {
              if (err) {
                res.send(err);
              } else {
                res.send(cart);
              }
            });
          }
        }
      );
    }
  });
};
