    require('dotenv').config()

const { testServer } = require('../../../config.json')

const { REST, Routes, ApplicationCommandOptionType, Client } = require('discord.js')
const getLocalCommands = require('../../utils/getLocalCommands')
const getApplicationCommands = require('../../utils/getApplicationCommands')
const areCommandsDifferent = require('../../utils/areCommandsDifferent')


/**
 * @param {Client} client
 * */
module.exports = async (client) => {
    try {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(client, testServer)

        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand;

            const existingCommand = await applicationCommands.cache.find(
                /**
                 * @param {*} cmd
                 * */
                (cmd) => cmd.name === name
            )

            if (existingCommand) {
                if (localCommand.deleted) {
                    await applicationCommands.delete(existingCommand.id)

                    console.log(`[DISCORD BOT] deleted command "${name}"`);

                    continue;
                }

                if (areCommandsDifferent(existingCommand, localCommand)) {
                    await applicationCommands.edit(existingCommand.id, {
                        description,
                        options: options || []
                    })

                    console.log(`[DISCORD BOT] Edited command "${name}".`)
                }
            } else {
                if (localCommand.deleted) {
                    console.log(`[DISCORD BOT] Skipping registering command "${name}" as it's set to delete.`)

                    continue;
                }

                await applicationCommands.create({
                    name,
                    description,
                    options: options || []
                })

                console.log(`[DISCORD BOT] Registered command "${name}".`)
            }
        }
    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
    // console.log(localCommands)
}
