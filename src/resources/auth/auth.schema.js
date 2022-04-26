const Joi = require("joi");
const nicknameSchema = Joi.string().required();
const emailSchema = Joi.string().email().required();
const passwordSchema = Joi.string().min(8).required();

exports.signUpSchema = Joi.object({
  nickname: nicknameSchema,
  email: emailSchema,
  password: passwordSchema,
});

exports.signInSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
});
