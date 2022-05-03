exports.serializeQuestionsListResponse = (tests) => {
    return {
        "questions": tests.map(serializeTest),
    }
}

function serializeTest(test) {
    return {
        id: test._id,
        question: test.question,
        answers: test.answers,
    };
}


