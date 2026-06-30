const {
	ApplicationCommandType,
	UserContextMenuCommandInteraction,
	Client,
} = require("discord.js");

module.exports = {
	name: "User Information",
	type: ApplicationCommandType.User,

	/**
	 * @param {Client} client
	 * @param {UserContextMenuCommandInteraction} interaction
	 * */
	callback: async (client, interaction) => {
		const targetUser = interaction.targetUser;

		// console.log("User command executed");

		if (interaction.inGuild()) {
			const targetMember = interaction.targetMember;

			const roles = targetMember.roles.cache
				.filter((role) => role.name !== "@everyone")
				.map((role) => role.name)
				.join(", ");

			await interaction.reply(
				`Username: ${targetUser.username}\nID: ${targetUser.id}\nNickname: ${targetMember.nick}\nJoined At: ${new Date(targetMember.joinedAt).toLocaleString()}\nRoles: ${roles}`,
			);
            
            return;
		}

		await interaction.reply(
			`Username: ${targetUser.username}\nID: ${targetUser.id}\n2`,
		);
	},
};
