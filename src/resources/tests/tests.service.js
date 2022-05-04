const {testsModel} = require("./tests.model");
const {NotFound} = require("http-errors");

class TestsService {
    async getTests(type) {
        const tests = await testsModel.find({questionType: type});

        if (tests.length === 0) throw new NotFound(`test not found`);

        const finalTests = tests.sort(() => Math.random() - 0.5).slice(0, 12);
        return finalTests;
    }

    async getResults(type, answers) {
        const tests = await testsModel.find({questionType: type});

        if (tests.length === 0) throw new NotFound(`test not found`);

        const questionIds = answers.map(({questionId}) => questionId)
        const userAnswers = answers.map(({answer}) => answer)

        const filterTests = tests.filter(question => questionIds.find(id => id == question._id))

        const correct = filterTests.filter(question => userAnswers.find(answer => answer === question.rightAnswer)).length

        return {"correct": correct, "incorrect": filterTests.length - correct}
    }
}


exports.testsService = new TestsService()
