/**
 * Imports necessary modules for the Express application.
 *
 * express The Express.js web application framework.
 * http The Node.js built-in HTTP module.
 * body-parser Middleware for parsing incoming request bodies.
 * cookie-parser Middleware for parsing cookies.
 * compression Middleware for compressing response bodies.
 * session Middleware for managing sessions.
 * passport Middleware for authentication.
 * router Routes for the Express application.
 * cors Middleware for enabling Cross-Origin Resource Sharing (CORS).
 * @module App
 */
import express from 'express';
import http, {Server} from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import session from 'express-session';
import {ENVIRONMENT, SESSION_SECRET} from "./config.js";
import router from "./routes/router.js";
import {connectToDatabase, connectToTestDatabase} from "./models/database.js";
import pino from 'pino-http';
import logger from "./utils/logger.js";
import SQLiteStoreFactory from 'connect-sqlite3';


/**
 * Creates an instance of the Express application.
 *
 * @type {Express}
 */
const app = express();

/**
 * Creates SQLiteStore instance.
 * @type {SQLiteStore}
 */
const SQLiteStore = SQLiteStoreFactory(session);

/**
 * Configures middleware for the Express application.
 */
app.use(
    /**
     * Enables CORS with credential support, allowing cross-origin requests
     * to access cookies and other credentials.
     */
    cors({
        credentials: true,
        origin: '*', // Replace '*' with the actual origin of your frontend
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'], // Use allowedHeaders instead of headers
        exposedHeaders: ['Content-Type', 'Authorization'], // Expose headers to the frontend
    })
);

/**
 * Configures session middleware for the api.
 */
app.use(
    session({
        store: new SQLiteStore,
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

/**
 * Compresses response bodies to reduce network traffic and improve performance.
 */
app.use(compression());

/**
 * Parses cookies from incoming requests.
 */
app.use(cookieParser());

/**
 * Parses incoming request bodies as JSON.
 */
app.use(bodyParser.json());


/**
 * Creates an instance of the http server
 * @type {Server}
 */
const server = http.createServer(app);

/**
 * Connects to the database.
 */

if (ENVIRONMENT !== "production") {
    await connectToTestDatabase();
} else {
    await connectToDatabase();
}

/**
 * Uses the registered routes in the router
 */
app.use(router);

export {app, server};
