const makeEmbed = require("../../../utils/embeds/makeEmbed");

const { EIGHTD_FILTER_NAME } = require("./8d");
const { SPEED_FILTER_NAME } = require("./speed");
const { TREMOLO_FILTER_NAME } = require("./tremolo");
const { BASSBOOST_FILTER_NAME } = require("./bassboost");
const { NIGHTCORE_FILTER_NAME } = require("./nightcore");

module.exports = {
	/**
	 * @param {import("discord.js").ChatInputCommandInteraction} interaction
	 * @param {import("distube").Queue} queue
	 * */
	callback: async (interaction, queue) => {
        if (queue.filters.size === 0) {
            await interaction.editReply({
                embeds: [makeEmbed({ description: `ℹ️ No filters are currently active.` })],
            });
     
            return;
        }
     
        queue.filters.clear();
     
        await interaction.editReply({
            embeds: [
                makeEmbed({ description: `🧹 Cleared all active filters` }),
            ],
        });
	},
};
