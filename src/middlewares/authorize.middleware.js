const { Unauthorized } = require("http-errors");
const jsonwebtoken = require("jsonwebtoken");
const { getConfig } = require("../config");

exports.authorize = () => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.replace("Bearer ", "");

    let payload;
    const {jwt: { secret }} = getConfig();
    try {
      payload = jsonwebtoken.verify(token, secret);
    } catch (error) {
      throw new Unauthorized();
    }
    console.log(payload)

    req.email = payload.userEmail;
    next();
  };
};
