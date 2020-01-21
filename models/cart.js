const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: "User"
  },
  order: [
    {
      product: {
        type: Schema.ObjectId,
        ref: "Product"
      },
      qty: {
        type: Number,
        default: 1
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
    shippingType: {
      type: String
    },
    shippingPartner: {
      name: {
        type: String
      },
      resiNumber: {
        type: String
      },
      weight: {
        type: Number //in KG
      },
      price: {
        type: Number
      },
      destination: {
        type: String
      },
      contact: {
        name: {
          type: String
        },
        phoneNumber: {
          type: String
        }
      },
      estimationTime: {
        type: Number
      }
    },
    shippingStatus: {
      type: String
    }
  },
  status: {
    type: String
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
