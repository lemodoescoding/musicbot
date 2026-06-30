const {
	ContextMenuCommandBuilder,
	ApplicationCommandType,
	MessageContextMenuCommandInteraction,
	Client,
} = require("discord.js");

module.exports = {
	name: "Translate message",
	type: ApplicationCommandType.Message,

	/**
	 * @param {Client} client
	 * @param {MessageContextMenuCommandInteraction} interaction
	 * */
	callback: async (client, interaction) => {
		if (!interaction.isMessageContextMenuCommand()) return;

		try {
			const message = interaction.targetMessage;

			await interaction.reply(
				`Original message: ${message.content}\nTranslated message: ....`,
			);
		} catch (error) {
			console.log(`There was an error: ${error}`);
		}
	},
};
