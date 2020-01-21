const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String
  },
  image: {
    type: Buffer,
    contentType: String
  },
  price: {
    type: Number
  },
  qty: {
    type: Number
  },
  sold: {
    type: Number
  },
  category: {
    type: String
  },
  seller: {
    type: Schema.ObjectId,
    ref: "User"
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
