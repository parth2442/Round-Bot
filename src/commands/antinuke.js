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
    .setName('antinuke')
    .setDescription('Manage antinuke system')

    .addSubcommand(sub =>
      sub
        .setName('enable')
        .setDescription('Enable antinuke')
    )

    .addSubcommand(sub =>
      sub
        .setName('disable')
        .setDescription('Disable antinuke')
    )

    .addSubcommand(sub =>
      sub
        .setName('punishment')
        .setDescription('Set punishment')
        .addStringOption(option =>
          option
            .setName('type')
            .setDescription('ban/kick')
            .setRequired(true)
            .addChoices(
              { name: 'Ban', value: 'ban' },
              { name: 'Kick', value: 'kick' }
            )
        )
    )

    .addSubcommand(sub =>
      sub
        .setName('limit')
        .setDescription('Set antinuke limit')
        .addIntegerOption(option =>
          option
            .setName('amount')
            .setDescription('Limit amount')
            .setRequired(true)
        )
    )

    .addSubcommand(sub =>
      sub
        .setName('config')
        .setDescription('Show antinuke config')
    )

    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {

    const sub =
      interaction.options.getSubcommand();

    const guildId =
      interaction.guild.id;

    if (sub === 'enable') {

      await db.set(
        `antinuke_enabled_${guildId}`,
        true
      );

      const embed = createEmbed(
        '🛡 Antinuke Enabled',
        'Protection system enabled.'
      );

      return interaction.reply({
        embeds: [embed]
      });

    }

    if (sub === 'disable') {

      await db.set(
        `antinuke_enabled_${guildId}`,
        false
      );

      const embed = createEmbed(
        '❌ Antinuke Disabled',
        'Protection system disabled.'
      );

      return interaction.reply({
        embeds: [embed]
      });

    }

    if (sub === 'punishment') {

      const type =
        interaction.options.getString('type');

      await db.set(
        `antinuke_punishment_${guildId}`,
        type
      );

      const embed = createEmbed(
        '⚒ Punishment Updated',
        `Punishment set to: ${type}`
      );

      return interaction.reply({
        embeds: [embed]
      });

    }

    if (sub === 'limit') {

      const amount =
        interaction.options.getInteger('amount');

      await db.set(
        `antinuke_limit_${guildId}`,
        amount
      );

      const embed = createEmbed(
        '📊 Limit Updated',
        `Limit set to: ${amount}`
      );

      return interaction.reply({
        embeds: [embed]
      });

    }

    if (sub === 'config') {

      const enabled =
        await db.get(
          `antinuke_enabled_${guildId}`
        );

      const punishment =
        await db.get(
          `antinuke_punishment_${guildId}`
        ) || 'Not Set';

      const limit =
        await db.get(
          `antinuke_limit_${guildId}`
        ) || 'Not Set';

      const embed = new EmbedBuilder()
        .setColor('Blue')
        .setTitle('🛡 Antinuke Config')
        .addFields(
          {
            name: 'Status',
            value: enabled ? 'Enabled' : 'Disabled',
            inline: true
          },
          {
            name: 'Punishment',
            value: `${punishment}`,
            inline: true
          },
          {
            name: 'Limit',
            value: `${limit}`,
            inline: true
          }
        )
        .setTimestamp();

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

      const embed = createEmbed(
        '❌ Error',
        'Administrator permission required.',
        'Red'
      );

      return message.reply({
        embeds: [embed]
      });

    }

    const sub = args[0];

    const guildId =
      message.guild.id;

    if (sub === 'enable') {

      await db.set(
        `antinuke_enabled_${guildId}`,
        true
      );

      const embed = createEmbed(
        '🛡 Antinuke Enabled',
        'Protection system enabled.'
      );

      return message.reply({
        embeds: [embed]
      });

    }

    if (sub === 'disable') {

      await db.set(
        `antinuke_enabled_${guildId}`,
        false
      );

      const embed = createEmbed(
        '❌ Antinuke Disabled',
        'Protection system disabled.'
      );

      return message.reply({
        embeds: [embed]
      });

    }

    if (sub === 'punishment') {

      const type = args[1];

      if (!['ban', 'kick'].includes(type)) {

        const embed = createEmbed(
          '❌ Error',
          'Use ban or kick.',
          'Red'
        );

        return message.reply({
          embeds: [embed]
        });

      }

      await db.set(
        `antinuke_punishment_${guildId}`,
        type
      );

      const embed = createEmbed(
        '⚒ Punishment Updated',
        `Punishment set to: ${type}`
      );

      return message.reply({
        embeds: [embed]
      });

    }

    if (sub === 'limit') {

      const amount =
        parseInt(args[1]);

      if (isNaN(amount)) {

        const embed = createEmbed(
          '❌ Error',
          'Provide valid number.',
          'Red'
        );

        return message.reply({
          embeds: [embed]
        });

      }

      await db.set(
        `antinuke_limit_${guildId}`,
        amount
      );

      const embed = createEmbed(
        '📊 Limit Updated',
        `Limit set to: ${amount}`
      );

      return message.reply({
        embeds: [embed]
      });

    }

    if (sub === 'config') {

      const enabled =
        await db.get(
          `antinuke_enabled_${guildId}`
        );

      const punishment =
        await db.get(
          `antinuke_punishment_${guildId}`
        ) || 'Not Set';

      const limit =
        await db.get(
          `antinuke_limit_${guildId}`
        ) || 'Not Set';

      const embed = new EmbedBuilder()
        .setColor('Blue')
        .setTitle('🛡 Antinuke Config')
        .addFields(
          {
            name: 'Status',
            value: enabled ? 'Enabled' : 'Disabled',
            inline: true
          },
          {
            name: 'Punishment',
            value: `${punishment}`,
            inline: true
          },
          {
            name: 'Limit',
            value: `${limit}`,
            inline: true
          }
        )
        .setTimestamp();

      return message.reply({
        embeds: [embed]
      });

    }

  },

};