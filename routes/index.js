const express = require("express");
const router = express.Router();
const session = require("express-session");
const userController = require("../controller/user");
const productController = require("../controller/product");
const cartController = require("../controller/cart");
const adminController = require("../controller/admin");
const shippingController = require("../controller/shipping");

/* GET home page. */

//User Routing
router.get("/signin", function(req, res, next) {
  res.render("signin");
});

router.post("/signin", userController.loginUser);

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", userController.signupUser);

router.get("/auth", function(req, res, next) {
  if (session.status == "agen") {
    session.login = true;
    res.redirect("/agen");
  } else if (session.status == "warung") {
    session.login = true;
    res.redirect("/warung");
  } else {
    res.redirect("/", { message: "User not found!" });
  }
});

router.get("/warung", function(req, res, next) {
  if (session.login && session.status == "warung") {
    console.log(session.id);
    res.render("client/warung/dashboard");
  } else {
    res.redirect("/");
  }
});

router.get("/agen", function(req, res, next) {
  if (session.login && session.status == "agen") {
    res.render("client/agen/dashboard");
  } else {
    res.redirect("/");
  }
});

// Admin Routing

router.get("/admin", function(req, res, next) {
  res.render("loginAdmin");
});

router.post("/loginAdmin", userController.loginAdmin);

router.get("/adminPanel", function(req, res, next) {
  if (session.login && session.status == "admin") {
    res.render("admin/dashboard");
  } else {
    res.redirect("/admin");
  }
});

router.get("/adminTransactionList", adminController.transaction);

router.get("/getCart", adminController.cart);
router.get("/admin/userList", adminController.userList);
router.post("/updateCart", adminController.updateCart);
router.get("/transaction", adminController.transaction);
router.get("/adminPanel", adminController.adminDashboard);
router.get("/addShipping", (req, res) => {
  res.render("admin/shipping", { title: "Add Shipping" });
});
router.post("/addShipping", shippingController.add);

// Product Routing
router.get("/", productController.showProducts);
router.get("/product/:id", productController.product);
router.get("/addProduct", (req, res) => {
  res.render("client/agen/addProduct", { title: "Add Product" });
});
router.post("/addProduct", productController.addProduct);
router.post("/deleteProduct", productController.deleteProduct);
router.post("/updateProduct", productController.updateProduct);

// Cart Routing
router.get("/carts", cartController.carts);
router.get("/cart", cartController.cart);
router.get("/addToCart/:id", cartController.addToCart);
router.get("/chooseShipping/:id", shippingController.choose);
router.get("/changeShipping/:id", shippingController.change);
router.get("/decreaseOne/:id", cartController.decreaseOne);
router.get("/removeFromCart/:id", cartController.removeFromCart);
router.get("/removeCart", cartController.removeCart);
router.get("/checkout", cartController.checkPage);
router.post("/checkout", cartController.checkout);
router.post("/installment", cartController.installment);

module.exports = router;
