import mongoose from "mongoose";
import {MONGO_URL} from "../config.js";

/**
 * Async function that connects to the database
 *
 * @function
 * @async
 * @returns {Promise<void>} A promise that resolves when the database connection is established.
 * @throws {Error} If there is an error connecting to the database.
 */
const connectToDatabase = async () => await mongoose.connect(MONGO_URL)
    .then(
        () => console.log('Connected to database')
    )
    .catch(
        err => console.error('Error connecting to database:', err)
    );

/**
 * Async function that disconnects from the database
 *
 * @function
 * @async
 * @returns {Promise<void>} A promise that resolves when the database connection is disconnected.
 */
const disconnectFromDatabase = async () => await mongoose.disconnect();

export {connectToDatabase, disconnectFromDatabase};