const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String
  },
  image: {
    type: String
  },
  price: {
    type: Number
  },
  seller: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
