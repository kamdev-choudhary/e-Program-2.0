import mongoose, { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const topicSchema = new Schema({
  id_subject: { type: Number, required: true, unique: false },
  id_sub_subject: { type: Number, required: true, unique: false },
  id_topic: { type: Number, unique: true }, // Corrected typo here
  name: { type: String, required: true },
});

const Topic = model("Topic", topicSchema);

export default Topic;
