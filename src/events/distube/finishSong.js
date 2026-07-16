const { Queue, Song } = require("distube");

/**
 * @param {Queue} queue
 * @param {Song} song
 * */
module.exports = (queue, song) => {
	if (song?.stream) {
		song.stream.url = null;
	}
};
