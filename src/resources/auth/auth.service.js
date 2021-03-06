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

    createToken(email) {
        const {jwt: {secret}} = getConfig();
        return jsonwebtoken.sign({userEmail: email}, secret);
    }

    async signUp(userParams) {
        const {username, email, password} = userParams;
        const existingUser = await this.findUser(email);
        if (existingUser) throw new Conflict(`User with ${email} already exist`);

        const passwordHash = await this.hashPassword(password);
        const token = this.createToken(email);

        const user = await this.createUser({username, email, passwordHash,token});

        return {user, token};
    }

    async signIn(logParams) {
        const {email, password} = logParams;
        const existingUser = await this.findUser(email);
        if (!existingUser) throw new NotFound(`User with ${email} not found`);

        const {passwordHash} = existingUser;
        if(!passwordHash) throw new Forbidden(`We didn’t find your password you probably logged in through Google authentication`);

        const isPasswordCorrect = await this.checkPassword(password, passwordHash);
        if (!isPasswordCorrect) throw new Forbidden(`Password is wrong`);

        const token = this.createToken(email);
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
            const {username, email} = existingUser
            token = this.createToken(email)
            return {user: {username, email}, token}
        }

        if (!existingUser) {
            token = this.createToken(email)
            const user = await this.createUser({username, email, token})
            return {user, token}
        }
    };

    async logout(email) {
        const user = await this.findUser(email);
        if (!user) throw new NotFound(`User not found`);

        const {id} = user
        await UserModel.findByIdAndUpdate(id, {
            token: null,
        });
        return user
    }
}

exports.authService = new AuthService();
