const makeEmbed = require("../../../utils/embeds/makeEmbed");

const SPEED_FILTER_NAME = "custom_speed";

/**
 * atempo only accepts 0.5 - 2.0 per instance, so chain multiple
 * instances together to support the full requested range.
 *
 * @param {number} speed
 * @returns {string}
 */
function buildAtempoChain(speed) {
	const parts = [];
	let remaining = speed;

	while (remaining > 2.0) {
		parts.push("atempo=2.0");
		remaining /= 2.0;
	}
	while (remaining < 0.5) {
		parts.push("atempo=0.5");
		remaining /= 0.5;
	}
	parts.push(`atempo=${remaining.toFixed(3)}`);

	return parts.join(",");
}

/**
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 * @param {import("distube").Queue} queue
 * */
module.exports = async (interaction, queue) => {
	const speed = interaction.options.getNumber("playback-speed", true);
	if (speed === 1) {
		const existing = queue.filters.values.find(
			(f) => f.name === SPEED_FILTER_NAME,
		);

		if (existing) {
			queue.filters.remove(existing);
		}

		await interaction.editReply({
			embeds: [
				makeEmbed({
					description: `▶️ Playback speed reset to **1x**.`,
				}),
			],
		});

		return;
	}

	queue.filters.add(
		{
			name: SPEED_FILTER_NAME,
			value: buildAtempoChain(speed),
		},
		true,
	);

	await interaction.editReply({
		embeds: [
			makeEmbed({
				description: `🎚️ Playback speed set to **${speed}x**.`,
			}),
		],
	});
};
