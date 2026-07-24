const { Queue } = require("distube")
const { MessageFlags } = require("discord.js");

/**
 * @param {Queue} queue
 * @param {Error} error
 * */
module.exports = (queue, error) => {
    console.log(`[${new Date().toISOString()}] [ERROR] ${error.message}`);
    console.log(`[${new Date().toISOString()}] [ERROR STACK] ${error.stack}`);

    queue?.textChannel?.send({
        content: `There was an error, report this to admin.\n❌ ${error.message}`,
        flags: [MessageFlags.Ephemeral]
    })
}
