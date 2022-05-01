const {UserModel} = require("../user/users.model");
const {Conflict, NotFound, Forbidden} = require("http-errors");
const {getConfig} = require("../../config");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const {OAuth2Client} = require('google-auth-library')


class AuthService {
    async hashPassword(password) {
        const {bcryptCostFactor} = getConfig();
        return bcryptjs.hash(password, bcryptCostFactor);
    }

    async findUser(email) {
        return UserModel.findOne({email});
    }

    async createUser(userParams) {
        return UserModel.create(userParams);
    }

    async checkPassword(password, passwordHash) {
        return bcryptjs.compare(password, passwordHash);
    }

    async updateUser(id) {
        return UserModel.updateOne(id);
    }

    createToken() {
        const {jwt: {secret}} = getConfig();
        return jsonwebtoken.sign({uid: secret}, secret);
    }

    async signUp(userParams) {
        const {username, email, password} = userParams;
        const existingUser = await this.findUser(email);
        if (existingUser) throw new Conflict(`User with ${email} already exist`);

        const passwordHash = await this.hashPassword(password);

        const user = await this.createUser({username, email, passwordHash});

        const token = this.createToken();

        return {user, token};
    }

    async signIn(logParams) {
        const {email, password} = logParams;
        const existingUser = await this.findUser(email);
        if (!existingUser) throw new NotFound(`User with ${email} not found`);

        const {passwordHash} = existingUser;
        const isPasswordCorrect = await this.checkPassword(password, passwordHash);
        if (!isPasswordCorrect) throw new Forbidden(`Password is wrong`);

        const token = this.createToken();
        return {existingUser, token};
    }

    async googleOAuth(logParams) {
        const client = new OAuth2Client(getConfig().OAuth.client_ID)

        let {token} = logParams

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: getConfig().OAuth.client_ID
        });
        const {name: username, email} = ticket.getPayload();

        const existingUser = await this.findUser(email);

        if (existingUser) {
            token = this.createToken()
            const {username, email} = existingUser
            return {user: {username, email}, token}
        }

        if (!existingUser) {
            token = this.createToken()
            const user = await this.createUser({username, email, token})
            return {user, token}
        }

    }

}

exports.authService = new AuthService();

exports.logoutUser = async (req, res, next) => {
    try {
        const user = await UserModel.findByIdAndUpdate(req.userId, {
            token: null,
        });
        if (!user) {
            res.status(401).json({message: "Not authorized"});
            return;
        }
        res.status(204).json("logout");
    } catch (error) {
        res.json(error.message);
    }
};
