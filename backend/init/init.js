const mongoose = require("mongoose");
const initdata = require("./lectureData.js");
const Lecture = require("../models/lectures.js");

// dbUrl = process.env.ATLASDB_URL;
const dbUrl = "mongodb://127.0.0.1:27017/dakshana";

main()
  .then(() => {
    console.log(`conneted to DB Atlas`);
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  // await Lecture.deleteMany({});
  await Lecture.insertMany(initdata.data);
  console.log(`data was initialised`);
};

initDB();
