require("dotenv").config();

const mongoose = require("mongoose");
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

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildPresences,
		IntentsBitField.Flags.MessageContent,
	],
    partials: [
        Partials.GuildMember,
        Partials.User
    ]
});

// client.on("clientReady", (c) => {

// });

(async () => {
	try {
		mongoose.set("strictQuery", false);
		await mongoose.connect(process.env.MONGODB_URI);

		console.log("Connected to MongoDB!");
	} catch (error) {
		console.log(error);
	}

	eventHandler(client);

	client.login(process.env.BOT_TOKEN);
})();
