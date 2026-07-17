const { Queue } = require("distube")
const { MessageFlags } = require("discord.js");

/**
 * @param {Queue} queue
 * @param {Error} error
 * */
module.exports = (queue, error) => {
    console.error(`[ERROR] ${error}`);
    console.error(`[ERROR STACK] ${error.stack}`);

    queue?.textChannel?.send({
        content: `There was an error, report this to admin.\n❌ ${error.message}`,
        flags: [MessageFlags.Ephemeral]
    })
}
