const { Queue, Song, RepeatMode } = require("distube");
const { release, cleanupDownload } = require("@distube/yt-dlp");

/**
 * @param {Queue} queue
 * @param {Song} song
 * */
module.exports = (queue, song) => {
    if(queue?.repeatMode !== RepeatMode.DISABLED) {
        return;
    }

    if(song?.url) {
        release(song.url);
        cleanupDownload(song.url);
    }

	if (song?.stream) {
		song.stream.url = null;
	}
};
