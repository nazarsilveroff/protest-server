const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const morgan = require('morgan')
const cors = require("cors");
const mongoose = require('mongoose')
const {getConfig} = require("./config");
const {authRouter} = require("./resources/auth/auth.router.controller");
const {usersRouter} = require("./resources/users/users.router.controller");
const {resultsRouter} = require("./resources/results/results.router.controller");
const {testsRouter} = require("./resources/tests/tests.router.controller");


class ContactsServer {
    constructor() {
        this.app = null
    }

    async start() {
        this.initServer()
        this.initConfig()
        await this.initDatabase();
        this.initMiddlewares()
        this.initRoutes()
        this.initErrorHandling()
        this.startListening()
    }

    initServer() {
        this.app = express();
    };

    initConfig() {
        dotenv.config({path: path.resolve(__dirname, '../.env')})
    };

    async initDatabase() {
        await mongoose.connect(getConfig().dbUrl)
    };

    initMiddlewares() {
        this.app.use(express.json({limit: "500kb"}));
        this.app.use(morgan("short"))
        this.configureCors();
    };

    initRoutes() {
        this.app.use("/auth", authRouter);
        this.app.use("/users", usersRouter);
        this.app.use("/test", testsRouter)
        this.app.use("/results", resultsRouter)
    };

    initErrorHandling() {
        this.app.use((err, req, res, next) => {
            const statusCode = err.status || 500;
            res.status(statusCode).send(err.message);
        });
    };

    startListening() {
        const {port} = getConfig()
        this.app.listen(port)
    };


    configureCors() {
        const {allowedCorsOrigin} = getConfig();
        this.app.use(cors({origin: allowedCorsOrigin}));
    }
}

exports.ContactsServer = ContactsServer