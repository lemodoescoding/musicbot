const { EmbedBuilder } = require("discord.js");

/**
 * formats a DisTube queue into a paginated-safe embed.
 *
 * @param {import("distube").Queue} queue
 * @param {Object} [options]
 * @param {number} [options.maxSongs=10] - Max songs listed before truncating.
 * @param {import("discord.js").ColorResolvable} [options.color="Purple"]
 * @returns {EmbedBuilder}
 */
function formatQueueEmbed(queue, { maxSongs = 10, color = "Purple" } = {}) {
	const embed = new EmbedBuilder().setColor(color).setTitle("🎶 Current Queue");

	if (!queue || queue.songs.length === 0) {
		embed.setDescription("The queue is empty.");
		return embed;
	}

	const [current, ...rest] = queue.songs;

	embed.setDescription(
		`**Now Playing:**\n▶️ [${current.name}](${current.url}) \`[${current.duration ? formatDuration(current.duration) : "LIVE"}]\`\n` +
			(current.uploader?.name ? `by ${current.uploader.name}` : "")
	);

	if (rest.length > 0) {
		const shown = rest.slice(0, maxSongs);
		const lines = shown.map((song, i) => {
			const dur = song.duration ? formatDuration(song.duration) : "LIVE";
			return `**${i + 1}.** [${song.name}](${song.url}) \`[${dur}]\``;
		});

		embed.addFields({
			name: `Up Next (${rest.length} song${rest.length === 1 ? "" : "s"})`,
			value: lines.join("\n"),
		});

		if (rest.length > maxSongs) {
			embed.setFooter({
				text: `+${rest.length - maxSongs} more song${rest.length - maxSongs === 1 ? "" : "s"} in queue`,
			});
		}
	}

	return embed;
}

/**
 * converts seconds into H:MM:SS or M:SS format.
 * @param {number} seconds
 * @returns {string}
 */
function formatDuration(seconds) {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = Math.floor(seconds % 60).toString().padStart(2, "0");
	return h > 0 ? `${h}:${m.toString().padStart(2, "0")}:${s}` : `${m}:${s}`;
}

module.exports = formatQueueEmbed;
