const Product = require("../models/product");
const User = require("../models/user");
const session = require("express-session");

exports.showProducts = (req, res, next) => {
  Product.find({}, (err, products) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { title: "home", products: products });
      // res.send(products);
    }
  });
};

exports.showProduct = async (req, res, next) => {
  const productId = req.params.id;
  await Product.findById(productId, (err, product) => {
    if (err) {
      res.send(err);
    } else {
      res.render("client/product", { product: product });
    }
  });
};

exports.addProduct = async (req, res, next) => {
  if (session.login && session.id) {
    const { name, image, price, qty, category } = req.body;
    await User.findById(session.id, async (err, user) => {
      if (err) console.log(err);
      const product = new Product({
        name: name,
        image: image,
        price: price,
        qty: qty,
        category: category,
        seller: user
      });
      await product.save((err, docs) => {
        if (err) {
          console.log(err);
        } else {
          console.log(docs);
        }
      });
      res.redirect("/agen");
    });
  } else {
    res.redirect("/signin");
  }
};

exports.deleteProduct = async (req, res, next) => {
  const productId = "";
  const oldUrl = req.url;
  await Product.deleteOne({ _id: productId }, err => {
    if (err) {
      res.render(oldUrl, { message: "Error Found" });
    } else {
      res.render(oldUrl, { message: "Deleted" });
    }
  });
};

exports.updateProduct = async (req, res, next) => {
  const productId = "";
  const oldUrl = req.url;
  await Product.findById(productId, async (err, product) => {
    if (err) {
      res.send(err);
    } else {
      const { name, image, price, qty, sold, category } = req.body;
      const product = new Product({
        name: name,
        image: image,
        price: price,
        qty: qty,
        sold: sold,
        category: category,
        seller: session.userID
      });
      await product.save((err, docs) => {
        if (err) {
          res.render(oldUrl, { message: "Error Found" });
        } else {
          res.render(oldUrl, { message: "Product Updated" });
        }
      });
    }
  });
};
