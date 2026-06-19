require('dotenv').config()

const { Client, IntentsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})

const roles = [
    {
        id: '1517398856558444564',
        label: 'Red'
    },
    {
        id: '1517398934815768586',
        label: 'Green'
    },
    {
        id: '1517398988272439306',
        label: 'Blue'
    }
]

client.on('clientReady', async (c) => {
    try {
        const channel = await client.channels.cache.get('1517169973510930444');
        if (!channel) return;
        
        const row = new ActionRowBuilder();

        roles.forEach((role) => {
            row.components.push(
                new ButtonBuilder()
                    .setCustomId(role.id)
                    .setLabel(role.label)
                    .setStyle(ButtonStyle.Primary)
            )
        })

        await channel.send({ 
            content: 'Claim or remove a role below.',
            components: [row]
        })

        process.exit()
    } catch (error) {
        console.log(error)
    }
    console.log(`[DISCORD BOT] ${c.user.tag} status is ready.`)
})

client.login(process.env.BOT_TOKEN)
