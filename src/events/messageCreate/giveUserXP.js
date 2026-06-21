const { Client, Message } = require('discord.js')

const Level = require('../../models/Level');
const calculateLevelXP = require('../../utils/calculateLevelXP');

/**
 * @param {Number} min
 * @param {Number} max
 * */
function getRandomXP(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {Client} _client
 * @param {Message} message
 * */
module.exports = async (_client, message) => {
    if(!message.inGuild() || message.author.bot) return;

    const xpToGive = getRandomXP(5, 15);

    const query = {
        userId: message.author.id,
        guildId: message.guildId,
    }

    try {
        const level = await Level.findOne(query);

        if (level) {
            level.xp += xpToGive;

            if (level.xp > calculateLevelXP(level.level)){
                level.xp = 0;
                level.level += 1;

                message.channel.send(`${message.member} you have leveled up to **level ${level.level}.**`);
            }

            await level.save().catch(e => {
                console.log(`Error saving updated level ${e}`);
                return;
            })
        } else {
            const newLevel = new Level({
                userId: message.author.id,
                guildId: message.guild.id,
                xp: xpToGive
            });

            await newLevel.save().catch(e => {
                console.log(`Error creating new level for user: ${e}`);
                return;
            })
        }
    } catch (error) {
        console.log(`Error giving xp: ${error}`);
    }
}
