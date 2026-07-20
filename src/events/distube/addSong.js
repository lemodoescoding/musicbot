const makeEmbed = require("../../utils/embeds/makeEmbed");
const formatDuration = require("../../utils/music/formatDuration");

const { Queue, Song } = require("distube");

/**
 * @param {Queue} queue
 * @param {Song} song
 * */
module.exports = async (queue, song) => {
    const position = queue.songs.findIndex(s => s === song);

    if(position <= 0) { return; }

    const embed = makeEmbed({
        description: `➕ Added [**${song.name}**](${song.url}) to the queue.`,
        thumbnail: song.thumbnail,
    }).addFields(
        {name: "Duration", value: song.duration ? formatDuration(song.duration) : "LIVE", inline: true},
        {name: "Position", value: `#${position}`, inline: true},
        {name: "Requested by", value: `${song.user}`, inline: true}
    )

    try {
        await queue.textChannel?.send({
            embeds: [embed]
        });
    } catch {
        console.error(
			`[addSong] Failed to send add-song message in guild ${queue.id}, channel ${queue.textChannel?.id}:`,
			error.message,
		);
    }

    if(queue.songs.length === 2 && queue.songs[1] === song) {
        const { preFetchSong } = require("@distube/yt-dlp");
        preFetchSong(song.url).catch((e) => {
            console.error(
				`[playSong] Prefetch failed for next song "${nextSong.name}":`,
				error.message,
			);
        }); 
    }
}
