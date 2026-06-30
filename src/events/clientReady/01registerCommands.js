require("dotenv").config();

const { testServer } = require("../../../config.json");

const {
	REST,
	Routes,
	ApplicationCommandOptionType,
	Client,
	ContextMenuCommandBuilder,
	ApplicationCommandType,
} = require("discord.js");
const getLocalCommands = require("../../utils/getLocalCommands");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const areCommandsDifferent = require("../../utils/areCommandsDifferent");

/**
 * @param {Client} client
 * */
module.exports = async (client) => {
	try {
		// const commandsData = [
		// 	new ContextMenuCommandBuilder()
		// 		.setName("User Information")
		// 		.setType(ApplicationCommandType.User),
		//
		// 	new ContextMenuCommandBuilder()
		// 		.setName("Translate message")
		// 		.setType(ApplicationCommandType.Message),
		// ];
		//
		// const rest = new REST().setToken(process.env.BOT_TOKEN);
		const localCommands = getLocalCommands();
		const applicationCommands = await getApplicationCommands(
			client,
			testServer,
		);

		for (const localCommand of localCommands) {
			const { name, description, options } = localCommand;

			const commandData = { name };

			const existingCommand = await applicationCommands.cache.find(
				/**
				 * @param {*} cmd
				 * */
				(cmd) => cmd.name === name,
			);

			if (existingCommand) {
				if (localCommand.deleted) {
					await applicationCommands.delete(existingCommand.id);

					console.log(`[DISCORD BOT] deleted command "${name}"`);

					continue;
				}

				if (areCommandsDifferent(existingCommand, localCommand)) {
					if (localCommand.type) {
						await applicationCommands.edit(existingCommand.id, {
							name: localCommand.name,
							type: localCommand.type,
						});
					} else {
						await applicationCommands.edit(existingCommand.id, {
							description: localCommand.description,
							options: localCommand.options || [],
						});
					}

					console.log(`[DISCORD BOT] Edited command "${name}".`);
				}
			} else {
				if (localCommand.deleted) {
					console.log(
						`[DISCORD BOT] Skipping registering command "${name}" as it's set to delete.`,
					);

					continue;
				}

				if (localCommand.type) {
					commandData.type = localCommand.type;
				} else {
					commandData.description = localCommand.description;
					commandData.options = localCommand.options || [];
				}

				await applicationCommands.create(commandData);

				console.log(`[DISCORD BOT] Registered command "${name}".`);
			}
		}
	} catch (error) {
		console.log(`There was an error: ${error}`);
	}
	// console.log(localCommands)
};
