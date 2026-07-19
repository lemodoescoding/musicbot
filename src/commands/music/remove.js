const { ChatInputCommandInteraction, ApplicationCommandOptionType, MessageFlags } = require("discord.js");
const { Queue } = require("distube");
const validateVoice = require("../../utils/music/validateVoice");
const getQueue = require("../../utils/music/getQueue");
const makeEmbed = require("../../utils/embeds/makeEmbed");

const { cleanupDownload } = require("@distube/yt-dlp");

module.exports = {
    name: 'remove',
    description: 'Remove a song from the queue by its position.',
    options: [
        {
            name: "position",
            description: "The song position.",
            type: ApplicationCommandOptionType.Integer,
            required: true,
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

        /**
         * @type {Queue}
         * */
        const queue = getQueue(client, interaction.guildId);
        const position = interaction.options.getInteger("position", true);

        const index = position;
        try {
            if(index < 1 || index >= queue.songs.length) {
                await interaction.reply({
                    embeds: [makeEmbed({
                        description: `❌ Invalid position. There are only **${queue.songs.length - 1}** song(s) in the up-next queue.`
                    })],
                    flags: [MessageFlags.Ephemeral]
                });

                return;
            }

            const [ removed ] = queue.songs.splice(index, 1);

            if(removed?.url) {
                cleanupDownload(removed.url);
            }

            await interaction.reply({
                embeds: [makeEmbed({ description: `🗑️ Removed [**${removed.name}**](${removed.url}) from the queue.` })]
            });
        } catch (error) {
            await interaction.reply({
                content: `There was an error when running command /remove. Contact the admin\n\`${error.message}\``,
                flags: [MessageFlags.Ephemeral]
            });

            console.log(error);
            console.log(error.stack);
        }
    }
}
