const { testsModel } = require("./tests.model");

const getTests = async (type) => {
  const tests = await testsModel.find({ questionType: type });
  const finalTests = tests.sort(() => Math.random() - 0.5).slice(0, 12);
  return finalTests;
};

module.exports = { getTests };
