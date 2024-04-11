/**
 * General configurations and common constants for APIs
 * @module Config
 */

import {cosmiconfig} from "cosmiconfig";

/**
 * Loads the environment file (Looks for it within the project scope)
 * the environment file is not .env but .envrc.json. An example file
 * (".envrc.example.json" which is a copy of it) has been added for reference.
 * Just like the .env file, the .envrc.json file is a JSON file.
 * The .env files are in key-value pair. For every environment variable
 * you want to use, it is recommended you add it to the .envrc.json file
 * and export it as a constant in the config.js (this file)
 * @param {String}
 * @type {PublicExplorer}
 */
const explorer = cosmiconfig('env', {
    searchStrategy: "project"
});

/**
 * asynchronously search for the configuration file
 */
const env = await explorer.search();

if (!env) {
    console.error('Configuration file not found.');
}


/**
 * Port number for the server. This is extracted from the environment variable
 */
const PORT = env.config.port;

/**
 * MongoDB URL for the server. This is extracted from the environment variable
 */
const MONGO_URL = env.config.mongoUrl;


/**
 * Session secret for the server. This is extracted from the environment variable
 */
const SESSION_SECRET = env.config.sessionSecret;

/**
 * Mail host for sending emails. This is extracted from the environment variable
 */
const MAIL_HOST = env.config.mailHost;

/**
 * Mail port for sending emails. This is extracted from the environment variable
 */
const MAIL_PORT = env.config.mailPort;

/**
 * Mail user for sending emails. This is extracted from the environment variable
 */
const MAIL_USER = env.config.mailUser;

/**
 * Mail password for sending emails. This is extracted from the environment variable
 */
const MAIL_PASSWORD = env.config.mailPassword;

/**
 * Key for Spaces. This is extracted from the environment variable
 */
const SPACES_KEY = env.config.spacesKey;

/**
 * Secret for Spaces. This is extracted from the environment variable
 */
const SPACES_SECRET = env.config.spacesSecret;

/**
 * Bucket name for Spaces. This is extracted from the environment variable
 */
const SPACES_BUCKET = env.config.spacesBucket;

export {
    MONGO_URL,
    PORT,
    SESSION_SECRET,
    MAIL_HOST,
    MAIL_PORT,
    MAIL_USER,
    MAIL_PASSWORD,
    SPACES_KEY,
    SPACES_SECRET,
    SPACES_BUCKET
};
