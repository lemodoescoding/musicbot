const { Client, PermissionFlagsBits, ChatInputCommandInteraction } = require('discord.js');
const AutoRole = require('../../models/AutoRole');

module.exports = {
    name: 'autorole-disable',
    description: 'Disable auto-role in this server.',
    permissionsRequired: [PermissionFlagsBits.Administrator],
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     * */
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply();

            if(!(await AutoRole.exists({ guildId: interaction.guildId}))) {
                interaction.editReply("Auto role has not been configured for this server. Use `/autorole-configure` to set it up")
               return;
            }

            await AutoRole.findOneAndDelete({ guildId: interaction.guildId });

            interaction.editReply("Auto role has been disabled for this server. Use `/autorle-configure` to set it up again.")
        } catch (error) {
            console.log(error)
        }
    }
}
