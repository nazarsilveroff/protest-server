function serializeUserResponse(user, token) {
    return {
        "user": serializeUser(user),
        "token": token
    };
}


function serializeUser(user) {
    return {
        username: user.username,
        email: user.email,
    };
}

exports.serializeUserResponse = serializeUserResponse;

exports.serializeUser = serializeUser;