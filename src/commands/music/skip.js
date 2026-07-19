const getQueue = require("../../utils/music/getQueue");

const validateVoice = require("../../utils/music/validateVoice");

const makeEmbed = require("../../utils/embeds/makeEmbed");

const {Client, ChatInputCommandInteraction, EmbedBuilder} = require('discord.js');
const { Queue, RepeatMode } = require("distube");

const { cleanupDownload } = require("@distube/yt-dlp");

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
            const hasNext = queue.songs.length > 1;
            if(!hasNext && queue.repeatMode === RepeatMode.DISABLED) {
                await interaction.reply({
                    embeds: [makeEmbed({ description: "No next track in queue, stopping the playback."})]
                });

                await queue.stop();

                if(skippedSong?.url) {
                    cleanupDownload(skippedSong.url);
                }

                return;
            }

            if(queue.repeatMode == RepeatMode.DISABLED) {
                await queue.skip();

                if(skippedSong?.url) {
                    cleanupDownload(skippedSong.url);
                }
            }

            if(queue.repeatMode === RepeatMode.SONG || queue.repeatMode === RepeatMode.QUEUE) {
                await queue.skip({ requeue: true })
            }

            await interaction.reply({
                embeds: [makeEmbed({ description: `⏭️ Skipped ${skippedSong.name}.`})]
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
