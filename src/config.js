/**
 * General configurations and common constants for APIs
 * @module Config
 */

import {cosmiconfig, cosmiconfigSync} from "cosmiconfig";

/**
 * Loads the environment file (Looks for it within the project scope)
 * the environment file is not .env but .envrc.json. An example file
 * (".envrc.example.json" which is a copy of it) has been added for reference.
 * Just like the .env file, the .envrc.json file is a JSON file.
 * The .env files are in key-value pair. For every environment variable
 * you want to use, it is recommended you add it to the .envrc.json file
 * and export it as a constant in the config.js (this file)
 * @param {String}
 * @type {PublicExplorerSync}
 */
const explorer = cosmiconfigSync('env', {
    searchStrategy: "project"
});

/**
 * asynchronously search for the configuration file
 */
const env = explorer.search();

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
const LIVE_MONGO_URL = env.config.liveMongoUrl;


/**
 * MongoDB URL for the server. This is extracted from the environment variable
 */
const TEST_MONGO_URL = env.config.testMongoUrl;


/**
 * Session secret for the server. This is extracted from the environment variable
 */
const SESSION_SECRET = env.config.sessionSecret;

/**
 * Mail host for sending emails. This is extracted from the environment variable
 */
const TEST_MAIL_HOST = env.config.testMailHost;

/**
 * Mail port for sending emails. This is extracted from the environment variable
 */
const TEST_MAIL_PORT = env.config.testMailPort;

/**
 * Mail user for sending emails. This is extracted from the environment variable
 */
const TEST_MAIL_USER = env.config.testMailUser;

/**
 * Mail password for sending emails. This is extracted from the environment variable
 */
const TEST_MAIL_PASSWORD = env.config.testMailPassword;

/**
 * Mail host for sending emails. This is extracted from the environment variable
 */
const LIVE_MAIL_HOST = env.config.liveMailHost;

/**
 * Mail port for sending emails. This is extracted from the environment variable
 */
const LIVE_MAIL_PORT = env.config.liveMailPort;

/**
 * Mail user for sending emails. This is extracted from the environment variable
 */
const LIVE_MAIL_USER = env.config.liveMailUser;

/**
 * Mail password for sending emails. This is extracted from the environment variable
 */
const LIVE_MAIL_PASSWORD = env.config.liveMailPassword;

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

/**
 * Token for Betterstack. This is extracted from the environment variable
 */
const BETTERSTACK_TOKEN = env.config.betterstackToken;

export {
    PORT,
    LIVE_MONGO_URL,
    TEST_MONGO_URL,
    SESSION_SECRET,
    TEST_MAIL_HOST,
    TEST_MAIL_PORT,
    TEST_MAIL_USER,
    TEST_MAIL_PASSWORD,
    LIVE_MAIL_HOST,
    LIVE_MAIL_PORT,
    LIVE_MAIL_USER,
    LIVE_MAIL_PASSWORD,
    SPACES_KEY,
    SPACES_SECRET,
    SPACES_BUCKET,
    BETTERSTACK_TOKEN
};
