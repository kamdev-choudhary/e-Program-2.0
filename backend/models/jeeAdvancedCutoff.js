import mongoose from "mongoose";

const JeeAdvancedCutoffSchema = new mongoose.Schema({
  year: { type: Number },

  examName: { type: String },

  generalSubject: { type: Number },
  generalPwdSubject: { type: Number },

  obcSubject: { type: Number },
  obcPwdSubject: { type: Number },

  scSubject: { type: Number },
  scPwdSubject: { type: Number },

  stSubject: { type: Number },
  stPwdSubject: { type: Number },

  ewsSubject: { type: Number },
  ewsPwdSubject: { type: Number },

  generalTotal: { type: Number },
  generalPwdTotal: { type: Number },

  obcTotal: { type: Number },
  obcPwdTotal: { type: Number },

  scTotal: { type: Number },
  scPwdTotal: { type: Number },

  stTotal: { type: Number },
  stPwdTotal: { type: Number },

  ewsTotal: { type: Number },
  ewsPwdTotal: { type: Number },
  preparatorySubject: { type: Number },
  preparatoryTotal: { type: Number },
});

const JeeAdvancedCutoff = mongoose.model(
  "JEEAdvancedCutoff",
  JeeAdvancedCutoffSchema
);

export default JeeAdvancedCutoff;
