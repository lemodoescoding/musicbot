const makeEmbed = require("../../utils/embeds/makeEmbed");
const formatDuration = require("../../utils/music/formatDuration");

const { Queue, Song } = require("distube");

/**
 * @param {Queue} queue
 * @param {Song} song
 * */
module.exports = (queue, song) => {
    const position = queue.songs.findIndex(s => s === song);

    if(position <= 0) { return; }

    const embed = makeEmbed({
        description: `➕ Added [**${song.name}**](${song.url}) to the queue.`,
        thumbnail: song.thumbnail,
    }).addFields(
        {name: "Duration", value: song.duration ? formatDuration(song.duration) : "LIVE", inline: true},
        {name: "Position", value: `#${position + 1}`, inline: true},
        {name: "Requested by", value: `${song.user}`, inline: true}
    )
    queue.textChannel?.send({
        embeds: [embed]
    });
}
