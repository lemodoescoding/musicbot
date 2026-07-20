const { Queue } = require("distube");
const { Innertube } = require("youtubei.js");

const getQueue = require("../../utils/music/getQueue");

const {
	ApplicationCommandOptionType,
	Client,
	ChatInputCommandInteraction,
	MessageFlags,
	VoiceBasedChannel,
	PermissionFlagsBits,
} = require("discord.js");

const { readDurationInfo, extractVideoId, checkPlaybackSafety, MAX_DURATION_SECONDS } = require("../../utils/music/checkPlaybackSafe");

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
            let knownDurationSec;
            let knownIsLive;

			if (!urlRegex) {

                /**
                 * @type {Innertube}
                 * */
				const yt = await getYtIClient();

				// https://github.com/LuanRT/YouTube.js/blob/main/docs/api/classes/Innertube.md
				// https://github.com/LuanRT/YouTube.js/blob/main/docs/api/youtubei.js/namespaces/Types/type-aliases/SearchFilters.md
				// https://github.com/LuanRT/YouTube.js/blob/main/docs/api/youtubei.js/namespaces/Types/type-aliases/SearchType.md
				const search = await yt.search(query, { type: "video" });
                const top = (search.results ?? []).find(r => {
                    if(!r?.id) { return false; }
                    const { seconds, isLive } = readDurationInfo(r);

                    if(isLive) { return false; }
                    return r.title?.text !== undefined && r.type === "Video" && r.id !== undefined && seconds && seconds <= MAX_DURATION_SECONDS;
                });

				if (!top?.id) {
                    await interaction.editReply({
                        content: `No results can be found for: ${query}`,
                        flags: [MessageFlags.Ephemeral]
                    })

                    return;
				}

				input = `https://www.youtube.com/watch?v=${top.id}`;
                const topInfo = readDurationInfo(top);
                knownDurationSec = topInfo.seconds;
                knownIsLive = topInfo.isLive;
			}

            const safeCheck = await checkPlaybackSafety({
                url: input,
                durationSeconds: knownDurationSec,
                isLive: knownIsLive
            });

            if(!safeCheck.allowed) {
                await interaction.editReply({
                    content: safeCheck.reason,
                    flags: [MessageFlags.Ephemeral]
                });

                return;
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

            if(!currentQueue?.songs) {
                await interaction.editReply({
                    content: `🔍 Found it — preparing playback, this may take a few seconds while it downloads...`,
                });
            } 

            if(currentQueue && currentQueue.songs.length >= 1){
                await interaction.editReply({
                    content: `🔍 Found it — adding it to playback...`,
                });
            }

			await client.distube.play(voiceChannel, input, {
				interaction,
				member: interaction.member,
				textChannel: interaction.channel,
			});

			await interaction.deleteReply();
		} catch (error) {
			await interaction.editReply({
				content: `Failed to play music.\n\`${error.message}\``,
			});

            console.log(error);
            console.log(error.stack);
		}
	},
};
