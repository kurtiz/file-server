import {PORT} from "./config.js";
import {server} from "./app.js";

/**
 * Starts the server
 */
server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});