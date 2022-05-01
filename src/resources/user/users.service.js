const {UserModel} = require("./users.model");
const {NotFound} = require('http-errors')


class UsersService {
    async findUser(email){
        return UserModel.findOne({email})
    };

    async getCurrentUser(email){
        const user = await this.findUser(email);
        if(!user) throw new NotFound(`User not found`);

        return user
    };
}
exports.usersService = new UsersService()