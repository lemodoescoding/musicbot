const { Queue } = require("distube");

const getQueue = require("../../utils/music/getQueue");

const {
	ApplicationCommandOptionType,
	Client,
	ChatInputCommandInteraction,
	MessageFlags,
	VoiceBasedChannel,
	PermissionFlagsBits,
} = require("discord.js");

const validateVoice = require("../../utils/music/validateVoice");
const { getYtIClient } = require("../../utils/music/getYtIClient")

module.exports = {
	name: "play",
	description: "Play a song",
	options: [
		{
			name: "query",
			description: "Song name or URL",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
	/**
	 * @param {import("discord.js").Client & {
	 *   distube: import("distube").DisTube
	 * }} client
	 * @param {ChatInputCommandInteraction} interaction
	 * */
	callback: async (client, interaction) => {
		const music = await validateVoice(interaction, false);

		if (!music) return;

		const { voiceChannel } = music;

		const query = interaction.options.getString("query", true);

		const urlRegex = /^https?:\/\//i.test(query);

		await interaction.deferReply();

		try {
			let input = query;

			if (!urlRegex) {
				const yt = await getYtIClient();

				// https://github.com/LuanRT/YouTube.js/blob/main/docs/api/classes/Innertube.md
				// https://github.com/LuanRT/YouTube.js/blob/main/docs/api/youtubei.js/namespaces/Types/type-aliases/SearchFilters.md
				// https://github.com/LuanRT/YouTube.js/blob/main/docs/api/youtubei.js/namespaces/Types/type-aliases/SearchType.md
				const search = await yt.search(query, { type: "video" });
				const top = await search.results?.[0];

				if (!top?.id) {
					throw new Error(`No results can be found for: ${query}`);
				}

				input = `https://www.youtube.com/watch?v=${top.id}`;
			}

            /**
             * @type {Queue}
             * */
            const currentQueue = getQueue(client, interaction.guildId)

            if (currentQueue) {
                /**
                 * @param {Queue.songs} song
                 * */
                const alreadyQueued = currentQueue.songs.some(song => {
                    return song.url === input
                })

                if (alreadyQueued) {
                    await interaction.editReply({
                        content: "❌ That song is already playing."
                    });

                    return;
                }
            }

			await client.distube.play(voiceChannel, input, {
				interaction,
				member: interaction.member,
				textChannel: interaction.channel,
			});

			await interaction.deleteReply();
		} catch (error) {
			await interaction.editReply({
				content: `Failed to play music.\n\`${error.message}\`\n${error.stack}`,
			});
		}
	},
};
