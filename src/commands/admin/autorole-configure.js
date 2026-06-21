const { Client, ChatInputCommandInteraction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')
const AutoRole = require('../../models/AutoRole');

module.exports = {
    name: 'autorole-configure',
    description: 'Configure your auto-role for this server.',
    options: [
        {
            name: 'target-role',
            description: 'The role you want users to get on join.',
            type: ApplicationCommandOptionType.Role,
            required: true
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.ManageRoles],
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     * */
    callback: async (client, interaction) => {
        if(!interaction.guildId) {
            interaction.reply("You can only run this command inside a server.");
            return;
        }

        const targetRoleId = interaction.options.get('target-role').value;

        try {
            await interaction.deferReply();

            let autoRole = await AutoRole.findOne({ guildId: interaction.guildId });

            if (autoRole) {
                if (autoRole.roleId === targetRoleId) {
                    interaction.editReply("Auto role has already been configured for that role. To disable, use `/autorole-disable`");
                    return;
                }

                autoRole.roleId = targetRoleId;
            } else {
                autoRole = new AutoRole({
                    guildId: interaction.guildId,
                    roleId: targetRoleId
                })
            }

            await autoRole.save();
            interaction.editReply("Autorole has now been configured. To disable, use `/autorole-disable`")
        } catch(error) {

        }
    }
}
