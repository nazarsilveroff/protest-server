function serializeUserResponse(user) {
    return {"user": serializeUser(user)};
}


function serializeUser(user) {
    return {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL
    };
}

exports.serializeUserResponse = serializeUserResponse;

exports.serializeUser = serializeUser;