const { ChatInputCommandInteraction, MessageFlags, ApplicationCommandOptionType } = require("discord.js");

const validateVoice = require("../../utils/music/validateVoice");
const getQueue = require("../../utils/music/getQueue");
const makeEmbed = require("../../utils/embeds/makeEmbed");

const EIGHTD_FILTER_NAME = 'custom_8d';

module.exports = {
    name: "8d",
    description: "Toggles the 8D audio effect thanks to FFMPEG.",
    options: [
        {
            name: "rotation-speed",
            description: "Rotation speed for 8D effect. (0.05 - 0.3, defaults 0.125)",
            type: ApplicationCommandOptionType.Number,
            required: false,
            min_value: 0.05,
            max_value: 0.3
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
        if (!music) { return; }

        const queue = getQueue(client, interaction.guildId);
        const requestedHz = interaction.options.getNumber("rotation-speed");


        try {
            const existed = queue.filters.values.find(f => f.name === EIGHTD_FILTER_NAME);
            if(existed && requestedHz === null){
                queue.filters.remove(existed);

                await interaction.reply({
                    embeds: [makeEmbed({ description: `🔈 8D effect disabled.` })]
                });

                return;
            }

            const hz = requestedHz ?? 0.125;
            const filterValue = `apulsator=hz=${hz},aecho=0.8:0.88:60:0.4`;

            queue.filters.add({
                name: EIGHTD_FILTER_NAME,
                value: filterValue
            }, true);

            await interaction.reply({
                embeds: [makeEmbed({ description: `🔊 8D effect set to active on **${hz}Hz** rotation speed.` })]
            });
        } catch(error) {
            await interaction.reply({
                content: `There was an error when running command /8d\n\`${error.message}\``,
                flags: [MessageFlags.Ephemeral]
            });

            console.log(error);
            console.log(error.stack);
        }
    }
}
