const { Client, ApplicationCommandOptionType, PermissionFlagsBits, ChatInputCommandInteraction, MessageFlags } = require('discord.js')

module.exports = {
    name: 'ban',
    description: 'Ban a member on the server.',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'target-user',
            description: 'Ban a member!!!!',
            required: true,
            type: ApplicationCommandOptionType.Mentionable
        },
        {
            name: 'reason',
            description: 'Reason to ban user.',
            type: ApplicationCommandOptionType.String
        }
    ],
    permissionsRequired: [
        PermissionFlagsBits.BanMembers
    ],
    botPermissions: [
        PermissionFlagsBits.BanMembers
    ],
    /** 
     * @param {Client} _client
     * @param {ChatInputCommandInteraction} interaction 
     * */
    callback: async (_client, interaction) => {
        const targetUserOption = interaction.options.get('target-user');
        if(!targetUserOption) return;

        const targetUserId = targetUserOption.value;
        const reason = interaction.options.get('reason')?.value || "No reason provided.";

        if(!targetUserId) {
            await interaction.editReply("That user doesnt exist in this server");
            return;
        }

        await interaction.deferReply();
        const targetUser = await interaction.guild.members.fetch(String(targetUserId))


        if(targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply("You can't ban that user because they're the server owner");
            return;
        }

        if(targetUser.id === interaction.member.id) {
            await interaction.editReply("You can't ban yourself.");
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestMember = await interaction.guild.members.fetch(interaction.user.id);
        const requestUserRolePosition = requestMember.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("You can't ban that user, because they have the same/higher role than you.")
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("I can't ban that user, because they have the same/higher role than me.");
            return;
        }



        try {
            await targetUser.ban({ reason: String(reason) })
            await interaction.editReply(`User ${targetUser} was banned\n Reason: ${reason}`)
        } catch (error) {
            console.log(`There was an error when banning: ${error}`)
        }
        // interaction.reply(`ban! ${client.ws.ping}ms`)
    }
}
