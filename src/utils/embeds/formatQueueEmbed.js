const { EmbedBuilder } = require("discord.js");
const formatDuration = require("../music/formatDuration");

/**
 * Formats a DisTube queue into an array of paginated embeds.
 *
 * @param {import("distube").Queue} queue
 * @param {Object} [options]
 * @param {number} [options.songsPerPage=10] - Songs listed per page.
 * @param {import("discord.js").ColorResolvable} [options.color="Purple"]
 * @returns {EmbedBuilder[]}
 */
function formatQueueEmbed(queue, { songsPerPage = 10, color = "Purple" } = {}) {
	if (!queue || queue.songs.length === 0) {
		return [
			new EmbedBuilder()
				.setColor(color)
				.setTitle("🎶 Current Queue")
				.setDescription("The queue is empty.")
		];
	}

	const [current, ...rest] = queue.songs;
	const nowPlayingLine =
		`**Now Playing:**\n▶️ [${current.name}](${current.url}) \`[${current.duration ? formatDuration(current.duration) : "LIVE"}]\`\n` +
		(current.uploader?.name ? `by ${current.uploader.name}` : "");

	if (rest.length === 0) {
		return [
			new EmbedBuilder()
				.setColor(color)
				.setTitle("🎶 Current Queue")
				.setDescription(nowPlayingLine)
		];
	}

	const pageCount = Math.ceil(rest.length / songsPerPage);
	const pages = [];

	for (let p = 0; p < pageCount; p++) {
		const slice = rest.slice(p * songsPerPage, (p + 1) * songsPerPage);
		const lines = slice.map((song, i) => {
			const dur = song.duration ? formatDuration(song.duration) : "LIVE";
			const index = p * songsPerPage + i + 1;
			return `**${index}.** [${song.name}](${song.url}) \`[${dur}]\``;
		});

		const embed = new EmbedBuilder()
			.setColor(color)
			.setTitle("🎶 Current Queue")
			.setDescription(nowPlayingLine)
			.addFields({
				name: `Up Next (${rest.length} song${rest.length === 1 ? "" : "s"})`,
				value: lines.join("\n"),
			})
			.setFooter({ text: `Page ${p + 1} of ${pageCount}` });

		pages.push(embed);
	}

	return pages;
}

module.exports = formatQueueEmbed;
