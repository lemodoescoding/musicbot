const {
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
} = require("discord.js");

const getQueue = require("../../utils/music/getQueue");
const validateVoice = require("../../utils/music/validateVoice");
const makeEmbed = require("../../utils/embeds/makeEmbed");

module.exports = {
	name: "loop",
	description: "Control queue looping.",
	options: [
		{
			name: "all",
			description: "Loop the entire queue.",
			type: ApplicationCommandOptionType.Subcommand,
		},
		{
			name: "current",
			description: "Loop only current song.",
			type: ApplicationCommandOptionType.Subcommand,
		},
		{
			name: "disable",
			description: "Disables the loop.",
			type: ApplicationCommandOptionType.Subcommand,
		},
	],
	/**
	 * @param {import("discord.js").Client & {
	 *  distube: import("distube").DisTube
	 * }} client
	 * @param {ChatInputCommandInteraction} interaction
	 * */
	callback: async (client, interaction) => {
		const music = await validateVoice(interaction, true);
		if (!music) {
			return;
		}

		const queue = getQueue(client, interaction.guildId);
		const sub = interaction.options.getSubcommand();

		const modeMap = { current: 1, all: 2, disable: 0 };
		const labelMap = {
			current: "🔂 Now looping the current song.",
			all: "🔁 Now looping the whole queue.",
			disable: "▶️ Looping disabled.",
		};

		try {
			queue.setRepeatMode(modeMap[sub]);

			await interaction.reply({
				embeds: [makeEmbed({ description: labelMap[sub] })],
			});
		} catch (error) {
			await interaction.reply({
				content: `An Error Occured: ${error.message}`,
			});

			console.log(error);
			console.log(error.stack);
		}
	},
};
