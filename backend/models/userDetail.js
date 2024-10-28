const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userDetailSchema = new Schema({
  addressLineOne: String,
  addressLineTwo: String,
  city: String,
  district: String,
  state: String,
  pinCode: Number,
});

const UserDetail = mongoose.model("UserDetail", userDetailSchema);

module.exports = UserDetail;
