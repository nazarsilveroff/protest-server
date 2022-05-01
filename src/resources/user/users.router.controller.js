const {Router} = require("express");
const {authorize} = require("../../middlewares/authorize.middleware");
const {catchErrors} = require("../../middlewares/catchErrors");
const {usersService} = require("./users.service");
const {serializeUserResponse} = require("./users.serializes");





const userRouter = Router();

userRouter.get("/current", authorize(), catchErrors(async (req, res) => {
        const user = await usersService.getCurrentUser(req.email);
        res.status(200).send(serializeUserResponse(user));
    })
);

exports.userRouter = userRouter;