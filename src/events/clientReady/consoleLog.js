const { ActivityType, Client } = require('discord.js')

/**
 * @param {Client} client
 * */
module.exports = (client) => {
    client.user.setActivity({
        name: "Under Maintenance",
        type: ActivityType.Streaming,
        url: 'https://www.youtube.com/watch?v=X4VbdwhkE10'
    })

    console.log(`[DISCORD BOT] ${client.user.tag} status is ready.`);
}
