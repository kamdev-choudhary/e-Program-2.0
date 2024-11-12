const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SubSubject = require("./subSubject");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const subjectSchema = new Schema({
  id_subject: { type: Number, unique: true },
  name: { type: String, required: true },
});

subjectSchema.plugin(AutoIncrement, { inc_field: "id_subject" });

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

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
