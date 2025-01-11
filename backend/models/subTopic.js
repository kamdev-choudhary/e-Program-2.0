import mongoose, { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const subTopicSchema = new Schema({
  id_subject: { type: Number, required: true },
  id_sub_subject: { type: Number, required: true },
  id_topic: { type: Number, unique: true },
  id_sub_topic: { type: Number, required: true },
  name: { type: String, required: true },
});

const SubTopic = model("SubTopic", subTopicSchema);

export default SubTopic;
