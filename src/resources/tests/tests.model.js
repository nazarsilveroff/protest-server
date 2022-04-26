const mongoose = require("mongoose");
const { Schema } = mongoose;

const testsSchema = new Schema({
  id: String,
  question: String,
  answers: Array,
  rightAnswer: String,
  questionType: String,
});

const testsModel = mongoose.model("Test", testsSchema);
exports.testsModel = testsModel;
