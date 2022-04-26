function serializeUserResponse(user) {
    return {"user": serializeUser(user)};
}


function serializeUser(user) {
    return {
        email: user.email,
    };
}

exports.serializeUserResponse = serializeUserResponse;

exports.serializeUser = serializeUser;