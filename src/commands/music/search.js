const {
	ChatInputCommandInteraction,
	MessageFlags,
	ApplicationCommandOptionType,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
	ButtonInteraction,
} = require("discord.js");
const { Queue } = require("distube");

const validateVoice = require("../../utils/music/validateVoice");
const getQueue = require("../../utils/music/getQueue");
const { getYtIClient } = require("../../utils/music/getYtIClient");
const makeEmbed = require("../../utils/embeds/makeEmbed");

const MAX_LIST_EMBED = 10;

/**
 * Escapes characters that would break Discord markdown link syntax.
 * @param {string} text
 * @returns {string}
 */
function escapeMarkdown(text) {
	return text.replace(/[\[\]()]/g, (match) => `\\${match}`);
}

module.exports = {
	name: "search",
	description:
		"Searches a track from the supported platform. Check using /support for more info",
	options: [
		{
			name: "input",
			description: "The search term you want to play.",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
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

		const { voiceChannel } = music;

		const input = interaction.options.getString("input", true);

		await interaction.deferReply();

		try {
			/**
			 * @type {import("youtubei.js").Innertube}
			 * */
			const yt = await getYtIClient();
			const search = await yt.search(input, { type: "video" });
            let results = search.results.filter((s) => {
                return s.title.text !== undefined && s.type === "Video" && s.id !== undefined
            });

			results = (results || []).slice(0, MAX_LIST_EMBED);

			if (results.length === 0) {
				await interaction.editReply({
					embeds: [
						makeEmbed({
							description: `❌ No results found for "${input}".`,
						}),
					],
				});

				return;
			}

// console.log(JSON.stringify(results[0], null, 2));
//
//             await interaction.deleteReply();
//             return;

			const listText = results
				.map((r, i) => {
					const title = escapeMarkdown(r.title?.text ?? "Untitled");
					return `**${i + 1}.** [${title}](https://www.youtube.com/watch?v=${r.id}) \`[${r.duration?.text ?? "?"}]\``;
				})
				.join("\n");

			const rows = [];

			const numberButtons = results.map((r, i) =>
				new ButtonBuilder()
					.setCustomId(`search_select_${i}`)
					.setLabel(`${i + 1}`)
					.setStyle(ButtonStyle.Secondary),
			);

			for (let i = 0; i < numberButtons.length; i += 5) {
				rows.push(
					new ActionRowBuilder().addComponents(
						numberButtons.slice(i, i + 5),
					),
				);
			}

			const lastRow = rows[rows.length - 1];
			if (lastRow.components.length < 5) {
				lastRow.addComponents(
					new ButtonBuilder()
						.setCustomId("search_cancel")
						.setLabel("Cancel")
						.setStyle(ButtonStyle.Danger),
				);
			} else {
				rows.push(
					new ActionRowBuilder().addComponents(
						new ButtonBuilder()
							.setCustomId("search_cancel")
							.setLabel("Cancel")
							.setStyle(ButtonStyle.Danger),
					),
				);
			}

			const message = await interaction.editReply({
				embeds: [
					makeEmbed({
						title: "🔎 Search Results",
						description: listText,
					}),
				],
				components: rows,
			});

			const collector = message.createMessageComponentCollector({
				componentType: ComponentType.Button,
				time: 30_000,
				max: 1,
			});

			/**
			 * @param {ButtonInteraction} btnInteraction
			 * */
			collector.on("collect", async (btnInteraction) => {
				if (btnInteraction.user.id !== interaction.user.id) {
					await btnInteraction.reply({
						content:
							"❌ Only the command user can select a result.",
						flags: [MessageFlags.Ephemeral],
					});
					return;
				}

				if (btnInteraction.customId === "search_cancel") {
					await btnInteraction.update({
						embeds: [
							makeEmbed({ description: "❌ Search cancelled." }),
						],
						components: [],
					});
					return;
				}

				const index = parseInt(
					btnInteraction.customId.split("_").pop(),
					10,
				);
				const chosen = results[index];
				const url = `https://www.youtube.com/watch?v=${chosen.id}`;

				await btnInteraction.update({
					embeds: [
						makeEmbed({
							description: `✅ Selected: [**${chosen.title?.text ?? "Untitled"}**](${url})`,
						}),
					],
					components: [],
				});

				await client.distube.play(voiceChannel, url, {
					interaction,
					member: interaction.member,
					textChannel: interaction.channel,
				});
			});

			/**
			 * @param {import("discord.js").ReadonlyCollection} collected
			 * */
			collector.on("end", async (collected) => {
				if (collected.size === 0) {
					await interaction
						.editReply({ components: [] })
						.catch(() => {});
				}
			});
		} catch (error) {
			await interaction.editReply({
				content: `Failed to search.\n\`${error.message}\``,
			});

			console.log(error);
			console.log(error.stack);
		}
	},
};
