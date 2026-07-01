const { ChatInputCommandInteraction, MessageFlags } = require("discord.js");

const validateVoice = require("../../utils/music/validateVoice");

const getQueue = require("../../utils/music/getQueue");

module.exports = {
    name: 'resume',
    description: 'Resume the current paused song.',
    /**
     * @param {import("discord.js").Client & {
     *  distube: import("distube").DisTube
     * }} client
     * @param {ChatInputCommandInteraction} interaction
     * */
    callback: async (client, interaction) => {
        const music = validateVoice(interaction, true);

        if(!music) { return; }

        const queue = getQueue(client, interaction.guildId);

        if(!queue.paused) {
            await interaction.reply({
                content: "⏸️ Music is already resumed."
            })

            return;
        }

        try {
            queue.resume();
            await interaction.reply({
                content: "⏸️ Music resumed."
            });

        } catch(error) {
            await interaction.reply({
                content: `There was an error on running command /resume\n\`${error.message}\``,
                flags: [MessageFlags.Ephemeral]
            });

            console.log(error);
        }
    }
}
