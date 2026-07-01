const getQueue = require("../../utils/music/getQueue");

const validateVoice = require("../../utils/music/validateVoice");

const makeEmbed = require("../../utils/embeds/makeEmbed");

const {Client, ChatInputCommandInteraction, EmbedBuilder} = require('discord.js');
const { Queue } = require("distube");

module.exports = {
    name: 'skip',
    description: 'Skip current playing song.',
    /**
     * @param {import("discord.js").Client & {
     *  distube: import("distube").DisTube
     * }} client
     * @param {ChatInputCommandInteraction} interaction
     * */
    callback: async (client, interaction) => {
        // needs to check if there is already a queue.
        const music = await validateVoice(interaction, true);

        if(!music) { return; };
        
        /**
         * @type {Queue}
         * */
        const queue = getQueue(client, interaction.guildId)

        try {
            const skippedSong = queue.songs[0];
            await queue.skip();

            await interaction.reply({
                embeds: [makeEmbed({description: `⏭️ Skipped ${skippedSong}.`})]
            })
        } catch (error) {
            await interaction.reply({
                content: `An Error Occured: ${error.message}`
            });

            console.log(error);
            console.log(error.stack);
        }
    }
}
