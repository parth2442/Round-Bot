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

    .setName('setstaffrole')

    .setDescription('Set ticket support role')

    .addRoleOption(option =>
      option
        .setName('role')
        .setDescription('Support role')
        .setRequired(true)
    )

    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {

    const role =
      interaction.options.getRole('role');

    await db.set(
      `staffrole_${interaction.guild.id}`,
      role.id
    );

    const embed = createEmbed(
      '✅ Staff Role Set',
      `Staff role set to ${role}`
    );

    await interaction.reply({
      embeds: [embed]
    });

  },

  async executePrefix(message) {

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

    const role =
      message.mentions.roles.first();

    if (!role) {

      return message.reply({
        embeds: [
          createEmbed(
            '❌ Error',
            'Mention a role.',
            'Red'
          )
        ]
      });

    }

    await db.set(
      `staffrole_${message.guild.id}`,
      role.id
    );

    return message.reply({
      embeds: [
        createEmbed(
          '✅ Staff Role Set',
          `Staff role set to ${role}`
        )
      ]
    });

  },

};