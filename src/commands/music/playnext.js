const { ChatInputCommandInteraction, ApplicationCommandOptionType, MessageFlags } = require("discord.js");
const validateVoice = require("../../utils/music/validateVoice");
const getQueue = require("../../utils/music/getQueue");
const { getYtIClient } = require("../../utils/music/getYtIClient");
const makeEmbed = require("../../utils/embeds/makeEmbed");
const { Queue } = require("distube");

const { preFetchSong } = require("@distube/yt-dlp");

module.exports = {
    name: 'playnext',
    description: 'Enqueues a track from the query and plays it after the current track ends',
    options: [
        {
            name: 'query',
            description: 'URL or search term for the music.',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    /**
     * @param {import("discord.js").Client & {
     *  distube: import("distube").DisTube
     * }} client
     * @param {ChatInputCommandInteraction} interaction
     * */
    callback: async (client, interaction) => {
        const music = await validateVoice(interaction, true);

        if(!music) { return; }

        const { voiceChannel } = music;

		const query = interaction.options.getString("query", true);

		const urlRegex = /^https?:\/\//i.test(query);

        await interaction.deferReply();

        try {
			let input = query;
            /**
             * @type {Queue}
             * */
            const queueBefore = getQueue(client, interaction.guildId);
            const wasEmpty = !queueBefore || queueBefore.songs.length === 0;

			if (!urlRegex) {
				const yt = await getYtIClient();

				// https://github.com/LuanRT/YouTube.js/blob/main/docs/api/classes/Innertube.md
				// https://github.com/LuanRT/YouTube.js/blob/main/docs/api/youtubei.js/namespaces/Types/type-aliases/SearchFilters.md
				// https://github.com/LuanRT/YouTube.js/blob/main/docs/api/youtubei.js/namespaces/Types/type-aliases/SearchType.md
				const search = await yt.search(query, { type: "video" });
				const top = await search.results?.[0];

				if (!top?.id) {
                    await interaction.editReply({
                        content: `No results can be found for: ${query}`,
                    })

                    return;
				}

				input = `https://www.youtube.com/watch?v=${top.id}`;
			}

			await client.distube.play(voiceChannel, input, {
				interaction,
				member: interaction.member,
				textChannel: interaction.channel,
			});

            /**
             * @type {Queue}
             * */
            const currentQueue = getQueue(client, interaction.guildId);
            if(!wasEmpty && currentQueue.songs.length > 2) {
                const [added] = currentQueue.songs.splice(currentQueue.songs.length - 1, 1);
                currentQueue.songs.splice(1, 0, added);

                if(added?.url) {
                    preFetchSong(added.url).catch(e => {
                        console.error(`[playnext] Prefetch failed for ${added.name}:`, e.message);
                    })
                }
            }

            const song = wasEmpty ? currentQueue.songs[0] : currentQueue.songs[1];

            await interaction.editReply({
                embeds: [makeEmbed({ description: `⏭️ [**${song.name}**](${song.url}) will play next.` })]
            });
		} catch (error) {
            await interaction.deleteReply().catch(() => {})
			await interaction.followUp({
				content: `Failed to play music.\n\`${error.message}\``,
                flags: [MessageFlags.Ephemeral]
			});

            console.log(error);
		}
    }
}
