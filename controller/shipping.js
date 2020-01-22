const Product = require("../models/product");
const Cart = require("../models/cart");
const User = require("../models/user");
const Shipping = require("../models/shipping");
const session = require("express-session");

exports.add = async (req, res, next) => {
  let userId = "5e0762e77aa0601a8c7d575e";
  await User.findById(userId, async (err, user) => {
    if (err) console.log(err);
    const { name, price } = req.body;
    let shipping = new Shipping({
      admin: user,
      name: name,
      price: price
    });
    await shipping.save((err, shipping) => {
      if (err) console.log(err);
      res.send(shipping);
    });
  });
};

exports.choose = async (req, res, next) => {
  let cartId = session.cart;
  let shippingId = req.params.id;
  await Cart.findById(cartId, async (err, cart) => {
    if (err) console.log(err);
    // res.send("No Shipping");
    await Shipping.findById(shippingId, async (err, shipping) => {
      if (err) console.log(err);
      cart.totalPrice += shipping.price;
      cart.shipping.type = shipping;
      await cart.save((err, cart) => {
        if (err) console.log(err);
        res.redirect("/cart");
      });
    });
  });
};

exports.change = async (req, res, next) => {
  let cartId = session.cart;
  let shippingId = req.params.id;
  await Cart.findById(cartId, async (err, cart) => {
    if (err) console.log(err);
    cart.totalPrice -= cart.shipping.type.price;
    cart.shipping.type = null;
    await cart.save(err => {
      if (err) console.log(err);
      res.redirect("/cart");
    });
  });
};
