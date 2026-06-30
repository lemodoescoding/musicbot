const { Client, ChatInputCommandInteraction, ApplicationCommandOptionType, MessageFlags } = require('discord.js');

const User = require('../../models/User');

module.exports = {
    name: 'balance',
    description: 'See yours/someone else\'s balance.',
    options: [
        {
            name: 'target-user',
            description: 'The user whose balance you want to see.',
            type: ApplicationCommandOptionType.Mentionable
        }
    ],
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     * */
    callback: async (client, interaction) => {
        if(!interaction.guildId) {
            await interaction.reply({
                content: 'You can only run this command inside a server',
                flags: [ MessageFlags.Ephemeral ]
            });

            return;
        }

        const targetUserId = interaction.options.get('user')?.value || interaction.member.id;

        await interaction.deferReply();

        const user = await User.findOne({ userId: targetUserId, guildId: interaction.guildId });

        if(!user) {
            interaction.editReply(`<@${targetUserId}> doesnt have a profile yet.`);
            return;
        }

        interaction.editReply(
            targetUserId === interaction.member.id ? `Your balance is **${user.balance}**`
            : `<@${targetUserId}>'s balance is **${user.balance}**`
        )
    }
}
