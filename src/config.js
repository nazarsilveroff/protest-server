exports.getConfig = () => {
  return {
    port: process.env.PORT || 8080,
    allowedCorsOrigin: process.env.ALLOWED_CORS_ORIGIN,
    dbUrl: process.env.MONGODB_URI,
    bcryptCostFactor: parseInt(process.env.BCRYPT_COST_FACTOR) || 8,
    SERVER_BASE_URL: process.env.SERVER_BASE_URL,
    dbName: process.env.MONGODB_NAME,
    jwt: {
      secret: process.env.JWT_SECRET || "secret",
    },
  };
};
