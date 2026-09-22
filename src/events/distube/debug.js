const logger = require("../../utils/logger/pino-logger")
/**
 * @param {String} debug
 * */
module.exports = (debug) => {
    // if(process.env.DISTUBE_DEBUG === "true") {
    //     console.log(`[${new Date().toISOString()}] [DEBUG] ${debug}`);
    // }
    logger.debug(debug)
}
