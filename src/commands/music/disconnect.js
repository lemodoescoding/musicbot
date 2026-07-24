const { ChatInputCommandInteraction, MessageFlags } = require("discord.js");

const validateVoice = require("../../utils/music/validateVoice");
const getQueue = require("../../utils/music/getQueue");

const { release, cleanupDownload } = require("@distube/yt-dlp");

module.exports = {
	name: "disconnect",
	description:
		"Disconnect the bot from the voice channel (also destroys queue).",

	/**
	 * @param {import("discord.js").Client & {
	 *  distube: import("distube").DisTube
	 * }} client
	 * @param {ChatInputCommandInteraction} interaction
	 * */
	callback: async (client, interaction) => {
		const music = await validateVoice(interaction, false);
		if (!music) {
			return;
		}

		const queue = getQueue(client, interaction.guildId);

		try {
            const songsToClean = queue?.songs ? [...queue.songs] : [];

			if (queue) {
				queue.stop();
			}

            for(const song of songsToClean) {
                if(song?.url) { 
                    release(song.url);
                    cleanupDownload(song.url)
                }
            }

			const voiceConnection = client.distube.voices.get(
				interaction.guildId,
			);

			if (voiceConnection) {
				voiceConnection.leave();
			}

			await interaction.reply({
				content:
					":white_check_mark: Disconnect the player and left the voice channel.",
			});
		} catch (error) {
			await interaction.reply({
				content: `There was an error when running command /disconnect\n\`${error.message}\``,
				flags: [MessageFlags.Ephemeral],
			});

			console.log(error);
			console.log(error.stack);
		}
	},
};
