const logger = require("../../utils/logger/pino-logger")

/**
 * @param {String} debug
 * */
module.exports = (debug) => {
    logger.debug({ module: "ffmpegDebug" }, debug)
}
