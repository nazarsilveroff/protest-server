const { Schema, model } = require("mongoose");

const testsSchema = new Schema({
  question: String,
  answers: Array,
  rightAnswer: String,
  questionType: String,
});

const testsModel = model("Test", testsSchema);
exports.testsModel = testsModel;
