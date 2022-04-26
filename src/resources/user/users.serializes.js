function serializeUserResponse(user, token) {
    return {
        "user": serializeUser(user),
        "token": token
    };
}


function serializeUser(user) {
    return {
        nickname: user.nickname,
        email: user.email,
    };
}

exports.serializeUserResponse = serializeUserResponse;

exports.serializeUser = serializeUser;