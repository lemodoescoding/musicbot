const {
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
	MessageFlags,
} = require("discord.js");

const validateVoice = require("../../utils/music/validateVoice");
const makeEmbed = require("../../utils/embeds/makeEmbed");
const getQueue = require("../../utils/music/getQueue");

module.exports = {
	name: "volume",
	description: "Control the volume output of the playback.",
	options: [
		{
			name: "level",
			description: "The volume level.",
			type: ApplicationCommandOptionType.Number,
			required: true,
			min_value: 0,
			max_value: 150,
		},
	],
	/**
	 * @param {import("discord.js").Client & {
	 *  distube: import("distube").DisTube
	 * }} client
	 * @param { ChatInputCommandInteraction } interaction
	 * */
	callback: async (client, interaction) => {
		const music = await validateVoice(interaction, true);

		if (!music) {
			return;
		}

		const queue = getQueue(client, interaction.guildId);
		const volume = parseInt(
			interaction.options.getNumber("level", true),
			10,
		);

		try {
			queue.setVolume(volume);

			if (volume !== 0) {
				await interaction.reply({
					embeds: [
						makeEmbed({
							description: `🔊 Volume of the playback set to ${volume}%.`,
						}),
					],
				});
			}

			await interaction.reply({
				embeds: [
					makeEmbed({ description: `🔊 Playback has been muted.` }),
				],
			});
		} catch (error) {
			await interaction.reply({
				content: `There was an error when running /volume command.\n\`${error.message}\``,
				flags: [MessageFlags.Ephemeral],
			});

			console.log(error);
			console.log(error.stack);
		}
	},
};
