const logger = require("../../utils/logger/pino-logger")

const { ActivityType, Client } = require('discord.js')

/**
 * @param {Client} client
 * */
module.exports = (client) => {
    client.user.setActivity({
        name: "Hi There! This is Echo",
        type: ActivityType.Listening,
        url: 'https://www.youtube.com/watch?v=X4VbdwhkE10'
    })

    logger.info(`${client.user.tag} status is ready.`)
    // console.log(`[DISCORD BOT] ${client.user.tag} status is ready.`);
}
