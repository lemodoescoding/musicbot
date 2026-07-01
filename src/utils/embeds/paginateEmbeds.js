const {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
} = require("discord.js");

/**
 * sends or edits a reply with Prev/Next button pagination across multiple embeds.
 *
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 * @param {import("discord.js").EmbedBuilder[]} pages
 * @param {Object} [options]
 * @param {number} [options.timeout=60000] - How long buttons stay active (ms).
 * @param {boolean} [options.useEditReply=true] - Use editReply (after deferReply) vs reply.
 */
async function paginateEmbeds(interaction, pages, { timeout = 60_000, useEditReply = true } = {}) {
	if (pages.length === 1) {
		const send = useEditReply ? interaction.editReply.bind(interaction) : interaction.reply.bind(interaction);
		return send({ embeds: [pages[0]] });
	}

	let page = 0;

	const buildRow = (disabled = false) =>
		new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId("paginate_prev")
				.setLabel("◀")
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(disabled || page === 0),
			new ButtonBuilder()
				.setCustomId("paginate_page")
				.setLabel(`${page + 1} / ${pages.length}`)
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(true),
			new ButtonBuilder()
				.setCustomId("paginate_next")
				.setLabel("▶")
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(disabled || page === pages.length - 1)
		);

	const send = useEditReply ? interaction.editReply.bind(interaction) : interaction.reply.bind(interaction);
	const message = await send({ embeds: [pages[page]], components: [buildRow()] });

	const collector = message.createMessageComponentCollector({
		componentType: ComponentType.Button,
		time: timeout,
	});

	collector.on("collect", async (btnInteraction) => {
		if (btnInteraction.user.id !== interaction.user.id) {
			await btnInteraction.reply({ content: "❌ Only the command user can control this.", ephemeral: true });
			return;
		}

		if (btnInteraction.customId === "paginate_prev") page = Math.max(page - 1, 0);
		if (btnInteraction.customId === "paginate_next") page = Math.min(page + 1, pages.length - 1);

		await btnInteraction.update({ embeds: [pages[page]], components: [buildRow()] });
	});

	collector.on("end", async () => {
		await interaction.editReply({ components: [buildRow(true)] }).catch(() => {});
	});
}

module.exports = paginateEmbeds;
