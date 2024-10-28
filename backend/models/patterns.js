const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const patternSchema = new Schema({
  id_pattern: { type: Number },
  name: { type: String, required: true },
  description: String,
});

patternSchema.plugin(AutoIncrement, { inc_field: "id_pattern" });

const Pattern = mongoose.model("Pattern", patternSchema);

module.exports = Pattern;
