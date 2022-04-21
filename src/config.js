exports.getConfig=()=>{
    return{
        port: process.env.PORT||8080,
        allowedCorsOrigin:process.env.ALLOWED_CORS_ORIGIN,
        dbUrl:process.env.MONGODB_URI,
        bcryptCostFactor: parseInt(process.env.BCRYPT_COST_FACTOR) || 8,
        SERVER_BASE_URL: process.env.SERVER_BASE_URL,
        jwt: {
            secret: process.env.JWT_SECRET || 'secret',
            expiresIn: process.env.JWT_EXPIRES_IN || "1d",
        },
    }
}

