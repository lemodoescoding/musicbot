const makeEmbed = require("../../../utils/embeds/makeEmbed");

const TREMOLO_FILTER_NAME = "custom_tremolo";

/**
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 * @param {import("distube").Queue} queue
 * */
module.exports = async (interaction, queue) => {
	const existed = queue.filters.values.find(
		(f) => f.name === TREMOLO_FILTER_NAME,
	);

	// already active -> toggle off
	if (existed) {
		queue.filters.remove(existed);
		await interaction.reply({
			embeds: [makeEmbed({ description: `🔈 Tremolo disabled.` })],
		});
		return;
	}

	const freq = 5;
	const depth = 0.5;

	queue.filters.add(
		{
			name: TREMOLO_FILTER_NAME,
			value: `tremolo=f=${freq}:d=${depth}`,
		},
		true,
	);

	await interaction.reply({
		embeds: [
			makeEmbed({
				description: `🔊 Tremolo effect filter active.`,
			}),
		],
	});
};
