const Product = require("../models/product");
const User = require("../models/user");
const session = require("express-session");

exports.showProducts = (req, res, next) => {
  Product.find({}, (err, products) => {
    if (err) {
      console.log(err);
    } else {
      res.render("client/home", { products: products });
    }
  });
};

exports.showProduct = async (req, res, next) => {
  const productId = "";
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
    // console.log(req.user);
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
        res.send(err);
      } else {
        res.send(docs);
      }
    });
    res.redirect("/agen");
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
