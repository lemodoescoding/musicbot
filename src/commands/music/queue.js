const getQueue = require("../../utils/music/getQueue");
const validateVoice = require("../../utils/music/validateVoice");
const formatQueueEmbed = require("../../utils/embeds/formatQueueEmbed");

const { Client, ChatInputCommandInteraction, ApplicationCommandOptionType } = require("discord.js");
const { Queue } = require("distube");

module.exports = {
    name: 'queue',
    description: 'Manage the current song queue.',
    options: [
        {
            name: "list",
            description: "Show current song queue.",
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: "clear",
            description: "Clear all songs from the queue (except the current one)",
            type: ApplicationCommandOptionType.Subcommand
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

        if (!music) { return; };

        /**
         * @type {Queue}
         * */
        const queue = getQueue(client, interaction.guildId);

        try {
            await interaction.reply({
                embeds: [formatQueueEmbed(queue)]
            });
        } catch (error) {
            await interaction.reply({
                content: `An Error Occured: ${error.message}`
            });

            console.log(error);
            console.log(error.stack);
        }
    }
}
