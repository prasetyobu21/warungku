const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OrderSchema = new Schema({
  product: [{ type: Schema.ObjectId, ref: "Product" }],
  qty: {
    type: Number,
    default: 1
  },
  _creator: {
    type: Schema.ObjectId,
    ref: "User"
  }
});

const OrderModel = mongoose.model("Order", OrderSchema);

module.exports = OrderModel;
