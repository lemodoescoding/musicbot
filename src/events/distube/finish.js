const { Queue } = require("distube");

/**
 * @param {Queue & {
 *  _npMessage: import("discord.js").Message | undefined
 * }} queue
 * */
module.exports = async (queue) => {
if (queue._npMessage?.deletable) {
        await queue._npMessage.delete().catch(() => {});
    }

    queue.textChannel?.send("✅ Queue finished.");
}
