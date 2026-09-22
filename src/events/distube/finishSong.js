const { Queue, Song, RepeatMode } = require("distube");
const { release, cleanupDownload } = require("@distube/yt-dlp");
const logger = require("../../utils/logger/pino-logger")

/**
 * @param {Queue} queue
 * @param {Song} song
 * */
module.exports = (queue, song) => {
    const log = logger.withContext({ module: "finishSong", guildId: queue?.id })
    if(song?.url) {
        release(song.url);
        log.debug({ url: song.url }, "Released song")
    }

    if(queue?.repeatMode === RepeatMode.DISABLED) {
        if(song?.url) {
            cleanupDownload(song.url);
            log.debug({ url: song.url }, "Cleanup procedure done for the song")
        }
    }


	if (song?.stream) {
		song.stream.url = null;
	}
};
