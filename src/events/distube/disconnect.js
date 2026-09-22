const { Queue } = require("distube");
const logger = require("../../utils/logger/pino-logger")

/**
 * @param {Queue & {
 *  _npMessage: import("discord.js").Message | undefined
 * }} queue
 */
module.exports = async (queue) => {
    const log = logger.withContext({ module: "disconnect", guildId: queue.id })
    if(queue._npMessage?.deletable) {
        await queue._npMessage.delete().catch(() => {})
    }

    log.info("Disconnected from the voice channel")
	queue.textChannel?.send("👋 Disconnected from the voice channel.");
};
