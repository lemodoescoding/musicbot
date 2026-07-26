const makeEmbed = require("../../../utils/embeds/makeEmbed");

const BASSBOOST_FILTER_NAME = "custom_bassboost";

module.exports = {
    BASSBOOST_FILTER_NAME: BASSBOOST_FILTER_NAME,

    /**
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     * @param {import("distube").Queue} queue
     * */
    callback: async (interaction, queue) => {
        const gain = interaction.options.getNumber("gain", true);

        if (gain === 0) {
            const existed = queue.filters.values.find(
                (f) => f.name === BASSBOOST_FILTER_NAME,
            );
            if (existed) {
                queue.filters.remove(existed);
            }

            await interaction.editReply({
                embeds: [makeEmbed({ description: `🔈 Bassboost disabled.` })],
            });

            return;
        }

        queue.filters.add(
            {
                name: BASSBOOST_FILTER_NAME,
                value: `bass=g=${gain}`,
            },
            true,
        );

        await interaction.editReply({
            embeds: [
                makeEmbed({ description: `🔊 Bassboost set to **+${gain}dB**.` }),
            ],
        });
    }
}

