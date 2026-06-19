require('dotenv').config()

const { REST, Routes, ApplicationCommandOptionType } = require('discord.js')

const commands = [
    {
        name: 'embed',
        description: 'Sends an embed.'
    }
]

// const commands = [
//     {
//         name: 'add',
//         description: 'Adds two numbers.',
//         options: [
//             {
//                 name: 'first-number',
//                 description: 'The first number.',
//                 type: ApplicationCommandOptionType.Number,
//                 required: true,
//                 choices: [
//                     {
//                         name: 'one',
//                         value: 1,
//                     },
//                     {
//                         name: 'two',
//                         value: 2,
//                     },
//                     {
//                         name: 'three',
//                         value: 3,
//                     }
//                 ]
//             },
//             {
//                 name: 'second-number',
//                 description: 'The second number.',
//                 type: ApplicationCommandOptionType.Number,
//                 required: true
//             }
//         ],
//     }
// ]

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log('[DISCORD BOT] registering slash commands...')
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            {
                body: commands
            }
        )

        console.log('[DISCORD BOT] slash commands registered success')
    } catch (error) {
        console.log(`[DISCORD BOT] There was an error: ${error}`)
    }
})();
