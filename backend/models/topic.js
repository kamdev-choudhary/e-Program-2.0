const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const topicSchema = new Schema({
  id_subject: { type: Number, required: true },
  id_sub_subject: { type: Number, required: true },
  id_topic: { type: Number, uniue: true },
  name: { type: String, required: true },
});

topicSchema.plugin(AutoIncrement, { inc_field: "id_topic" });

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
