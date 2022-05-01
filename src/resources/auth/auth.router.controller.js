const {Router} = require("express");
const {signInSchema, signUpSchema} = require("./auth.schema");
const {catchErrors} = require("../../middlewares/catchErrors");
const {validate} = require("../../middlewares/validate");
const {authService, logoutUser} = require("./auth.service");
const {serializeUserResponse} = require("../user/users.serializes");
const {serializeSignInResponse} = require("./auth.serializers");
const {authorize} = require("../../middlewares/authorize.middleware");

const authRouter = Router();

authRouter.post(
    "/sign-up",
    validate(signUpSchema),
    catchErrors(async (req, res, next) => {
        const {user, token} = await authService.signUp(req.body);
        res.status(201).send(serializeUserResponse(user, token));
    })
);

authRouter.post(
    "/sign-in",
    validate(signInSchema),
    catchErrors(async (req, res, next) => {
        const {existingUser, token} = await authService.signIn(req.body);
        res.status(201).send(serializeSignInResponse(existingUser, token));
    })
);

authRouter.post('/google',
    catchErrors(async (req, res, next) => {
        const {user, token} = await authService.googleOAuth(req.body)
        res.status(201).send(serializeSignInResponse(user, token));
    }))

authRouter.get("/logout", authorize(), logoutUser);

exports.authRouter = authRouter;
