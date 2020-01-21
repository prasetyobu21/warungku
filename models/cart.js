const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema({
  buyer: {
    type: String
  },
  product: [
    {
      name: {
        type: String
      },
      price: {
        type: Number
      },
      seller: {
        type: String
      },
      qty: {
        type: Number,
        default: 1
      }
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
