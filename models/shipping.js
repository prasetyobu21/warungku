const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const shippingSchema = new Schema({
  admin: {
    type: Object
  },
  name: {
    type: String
  },
  price: {
    type: Number
  }
});

const ShippingModel = mongoose.model("Shipping", shippingSchema);
module.exports = ShippingModel;
