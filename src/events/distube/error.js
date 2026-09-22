const { Queue } = require("distube")
const { MessageFlags } = require("discord.js");
const logger = require("../../utils/logger/pino-logger")

/**
 * @param {Queue} queue
 * @param {Error} error
 * */
module.exports = (queue, error) => {
    // console.log(`[${new Date().toISOString()}] [ERROR] ${error.message}`);
    // console.log(`[${new Date().toISOString()}] [ERROR STACK] ${error.stack}`);

    logger.error({ err: error, guildId: queue?.id }, "Distube playback error")

    queue?.textChannel?.send({
        content: `There was an error.\n❌ ${error.message}`,
    })
}
