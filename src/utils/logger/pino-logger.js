const fs = require("fs")
const path = require("path")
const pino = require("pino")

const LOG_DIR = process.evn.LOG_DIR || path.join(process.cwd(), "logs")
const LOG_LEVEL = process.env.LOG_LEVEL || "info"
const LOG_TO_FILE = (process.env.LOG_TO_FILE ?? "true") === "true"

if (LOG_TO_FILE && !fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true }) // will resolved to /home/app/logs, if run with docker compose
}

/**
 * @returns {string}
 * */
function dateStamp() {
    return new Date().toISOString().slice(0, 10);
}

/**
 * @returns {string}
 * */
function currentLogFile() {
    return path.join(LOG_DIR, `${dateStamp()}.log`)
}

const PINO_TARGETS = [
    {
        target: "pino-pretty",
        level: LOG_LEVEL,
        options: {
            colorize: true,
            translateTime: "yyyy-mm-dd HH:MM:ss.l",
            ignore: 'pid,hostname'
        }
    }
]

if (LOG_TO_FILE) {
    PINO_TARGETS.push({
        target: 'pino/file',
        level: LOG_LEVEL,
        options: { destination: currentLogFile(), mkdir: true }
    })
}

const transport = pino.transport({ PINO_TARGETS })

const logger = pino(
    {
        level: LOG_LEVEL,
        base: undefined,
        timestamp: pino.stdTimeFunctions.isoTime
    },
    transport
)

/**
 * @returns {pino.Logger}
 * */
function withContext(context) {
    return logger.child(context)
}

module.exports = logger
module.exports.withContext = withContext
