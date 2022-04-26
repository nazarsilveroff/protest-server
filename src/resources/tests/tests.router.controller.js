const { Router } = require("express");
const { catchErrors } = require("../../middlewares/catchErrors");
const { getTests } = require("./tests.service");
const { serializeContactsListResponse } = require("./tests.serializers");

const testsRouter = Router();

testsRouter.get(
  "/getting-tests",
  catchErrors(async (req, res, next) => {
    const tests = await getTests(req.body.type);
    res.status(200).send(serializeContactsListResponse(tests));
  })
);

exports.testsRouter = testsRouter;
