const {
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
	MessageFlags,
} = require("discord.js");

const validateVoice = require("../../utils/music/validateVoice");
const getQueue = require("../../utils/music/getQueue");
const makeEmbed = require("../../utils/embeds/makeEmbed");

/**
 * @type {Record<string, (interaction: ChatInputCommandInteraction, queue: import("distube").Queue) => Promise<void>>}
 * */
const subcommands = {
    "tremolo": require("./filters/tremolo"),
    "8d": require("./filters/8d"),
    "bassboost": require("./filters/bassboost"),
    "speed": require("./filters/speed"),
    "nightcore": require("./filters/nightcore")
};

module.exports = {
	name: "filter",
	description: "Apply or adjust an audio filter on the current playback.",
	options: [
		{
			name: "tremolo",
			description:
				"Enable/disables tremolo effect filter on the playback.",
			type: ApplicationCommandOptionType.Subcommand,
		},
		{
			name: "8d",
			description: "Toggles the 8D audio effect thanks to FFMPEG.",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "rotation-speed",
					description:
						"Rotation speed for 8D effect. (0.05 - 0.3, defaults 0.125)",
					type: ApplicationCommandOptionType.Number,
					required: false,
					min_value: 0.05,
					max_value: 0.3,
				},
			],
		},
		{
			name: "bassboost",
			description: "Controls the bass boost effect for the playback.",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "gain",
					description: "Bass gain in dB (0 disables the effect)",
					type: ApplicationCommandOptionType.Number,
					required: true,
					min_value: 0,
					max_value: 20,
				},
			],
		},
		{
			name: "speed",
			description: "Controls the playback speed.",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "playback-speed",
					description:
						"Input the playback speed you desire. Range from 0.25 - 4.0",
					type: ApplicationCommandOptionType.Number,
					required: true,
					min_value: 0.25,
					max_value: 4.0,
				},
			],
		},
		{
			name: "nightcore",
			description:
				"Enables/disables the nightcore effect on the playback.",
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
		const subCommandName = interaction.options.getSubcommand();
		const handler = subcommands[subCommandName];

        await interaction.deferReply();

		if (!handler) {
			await interaction.reply({
				content: `Unknown filter subcommand: ${subCommandName}`,
				flags: [MessageFlags.Ephemeral],
			});

			return;
		}

		try {
			handler(interaction, queue);
		} catch (error) {
			await interaction.editReply({
				content: `There was an error when running command, contact admin.\n\`${error.message}\``,
				flags: [MessageFlags.Ephemeral],
			});

			console.log(error);
			console.log(error.stack);
		}
	},
};
