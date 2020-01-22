const express = require("express");
const router = express.Router();
const session = require("express-session");
const userController = require("../controller/user");
const productController = require("../controller/product");
const cartController = require("../controller/cart");
const adminController = require("../controller/admin");

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

// Product Routing
router.get("/", productController.showProducts);
router.get("/showProduct/:id", productController.showProduct);
router.get("/addProduct", (req, res) => {
  res.render("client/agen/addProduct", { title: "Add Product" });
});
router.post("/addProduct", productController.addProduct);
router.post("/deleteProduct", productController.deleteProduct);
router.post("/updateProduct", productController.updateProduct);

// Cart Routing
router.get("/carts", cartController.carts);
router.get("/cart", cartController.cart);
router.post("/addToCart", cartController.addToCart);
router.post("/decreaseOne", cartController.decreaseOne);
router.get("/removeFromCart", cartController.removeFromCart);
router.get("/removeCart", cartController.removeCart);
router.get("/checkout", cartController.cart);
router.post("/checkout", cartController.checkout);
router.post("/installment", cartController.installment);

module.exports = router;
