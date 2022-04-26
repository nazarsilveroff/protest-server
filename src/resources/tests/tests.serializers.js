function serializeTest(test) {
  return {
    _id: test._id,
    question: test.question,
    answers: test.answers,
    questionType: test.questionType,
  };
}

exports.serializeContactsListResponse = (tests) => ({
  tests: tests.map(serializeTest),
});
