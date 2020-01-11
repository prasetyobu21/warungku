const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const Cart = require("../models/cart");
const session = require("express-session");

exports.order = (req, res, next) => {
  Order.find({}, (err, docs) => {
    res.send(docs);
  });
};

exports.addToCart = (req, res, next) => {
  if (session.login) {
    if (session.cart == undefined) {
      Product.findById("5e076dc334df8134189c0332", (err, docs) => {
        const order = new Order({
          product: docs,
          _creator: session.id
        });
        order.save((err, order) => {
          if (err) {
            res.send(err);
          } else {
            const cart = new Cart({
              user: session.id,
              order: order._id
            });

            cart.save((err, cart) => {
              if (err) {
                res.send(err);
              } else {
                session.cart = cart;
                res.send(cart);
              }
            });
          }
        });
      });
    } else {
      res.send("Not Empty");
    }
  } else {
    res.send("Login first");
  }
};

exports.cart = (req, res, next) => {
  Cart.find({}, (err, docs) => {
    if (err) {
      res.send(err);
    } else {
      res.send(docs);
    }
  });
};

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
