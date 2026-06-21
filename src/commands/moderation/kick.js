const { Client, ChatInputCommandInteraction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')

module.exports = {
    name: 'kick',
    description: 'Kick a member on the server.',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'target-user',
            description: 'Kick a member!!!!',
            required: true,
            type: ApplicationCommandOptionType.Mentionable
        },
        {
            name: 'reason',
            description: 'Reason to kick user.',
            type: ApplicationCommandOptionType.String
        }
    ],
    permissionsRequired: [
        PermissionFlagsBits.KickMembers
    ],
    botPermissions: [
        PermissionFlagsBits.KickMembers
    ],
    /** 
     * @param {Client} _client
     * @param {ChatInputCommandInteraction} interaction 
     * */
    callback: async (_client, interaction) => {
        const targetUserOption = interaction.options.get('target-user');
        if(!targetUserOption) return;
        
        const targetUserId = targetUserOption.value;

        if(!targetUserId) {
            await interaction.editReply("That user doesnt exist in this server");
            return;
        }

        const reason = interaction.options.get('reason')?.value || "No reason provided.";

        await interaction.deferReply();
        const targetUser = await interaction.guild.members.fetch(String(targetUserId))


        if(targetUserId === interaction.guild.ownerId) {
            await interaction.editReply("You can't kick that user because they're the server owner");
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestMember = await interaction.guild.members.fetch(interaction.user.id);
        const requestUserRolePosition = requestMember.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("You can't kick that user, because they have the same/higher role than you.")
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("I can't kick that user, because they have the same/higher role than me.");
            return;
        }

        try {
            await targetUser.kick(String(reason))
            await interaction.editReply(`User ${targetUser} was kicked\n Reason: ${reason}`)
        } catch (error) {
            console.log(`There was an error when kicking: ${error}`)
        }
        // interaction.reply(`ban! ${client.ws.ping}ms`)
    }
}
