import mongoose, { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;
import SubSubject from "./subSubject.js";

const subjectSchema = new Schema({
  id_subject: { type: Number, unique: true },
  name: { type: String, required: true },
});

subjectSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const subject = this;
    try {
      await SubSubject.deleteMany({ id_subject: subject.id_subject }); // Fixed method name and added await
      next();
    } catch (error) {
      next(error);
    }
  }
);

const Subject = model("Subject", subjectSchema);

export default Subject;
