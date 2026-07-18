const getQueue = require("../../utils/music/getQueue");

const validateVoice = require("../../utils/music/validateVoice");

const makeEmbed = require("../../utils/embeds/makeEmbed");

const {Client, ChatInputCommandInteraction, EmbedBuilder} = require('discord.js');
const { Queue, RepeatMode } = require("distube");
const { killFifoWriter } = require("@distube/yt-dlp");

/**
 * @param {import("distube").Song} song
 * @returns {null | String }
 * */
function extractFifoName(song) {
    const url = String(song?.stream?.url);
    if(!url || !url.startsWith("file:///")) { return null; }

    return url.split("/").pop() || null;
}

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
            const hasNext = queue.songs.length > 1;
            if(!hasNext && queue.repeatMode === RepeatMode.DISABLED) {
                await interaction.reply({
                    embeds: [makeEmbed({ description: "No next track in queue, stopping the playback."})]
                });

                await queue.stop();

                return;
            }

            if(!hasNext && queue.repeatMode === RepeatMode.SONG) {

            }

            const skippedSong = queue.songs[0];

            const fifoName = extractFifoName(skippedSong);

            if(fifoName) {
                const killed = killFifoWriter(fifoName);
                if(killed) {
                    console.log(`[skip] Killed active fifo writer ${fifoName} for skipped song "${skippedSong?.name}".`)
                }
            }

            if(queue.repeatMode === RepeatMode.SONG || queue.repeatMode == RepeatMode.DISABLED) {
                await queue.skip();
            }

            if(queue.repeatMode === RepeatMode.QUEUE) {
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
