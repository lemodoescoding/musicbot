const { ChatInputCommandInteraction, ApplicationCommandOptionType, MessageFlags } = require("discord.js");
const { Queue } = require("distube");

const validateVoice = require("../../utils/music/validateVoice");
const getQueue = require("../../utils/music/getQueue");
const makeEmbed = require("../../utils/embeds/makeEmbed");

const SPEED_FILTER_NAME = "custom_speed";

/**
 * atempo only accepts 0.5 - 2.0 per instance, so chain multiple
 * instances together to support the full requested range.
 *
 * @param {number} speed
 * @returns {string}
 */
function buildAtempoChain(speed) {
	const parts = [];
	let remaining = speed;

	while (remaining > 2.0) {
		parts.push("atempo=2.0");
		remaining /= 2.0;
	}
	while (remaining < 0.5) {
		parts.push("atempo=0.5");
		remaining /= 0.5;
	}
	parts.push(`atempo=${remaining.toFixed(3)}`);

	return parts.join(",");
}

module.exports = {
    name: "speed",
    description: "Controls the playback speed.",
    options: [
        {
            name: 'playback-speed',
            description: 'Input the playback speed you desire. Range from 0.25 - 4.0',
            type: ApplicationCommandOptionType.Number,
            required: true,
            min_value: 0.25,
            max_value: 4.0
        }
    ],
    /**
     * @param {import("discord.js").Client & {
     *  distube: import("distube").DisTube
     * }} client
     * @param {ChatInputCommandInteraction} interaction
     * */
    callback: async (client, interaction) => {
        const music = await validateVoice(interaction, true);
        if(!music) { return; }

        /**
         * @type {Queue}
         * */
        const queue = getQueue(client, interaction.guildId);
        /**
         * @type {Number}
         * */
        const speed = interaction.options.getNumber("playback-speed", true);

        try {
            if(speed === 1) {
                const existing = queue.filters.values.find(f => f.name === SPEED_FILTER_NAME);

                if(existing) {
                    queue.filters.remove(existing);
                }

                await interaction.reply({
                    embeds: [makeEmbed({ description: `▶️ Playback speed reset to **1x**.` })]
                });

                return;
            }

            queue.filters.add({
                name: SPEED_FILTER_NAME,
                value: buildAtempoChain(speed)
            }, true);

            await interaction.reply({
                embeds: [makeEmbed({ description: `🎚️ Playback speed set to **${speed}x**.` })]
            });
        } catch(error) {
            await interaction.reply({
                content: `There was an error when running command /speed\n\`${error.message}\``,
                flags: [MessageFlags.Ephemeral]
            });

            console.log(error);
            console.log(error.stack);
        }
    }
}
