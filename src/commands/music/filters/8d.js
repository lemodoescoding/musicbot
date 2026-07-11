const makeEmbed = require("../../../utils/embeds/makeEmbed");

const EIGHTD_FILTER_NAME = "custom_8d";

/**
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 * @param {import("distube").Queue} queue
 * */
module.exports = async (interaction, queue) => {
	const requestedHz = interaction.options.getNumber("rotation-speed");

	const existed = queue.filters.values.find(
		(f) => f.name === EIGHTD_FILTER_NAME,
	);
	if (existed && requestedHz === null) {
		queue.filters.remove(existed);

		await interaction.reply({
			embeds: [makeEmbed({ description: `🔈 8D effect disabled.` })],
		});

		return;
	}

	const hz = requestedHz ?? 0.125;
	const filterValue = `apulsator=hz=${hz},aecho=0.8:0.88:60:0.4`;

	queue.filters.add(
		{
			name: EIGHTD_FILTER_NAME,
			value: filterValue,
		},
		true,
	);

	await interaction.reply({
		embeds: [
			makeEmbed({
				description: `🔊 8D effect set to active on **${hz}Hz** rotation speed.`,
			}),
		],
	});
};
