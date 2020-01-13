const Product = require("../models/product");
const User = require("../models/user");
const Cart = require("../models/cart");
const Order = require("../models/order");
const session = require("express-session");

exports.orders = (req, res, next) => {
  Order.find({}, (err, docs) => {
    res.send(docs);
  });
};

exports.carts = (req, res, next) => {
  Cart.find({}, (err, docs) => {
    res.send(docs);
  });
};

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
  let cartId = "5e1c0646a85acc465cbac2bd";
  Cart.findById(cartId, (err, cart) => {
    if (err) {
      console.log(err);
    } else {
      cart.order.pull({ _id: "5e1c1088908f5e36fc73883f" });
      cart.save((err, cart) => {
        if (err) {
          console.log(err);
        } else {
          console.log(cart);
        }
      });
    }
  });
};

// exports.addToCart = (req, res, next) => {
//   session.login = true;
//   // session.cart = "5e19bc626a578715b85e90ae";
//   if (session.login) {
//     if (session.cart == undefined) {
//       Product.findById("5e076dc334df8134189c0332", (err, docs) => {
//         const order = new Order({
//           product: docs,
//           _creator: session.id
//         });
//         order.save((err, order) => {
//           if (err) {
//             res.send(err);
//           } else {
//             const cart = new Cart({
//               user: session.id,
//               order: order._id
//             });

//             cart.save((err, cart) => {
//               if (err) {
//                 res.send(err);
//               } else {
//                 session.cart = cart;
//                 res.send(cart);
//               }
//             });
//           }
//         });
//       });
//     } else {
//       // Cart.findById(session.cart, (err, cart) => {
//       //   if (err) {
//       //     res.send(err);
//       //   } else {
//       //     Order.findById("5e19bc626a578715b85e90ad", (err, order) => {
//       //       // const productId = order.product;
//       //       if (err) {
//       //         res.send(err);
//       //       } else {
//       //         res.send(cart);
//       //       }
//       //     });
//       //   }
//       // });
//     }
//   } else {
//     res.send("Login first");
//   }
// };

// exports.cart = (req, res, next) => {
//   Cart.find({}, (err, docs) => {
//     if (err) {
//       res.send(err);
//     } else {
//       res.send(docs);
//     }
//   });
// };

// exports.addToCart = (req, res, next) => {
//   if (session.login && session.id) {
//     if (session.cart == undefined) {
//       const productId = req.body.productId;
//       Product.findOne({ _id: productId }, (req, product) => {
//         const cart = new Cart({
//           buyer: session.id,
//           product: [
//             {
//               _id: productId,
//               name: product.name,
//               seller: product.seller,
//               price: product.price
//             }
//           ]
//         });
//         cart.save((err, docs) => {
//           if (err) {
//             console.log(err);
//           } else {
//             session.cart = docs;
//             res.send(session.cart._id);
//           }
//         });
//       });
//     } else {
//       const productId = req.body.productId;
//       Product.findOne({ _id: productId }, (req, product) => {
//         Cart.findOneAndUpdate(
//           { _id: session.cart },
//           {
//             $push: {
//               product: {
//                 _id: productId,
//                 name: product.name,
//                 seller: product.seller,
//                 price: product.price
//               }
//             }
//           },
//           (err, docs) => {
//             if (err) {
//               res.send(err);
//             } else {
//               res.send(docs._id);
//             }
//           }
//         );
//       });
//     }
//   } else {
//     res.redirect("/signin");
//   }
// };

// exports.checkout = (req, res, next) => {
//   Cart.findOne({ _id: session.cart._id }, (err, cart) => {
//     if (err) {
//       res.send(err);
//     } else {
//       const totalProduct = cart.product.length;
//       var totalPrice = 0;
//       for (var i = 0; i < totalProduct; i++) {
//         totalPrice += cart.product[i].price;
//       }
//       res.send(cart + "\n" + "Total Price : " + JSON.stringify(totalPrice));
//     }
//   });
// };
