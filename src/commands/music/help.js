const {
	ChatInputCommandInteraction,
	ApplicationCommandOptionType,
	MessageFlags,
} = require("discord.js");

const validateVoice = require("../../utils/music/validateVoice");
const makeEmbed = require("../../utils/embeds/makeEmbed");
const getAllFiles = require("../../utils/getAllFiles");
const getLocalCommands = require("../../utils/getLocalCommands");

const path = require("path");

const CATEGORY_LABELS = {
	music: "🎵 Music",
	misc: "🔧 Misc",
};

module.exports = {
	name: "help",
	description: "Shows the available commands.",
	options: [
		{
			name: "command",
			description: "Get details on a specific command",
			type: ApplicationCommandOptionType.String,
			required: false,
		},
	],
	/**
	 * @param {import("discord.js").Client & {
	 *  distube: import("distube").DisTube
	 * }} client
	 * @param {ChatInputCommandInteraction} interaction
	 * */
	callback: async (client, interaction) => {
		const target = interaction.options.getString("command");

		try {
			if (target) {
				const localCommands = getLocalCommands();
				const commandObject = localCommands.find(
					(cmd) => cmd.name.toLowerCase() === target.toLowerCase(),
				);

				if (!commandObject) {
					await interaction.reply({
						content: `No command found matching \`${target}\`.`,
						flags: [MessageFlags.Ephemeral],
					});
					return;
				}

				const optionsList = commandObject.options?.length
					? commandObject.options
							.map(
								(opt) =>
									`\`${opt.name}\`${opt.required ? " (required)" : " (optional)"} — ${opt.description}`,
							)
							.join("\n")
					: "None";

				await interaction.reply({
					embeds: [
						makeEmbed({
                            color: "Yellow",
							title: `/${commandObject.name}`,
							description: `${commandObject.description}\n\n**Options:**\n${optionsList}`,
						}),
					],
				});
				return;
			}

			// no specific command requested -> list everything, grouped by folder/category
			const commandCategories = getAllFiles(
				path.join(__dirname, "..", "..", "commands"),
				true,
			);

			const groupedText = commandCategories.map((categoryPath) => {
				const categoryName = path.basename(categoryPath);
				const label = CATEGORY_LABELS[categoryName] ?? categoryName;

				const commandList = getAllFiles(categoryPath)
					.map((file) => require(file))
					.filter((cmd) => !cmd.devOnly)
					.map((cmd) => `\`/${cmd.name}\` — ${cmd.description}`)
					.join("\n");

				return `**${label}**\n${commandList}`;
			});

			await interaction.reply({
				embeds: [
					makeEmbed({
                        color: "Yellow",
						title: "📖 Command List",
						description: groupedText.join("\n\n"),
						footer: "Use /help command:<name> for details on a specific command.",
					}),
				],
			});
		} catch (error) {
			await interaction.reply({
				content: `There was an error when running /help\n\`${error.message}\``,
				flags: [MessageFlags.Ephemeral],
			});
			console.log(error);
			console.log(error.stack);
		}
	},
};
