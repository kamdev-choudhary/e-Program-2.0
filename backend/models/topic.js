const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const topicSchema = new Schema({
  id_subject: { type: String, required: true },
  id_sub_subject: { type: String, required: true },
  id_topic: { type: String, required: true },
  name: { type: String, required: true },
});

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
