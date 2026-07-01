const { EmbedBuilder } = require("discord.js");
const formatDuration = require("./formatDuration");
const progressBar = require("./progressBar");

/**
 * @param {import("distube").Song} song
 * @param {import("distube").Queue} queue
 * */
module.exports = (song, queue) => {
	const total = song.duration;
	const current = queue?.currentTime ?? 0;

	const progressLine = total
		? `${progressBar(current, total)}\n\`${formatDuration(current)} / ${formatDuration(total)}\``
		: "🔴 LIVE";

	return new EmbedBuilder()
		.setColor("Blurple")
		.setTitle("🎵 Now Playing")
		.setURL(song.url)
		.setDescription(`**${song.name}**\n${progressLine}`)
		.setThumbnail(song.thumbnail)
		.addFields(
			{
				name: "Duration",
				value: total ? formatDuration(total) : "LIVE",
				inline: true,
			},
			{
				name: "Requested by",
				value: `${song.user}`,
				inline: true,
			},
		);
};
