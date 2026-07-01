const { ApplicationCommandOptionType, Client, ChatInputCommandInteraction } = require("discord.js");
const { Queue } = require("distube");
const getQueue = require("../../utils/music/getQueue");
const getLyrics = require("../../utils/music/getLyrics");
const makeEmbed = require("../../utils/embeds/makeEmbed");
const paginateEmbeds = require("../../utils/embeds/paginateEmbeds");

const CHUNK_SIZE = 4000;

/**
 * split lyrics into chunks without cutting lines in half where possible.
 * @param {string} text
 * @returns {string[]}
 */
function chunkLyrics(text) {
	const lines = text.split("\n");
	const chunks = [];
	let current = "";

	for (const line of lines) {
		if ((current + "\n" + line).length > CHUNK_SIZE) {
			chunks.push(current);
			current = line;
		} else {
			current = current ? `${current}\n${line}` : line;
		}
	}
	if (current) chunks.push(current);

	return chunks.length ? chunks : [text.slice(0, CHUNK_SIZE)];
}

module.exports = {
    name: "lyrics",
    description: "Get lyrics for the current song or a search query.",
    options: [
        {
            name: "query",
            description: "Song title (optional — defaults to the currently playing song)",
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    callback: async (client, interaction) => {
        let query = interaction.options.getString("query");

        if (!query) {
            /**
             * @type {Queue}
             * */
            const queue = getQueue(client, interaction.guildId);

            if (!queue?.songs.length) {
                await interaction.reply({
                    embeds: [makeEmbed({ description: "❌ Nothing is playing and no query was given." })]
                });
                return;
            }

            query = queue.songs[0].name;
        }

        await interaction.deferReply();

        try {
            const result = await getLyrics(query);

            if (!result || !result.plainLyrics) {
                await interaction.editReply({
                    embeds: [makeEmbed({ description: `❌ No lyrics found for **${query}**.` })]
                });
                return;
            }

            const chunks = chunkLyrics(result.plainLyrics);
            const pages = chunks.map((chunk, i) =>
                makeEmbed({
                    title: `📜 ${result.trackName} — ${result.artistName}`,
                    description: chunk,
                    footer: chunks.length > 1 ? `Page ${i + 1} of ${chunks.length}` : undefined,
                })
            );

            await paginateEmbeds(interaction, pages);
        } catch (error) {
            await interaction.editReply({
                content: `An Error Occured: ${error.message}`
            });
            console.log(error);
            console.log(error.stack);
        }
    }
}
