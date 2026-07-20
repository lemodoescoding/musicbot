const buildNowPlayingEmbed = require("../../utils/music/buildNowPlayingEmbed");
const { Queue, Song } = require("distube");
const { Message } = require("discord.js");


/**
 * @param {Queue & {
 *  _npMessage: import("discord.js").Message | undefined
 * }} queue
 * @param {Song} song
 * */
module.exports = async (queue, song) => {
	const embed = buildNowPlayingEmbed(song, queue);

	console.log("[playSong] queue.id:", queue.id);
	console.log(
		"[playSong] existing _npMessage:",
		queue._npMessage?.id ?? "none",
	);

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
        console.error(
			`[playSong] Failed to send now-playing message in guild ${queue.id}, channel ${queue.textChannel?.id}:`,
			error.message,
		);
    }

	/**
	 * @type {Queue & {
	 *  _npMessage: import("discord.js").Message
	 * }}
	 * */
	queue._npMessage = sent;
	console.log("[playSong] sent new message, id:", sent?.id);

    const nextSong = queue.songs[1];
    if(nextSong?.url) {
        const { preFetchSong } = require("@distube/yt-dlp");
        preFetchSong(nextSong.url).catch((e) => {
            console.error(
				`[playSong] Prefetch failed for next song "${nextSong.name}":`,
				error.message,
			);

        });
    }
};
