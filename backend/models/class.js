const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classSchema = new Schema({
  id_class: { type: String, required: true },
  name: { type: String, required: true },
  value: { type: String, required: true },
});

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
