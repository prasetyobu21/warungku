const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: {
    type: String
  }
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
