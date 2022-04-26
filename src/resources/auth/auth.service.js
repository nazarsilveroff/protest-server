const { UserModel } = require("../user/users.model");
const { Conflict, NotFound, Forbidden } = require("http-errors");
const { getConfig } = require("../../config");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

class AuthService {
  async hashPassword(password) {
    const { bcryptCostFactor } = getConfig();
    return bcryptjs.hash(password, bcryptCostFactor);
  }

  async findUser(email) {
    return UserModel.findOne({ email });
  }

  async createUser(email, passwordHash) {
    return UserModel.create({ email, passwordHash });
  }

  async checkPassword(password, passwordHash) {
    return bcryptjs.compare(password, passwordHash);
  }

  async updateUser(id) {
    return UserModel.updateOne(id);
  }

  createToken(user) {
    const {
      jwt: { secret },
    } = getConfig();
    const { id } = user;
    return jsonwebtoken.sign(
      {
        uid: id,
      },
      secret
    );
  }

  async signUp(userParams) {
    const { email, password } = userParams;
    const existingUser = await this.findUser(email);
    if (existingUser) throw new Conflict(`User with ${email} already exist`);

    const passwordHash = await this.hashPassword(password);

    const user = await this.createUser(email, passwordHash);

    return user;
  }

  async signIn(logParams) {
    const { email, password } = logParams;
    const existingUser = await this.findUser(email);
    if (!existingUser) throw new NotFound(`User with ${email} not found`);

    const { passwordHash } = existingUser;
    const isPasswordCorrect = await this.checkPassword(password, passwordHash);
    if (!isPasswordCorrect) throw new Forbidden(`Password is wrong`);

    const token = this.createToken(existingUser);
    return { existingUser, token };
  }
  async logout(id) {
    try {
      return await this.updateUser({ _id: id }, { token: null });
    } catch (error) {
      console.log("error", error.message);
    }
  }
}

exports.authService = new AuthService();

exports.logoutUser = async (req, res, next) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      req.userId,
      {
        token: null,
      },
      { new: true }
    );
    if (!user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    res.status(204).json("logout");
  } catch (error) {
    res.json(error.message);
  }
};
