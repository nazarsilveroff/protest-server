const {serializeUser} = require("../user/users.serializes");


exports.serializeSignInResponse = (userData, token) => {
    const user = serializeUser(userData);
    return { user, token };
};