const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
  },
  token: {
    type: String,
    default: null,
  },
});

const UserModel = mongoose.model("User", userSchema);
exports.UserModel = UserModel;
