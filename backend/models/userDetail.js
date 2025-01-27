import mongoose from "mongoose";
const Schema = mongoose.Schema;

const scholarSchema = new Schema(
  {
    idUser: { type: Schema.Types.ObjectId, ref: "User" },
    addressLineOne: { type: String },
    addressLineTwo: { type: String },
    city: { type: String },
    district: { type: String },
    state: { type: String },
    pinCode: { type: Number },
    scholarId: { type: String },
    dateOfBirth: { type: Date },
    batches: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Scholar = mongoose.model("Scholar", scholarSchema);

export default Scholar;
