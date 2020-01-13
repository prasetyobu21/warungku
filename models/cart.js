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

// module.exports = function Cart(oldCart) {
//   this.items = oldCart.items || {};
//   this.totalQty = oldCart.totalQty || 0;
//   this.totalPrice = oldCart.totalPrice || 0;

//   this.add = (item, id) => {
//     let storedItem = this.items[id];
//     if (!storedItem) {
//       storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
//     }
//     storedItem.qty++;
//     storedItem.price = storedItem.item.price * storedItem.qty;
//     this.totalQty++;
//     this.totalPrice += storedItem.item.price;
//   };

//   this.generateArray = () => {
//     let arr = [];
//     for (let id in this.items) {
//       arr.push(this.items[id]);
//     }
//     return arr;
//   };
// };
