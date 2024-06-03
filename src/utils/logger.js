import pino from "pino";
import {BETTERSTACK_TOKEN} from "../config.js";


const transports = pino.transport({
    targets: [
        {
            target: "pino-pretty",
            options: {
                colorize: false,
                destination: "./logs/error.log",
                mkdir: true
            }
        },
        {
            target: "pino-pretty",
            options: {
                ignore: "pid,hostname,req,res",
            }
        },
        {
            level: "warn",
            target: "@logtail/pino",
            options: {
                sourceToken: BETTERSTACK_TOKEN
            }
        },
    ]
})
const logger = pino(transports);

export default logger;