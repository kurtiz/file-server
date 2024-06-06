import pino from "pino";
import {BETTERSTACK_TOKEN} from "../config.js";


const transports = pino.transport({
    targets: [
        {
            target: "pino-pretty",
            options: {
                translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
                colorize: false,
                destination: "./logs/error.log",
                mkdir: true
            }
        },
        {
            target: "pino-pretty",
            options: {
                translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
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