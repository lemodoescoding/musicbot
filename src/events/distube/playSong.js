const buildNowPlayingEmbed = require("../../utils/music/buildNowPlayingEmbed");
const { Queue, Song } = require("distube");
const { Message } = require("discord.js");

const { preFetchSong } = require("@distube/yt-dlp");
const logger = require("../../utils/logger/pino-logger")

/**
 * @param {Queue & {
 *  _npMessage: import("discord.js").Message | undefined
 * }} queue
 * @param {Song} song
 * */
module.exports = async (queue, song) => {
	const embed = buildNowPlayingEmbed(song, queue);
    const log = logger.withContext({ module: "playSong", guildId: queue.id })

	// console.log("[playSong] queue.id:", queue.id);
	// console.log(
	// 	"[playSong] existing _npMessage:",
	// 	queue._npMessage?.id ?? "none",
	// );
    log.debug("existing _npMessage: %s", queue._npMessage?.id ?? "none");``

	if (queue._npMessage?.deletable) {
		try {
			await queue._npMessage.delete().catch(() => {});
		} catch (error) {
			// pass
		}
	}

    /**
     * @type {import("discord.js").Message}
     * */
    let sent;

    try {
        sent = await queue.textChannel?.send({
            embeds: [embed],
        });
    } catch (error){
  //       console.error(
		// 	`[playSong] Failed to send now-playing message in guild ${queue.id}, channel ${queue.textChannel?.id}:`,
		// 	error.message,
		// );
        log.error(
			{ err: error, channelId: queue.textChannel?.id },
			"Failed to send now-playing message"
		);
    }

	/**
	 * @type {Queue & {
	 *  _npMessage: import("discord.js").Message
	 * }}
	 * */
	queue._npMessage = sent;
	// console.log("[playSong] sent new message, id:", sent?.id);
    log.debug("sent new now-playing message, id: %s", sent?.id ?? "none");

    const nextSong = queue.songs[1];
    if(nextSong?.url) {
        try {
            preFetchSong(nextSong.url);
        } catch {}
    }
};
