const { testsModel } = require("./tests.model");

const getTests = async (type) => {
  console.log(type);
  const tests = await testsModel.find({ questionType: type });
  console.log(tests);
  return tests;
};

module.exports = { getTests };
