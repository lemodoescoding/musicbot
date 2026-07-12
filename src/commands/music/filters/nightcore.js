const makeEmbed = require("../../../utils/embeds/makeEmbed");

const NIGHTCORE_FILTER_NAME = "custom_nightcore";

/**
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 * @param {import("distube").Queue} queue
 * */
module.exports = async (interaction, queue) => {
	const existed = queue.filters.values.find(
		(f) => f.name === NIGHTCORE_FILTER_NAME,
	);
	if (existed) {
		queue.filters.remove(existed);

		await interaction.editReply({
			embeds: [
				makeEmbed({ description: `🔈 Nightcore effect disabled.` }),
			],
		});

		return;
	}

	queue.filters.add(
		{
			name: NIGHTCORE_FILTER_NAME,
			value: "asetrate=48000*1.25,aresample=48000,bass=g=5",
		},
		true,
	);

	await interaction.editReply({
		embeds: [makeEmbed({ description: `🔊 Nightcore effect enabled.` })],
	});
};
