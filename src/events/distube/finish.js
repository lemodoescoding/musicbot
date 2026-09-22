const { Queue } = require("distube");
const logger = require("../../utils/logger/pino-logger")

/**
 * @param {Queue & {
 *  _npMessage: import("discord.js").Message | undefined
 * }} queue
 * */
module.exports = async (queue) => {
if (queue._npMessage?.deletable) {
        await queue._npMessage.delete().catch(() => {});
    }

    logger.info({ module: "finish", guildId: queue?.id }, "Queue finished")
    // queue.textChannel?.send("✅ Queue finished.");
}
