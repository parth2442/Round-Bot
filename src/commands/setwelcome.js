const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits
} = require('discord.js');

const db = require('../database/database');

function createEmbed(title, description, color = 'Blue') {

  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();

}

module.exports = {

  data: new SlashCommandBuilder()

    .setName('setwelcome')

    .setDescription('Set welcome channel')

    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Welcome channel')
        .setRequired(true)
    )

    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {

    const channel =
      interaction.options.getChannel('channel');

    await db.set(
      `welcome_${interaction.guild.id}`,
      channel.id
    );

    const embed = createEmbed(
      '✅ Welcome Channel Set',
      `Welcome channel set to ${channel}`
    );

    await interaction.reply({
      embeds: [embed]
    });

  },

  async executePrefix(message, args) {

    if (
      !message.member.permissions.has(
        PermissionFlagsBits.Administrator
      )
    ) {

      return message.reply({
        embeds: [
          createEmbed(
            '❌ Error',
            'Administrator permission required.',
            'Red'
          )
        ]
      });

    }

    const channel =
      message.mentions.channels.first();

    if (!channel) {

      return message.reply({
        embeds: [
          createEmbed(
            '❌ Error',
            'Mention a channel.',
            'Red'
          )
        ]
      });

    }

    await db.set(
      `welcome_${message.guild.id}`,
      channel.id
    );

    const embed = createEmbed(
      '✅ Welcome Channel Set',
      `Welcome channel set to ${channel}`
    );

    await message.reply({
      embeds: [embed]
    });

  },

};