function serializeUserResponse(user) {
    return {"user": serializeUser(user)};
}


function serializeUser(user) {
    return {
        username:user.username,
        email: user.email,
    };
}

exports.serializeUserResponse = serializeUserResponse;

exports.serializeUser = serializeUser;