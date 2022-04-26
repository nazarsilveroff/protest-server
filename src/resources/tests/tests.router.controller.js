const { Router } = require("express");
const { catchErrors } = require("../../middlewares/catchErrors");
const { getTests } = require("./tests.service");

// const

const testsRouter = Router();

testsRouter.get(
  "/",
  catchErrors(async (req, res, next) => {
    const tests = await getTests(req.body.type);
    res.status(200).send(tests);
  })
);

exports.testsRouter = testsRouter;
