const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema({
  user: {
    type: Object
  },
  order: [
    {
      product: {
        type: Object
      },
      qty: {
        type: Number,
        default: 1
      },
      totalPrice: {
        type: Number
      }
    }
  ],
  totalPrice: {
    type: Number
  },
  qty: {
    type: Number,
    default: 1
  },
  payment: {
    status: {
      type: String,
      default: "Belum Bayar"
    },
    paymentType: {
      partner: {
        type: String
      },
      paymentId: {
        type: String
      },
      installment: {
        duration: {
          type: String
        },
        pricePerMonth: {
          type: Number
        },
        currentMonth: {
          type: Number
        }
      }
    }
  },
  shipping: {
    type: {
      type: Object
    },
    status: {
      type: String,
      default: "Sedang Disiapkan"
    }
  },
  status: {
    type: String,
    default: "In Cart"
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
