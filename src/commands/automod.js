const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits
} = require('discord.js');

const db =
  require('../database/database');

module.exports = {

  data: new SlashCommandBuilder()

    .setName('automod')

    .setDescription(
      'Manage automod system'
    )

    /*
    =========================
    ENABLE
    =========================
    */

    .addSubcommand(subcommand =>

      subcommand

        .setName('enable')

        .setDescription(
          'Enable automod'
        )

    )

    /*
    =========================
    DISABLE
    =========================
    */

    .addSubcommand(subcommand =>

      subcommand

        .setName('disable')

        .setDescription(
          'Disable automod'
        )

    )

    /*
    =========================
    PUNISHMENT
    =========================
    */

    .addSubcommand(subcommand =>

      subcommand

        .setName('punishment')

        .setDescription(
          'Set automod punishment'
        )

        .addStringOption(option =>

          option

            .setName('type')

            .setDescription(
              'Punishment type'
            )

            .setRequired(true)

            .addChoices(

              {
                name: 'warn',
                value: 'warn'
              },

              {
                name: 'timeout',
                value: 'timeout'
              },

              {
                name: 'kick',
                value: 'kick'
              },

              {
                name: 'ban',
                value: 'ban'
              }

            )

        )

    )

    /*
    =========================
    IGNORE CHANNEL
    =========================
    */

    .addSubcommand(subcommand =>

      subcommand

        .setName('ignore')

        .setDescription(
          'Ignore channel from automod'
        )

        .addChannelOption(option =>

          option

            .setName('channel')

            .setDescription(
              'Channel to ignore'
            )

            .setRequired(true)

        )

    )

    /*
    =========================
    WL USER
    =========================
    */

    .addSubcommand(subcommand =>

      subcommand

        .setName('wl')

        .setDescription(
          'Whitelist user'
        )

        .addUserOption(option =>

          option

            .setName('user')

            .setDescription(
              'User to whitelist'
            )

            .setRequired(true)

        )

    )

    /*
    =========================
    REMOVE WL USER
    =========================
    */

    .addSubcommand(subcommand =>

      subcommand

        .setName('unwl')

        .setDescription(
          'Remove whitelisted user'
        )

        .addUserOption(option =>

          option

            .setName('user')

            .setDescription(
              'User to remove'
            )

            .setRequired(true)

        )

    )

    /*
    =========================
    WL ROLE
    =========================
    */

    .addSubcommand(subcommand =>

      subcommand

        .setName('wlrole')

        .setDescription(
          'Whitelist role'
        )

        .addRoleOption(option =>

          option

            .setName('role')

            .setDescription(
              'Role to whitelist'
            )

            .setRequired(true)

        )

    )

    /*
    =========================
    REMOVE WL ROLE
    =========================
    */

    .addSubcommand(subcommand =>

      subcommand

        .setName('unwlrole')

        .setDescription(
          'Remove whitelisted role'
        )

        .addRoleOption(option =>

          option

            .setName('role')

            .setDescription(
              'Role to remove'
            )

            .setRequired(true)

        )

    )

    /*
    =========================
    SHOW WL
    =========================
    */

    .addSubcommand(subcommand =>

      subcommand

        .setName('wlshow')

        .setDescription(
          'Show automod whitelist'
        )

    )

    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {

    const sub =
      interaction.options.getSubcommand();

    /*
    =========================
    ENABLE
    =========================
    */

    if (sub === 'enable') {

      await db.set(
        `automod_${interaction.guild.id}`,
        true
      );

      return interaction.reply({

        embeds: [

          new EmbedBuilder()

            .setColor('#00ff99')

            .setTitle(
              '🤖 Automod Enabled'
            )

        ]

      });

    }

    /*
    =========================
    DISABLE
    =========================
    */

    if (sub === 'disable') {

      await db.set(
        `automod_${interaction.guild.id}`,
        false
      );

      return interaction.reply({

        embeds: [

          new EmbedBuilder()

            .setColor('#ff0000')

            .setTitle(
              '❌ Automod Disabled'
            )

        ]

      });

    }

    /*
    =========================
    PUNISHMENT
    =========================
    */

    if (sub === 'punishment') {

      const type =
        interaction.options.getString(
          'type'
        );

      await db.set(

        `automodpunishment_${interaction.guild.id}`,

        type

      );

      return interaction.reply({

        embeds: [

          new EmbedBuilder()

            .setColor('#00d5ff')

            .setTitle(
              '⚙ Automod Punishment'
            )

            .setDescription(
              `Punishment set to: \`${type}\``
            )

        ]

      });

    }

    /*
    =========================
    IGNORE CHANNEL
    =========================
    */

    if (sub === 'ignore') {

      const channel =
        interaction.options.getChannel(
          'channel'
        );

      await db.set(

        `automodignore_${interaction.guild.id}_${channel.id}`,

        true

      );

      return interaction.reply({

        embeds: [

          new EmbedBuilder()

            .setColor('#00d5ff')

            .setTitle(
              '✅ Channel Ignored'
            )

            .setDescription(
              `${channel} ignored from automod.`
            )

        ]

      });

    }

    /*
    =========================
    WL USER
    =========================
    */

    if (sub === 'wl') {

      const user =
        interaction.options.getUser(
          'user'
        );

      await db.set(

        `automodwl_${interaction.guild.id}_${user.id}`,

        true

      );

      return interaction.reply({

        embeds: [

          new EmbedBuilder()

            .setColor('#00ff99')

            .setTitle(
              '✅ User Whitelisted'
            )

            .setDescription(
              `${user} bypasses automod now.`
            )

        ]

      });

    }

    /*
    =========================
    REMOVE WL USER
    =========================
    */

    if (sub === 'unwl') {

      const user =
        interaction.options.getUser(
          'user'
        );

      await db.delete(

        `automodwl_${interaction.guild.id}_${user.id}`

      );

      return interaction.reply({

        embeds: [

          new EmbedBuilder()

            .setColor('#ff0000')

            .setTitle(
              '❌ User Removed'
            )

            .setDescription(
              `${user} removed from automod whitelist.`
            )

        ]

      });

    }

    /*
    =========================
    WL ROLE
    =========================
    */

    if (sub === 'wlrole') {

      const role =
        interaction.options.getRole(
          'role'
        );

      await db.set(

        `automodwlrole_${interaction.guild.id}_${role.id}`,

        true

      );

      return interaction.reply({

        embeds: [

          new EmbedBuilder()

            .setColor('#00ff99')

            .setTitle(
              '✅ Role Whitelisted'
            )

            .setDescription(
              `${role} bypasses automod now.`
            )

        ]

      });

    }

    /*
    =========================
    REMOVE WL ROLE
    =========================
    */

    if (sub === 'unwlrole') {

      const role =
        interaction.options.getRole(
          'role'
        );

      await db.delete(

        `automodwlrole_${interaction.guild.id}_${role.id}`

      );

      return interaction.reply({

        embeds: [

          new EmbedBuilder()

            .setColor('#ff0000')

            .setTitle(
              '❌ Role Removed'
            )

            .setDescription(
              `${role} removed from automod whitelist.`
            )

        ]

      });

    }

    /*
    =========================
    SHOW WL
    =========================
    */

    if (sub === 'wlshow') {

      return interaction.reply({

        embeds: [

          new EmbedBuilder()

            .setColor('#00d5ff')

            .setTitle(
              '📜 Automod Whitelist'
            )

            .setDescription(
              'Use database viewer or future dashboard for full list.'
            )

        ]

      });

    }

  }

};