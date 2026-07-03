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

	if (queue._npMessage?.editable) {
		try {
			await queue._npMessage.edit({ embeds: [embed] });
			console.log(
				"[playSong] edited existing message:",
				queue._npMessage.id,
			);
			return;
		} catch (error) {
			console.log("[playSong] edit failed, sending new:", err.message);
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
