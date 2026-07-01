const { EmbedBuilder } = require("discord.js");

/**
 * quick wrapper for simple one-off embeds like status/action messages.
 *
 * @param {Object} options
 * @param {string} [options.description] - Main text of the embed.
 * @param {string} [options.title] - Optional embed title.
 * @param {import("discord.js").ColorResolvable} [options.color="Purple"] - Embed color.
 * @param {string} [options.footer] - Optional footer text.
 * @param {string} [options.thumbnail] - Optional thumbnail image URL.
 * @returns {EmbedBuilder}
 */
function makeEmbed({
	description,
	title,
	color = "Purple",
	footer,
	thumbnail,
} = {}) {
	const embed = new EmbedBuilder().setColor(color);

	if (title) embed.setTitle(title);
	if (description) embed.setDescription(description);
	if (footer) embed.setFooter({ text: footer });
	if (thumbnail) embed.setThumbnail(thumbnail);

	return embed;
}

module.exports = makeEmbed;
