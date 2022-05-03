const {Router} = require("express");
const {catchErrors} = require("../../middlewares/catchErrors");
const {testsService} = require("./tests.service");
const {serializeQuestionsListResponse} = require("./tests.serializers");

const testsRouter = Router();

testsRouter.get(
    "/:questionType",
    catchErrors(async (req, res, next) => {
        const questionType = req.params.questionType
        const questions = await testsService.getTests(questionType)
        res.status(200).send(serializeQuestionsListResponse(questions));
    })
)
testsRouter.post(
    "/:questionType",
    catchErrors(async (req, res, next) => {
        const questionType = req.params.questionType
        const answers = req.body
        const results = await testsService.getResults(questionType,answers)
        res.status(200).send(results);
    })
)

exports.testsRouter = testsRouter;
