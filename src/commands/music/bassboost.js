const { ChatInputCommandInteraction, ApplicationCommandOptionType, MessageFlags } = require("discord.js");
const { Queue } = require("distube");

const validateVoice = require("../../utils/music/validateVoice");
const getQueue = require("../../utils/music/getQueue");
const makeEmbed = require("../../utils/embeds/makeEmbed");

const BASSBOOST_FILTER_NAME = "custom_bassboost";

module.exports = {
    name: "bassboost",
    description: "Controls the bass boost effect for the playback.",
    options: [
        {
            name: "gain",
            description: "Bass gain in dB (0 disables the effect)",
            type: ApplicationCommandOptionType.Number,
            required: true,
            min_value: 0,
            max_value: 20,
        }
    ],
    /**
     * @param {import("discord.js").Client & {
     *  distube: import("distube").DisTube
     * }} client
     * @param {ChatInputCommandInteraction} interaction
     * */
    callback: async (client,interaction) => {
        const music = await validateVoice(interaction, true);
        if(!music) { return; }

        /**
         * @type {Number}
         * */
        const gain = interaction.options.getNumber("gain", true);
        /**
         * @type {Queue}
         * */
        const queue = getQueue(client, interaction.guildId);

        try {
            if(gain === 0) {
                const existed = queue.filters.values.find(f => f.name === BASSBOOST_FILTER_NAME);
                if(existed) {
                    queue.filters.remove(existed);
                }

                await interaction.reply({
                    embeds: [makeEmbed({ description: `🔈 Bassboost disabled.` })]
                });

                return;
            }

            queue.filters.add({
                name: BASSBOOST_FILTER_NAME,
                value: `bass=g=${gain}`
            });

            await interaction.reply({
                embeds: [makeEmbed({ description: `🔊 Bassboost set to **+${gain}dB**.` })]
            });
        } catch(error) {
            await interaction.reply({
                content: `There was an error when running /bassboost command\n\`${error.message}\``,
                flags: [MessageFlags.Ephemeral]
            });

            console.log(error);
            console.log(error.stack);
        }
    }
}
