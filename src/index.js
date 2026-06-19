require("dotenv").config();

const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("clientReady", (c) => {
  console.log(`[DISCORD BOT] ${c.user.tag} status is ready.`);
});

function createEmbed(image) {
  const embed = new EmbedBuilder()
    .setTitle("Embed title")
    .setDescription("This is an embed description")
    .setColor("Random")
    .addFields(
      {
        name: "Field title",
        value: "Some random value",
        inline: true,
      },
      {
        name: "2nd Field title",
        value: "Another Some random value",
        inline: true,
      },
      {
        name: "3rd Field title",
        value: "Just Another Some random value",
        inline: true,
      },
    );

  if (image && typeof image === "string") embed.setImage(image.trim());

  return embed;
}

client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  console.log(interaction.commandName);

  // if (interaction.commandName === 'add') {
  //     const num1 = interaction.options.get('first-number').value;
  //     const num2 = interaction.options.get('second-number').value;
  //
  //     interaction.reply(`The sum is ${num1 + num2}`)
  // }

  if (interaction.commandName === "embed") {
    interaction.reply({ embeds: [createEmbed()] });
  }
});

client.on("messageCreate", (message) => {
  if (message.content === "embed") {
    message.channel.send({
      embeds: [
        createEmbed(
          "https://github.com/lemodoescoding/fp-mbd-kelompok-4-2026/raw/master/assets/FP_MBD_B_-_Kelompok_4.png",
        ),
      ],
    });
  }
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isButton()) return;
    await interaction.deferReply({ ephemeral: true });

    const role = interaction.guild.roles.cache.get(interaction.customId);
    if (!role) {
      interaction.editReply({
        content: "I couldnt find that role.",
      });

      return;
    }

    const hasRole = interaction.member.roles.cache.has(role.id);
    if (hasRole) {
      await interaction.member.roles.remove(role);
      await interaction.editReply(`The role ${role} has been removed.`);

      return;
    }

    await interaction.member.roles.add(role);
    await interaction.editReply(`The role ${role} has been added.`);
  } catch (error) {
    console.log(error);
  }
});

client.login(process.env.BOT_TOKEN);
