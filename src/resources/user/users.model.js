const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  nickname: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    default: null,
  },
});

const UserModel = mongoose.model("User", userSchema);
exports.UserModel = UserModel;
