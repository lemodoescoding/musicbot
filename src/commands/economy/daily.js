const { Client, MessageFlags, ChatInputCommandInteraction } = require('discord.js')
const User = require('../../models/User')

const dailyAmount = 1000;

module.exports = {
    name: 'daily',
    description: 'Collect your dailies!',
    /**
     * @param {Client} _client
     * @param {ChatInputCommandInteraction} interaction
     * */
    callback: async (_client, interaction) => {
        if(!interaction.guildId) {
            await interaction.reply({
                content: 'You can only run this command inside a server',
                flags: [ MessageFlags.Ephemeral ]
            })

            return;
        }

        try {
            await interaction.deferReply();

            let query = {
                userId: interaction.member.user.id,
                guildId: interaction.guild.id
            }

            let user = await User.findOne(query);

            if(user) {
                const lastDailyDate = user.lastDaily.toDateString();
                const currentDate = new Date().toDateString()

                if(lastDailyDate === currentDate){
                    interaction.editReply("You have already collected your dailies today. Come back tomorrow!");

                    return;
                } 

                user.lastDaily = new Date()
            } else {
                user = new User({
                    ...query,
                    lastDaily: new Date()
                })
            }

            user.balance += dailyAmount;
            await user.save();

            interaction.editReply(`${dailyAmount} was added to your balance. Your new balance is ${user.balance}`)
        } catch (error) {
            console.log(`Error with /daily: ${error}`)
        }
    }
}
