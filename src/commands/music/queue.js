const { ApplicationCommandOptionType, Client, ChatInputCommandInteraction } = require("discord.js");
const { Queue } = require("distube");

const getQueue = require("../../utils/music/getQueue");
const validateVoice = require("../../utils/music/validateVoice");
const formatQueueEmbed = require("../../utils/embeds/formatQueueEmbed");
const makeEmbed = require("../../utils/embeds/makeEmbed");
const paginateEmbeds = require("../../utils/embeds/paginateEmbeds");

const { release, cleanupDownload } = require("@distube/yt-dlp");

module.exports = {
    name: "queue",
    description: "Manage the song queue.",
    options: [
        {
            name: "list",
            description: "Show the current song queue.",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "clear",
            description: "Clear all songs from the queue (except the current one).",
            type: ApplicationCommandOptionType.Subcommand,
        },
    ],
    /**
     * @param {import("discord.js").Client & {
     *  distube: import("distube").DisTube
     * }} client
     * @param {ChatInputCommandInteraction} interaction
     * */
    callback: async (client, interaction) => {
        const music = await validateVoice(interaction, true);
        if (!music) return;

        /**
         * @type {Queue}
         * */
        const queue = getQueue(client, interaction.guildId);
        const sub = interaction.options.getSubcommand();

        try {
            if (sub === "list") {
                const pages = formatQueueEmbed(queue);
                await paginateEmbeds(interaction, pages, { useEditReply: false });
                return;
            }

            if (sub === "clear") {
                const num_removed = queue.songs.length - 1;
                const removed = queue.songs.slice(1);
                queue.songs.length = 1;

                for(const song of removed) {
                    if(song?.url) { 
                        release(song.url);
                        cleanupDownload(song.url);
                    }
                }

                await interaction.reply({
                    embeds: [makeEmbed({ description: `🗑️ Cleared **${num_removed}** song${num_removed === 1 ? "" : "s"} from the queue.` })]
                });
                return;
            }
        } catch (error) {
            await interaction.reply({
                content: `An Error Occured: ${error.message}`
            });

            console.log(error);
            console.log(error.stack);
        }
    }
}
