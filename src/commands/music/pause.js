const { ChatInputCommandInteraction } = require("discord.js");

const validateVoice = require("../../utils/music/validateVoice");

const getQueue = require("../../utils/music/getQueue");

module.exports = {
    name: 'pause',
    description: 'Pause the current playing song.',
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

        if(queue.paused) {
            await interaction.reply({
                content: "⏸️ Music is already paused."
            })

            return;
        }

        try {
            queue.pause();
            await interaction.reply({
                content: "⏸️ Music paused."
            });

        } catch(error) {
            await interaction.reply({
                content: `There was an error on running command /pause\n\`${error.message}\``
            });

            console.log(error);
        }
    }
}
