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

	const sent = await queue.textChannel?.send({
		embeds: [embed],
	});

	/**
	 * @type {Queue & {
	 *  _npMessage: import("discord.js").Message
	 * }}
	 * */
	queue._npMessage = sent;
	console.log("[playSong] sent new message, id:", sent?.id);
};
