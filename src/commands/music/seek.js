const { ChatInputCommandInteraction, ApplicationCommandOptionType, MessageFlags } = require("discord.js");
const { Queue, Song } = require("distube");

const ms = require('ms');

const validateVoice = require("../../utils/music/validateVoice");
const getQueue = require("../../utils/music/getQueue");
const makeEmbed = require("../../utils/embeds/makeEmbed");
const formatDuration = require("../../utils/music/formatDuration");
const parseTimeInput = require("../../utils/music/parseTimeInput");

module.exports = {
    name: "seek",
    description: "Sets the time of the playback.test",
    options: [
        {
            name: "time",
            description: "The time format, e.g. 90 or 1:30 or 1:02:11",
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

        /**
         * @type {String}
         * */
        const rawTime = interaction.options.getString("time", true);
        const time = parseTimeInput(rawTime);

        /**
         * @type {Queue}
         * */
        const queue = getQueue(client, interaction.guildId);

        try {
            if (time === null || time < 0) {
                await interaction.reply({
                    embeds: [makeEmbed({ description: `❌ Invalid time format. Use seconds (\`90\`) or \`mm:ss\` (\`1:30\`).` })],
                    flags: [MessageFlags.Ephemeral],
                });
                return;
            }

            /**
             * @type {Song}
             * */
            const currentSong = queue.songs[0];

            if(currentSong.duration && time > currentSong.duration) {
                await interaction.reply({
                    embeds: [makeEmbed({ description: `❌ That song is only **${formatDuration(song.duration)}** long.` })],
                    flags: [MessageFlags.Ephemeral],
                });
                return;
            }

            queue.seek(time);

            await interaction.reply({
                embeds: [makeEmbed({ description: `⏩ Seeked to \`${formatDuration(time)}\`.` })]
            });
        } catch(error) {
            await interaction.reply({
                content: `There was an error when running command /seek\n\`${error.message}\``,
                flags: [MessageFlags.Ephemeral]
            });

            console.log(error);
            console.log(error.stack);
        }
    }
}
