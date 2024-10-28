const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const subTopicSchema = new Schema({
  id_subject: { type: Number, required: true },
  id_sub_subject: { type: Number, required: true },
  id_topic: { type: Number, unique: true },
  id_sub_topic: { type: Number, required: true },
  name: { type: String, required: true },
});

subTopicSchema.plugin(AutoIncrement, { inc_field: "id_sub_topic" });

const SubTopic = mongoose.model("SubTopic", subTopicSchema);

module.exports = SubTopic;
