const buildNowPlayingEmbed = require("../../utils/music/buildNowPlayingEmbed");

const { ChatInputCommandInteraction, MessageFlags } = require("discord.js");

const { Queue } = require("distube");

const validateVoice = require("../../utils/music/validateVoice");
const getQueue = require("../../utils/music/getQueue");

module.exports = {
    name: "nowplaying",
    description: "Check detail of current playing song.",
    /**
     * @param {import("discord.js").Client & {
     *  distube: import("distube").DisTube
     * }} client
     * @param {ChatInputCommandInteraction} interaction
     * */
    callback: async (client, interaction) => {
        const music = validateVoice(interaction, true);

        if(!music) { return; }

        /**
         * @type {Queue}
         * */
        const currentQueue = getQueue(client, interaction.guildId);

        const currentSong = currentQueue.songs[0]

        await interaction.reply({
            embeds: [buildNowPlayingEmbed(currentSong, currentQueue)]
        })
        try {
            
        } catch (error) {
            await interaction.reply({
                content: `There was error running command /nowplaying\n\`${error.message}\``,
                flags: [MessageFlags.Ephemeral]
            });

            console.log(error);
        }
    }
}
