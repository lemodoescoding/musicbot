const { ChatInputCommandInteraction, ApplicationCommandOptionType } = require("discord.js");
const validateVoice = require("../../utils/music/validateVoice");
const getQueue = require("../../utils/music/getQueue");

module.exports = {
    name: 'playnext',
    description: 'Enqueues a track from the query and plays it after the current track ends',
    options: [
        {
            name: 'query',
            description: 'URL or search term for the music.',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    /**
     * @param {import("discord.js").Client & {
     *  distube: import("distube").DisTube
     * }} client
     * @param {ChatInputCommandInteraction} interaction
     * */
    callback: async (client, interaction) => {
        const music = await validateVoice(interaction, true);

        if(!music) { return; }

        const queue = getQueue(client, interaction.guildId); 
    }
}
