const {Client, ChatInputCommandInteraction} = require('discord.js')

module.exports = {
    name: 'ping',
    description: 'Pong!',
    // devOnly: Boolean,
    // testOnly: Boolean,
    // options: Object[],
    // deleted: Boolean,
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     * */
    callback: async (client, interaction) => {
        await interaction.deferReply();

        const reply = await interaction.fetchReply();

        const ping = reply.createdTimestamp - interaction.createdTimestamp
        interaction.editReply(`Pong! Client ${client.ws.ping}ms | Websocket: ${client.ws.ping}ms`)
    }
}
