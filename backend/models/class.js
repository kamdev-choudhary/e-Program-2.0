const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const classSchema = new Schema({
  id_class: { type: Number, unique: true },
  name: { type: String, required: true },
  value: { type: String, required: true },
});

classSchema.plugin(AutoIncrement, { inc_field: "id_class" });

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
