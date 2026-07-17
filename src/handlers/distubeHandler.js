const { DisTube } = require("distube");
const { Client } = require("discord.js");
const { YtDlpPlugin } = require("@distube/yt-dlp");

const getAllFiles = require("../utils/getAllFiles");
const path = require("path");

/**
 * @param {import("discord.js").Client & {
 *   distube: import("distube").DisTube
 * }} client
 * */
module.exports = (client) => {
    console.log("[DEBUG] HOME:", process.env.HOME);

	client.distube = new DisTube(client, {
		plugins: [
			new YtDlpPlugin({
				update: false,
			}),
		],
		emitNewSongOnly: true,
	});

	const eventFiles = getAllFiles(
		path.join(__dirname, "..", "events", "distube"),
	);

	for (const file of eventFiles) {
		const event = require(file);

		const eventName = path.basename(file, ".js");

		client.distube.on(eventName, event);
	}

	console.log("[DISCORD BOT] Distube initialized.");
};
