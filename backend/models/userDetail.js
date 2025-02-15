import mongoose from "mongoose";
const Schema = mongoose.Schema;

const scholarSchema = new Schema(
  {
    idUser: { type: Schema.Types.ObjectId, ref: "User" },

    // Address
    addressLineOne: { type: String },
    addressLineTwo: { type: String },
    city: { type: String },
    district: { type: String },
    state: { type: String },
    pincode: { type: Number },

    // More info
    scholarId: { type: String },
    dateOfBirth: { type: Date },
    category: { type: String },
    pwd: { type: String, default: "No", enum: ["Yes", "No"] },
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
