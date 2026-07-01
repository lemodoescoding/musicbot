const buildNowPlayingEmbed = require("../../utils/music/buildNowPlayingEmbed");
const { Queue, Song } = require('distube')

/**
 * @param {Queue} queue
 * @param {Song} song
 * */
module.exports = (queue, song) => {
    queue.textChannel?.send({
        embeds: [buildNowPlayingEmbed(song, queue)]
    });
}
