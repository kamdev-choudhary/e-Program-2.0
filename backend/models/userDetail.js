import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const userDetailSchema = new Schema({
  addressLineOne: String,
  addressLineTwo: String,
  city: String,
  district: String,
  state: String,
  pinCode: Number,
});

const UserDetail = model("UserDetail", userDetailSchema);

export default UserDetail;
