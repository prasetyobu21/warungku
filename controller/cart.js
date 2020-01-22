const Product = require("../models/product");
const Cart = require("../models/cart");
const User = require("../models/user");
const Shipping = require("../models/shipping");
const session = require("express-session");

exports.carts = async (req, res, next) => {
  await Cart.find({}, (err, carts) => {
    if (err) {
      console.log(err);
    } else {
      // res.render("admin/cart", { carts: carts });
      res.send(carts);
    }
  });
};

exports.cart = (req, res, next) => {
  let cartId = session.cart;
  // console.log(cartId);
  Cart.findOne({ _id: cartId, status: "In Cart" }, async (err, cart) => {
    // Sedang diteruskan ke agent
    if (err) {
      // res.send("Error");
      console.log(err);
    } else {
      if (cart == null) {
        // res.send("No Cart");
        res.render("client/warung/noCart");
      } else {
        await Shipping.find({}, (err, shipping) => {
          if (err) console.log(err);
          res.render("client/warung/cart", { cart: cart, shipping: shipping });
          // res.send(cart);
        });
      }
    }
  });
};

exports.addToCart = async (req, res, next) => {
  let productId = req.params.id;
  let userId = session.id;
  let cartId = session.cart;
  await User.findById(userId, async (err, user) => {
    if (err) {
      console.log(err);
    } else {
      await Product.findById(productId, async (err, product) => {
        if (err) console.log(err);
        await Cart.findById(cartId, async (err, cart) => {
          if (err) console.log(err);
          if (cart == null) {
            let newCart = new Cart({
              user: user,
              order: {
                _id: productId,
                product: product,
                totalPrice: product.price
              },
              totalPrice: product.price
            });
            await newCart.save((err, cart) => {
              if (err) console.log(err);
              // res.send(newCart);
              session.cart = cart.id;
              res.redirect("/");
            });
          } else {
            let item = cart.order.id(productId);
            if (item == undefined) {
              // res.send("Undefined");
              cart.order.push({
                _id: productId,
                product: product,
                totalPrice: product.price
              });
              cart.qty += 1;
              cart.totalPrice += product.price;
              cart.save((err, cart) => {
                if (err) {
                  console.log(err);
                } else {
                  res.redirect("/");
                }
              });
            } else {
              item.qty += 1;
              cart.totalPrice += product.price;
              item.totalPrice += product.price;
              cart.qty += 1;
              await cart.save((err, cart) => {
                if (err) {
                  console.log(err);
                } else {
                  res.redirect("/cart");
                }
              });
            }
          }
        });
      });
    }
  });
};

exports.decreaseOne = async (req, res, next) => {
  let cartId = session.cart;
  let productId = req.params.id;
  await Product.findById(productId, async (err, product) => {
    if (err) console.log(err);
    await Cart.findById(cartId, async (err, cart) => {
      if (err) console.log(err);
      let item = cart.order.id(productId);
      item.qty -= 1;
      item.totalPrice -= product.price;
      cart.totalPrice -= product.price;
      cart.qty -= 1;
      if (cart.qty < 1) {
        res.render("client/warung/noCart");
      } else {
        if (item.qty < 1) {
          cart.order.pull({ _id: productId });
        } else {
          await cart.save(err => {
            if (err) {
              res.send(err);
            } else {
              res.redirect("/cart");
              // res.render("client/warung/cart", { cart: cart });
              // res.json(cart);
            }
          });
        }
      }
    });
  });
};

exports.removeFromCart = async (req, res, next) => {
  let cartId = session.cart;
  let productId = req.params.id;
  await Cart.findById(cartId, async (err, cart) => {
    if (err) {
      console.log(err);
    } else {
      if (cart.order.length < 1) {
        // res.redirect("/removeCart");
        res.render("client/home", {
          products: products,
          message: "Product not in cart"
        });
      } else {
        let item = cart.order.id(productId);
        await Product.findById(item._id, async (err, product) => {
          if (err) {
            console.log(err);
          } else {
            cart.totalPrice -= item.totalPrice;
            cart.qty -= item.qty;
            cart.order.pull({ _id: item._id });
            await cart.save((err, cart) => {
              if (err) {
                console.log(err);
              } else {
                res.redirect("/cart");
                // res.render("client/warung/cart", { cart: cart });
              }
            });
          }
        });
      }
    }
  });
};

exports.removeCart = async (req, res, next) => {
  let cartId = session.cart;
  await Cart.deleteOne({ _id: cartId }, (err, cart) => {
    if (err) {
      console.log(err);
    } else {
      res.render("client/home", {
        message: "Cart Deleted"
      });
    }
  });
};

exports.checkPage = async (req, res, next) => {
  let cartId = session.cart;
  await Cart.findById(cartId, (err, cart) => {
    if (err) console.log(err);
    res.render("client/warung/checkout", { cart: cart });
  });
};

exports.checkout = async (req, res, next) => {
  let cartId = session.cart;
  const stripe = require("stripe")(
    "sk_test_uDIFUkLi6pqMa1M4iG78eAKq004N78CImt"
  );
  // var elements = stripe.elements();

  await Cart.findById(cartId, (err, cart) => {
    if (err) {
      console.log("Cart not found");
    } else {
      stripe.charges.create(
        {
          amount: cart.totalPrice * 100,
          currency: "idr",
          source: req.body.stripeToken,
          description: "Test Charge"
        },
        async (err, charge) => {
          if (err) {
            console.log(err);
          } else {
            cart.payment.status = "Sudah Bayar";
            cart.status = "Sedang diteruskan ke agent";
            await cart.save(async (err, cart) => {
              if (err) {
                console.log(err);
              } else {
                // res.send("Success");
                session.message = "Success";
                session.cart = null;
                res.redirect("/");
              }
            });
          }
        }
      );
    }
  });
};

exports.installment = async (req, res, next) => {
  let cartId = session.cart;
  await Cart.findById(cartId, async (err, cart) => {
    if (err) {
      console.log(err);
    } else {
      const installment = cart.payment.paymentType.installment;
      const { duration } = req.body;
      let price = cart.totalPrice / duration;
      cart.shipping.shippingType = "COD";
      cart.shipping.shippingStatus = "Sedang diteruskan ke agen";
      installment.duration = duration;
      installment.pricePerMonth = price;
      installment.currentMonth = price;
      await cart.save((err, cart) => {
        if (err) {
          console.log(err);
        } else {
          let productLength = cart.order.length;
          let product = cart.order;
          for (let i = 0; i <= productLength; i++) {
            Product.findById(product[i].id, async (err, product) => {
              if (err) {
                console.log(err);
              } else {
                product.qty -= 1;
                product.sold += 1;
                await product.save(err => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.render("client/warung/order", {
                      message: "Order forward to agent"
                    });
                  }
                });
              }
            });
          }
        }
      });
    }
  });
};
