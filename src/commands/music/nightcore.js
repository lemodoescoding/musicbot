const { ChatInputCommandInteraction, MessageFlags, ApplicationCommandOptionType } = require("discord.js");

const validateVoice = require("../../utils/music/validateVoice");
const getQueue = require("../../utils/music/getQueue");
const makeEmbed = require("../../utils/embeds/makeEmbed");

const NIGHTCORE_FILTER_NAME = "custom_nightcore";

module.exports = {
    name: "nightcore",
    description: "Enables/disables the nightcore effect on the playback.",

    /**
     * @param {import("discord.js").Client & {
     *  distube: import("distube").DisTube
     * }} client
     * @param {ChatInputCommandInteraction} interaction
     * */
    callback: async (client, interaction) => {
        const music = await validateVoice(interaction, true);
        if(!music) { return; }

        const queue = getQueue(client, interaction.guildId);

        try {
            const existed = queue.filters.values.find(f => f.name === NIGHTCORE_FILTER_NAME);
            if(existed) {
                queue.filters.remove(existed);

                await interaction.reply({
                    embeds: [makeEmbed({ description: `🔈 Nightcore effect disabled.` })]
                });

                return;
            }

            queue.filters.add({
                name: NIGHTCORE_FILTER_NAME,
                value: "asetrate=48000*1.25,aresample=48000,bass=g=5"
            }, true);

            await interaction.reply({
                embeds: [makeEmbed({ description: `🔊 Nightcore effect enabled.`})]
            });
        } catch(error) {
            await interaction.reply({
                content: `There was an error when running command /nightcore\n\`${error.message}\``,
                flags: [MessageFlags.Ephemeral]
            });

            console.log(error);
            console.log(error.stack);
        }
    }
}
