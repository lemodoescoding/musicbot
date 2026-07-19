const { Queue, Song } = require("distube");
const { cleanupDownload } = require("@distube/yt-dlp");

/**
 * @param {Queue} queue
 * @param {Song} song
 * */
module.exports = (queue, song) => {
    if(queue?.repeatMode !== 0) {
        return;
    }

    if(song?.url) {
        cleanupDownload(song.url);
    }

	if (song?.stream) {
		song.stream.url = null;
	}
};
