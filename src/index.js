require("dotenv").config();

const path = require("path");

const { Font, FontFactory } = require("canvacord");
if (!FontFactory.size) {
	Font.loadDefault();
}

const { GlobalFonts } = require("@napi-rs/canvas");

GlobalFonts.registerFromPath(
	path.join(__dirname, "../assets/fonts/Roboto-Regular.ttf"),
	"Roboto",
);

process.on("uncaughtException", (err) => {
	console.error("Uncaught Exception:");
	console.error(err);
});

process.on("unhandledRejection", (reason) => {
	console.error("Unhandled Rejection:");
	console.error(reason);
});

const { Client, IntentsBitField, Partials } = require("discord.js");
const eventHandler = require("./handlers/eventHandler");
const distubeHandler = require("./handlers/distubeHandler");

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildPresences,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildVoiceStates,
	],
	partials: [Partials.GuildMember, Partials.User],
});

(async () => {

	eventHandler(client);

	distubeHandler(client);

	client.on("voiceStateUpdate", (oldState, newState) => {
		if (newState.id === client.user?.id) {
			console.log("VOICE STATE UPDATE");
			console.log({
				channel: newState.channel?.name,
				sessionId: newState.sessionId,
			});
		}
	});

	client.ws.on("VOICE_SERVER_UPDATE", (data) => {
		console.log("VOICE SERVER UPDATE", data);
	});

	client.on("raw", (packet) => {
		if (
			packet.t === "VOICE_STATE_UPDATE" ||
			packet.t === "VOICE_SERVER_UPDATE"
		) {
			console.log(packet.t, packet.d);
		}
	});

	client.login(process.env.BOT_TOKEN);
})();
