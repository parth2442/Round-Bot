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
    .setName('antinukelog')
    .setDescription('Set antinuke logs channel')

    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Logs channel')
        .setRequired(true)
    )

    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {

    const channel =
      interaction.options.getChannel('channel');

    await db.set(
      `antinuke_log_${interaction.guild.id}`,
      channel.id
    );

    const embed = createEmbed(
      '✅ Antinuke Logs Set',
      `Logs channel set to ${channel}`
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

      const embed = createEmbed(
        '❌ Error',
        'Administrator permission required.',
        'Red'
      );

      return message.reply({
        embeds: [embed]
      });

    }

    const channel =
      message.mentions.channels.first();

    if (!channel) {

      const embed = createEmbed(
        '❌ Error',
        'Mention a channel.',
        'Red'
      );

      return message.reply({
        embeds: [embed]
      });

    }

    await db.set(
      `antinuke_log_${message.guild.id}`,
      channel.id
    );

    const embed = createEmbed(
      '✅ Antinuke Logs Set',
      `Logs channel set to ${channel}`
    );

    return message.reply({
      embeds: [embed]
    });

  },

};