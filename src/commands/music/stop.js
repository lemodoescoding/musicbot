const { ChatInputCommandInteraction } = require("discord.js");

const { Queue } = require("distube");

const validateVoice = require("../../utils/music/validateVoice");
const getQueue = require("../../utils/music/getQueue");

module.exports = {
	name: "stop",
	description: "Clears the queue and disconnect the bot.",
	/**
	 * @param { import("discord.js").Client & {
	 *  distube: import("distube").Distube
	 * }} client
	 * @param {ChatInputCommandInteraction} interaction
	 * */
	callback: async (client, interaction) => {
		const music = await validateVoice(interaction, true);

		if (!music) {
			return;
		}

		try {
			/**
			 * @type {Queue}
			 * */
			const queue = getQueue(client, interaction.guildId);

			queue.stop();

			await interaction.reply({
				content: "⏹️ Stopped playback and cleared the queue.",
			});
		} catch (error) {
			await interaction.reply({
				content: `There was an error running command /stop\n\`${error.message}\``,
			});
		}
	},
};
