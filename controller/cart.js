const Product = require("../models/product");
const Cart = require("../models/cart");
const session = require("express-session");

exports.carts = async (req, res, next) => {
  await Cart.find({}, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      res.render("admin/cart", { carts: carts });
    }
  });
};

exports.cart = async (req, res, next) => {
  let cartId = "";
  await Cart.findById(cartId, (err, cart) => {
    if (err) {
      res.render("client/warung/cart", { message: "Empty Cart" });
    } else {
      res.render("client/warung/cart", { cart: cart });
    }
  });
};

exports.addToCart = async (req, res, next) => {
  let productId = "5e077056856fca2084ccd7e1";
  let userId = "5e0762e77aa0601a8c7d575e";
  let cartId = "5e1c207eb9873b4824472471";
  await Product.findById(productId, async (err, product) => {
    if (err) {
      console.log(err);
    } else {
      if (product.qty > 0) {
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
                console.log(err);
              } else {
                res.render("client/warung/cart", { cart: cart });
              }
            });
          } else {
            let item = cart.order.id(productId);
            item.qty += 1;
            cart.totalPrice += product.price;
            cart.qty += 1;
            await cart.save((err, cart) => {
              if (err) {
                console.log(err);
              } else {
                res.render("client/warung/cart", { cart: cart });
              }
            });
          }
        });
      } else {
        res.render("client/home", {
          products: products,
          message: "Product Kosong"
        });
      }
    }
  });
};

exports.decreaseOne = async (req, res, next) => {
  let cartId = "5e1c207eb9873b4824472471";
  let productId = "5e077056856fca2084ccd7e1";
  await Product.findById(productId, async (err, product) => {
    if (err) {
      console.log(err);
    } else {
      if (product.qty > 1) {
        await Cart.findById(cartId, async (err, cart) => {
          if (err) {
            console.log(err);
          } else {
            let item = cart.order.id(productId);
            item.qty -= 1;
            cart.totalPrice -= product.price;
            cart.qty -= 1;
            if (qty < 1) {
              cart.order.pull({ _id: productId });
            }
            await cart.save((err, cart) => {
              if (err) {
                res.send(err);
              } else {
                res.render("client/warung/cart", { cart: cart });
              }
            });
          }
        });
      } else {
        res.render("client/home", {
          products: products,
          message: "Product Kosong"
        });
      }
    }
  });
};

exports.removeFromCart = async (req, res, next) => {
  let cartId = "5e1c207eb9873b4824472471";
  let productId = "5e077056856fca2084ccd7e1";
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
            cart.totalPrice -= product.price * item.qty;
            cart.qty -= item.qty;
            cart.order.pull({ _id: item._id });
            await cart.save((err, cart) => {
              if (err) {
                console.log(err);
              } else {
                res.render("client/warung/cart", { cart: cart });
              }
            });
          }
        });
      }
    }
  });
};

exports.removeCart = async (req, res, next) => {
  let cartId = "5e1c207eb9873b4824472471";
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

exports.checkout = async (req, res, next) => {
  let cartId = "5e1c207eb9873b4824472471";
  const stripe = require("stripe")(
    "sk_test_uDIFUkLi6pqMa1M4iG78eAKq004N78CImt"
  );

  await Cart.findById(cartId, (err, cart) => {
    if (err) {
      console.log("Cart not found");
    } else {
      const {
        shippingType,
        partner,
        price,
        estimation,
        destination
      } = req.body;
      let totalPrice = cart.totalPrice + price;
      stripe.charges.create(
        {
          amount: totalPrice * 100,
          currency: "idr",
          source: "tok_mastercard",
          description: "Test Charge"
        },
        async (err, charge) => {
          if (err) {
            console.log(err);
          } else {
            cart.paymentType.paymentId = charge.id;
            cart.paymentType.partner = "Stripe";
            cart.payment.status = "Sudah Bayar";
            cart.status = "Sedang diteruskan ke agent";
            cart.shipping.shippingType = shippingType;
            cart.shipping.shippingPartner = partner;
            cart.shipping.estimation = estimation;
            cart.shipping.destination = destination;
            await cart.save(async (err, cart) => {
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
        }
      );
    }
  });
};

exports.installment = async (req, res, next) => {
  let cartId = "5e1c207eb9873b4824472471";
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
