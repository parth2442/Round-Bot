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

    .setName('autorole')

    .setDescription('Manage autorole system')

    .addSubcommand(sub =>
      sub
        .setName('set')
        .setDescription('Set autorole')
        .addRoleOption(option =>
          option
            .setName('role')
            .setDescription('Role')
            .setRequired(true)
        )
    )

    .addSubcommand(sub =>
      sub
        .setName('remove')
        .setDescription('Remove autorole')
    )

    .addSubcommand(sub =>
      sub
        .setName('show')
        .setDescription('Show current autorole')
    )

    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {

    const sub =
      interaction.options.getSubcommand();

    const key =
      `autorole_${interaction.guild.id}`;

    if (sub === 'set') {

      const role =
        interaction.options.getRole('role');

      await db.set(key, role.id);

      const embed = createEmbed(
        '✅ Autorole Set',
        `Autorole set to ${role}`
      );

      return interaction.reply({
        embeds: [embed]
      });

    }

    if (sub === 'remove') {

      await db.delete(key);

      const embed = createEmbed(
        '🗑 Autorole Removed',
        'Autorole has been removed.'
      );

      return interaction.reply({
        embeds: [embed]
      });

    }

    if (sub === 'show') {

      const roleId =
        await db.get(key);

      if (!roleId) {

        return interaction.reply({
          embeds: [
            createEmbed(
              '❌ No Autorole',
              'No autorole configured.',
              'Red'
            )
          ]
        });

      }

      const role =
        interaction.guild.roles.cache.get(
          roleId
        );

      const embed = createEmbed(
        '📌 Current Autorole',
        `Current autorole: ${role}`
      );

      return interaction.reply({
        embeds: [embed]
      });

    }

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

    const sub = args[0];

    const key =
      `autorole_${message.guild.id}`;

    if (sub === 'set') {

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

      await db.set(key, role.id);

      return message.reply({
        embeds: [
          createEmbed(
            '✅ Autorole Set',
            `Autorole set to ${role}`
          )
        ]
      });

    }

    if (sub === 'remove') {

      await db.delete(key);

      return message.reply({
        embeds: [
          createEmbed(
            '🗑 Autorole Removed',
            'Autorole removed.'
          )
        ]
      });

    }

    if (sub === 'show') {

      const roleId =
        await db.get(key);

      if (!roleId) {

        return message.reply({
          embeds: [
            createEmbed(
              '❌ No Autorole',
              'No autorole configured.',
              'Red'
            )
          ]
        });

      }

      const role =
        message.guild.roles.cache.get(
          roleId
        );

      return message.reply({
        embeds: [
          createEmbed(
            '📌 Current Autorole',
            `Current autorole: ${role}`
          )
        ]
      });

    }

  },

};