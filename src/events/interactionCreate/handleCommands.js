const { Client } = require("discord.js");

const { devs, testServer } = require("../../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");

/**
 * @param {Client} client
 * @param {import("discord.js").Interaction} interaction
 * */
module.exports = async (client, interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const localCommands = getLocalCommands();

	try {
		const commandObject = localCommands.find(
			(cmd) => cmd.name === interaction.commandName,
		);

		if (!commandObject) return;

		if (commandObject.devOnly) {
			if (!devs.includes(interaction.member.user.id)) {
				interaction.reply({
					content: "Only developers can run this command",
					ephemeral: true,
				});

				return;
			}
		}

		if (commandObject.testOnly) {
			if (!(interaction.guild.id === testServer)) {
				interaction.reply({
					content: "This command cannot be ran here.",
					ephemeral: true,
				});

				return;
			}
		}

		if (commandObject.permissionsRequired?.length) {
			for (const permission of commandObject.permissionsRequired) {
				if (!interaction.member.permissions.has(permission)) {
					interaction.reply({
						content: "Not enough permissions.",
						ephemeral: true,
					});

					break;
				}
			}
		}

		if (commandObject.botPermissions?.length) {
			for (const permission of commandObject.botPermissions) {
				const bot = interaction.guild.members.me;

				if (!bot.permissions.has(permission)) {
					interaction.reply({
						content: "I dont have enough permissions.",
						ephemeral: true,
					});

					break;
				}
			}
		}

		await commandObject.callback(client, interaction);
	} catch (error) {
		console.log(`There was an error running this command: ${error}`);
	}
};
