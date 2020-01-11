const mongoose = require("mongoose");
const User = require("./user");
const Product = require("./product");

const Schema = mongoose.Schema;

const cartSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: "User"
  },
  order: [
    {
      type: Schema.ObjectId,
      ref: "Order"
    }
  ],
  statusPayment: {
    type: String,
    default: "Belum Bayar"
  },
  statusShipping: {
    type: String,
    default: "Order sedang diteruskan ke agen"
  },
  expiredDate: {
    type: Date,
    default: Date.now() + 7 * 24 * 60 * 60 * 1000
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

const CartModel = mongoose.model("Cart", cartSchema);

module.exports = CartModel;
