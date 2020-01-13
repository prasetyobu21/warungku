const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  product: { type: Schema.ObjectId, ref: "Product" },
  qty: {
    type: Number,
    default: 1
  },
  _cart: {
    type: Schema.ObjectId,
    ref: "Cart"
  }
});

const OrderModel = mongoose.model("Order", OrderSchema);

module.exports = OrderModel;
